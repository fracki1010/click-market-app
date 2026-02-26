// src/features/Auth/views/LoginPage.tsx
import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router";
import { Button } from "@heroui/react";

import { AuthForm } from "../../../components/ui/AuthForm";
import { useAuth } from "../hooks/useAuth";
import { LoadingComponent } from "../../../components/layout/LoadingComponent";
import { Modal } from "../../../components/layout/Modal";

export const LoginPage = () => {
  const { login, loading, error, token, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSessionExpiredModalOpen, setIsSessionExpiredModalOpen] =
    useState(false);

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

  const handleLogin = async (data: Record<string, string>) => {
    await login(data.email, data.password);
  };

  if (loading) {
    return <LoadingComponent />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-neutral-900">
      <AuthForm
        fields={[
          { name: "email", label: "Email", type: "email" },
          { name: "password", label: "Contraseña", type: "password" },
        ]}
        submitLabel={loading ? "Cargando..." : "Iniciar sesión"}
        onSubmit={handleLogin}
      />

      {error && <p className="mt-4 text-red-600 font-medium">{error}</p>}

      <p className="mt-6 text-gray-600">
        ¿No tienes cuenta?{" "}
        <Link className="text-indigo-600 font-medium" to="/register">
          Registrate
        </Link>
      </p>

      {/* Modal de Sesión Expirada */}
      <Modal
        isOpen={isSessionExpiredModalOpen}
        title="Sesión Expirada"
        onClose={() => setIsSessionExpiredModalOpen(false)}
      >
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Tu sesión ha expirado por seguridad. Por favor, vuelve a iniciar
            sesión para continuar.
          </p>
          <Button
            fullWidth
            color="primary"
            onPress={() => setIsSessionExpiredModalOpen(false)}
          >
            Entendido
          </Button>
        </div>
      </Modal>
    </div>
  );
};
