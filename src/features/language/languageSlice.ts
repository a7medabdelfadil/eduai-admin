import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  language: "en",
  loading: true,
};

const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    setLanguage: (state, action) => {
      state.language = action.payload;
      localStorage.setItem("language", action.payload);
      state.loading = false;
    },
    initializeLanguage: state => {
      const savedLanguage =
        typeof window !== "undefined" ? localStorage.getItem("language") : null;
      if (savedLanguage) {
        state.language = savedLanguage;
      }
      state.loading = false;
    },
  },
});

export const { setLanguage, initializeLanguage } = languageSlice.actions;
export default languageSlice.reducer;
