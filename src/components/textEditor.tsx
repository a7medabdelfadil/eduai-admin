import React, { useRef, useEffect, useState } from "react";
import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaStrikethrough,
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
  FaListOl,
  FaListUl,
} from "react-icons/fa";
import { useTheme } from "next-themes";
import { useSelector } from "react-redux";
import { RootState } from "@/GlobalRedux/store";

const TextEditor = ({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [editorIsEmpty, setEditorIsEmpty] = useState(true);
  const { theme } = useTheme();
  const { language: currentLanguage } = useSelector(
    (state: RootState) => state.language,
  );

  // State to keep track of formatting
  const [formattingState, setFormattingState] = useState({
    bold: false,
    italic: false,
    underline: false,
    strikeThrough: false,
    alignLeft: false,
    alignCenter: false,
    alignRight: false,
    orderedList: false,
    unorderedList: false,
  });

  // State to track character count
  const [characterCount, setCharacterCount] = useState(0);
  const maxCharacters = 255;

  const handleChange = () => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      const textContent = editorRef.current.textContent || "";
      onChange(content);
      setCharacterCount(textContent.length);
      setEditorIsEmpty(textContent.trim() === "");
    }
  };

  // Function to wrap selected text with a tag
  const wrapSelectionWithTag = (tagName: string) => {
    const selection = window.getSelection();

    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);

      if (
        editorRef.current &&
        editorRef.current.contains(range.commonAncestorContainer)
      ) {
        // Create the new element with the specified tag
        const newNode = document.createElement(tagName);
        newNode.appendChild(range.extractContents());

        range.deleteContents();
        range.insertNode(newNode);

        // Update the selection to the new node
        selection.removeAllRanges();
        const newRange = document.createRange();
        newRange.selectNodeContents(newNode);
        selection.addRange(newRange);

        handleChange();
        updateFormattingState();
      }
    }
  };

  const toggleBold = () => wrapSelectionWithTag("strong");

  // Other formatting functions remain the same
  const toggleItalic = () => wrapSelectionWithTag("em");
  const toggleUnderline = () => wrapSelectionWithTag("u");
  const toggleStrikethrough = () => wrapSelectionWithTag("s");

  const applyAlignment = (alignment: string) => {
    applyFormat(
      `justify${alignment.charAt(0).toUpperCase() + alignment.slice(1)}`,
    );
  };

  const toggleList = (
    listType: "insertOrderedList" | "insertUnorderedList",
  ) => {
    applyFormat(listType);
  };

  const createLink = (url: string) => {
    applyFormat("createLink", url);
  };

  const insertImage = (url: string) => {
    applyFormat("insertImage", url);
  };

  const changeFontSize = (size: string) => {
    applyFormat("fontSize", size);
  };

  const changeFontColor = (color: string) => {
    applyFormat("foreColor", color);
  };

  const changeBackgroundColor = (color: string) => {
    applyFormat("hiliteColor", color);
  };

  const insertCodeBlock = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      if (
        editorRef.current &&
        editorRef.current.contains(range.commonAncestorContainer)
      ) {
        // Wrap selected text in <pre><code></code></pre>
        const codeElement = document.createElement("code");
        codeElement.appendChild(range.extractContents());

        const preElement = document.createElement("pre");
        preElement.appendChild(codeElement);

        range.deleteContents();
        range.insertNode(preElement);

        // Update the selection to the new node
        selection.removeAllRanges();
        const newRange = document.createRange();
        newRange.selectNodeContents(preElement);
        selection.addRange(newRange);

        handleChange();
        updateFormattingState();
      }
    } else {
      // If no selection, insert an empty code block
      const preElement = document.createElement("pre");
      const codeElement = document.createElement("code");
      codeElement.innerHTML = "<br>"; // Ensure the code block is selectable
      preElement.appendChild(codeElement);

      if (editorRef.current) {
        const range = document.createRange();
        const sel = window.getSelection();

        // Insert the code block at the current cursor position
        if (sel && sel.rangeCount > 0) {
          range.setStart(sel.anchorNode!, sel.anchorOffset);
        } else {
          range.setStart(
            editorRef.current,
            editorRef.current.childNodes.length,
          );
        }
        range.collapse(true);
        range.insertNode(preElement);

        // Move cursor inside the code element
        range.setStart(codeElement, 0);
        range.collapse(true);
        sel?.removeAllRanges();
        sel?.addRange(range);

        handleChange();
        updateFormattingState();
      }
    }
  };

  const insertBlockquote = () => wrapSelectionWithTag("blockquote");

  // Undo and Redo functions
  const undo = () => applyFormat("undo");
  const redo = () => applyFormat("redo");

  // Handle paste
  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text/plain");
    const currentText = editorRef.current?.textContent || "";
    const remainingChars = maxCharacters - currentText.length;
    if (remainingChars > 0) {
      const textToInsert = pastedText.substring(0, remainingChars);
      document.execCommand("insertText", false, textToInsert);
    }
  };

  const applyFormat = (command: string, value: any = null) => {
    document.execCommand(command, false, value);
    handleChange();
    updateFormattingState();
  };

  // Function to update formatting state
  const updateFormattingState = () => {
    if (editorRef.current) {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const anchorNode = selection.anchorNode;

        // Initialize formatting states
        let isBold = false;
        let isItalic = false;
        let isUnderline = false;
        let isStrikeThrough = false;
        let isAlignLeft = false;
        let isAlignCenter = false;
        let isAlignRight = false;
        let isOrderedList = false;
        let isUnorderedList = false;

        if (anchorNode) {
          let currentNode: Node | null = anchorNode;
          while (currentNode && currentNode !== editorRef.current) {
            if (currentNode.nodeType === Node.ELEMENT_NODE) {
              const element = currentNode as HTMLElement;
              const tagName = element.tagName.toLowerCase();

              if (tagName === "strong" || tagName === "b") {
                isBold = true;
              }
              if (tagName === "em" || tagName === "i") {
                isItalic = true;
              }
              if (tagName === "u") {
                isUnderline = true;
              }
              if (tagName === "s" || tagName === "strike") {
                isStrikeThrough = true;
              }
              if (element.style.textAlign === "left") {
                isAlignLeft = true;
              }
              if (element.style.textAlign === "center") {
                isAlignCenter = true;
              }
              if (element.style.textAlign === "right") {
                isAlignRight = true;
              }
              if (tagName === "ol") {
                isOrderedList = true;
              }
              if (tagName === "ul") {
                isUnorderedList = true;
              }
            }
            currentNode = currentNode.parentNode;
          }
        }

        setFormattingState({
          bold: isBold,
          italic: isItalic,
          underline: isUnderline,
          strikeThrough: isStrikeThrough,
          alignLeft: isAlignLeft,
          alignCenter: isAlignCenter,
          alignRight: isAlignRight,
          orderedList: isOrderedList,
          unorderedList: isUnorderedList,
        });
      }
    }
  };

  const getButtonClassName = (isActive: boolean) => {
    return `rounded px-3 py-2 ${isActive ? "bg-blue-500 text-white" : ""} ${
      theme === "dark"
        ? "hover:bg-hover"
        : "hover:bg-hover hover:text-[#ffffff]"
    }`;
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey || e.metaKey) &&
        editorRef.current &&
        document.activeElement === editorRef.current
      ) {
        switch (e.key.toLowerCase()) {
          case "b":
            e.preventDefault();
            toggleBold();
            break;
          case "i":
            e.preventDefault();
            toggleItalic();
            break;
          case "u":
            e.preventDefault();
            toggleUnderline();
            break;
          case "z":
            e.preventDefault();
            undo();
            break;
          case "y":
            e.preventDefault();
            redo();
            break;
          // Add more shortcuts as needed
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value;
      const textContent = editorRef.current.textContent || "";
      setCharacterCount(textContent.length);
      setEditorIsEmpty(textContent.trim() === "");
    }
  }, [value]);

  useEffect(() => {
    const handleSelectionChange = () => {
      if (
        editorRef.current &&
        editorRef.current.contains(window.getSelection()?.anchorNode ?? null)
      ) {
        updateFormattingState();
      }
    };

    document.addEventListener("selectionchange", handleSelectionChange);

    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
    };
  }, []);

  // Handle before input to prevent exceeding character limit
  const handleBeforeInput = (e: React.FormEvent<HTMLDivElement>) => {
    const inputEvent = e.nativeEvent as InputEvent;
    const inputType = inputEvent.inputType;
    const inputData = inputEvent.data || "";
    const currentText = editorRef.current?.textContent || "";
    if (inputType === "insertText" || inputType === "insertCompositionText") {
      const newLength = currentText.length + inputData.length;
      if (newLength > maxCharacters) {
        const allowedChars = maxCharacters - currentText.length;
        if (allowedChars > 0) {
          const textToInsert = inputData.substring(0, allowedChars);
          document.execCommand("insertText", false, textToInsert);
        }
        e.preventDefault();
      }
    }
  };

  return (
    <div className="mx-auto p-4">
      <div className="flex flex-wrap items-center gap-2 rounded-t-md border border-borderPrimary p-2">
        {/* Undo and Redo buttons */}
        <button
          type="button"
          onClick={undo}
          className={getButtonClassName(false)}
          aria-label="Undo"
        >
          <svg
            className="h-8 w-8"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="1 4 1 10 7 10" />
            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
          </svg>
        </button>
        <button
          type="button"
          onClick={redo}
          className={getButtonClassName(false)}
          aria-label="Redo"
        >
          <svg
            className="h-8 w-8"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="23 4 23 10 17 10" />
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
          </svg>
        </button>
        {/* Text format dropdown */}
        <select
          onChange={e => {
            applyFormat("formatBlock", e.target.value);
          }}
          className="rounded p-2 outline-none"
          aria-label="Text format"
        >
          <option value="<p>">
            {currentLanguage === "en"
              ? "Paragraph"
              : currentLanguage === "ar"
                ? "فقرة"
                : "Paragraphe"}
          </option>
          <option value="<h1>">
            {currentLanguage === "en"
              ? "Heading 1"
              : currentLanguage === "ar"
                ? "العنوان 1"
                : "Titre 1"}
          </option>
          <option value="<h2>">
            {currentLanguage === "en"
              ? "Heading 2"
              : currentLanguage === "ar"
                ? "العنوان 2"
                : "Titre 2"}
          </option>
          <option value="<h3>">
            {currentLanguage === "en"
              ? "Heading 3"
              : currentLanguage === "ar"
                ? "العنوان 3"
                : "Titre 3"}
          </option>
        </select>
        <select
          onChange={e => changeFontSize(e.target.value)}
          className="rounded p-2 outline-none"
          aria-label="Font size"
          defaultValue="3"
        >
          <option value="1">Small</option>
          <option value="3">Normal</option>
          <option value="5">Large</option>
          <option value="7">Huge</option>
        </select>
        {/* Formatting buttons */}
        <button
          type="button"
          onClick={toggleBold}
          className={getButtonClassName(formattingState.bold)}
          aria-label="Bold"
        >
          <FaBold size={20} />
        </button>
        <button
          type="button"
          onClick={toggleItalic}
          className={getButtonClassName(formattingState.italic)}
          aria-label="Italic"
        >
          <FaItalic size={20} />
        </button>
        <button
          type="button"
          onClick={toggleUnderline}
          className={getButtonClassName(formattingState.underline)}
          aria-label="Underline"
        >
          <FaUnderline size={20} />
        </button>
        <button
          type="button"
          onClick={toggleStrikethrough}
          className={getButtonClassName(formattingState.strikeThrough)}
          aria-label="Strikethrough"
        >
          <FaStrikethrough size={20} />
        </button>
        {/* Alignment buttons */}
        <button
          type="button"
          onClick={() => applyAlignment("left")}
          className={getButtonClassName(formattingState.alignLeft)}
          aria-label="Align left"
        >
          <FaAlignLeft size={20} />
        </button>
        <button
          type="button"
          onClick={() => applyAlignment("center")}
          className={getButtonClassName(formattingState.alignCenter)}
          aria-label="Align center"
        >
          <FaAlignCenter size={20} />
        </button>
        <button
          type="button"
          onClick={() => applyAlignment("right")}
          className={getButtonClassName(formattingState.alignRight)}
          aria-label="Align right"
        >
          <FaAlignRight size={20} />
        </button>
        {/* List buttons */}
        <button
          type="button"
          onClick={() => toggleList("insertOrderedList")}
          className={getButtonClassName(formattingState.orderedList)}
          aria-label="Ordered list"
        >
          <FaListOl size={20} />
        </button>
        <button
          type="button"
          onClick={() => toggleList("insertUnorderedList")}
          className={getButtonClassName(formattingState.unorderedList)}
          aria-label="Unordered list"
        >
          <FaListUl size={20} />
        </button>
        {/* Link and Image buttons */}
        <button
          type="button"
          onClick={() => {
            const url = prompt("Enter URL") || "";
            if (url) {
              createLink(url);
            }
          }}
          className={getButtonClassName(false)}
          aria-label="Insert link"
        >
          {/* SVG icon here */}
          <svg
            className="h-7 w-7"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {" "}
            <path stroke="none" d="M0 0h24v24H0z" />{" "}
            <path d="M10 14a3.5 3.5 0 0 0 5 0l4 -4a3.5 3.5 0 0 0 -5 -5l-.5 .5" />{" "}
            <path d="M14 10a3.5 3.5 0 0 0 -5 0l-4 4a3.5 3.5 0 0 0 5 5l.5 -.5" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => {
            const url = prompt("Enter image URL") || "";
            if (url) {
              insertImage(url);
            }
          }}
          className={getButtonClassName(false)}
          aria-label="Insert image"
        >
          {/* SVG icon here */}
          <svg
            className="h-6 w-7"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {" "}
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />{" "}
            <circle cx="8.5" cy="8.5" r="1.5" />{" "}
            <polyline points="21 15 16 10 5 21" />
          </svg>
        </button>
        {/* Code Block and Blockquote */}
        <button
          type="button"
          onClick={insertCodeBlock}
          className={getButtonClassName(false)}
          aria-label="Insert code block"
        >
          {/* SVG icon here */}
          <svg
            className="h-6 w-7"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {" "}
            <path stroke="none" d="M0 0h24v24H0z" />{" "}
            <polyline points="7 8 3 12 7 16" />{" "}
            <polyline points="17 8 21 12 17 16" />{" "}
            <line x1="14" y1="4" x2="10" y2="20" />
          </svg>
        </button>
        {/* Font Color */}
        <input
          type="color"
          onChange={e => changeFontColor(e.target.value)}
          aria-label="Font color"
        />
        {/* Background Color */}
        <input
          type="color"
          onChange={e => changeBackgroundColor(e.target.value)}
          aria-label="Background color"
        />
      </div>
      <div className="relative text-wrap">
        <div
          ref={editorRef}
          contentEditable={true}
          className="editor-content min-h-[200px] cursor-text rounded-b-md border border-borderPrimary p-4 focus:outline-none"
          style={{ whiteSpace: "pre-wrap" }}
          onInput={handleChange}
          onFocus={() => setEditorIsEmpty(false)}
          onBlur={() => {
            const textContent = editorRef.current?.textContent || "";
            setEditorIsEmpty(textContent.trim() === "");
          }}
          onPaste={handlePaste}
          onBeforeInput={handleBeforeInput}
          suppressContentEditableWarning={true}
        ></div>
        {editorIsEmpty && (
          <div className="pointer-events-none absolute left-0 top-0 p-4 text-gray-400">
            {placeholder || "Start typing..."}
          </div>
        )}
        <div className="mt-2 text-right">
          {characterCount}/{maxCharacters}
        </div>
      </div>
    </div>
  );
};

export default TextEditor;
