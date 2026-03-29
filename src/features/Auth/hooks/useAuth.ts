import type { AppDispatch, RootState } from "../../../store/store";

import { useDispatch, useSelector } from "react-redux";
import { signInWithPopup, signOut as firebaseSignOut } from "firebase/auth";

import { apiClient } from "../../../services/apiClient";
import { auth, googleProvider } from "../../../lib/firebase";
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

  const normalizeAuthPayload = (data: any) => {
    const {
      access_token,
      name: nameData,
      _id,
      role,
      email: emailData,
      username: usernameData,
      phone: phoneData,
      authProvider,
      avatar,
    } = data;

    return {
      token: access_token,
      user: {
        id: _id,
        username: usernameData,
        name: nameData,
        role,
        email: emailData,
        phone: phoneData,
        authProvider,
        avatar,
      },
    };
  };

  //Login
  const login = async (email: string, password: string) => {
    try {
      dispatch(loginStart());

      const response = await apiClient.post("/auth/login", {
        email,
        password,
      });

      const { user, token: access_token } = normalizeAuthPayload(response.data);

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

  const loginWithGoogle = async () => {
    try {
      dispatch(loginStart());

      const firebaseResult = await signInWithPopup(auth, googleProvider);
      const idToken = await firebaseResult.user.getIdToken();

      const response = await apiClient.post("/auth/google", { idToken });
      const { user, token: access_token } = normalizeAuthPayload(response.data);

      dispatch(loginSuccess({ user, token: access_token }));
      localStorage.setItem("token", access_token);
    } catch (err: any) {
      console.error("Error en login con Google:", err);

      if (err?.code === "auth/popup-closed-by-user") {
        dispatch(
          loginFailure("Cerraste la ventana antes de completar el login"),
        );

        return;
      }

      const message =
        err?.response?.data?.message ||
        err?.message ||
        "No se pudo iniciar sesión con Google";

      dispatch(loginFailure(message));
    }
  };

  const logoutUser = () => {
    firebaseSignOut(auth).catch((error) => {
      console.error("Error cerrando sesión de Firebase:", error);
    });

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
        err?.response?.data?.message || err?.message || "Error al registrarse";

      dispatch(loginFailure(message));
      dispatch(setErrorRegister(err.message || message));
    }
  };

  const updateUserState = async (updatedUserData: any) => {
    try {
      dispatch(loginStart());

      const response = await apiClient.put("/auth/profile", {
        ...updatedUserData,
      });

      // Guardar en Redux + localStorage;
      dispatch(updateUser(response?.data?.user || updatedUserData));
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
    loginWithGoogle,
    logoutUser,
    isAuthenticated: Boolean(token),
    register,
    updateUserState,
  };
};
