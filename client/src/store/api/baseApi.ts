import {
  fetchBaseQuery,
  type FetchBaseQueryError,
  type FetchArgs,
  type BaseQueryApi,
} from "@reduxjs/toolkit/query/react";
import {
  getAccessToken,
  setAccessToken,
} from "../tokenStore";
import { logout, setUser } from "../slice/authSlice";
import { Mutex } from "async-mutex";

import { jwtDecode } from "jwt-decode";
const mutex = new Mutex();

const baseQuery = fetchBaseQuery({
  baseUrl: "https://localhost:5001/api/",
  credentials: "include",
  prepareHeaders: (headers) => {
    const token = getAccessToken();
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
});

export const customBaseQuery = async (
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOptions: object
) => {
  await mutex.waitForUnlock(); 

  let result = await baseQuery(args, api, extraOptions);

  console.log("Result:", result);
  if (result.error) {
    console.log("Error type:", result.error);
    console.log("Error status:", (result.error as FetchBaseQueryError).status);
    console.log("Error data:", (result.error as FetchBaseQueryError).data);
  }

  if (result.error && (result.error as FetchBaseQueryError).status === 401) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        console.log("trazi novi access");
        const refreshResult = await baseQuery(
          { url: "auth/refresh-token", method: "POST" },
          api,
          extraOptions
        );

        if (
          refreshResult.data &&
          typeof refreshResult.data === "object" &&
          "accessToken" in refreshResult.data
        ) {
          const { accessToken } = refreshResult.data as { accessToken: string };
          setAccessToken(accessToken);
          console.log("Novi token: " + accessToken);

          const decoded = jwtDecode<{ userId: string; role: string }>(
            accessToken
          );

          api.dispatch(
            setUser({
              id: decoded.userId,
              username: "", 
              role: decoded.role,
              
            })
          );
          console.log("Novi token: " + accessToken);

          result = await baseQuery(args, api, extraOptions);
        } else {
          api.dispatch(logout());
        }
      } finally {
        release();
      }
    } else {
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  }

  return result;
};
