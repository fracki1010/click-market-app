import { useState, useEffect, FormEvent } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { Button, Input } from "@heroui/react";
import { FcGoogle } from "react-icons/fc";

import { useAuth } from "../hooks/useAuth";
import { LoadingComponent } from "../../../components/layout/LoadingComponent";
import { Modal } from "../../../components/layout/Modal";
import logoBrand from "../../../assets/Recurso 1.svg";

export const LoginPage = () => {
  const { login, loginWithGoogle, loading, error, token, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSessionExpiredModalOpen, setIsSessionExpiredModalOpen] =
    useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    if (params.get("session_expired") === "true") {
      setIsSessionExpiredModalOpen(true);
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

    if (!email || !password) {
      return;
    }

    await login(email, password);
  };

  const handleGoogleLogin = async () => {
    await loginWithGoogle();
  };

  if (loading) {
    return <LoadingComponent />;
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-b from-amber-50 via-background to-content1 px-4 py-10 transition-colors sm:px-8">
      <div className="pointer-events-none absolute -left-20 top-14 h-64 w-64 rounded-full bg-amber-200/35 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-14 h-64 w-64 rounded-full bg-primary-200/35 blur-3xl" />

      <div className="relative z-10 w-full max-w-[460px] animate-appearance-in">
        <div className="rounded-[2.25rem] border border-divider bg-content1/90 p-8 shadow-2xl shadow-black/10 backdrop-blur-xl sm:p-10">
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="mb-6 rounded-3xl bg-default-50 p-4 ring-1 ring-divider">
              <img
                src={logoBrand}
                alt="Click Market"
                className="h-14 w-auto object-contain"
              />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-default-900">
              Bienvenido otra vez
            </h1>
            <p className="mt-3 text-sm font-medium text-default-500">
              Iniciá sesión para continuar tu compra
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Input
              label="Correo electrónico"
              placeholder="tuemail@ejemplo.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              isRequired
              variant="faded"
              classNames={{
                inputWrapper:
                  "bg-default-50 border-divider shadow-none hover:bg-default-100 transition-colors",
                label: "text-default-600 font-medium",
              }}
            />
            <Input
              label="Contraseña"
              placeholder="Ingresá tu contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              isRequired
              variant="faded"
              classNames={{
                inputWrapper:
                  "bg-default-50 border-divider shadow-none hover:bg-default-100 transition-colors",
                label: "text-default-600 font-medium",
              }}
            />

            {error && (
              <div className="rounded-2xl border border-danger-100 bg-danger-50 p-4 text-center text-sm font-medium text-danger">
                {error}
              </div>
            )}

            <Button
              color="primary"
              type="submit"
              size="lg"
              className="mt-1 w-full font-semibold shadow-md transition-all hover:shadow-lg"
              isLoading={loading}
              radius="full"
            >
              {loading ? "Iniciando sesión..." : "Iniciar sesión"}
            </Button>

            <div className="flex items-center gap-3 pt-2">
              <span className="h-px flex-1 bg-divider" />
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-default-400">
                o
              </span>
              <span className="h-px flex-1 bg-divider" />
            </div>

            <Button
              type="button"
              variant="bordered"
              size="lg"
              className="w-full border-divider bg-default-50 font-semibold text-default-700 transition-colors hover:bg-default-100"
              radius="full"
              isDisabled={loading}
              onPress={handleGoogleLogin}
              startContent={<FcGoogle className="text-xl" />}
            >
              Continuar con Google
            </Button>
          </form>

          <p className="mt-7 text-center text-sm text-default-600">
            ¿No tenés cuenta?{" "}
            <Link className="font-semibold text-primary hover:underline" to="/register">
              Registrate
            </Link>
          </p>
        </div>
      </div>

      <Modal
        isOpen={isSessionExpiredModalOpen}
        title="Sesión expirada"
        onClose={() => setIsSessionExpiredModalOpen(false)}
      >
        <div className="p-2 text-center">
          <p className="mb-6 font-medium text-default-600">
            Tu sesión expiró por seguridad. Iniciá sesión nuevamente para
            continuar.
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
