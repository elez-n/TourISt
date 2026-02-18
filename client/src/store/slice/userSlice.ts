import { createSlice } from "@reduxjs/toolkit";
import type { UserParams } from "../models/UserParams";

const initialState: UserParams = {
  pageNumber: 1,
  pageSize: 10,
  role: "",
  searchTerm: "",
  orderBy: "username", 
};

export const userSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {
    setPageNumber(state, action) {
      state.pageNumber = action.payload;
    },
    setPageSize(state, action) {
      state.pageSize = action.payload;
    },
    setOrderBy(state, action) {
      state.orderBy = action.payload;
      state.pageNumber = 1;
    },
    setRole(state, action) {
      state.role = action.payload;
      state.pageNumber = 1;
    },
    setSearchTerm(state, action) {
      state.searchTerm = action.payload;
      state.pageNumber = 1;
    },
    resetParams() {
      return initialState;
    },
  },
});

export const { 
  setPageNumber, 
  setPageSize, 
  setOrderBy, 
  setRole, 
  setSearchTerm, 
  resetParams 
} = userSlice.actions;

export default userSlice.reducer;
