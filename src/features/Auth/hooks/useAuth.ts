import type { AppDispatch, RootState } from "../../../store/store";

import { useDispatch, useSelector } from "react-redux";

import { apiClient } from "../../../services/apiClient";
import {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  setErrorRegister,
  updateUser,
} from "../redux/authSlice";

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, token, loading, error } = useSelector(
    (state: RootState) => state.auth,
  );

  //Login
  const login = async (email: string, password: string) => {
    try {
      dispatch(loginStart());

      const response = await apiClient.post("/auth/login", {
        email,
        password,
      });

      const {
        access_token,
        name: nameData,
        _id,
        role,
        email: emailData,
        username: usernameData,
      } = response.data;

      //convertimos para el slice
      const user = {
        id: _id,
        username: usernameData,
        name: nameData,
        role: role,
        email: emailData,
      };

      //Tiempo para el loading
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Guardar en Redux + localStorage
      dispatch(loginSuccess({ user, token: access_token }));
      localStorage.setItem("token", access_token);
    } catch (err: any) {
      console.error("Error en login:", err);
      dispatch(loginFailure("Credenciales inválidas o error del servidor"));
    }
  };

  const logoutUser = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  //Register
  const register = async (
    username: string,
    email: string,
    password: string,
    name: string,
  ) => {
    try {
      dispatch(loginStart());

      const res = await apiClient.post("/auth/register", {
        username,
        name,
        email,
        password,
      });

      await login(res.data.email || email, password);
    } catch (err: any) {
      console.error(err);

      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Error al registrarse";
      dispatch(loginFailure(message));
      dispatch(setErrorRegister(err.message || message));
    }
  };

  const updateUserState = async (updatedUserData: any) => {
    try {
      dispatch(loginStart());

      await apiClient.patch("/auth/me", {
        ...updatedUserData,
      });

      // Guardar en Redux + localStorage;
      dispatch(updateUser(updatedUserData));
    } catch (err: any) {
      console.error(err);

      dispatch(setErrorRegister(err.message || "Error a actualizar usuario"));
    }
  };

  return {
    user,
    token,
    loading,
    error,
    login,
    logoutUser,
    isAuthenticated: Boolean(token),
    register,
    updateUserState,
  };
};
