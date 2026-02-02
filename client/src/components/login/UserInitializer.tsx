import { useEffect, useState } from "react";
import { useAppDispatch } from "@/store/store";
import { setUser } from "@/store/slice/authSlice";
import { setAccessToken } from "@/store/tokenStore";
import { jwtDecode } from "jwt-decode";
import type { JwtPayload } from "@/store/models/JwtPayload";
import { useRefreshTokenMutation } from "@/store/api/userApi";

const UserInitializer = () => {
  const dispatch = useAppDispatch();
  const [refreshToken] = useRefreshTokenMutation();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const initUser = async () => {
      try {
        const response = await refreshToken().unwrap();
        const { accessToken } = response;

        if (accessToken) {
          setAccessToken(accessToken);

          const decoded = jwtDecode<JwtPayload>(accessToken);

          dispatch(
            setUser({
              id: decoded.userId,
              username: decoded.username,
              role: decoded.role,
            })
          );
        }
      } catch (err) {
        console.log("No session", err);
      } finally {
        setInitialized(true);
      }
    };

    initUser();
  }, [dispatch, refreshToken]);

  if (!initialized) return null; 

  return null;
};

export default UserInitializer;
