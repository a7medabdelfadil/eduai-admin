// ImageComponent.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ImageComponent from './ImageSrc';

// -------------------------------------------------------------------
// MOCK INTERSECTION OBSERVER
// -------------------------------------------------------------------
// This simple mock immediately triggers the callback as if the element
// is intersecting (i.e. visible), which is useful to bypass lazy loading.
class MockIntersectionObserver implements IntersectionObserver {
  callback: IntersectionObserverCallback;
  root: Element | null = null;
  rootMargin: string = "0px";
  thresholds: readonly number[] = [0];
  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
  }
  observe(target: Element) {
    // Simulate that the target is in the viewport.
    this.callback([{ isIntersecting: true, target } as IntersectionObserverEntry], this);
  }
  disconnect() {}
  unobserve() {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

beforeAll(() => {
  (global as any).IntersectionObserver = MockIntersectionObserver;
});

// -------------------------------------------------------------------
// TESTS
// -------------------------------------------------------------------
describe('ImageComponent', () => {
  test('renders image immediately when priority is true', () => {
    const testSrc = 'test-image.jpg';
    render(<ImageComponent src={testSrc} priority={true} alt="Test Image" />);
    const img = screen.getByAltText('Test Image');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', testSrc);
  });

  test('calls onLoadingComplete when image loads', async () => {
    const testSrc = 'test-image.jpg';
    const onLoadingComplete = jest.fn();
    render(
      <ImageComponent
        src={testSrc}
        priority={true}
        alt="Test Image"
        onLoadingComplete={onLoadingComplete}
      />
    );
    const img = screen.getByAltText('Test Image');

    // Simulate the load event on the image.
    fireEvent.load(img);

    // Wait for the onLoadingComplete callback to have been called.
    await waitFor(() => expect(onLoadingComplete).toHaveBeenCalled());

    // After load, the image should have a class that indicates full opacity.
    expect(img.className).toMatch(/opacity-100/);
  });

  test('calls onError when image fails to load and displays error placeholder', async () => {
    const testSrc = 'broken-image.jpg';
    const onError = jest.fn();
    render(
      <ImageComponent
        src={testSrc}
        priority={true}
        alt="Test Image"
        onError={onError}
      />
    );
    const img = screen.getByAltText('Test Image');

    // Simulate an error event on the image.
    fireEvent.error(img);

    // Wait for the onError callback to have been called.
    await waitFor(() => expect(onError).toHaveBeenCalled());

    // The default error placeholder renders an image with alt text "Error loading image"
    const errorImg = screen.getByAltText('Error loading image');
    expect(errorImg).toBeInTheDocument();
    expect(errorImg).toHaveAttribute('src', '/images/noImage.png');
  });

  test('renders provided loadingPlaceholder while loading and removes it after load', async () => {
    const testSrc = 'test-image.jpg';
    const LoadingPlaceholder = () => (
      <div data-testid="loading-placeholder">Loading...</div>
    );
    render(
      <ImageComponent
        src={testSrc}
        priority={true}
        alt="Test Image"
        loadingPlaceholder={<LoadingPlaceholder />}
      />
    );

    // Initially, the loading placeholder should be rendered.
    const placeholder = screen.getByTestId('loading-placeholder');
    expect(placeholder).toBeInTheDocument();

    // Simulate the image load event.
    const img = screen.getByAltText('Test Image');
    fireEvent.load(img);

    // After loading, the placeholder should no longer be rendered.
    await waitFor(() =>
      expect(screen.queryByTestId('loading-placeholder')).toBeNull()
    );
  });

  test('uses fallbackSrc when src is null', () => {
    const fallbackSrc = '/fallback-image.jpg';
    render(
      <ImageComponent
        src={null}
        fallbackSrc={fallbackSrc}
        priority={true}
        alt="Fallback Image"
      />
    );
    const img = screen.getByAltText('Fallback Image');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', fallbackSrc);
  });
});
