import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  name: null,
  email: null,
  id: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.id = action.payload.id;
    },
    clearUser: state => {
      state.name = null;
      state.email = null;
      state.id = null;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
