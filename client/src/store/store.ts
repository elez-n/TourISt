import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { touristObjectApi } from "./api/TouristObjectApi";
import { objectSlice } from "./slice/objectSlice";
import { authSlice } from "./slice/authSlice";
import { userApi } from "./api/userApi";
import { reviewsApi } from "./api/reviewsApi";
import { evaluationApi } from "./api/evaluationApi";
import { favoritesApi } from "./api/favoritesApi";
import { adminApi } from "./api/adminApi";
import { userSlice } from "./slice/userSlice";
import { reportsApi } from "./api/reportsApi";
import { statisticsApi } from "./api/statisticsApi";
export const store = configureStore({
  reducer: {
    [touristObjectApi.reducerPath]: touristObjectApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [reviewsApi.reducerPath]: reviewsApi.reducer,
    [evaluationApi.reducerPath]: evaluationApi.reducer,
    [favoritesApi.reducerPath]: favoritesApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
    [reportsApi.reducerPath]: reportsApi.reducer,
    [statisticsApi.reducerPath]: statisticsApi.reducer,
    touristObject: objectSlice.reducer,
    auth: authSlice.reducer,
    user: userSlice.reducer
  },
  middleware: (getDefaultMiddleware) =>
  getDefaultMiddleware({ serializableCheck: false }).concat(
    touristObjectApi.middleware,
    userApi.middleware,
    reviewsApi.middleware,
    evaluationApi.middleware,
    favoritesApi.middleware,
    adminApi.middleware,
    reportsApi.middleware,
    statisticsApi.middleware
  ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
