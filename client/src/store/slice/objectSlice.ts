import { createSlice } from "@reduxjs/toolkit";
import type { ObjectParams } from "../models/ObjectParams";

const initialState: ObjectParams = {
  pageNumber: 1,
  pageSize: 8,
  objectTypes: "",
  categories: "",
  municipalities: "",
  searchTerm: "",
  orderBy: "beds",
};

export const objectSlice = createSlice({
  name: "pacijentSlice",
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
    setType(state, action) {
      state.objectTypes = action.payload;
      state.pageNumber = 1;
    },
        setCategory(state, action) {
      state.categories = action.payload;
      state.pageNumber = 1;
    },
        setMunicipality(state, action) {
      state.municipalities = action.payload;
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
  setType,
  setCategory,
  setMunicipality,
  setOrderBy,
  setPageNumber,
  setPageSize,
  setSearchTerm,
  resetParams,
} = objectSlice.actions;
