import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { touristObjectApi } from "./api/TouristObjectApi";
import { objectSlice } from "./slice/objectSlice";
import { authSlice } from "./slice/authSlice";
import { userApi } from "./api/userApi";
export const store = configureStore({
  reducer: {
    [touristObjectApi.reducerPath]: touristObjectApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    touristObject: objectSlice.reducer,
    auth: authSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
  getDefaultMiddleware({ serializableCheck: false }).concat(
    touristObjectApi.middleware,
    userApi.middleware
  ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
