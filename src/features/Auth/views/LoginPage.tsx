import { useState, useEffect, FormEvent } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { Button, Input } from "@heroui/react";
import { FcGoogle } from "react-icons/fc";

import { useAuth } from "../hooks/useAuth";
import { LoadingComponent } from "../../../components/layout/LoadingComponent";
import logoBrand from "../../../assets/Recurso 1.svg";

import { useToast } from "@/components/ui/ToastProvider";

export const LoginPage = () => {
  const { login, loginWithGoogle, loading, error, token, user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    if (params.get("session_expired") === "true") {
      addToast(
        "Tu sesión expiró por seguridad. Iniciá sesión nuevamente para continuar.",
        "info",
      );
      navigate("/login", { replace: true });
    }
  }, [location.search, navigate, addToast]);

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
    <div className="pt-safe relative flex min-h-screen-safe items-center justify-center overflow-hidden bg-gradient-to-b from-amber-50 via-background to-content1 px-4 py-6 transition-colors sm:px-8 sm:py-10">
      <div className="pointer-events-none absolute -left-20 top-14 h-64 w-64 rounded-full bg-amber-200/35 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-14 h-64 w-64 rounded-full bg-primary-200/35 blur-3xl" />

      <div className="relative z-10 w-full max-w-[460px] animate-appearance-in">
        <div className="rounded-[1.75rem] border border-divider bg-content1/90 p-6 shadow-2xl shadow-black/10 backdrop-blur-xl sm:rounded-[2.25rem] sm:p-10">
          <div className="mb-6 flex flex-col items-center text-center sm:mb-8">
            <div className="mb-4 rounded-3xl bg-default-50 p-3 ring-1 ring-divider sm:mb-6 sm:p-4">
              <img
                alt="Click Market"
                className="h-12 w-auto object-contain sm:h-14"
                src={logoBrand}
              />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-default-900 sm:text-3xl">
              Bienvenido
            </h1>
            <p className="mt-2 text-sm font-medium text-default-500 sm:mt-3">
              Iniciá sesión para continuar tu compra
            </p>
          </div>

          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <Input
              isRequired
              classNames={{
                inputWrapper:
                  "h-12 bg-default-50 border-divider shadow-none hover:bg-default-100 transition-colors",
                label: "text-default-600 font-medium",
              }}
              label="Correo electrónico"
              placeholder="tuemail@ejemplo.com"
              type="email"
              value={email}
              variant="faded"
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              isRequired
              classNames={{
                inputWrapper:
                  "h-12 bg-default-50 border-divider shadow-none hover:bg-default-100 transition-colors",
                label: "text-default-600 font-medium",
              }}
              label="Contraseña"
              placeholder="Ingresá tu contraseña"
              type="password"
              value={password}
              variant="faded"
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && (
              <div className="rounded-2xl border border-danger-100 bg-danger-50 p-4 text-center text-sm font-medium text-danger">
                {error}
              </div>
            )}

            <Button
              className="mt-1 h-12 w-full font-semibold shadow-md transition-all hover:shadow-lg"
              color="primary"
              isLoading={loading}
              radius="full"
              size="lg"
              type="submit"
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
              className="h-12 w-full border-divider bg-default-50 font-semibold text-default-700 transition-colors hover:bg-default-100"
              isDisabled={loading}
              radius="full"
              size="lg"
              startContent={<FcGoogle className="text-xl" />}
              type="button"
              variant="bordered"
              onPress={handleGoogleLogin}
            >
              Continuar con Google
            </Button>
          </form>

          <p className="mt-7 text-center text-sm text-default-600">
            ¿No tenés cuenta?{" "}
            <Link
              className="font-semibold text-primary hover:underline"
              to="/register"
            >
              Registrate
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
