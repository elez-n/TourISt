import { useEffect } from "react";
import { useAppDispatch } from "@/store/store";
import { setUser } from "@/store/slice/authSlice";
import { setAccessToken } from "@/store/tokenStore";
import { userApi } from "@/store/api/userApi";

const UserInitializer = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const initUser = async () => {
      try {
        const { data } = await userApi.getCurrentUser();
        setAccessToken(data.accessToken);

        dispatch(
          setUser({
            id: data.id,
            username: data.username,
            role: data.role,
          })
        );
      } catch (err) {
        console.log("No logged-in user on refresh", err);
      }
    };

    initUser();
  }, [dispatch]);

  return null; 
};

export default UserInitializer;
