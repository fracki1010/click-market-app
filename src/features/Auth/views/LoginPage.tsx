// src/features/Auth/views/LoginPage.tsx
import { useState, useEffect, FormEvent } from "react";
import { useNavigate, useLocation } from "react-router";
import { Button, Input } from "@heroui/react";

import { useAuth } from "../hooks/useAuth";
import { LoadingComponent } from "../../../components/layout/LoadingComponent";
import { Modal } from "../../../components/layout/Modal";
import logoExt from "../../../assets/logo-ext.svg";

export const LoginPage = () => {
  const { login, loading, error, token, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSessionExpiredModalOpen, setIsSessionExpiredModalOpen] =
    useState(false);

  // Estados del formulario
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    if (params.get("session_expired") === "true") {
      setIsSessionExpiredModalOpen(true);
      // Limpiar el parámetro de la URL sin recargar la página
      navigate("/login", { replace: true });
    }
  }, [location.search, navigate]);

  useEffect(() => {
    if (token && user) {
      const from = location.state?.from?.pathname;

      if (from) {
        navigate(from, { replace: true });

        return;
      }

      if (user.role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/home", { replace: true });
      }
    }
  }, [token, user, navigate, location]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    await login(email, password);
  };

  if (loading) {
    return <LoadingComponent />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50/50 dark:bg-neutral-950 p-4 sm:p-8">
      <div className="w-full max-w-[420px] animate-appearance-in">
        {/* Logo and Header */}
        <div className="flex flex-col items-center mb-10">
          <div className="bg-white dark:bg-neutral-900 p-5 rounded-[2rem] shadow-sm mb-8 ring-1 ring-gray-100 dark:ring-neutral-800">
            <img
              src={logoExt}
              alt="Click Market Logo"
              className="h-16 w-auto object-contain"
            />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center tracking-tight">
            Bienvenido de vuelta
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-3 text-center text-sm font-medium px-4">
            Ingresa a tu cuenta para continuar
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white dark:bg-neutral-900/80 backdrop-blur-xl shadow-xl shadow-black/5 dark:shadow-black/20 rounded-[2.5rem] p-8 sm:p-10 border border-gray-100 dark:border-neutral-800">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col gap-5">
              <Input
                label="Correo electrónico"
                placeholder="Ingresa tu email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                isRequired
                variant="faded"
                classNames={{
                  inputWrapper:
                    "bg-gray-50 dark:bg-neutral-950 border-gray-200 dark:border-neutral-800 shadow-none hover:bg-gray-100 dark:hover:bg-neutral-900 transition-colors",
                  label: "text-gray-600 dark:text-gray-400 font-medium",
                }}
              />
              <Input
                label="Contraseña"
                placeholder="Ingresa tu contraseña"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                isRequired
                variant="faded"
                classNames={{
                  inputWrapper:
                    "bg-gray-50 dark:bg-neutral-950 border-gray-200 dark:border-neutral-800 shadow-none hover:bg-gray-100 dark:hover:bg-neutral-900 transition-colors",
                  label: "text-gray-600 dark:text-gray-400 font-medium",
                }}
              />
            </div>

            {error && (
              <div className="bg-red-50/80 dark:bg-red-500/10 text-red-600 dark:text-red-400 p-4 rounded-2xl text-sm text-center font-medium border border-red-100 dark:border-red-500/20">
                {error}
              </div>
            )}

            <Button
              color="primary"
              type="submit"
              size="lg"
              className="w-full mt-2 font-semibold shadow-md hover:shadow-lg transition-all"
              isLoading={loading}
              radius="full"
            >
              {loading ? "Iniciando sesión..." : "Iniciar sesión"}
            </Button>
          </form>
        </div>
      </div>

      {/* Modal de Sesión Expirada */}
      <Modal
        isOpen={isSessionExpiredModalOpen}
        title="Sesión Expirada"
        onClose={() => setIsSessionExpiredModalOpen(false)}
      >
        <div className="text-center p-2">
          <p className="text-gray-600 dark:text-gray-300 mb-6 font-medium">
            Tu sesión ha expirado por seguridad. Por favor, vuelve a iniciar
            sesión para continuar.
          </p>
          <Button
            fullWidth
            color="primary"
            onPress={() => setIsSessionExpiredModalOpen(false)}
            radius="lg"
            className="font-medium"
          >
            Entendido
          </Button>
        </div>
      </Modal>
    </div>
  );
};
