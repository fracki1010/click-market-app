import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { Button, Input } from "@heroui/react";

import { useAuth } from "../hooks/useAuth";
import logoBrand from "../../../assets/Recurso 1.svg";

export const RegisterPage = () => {
  const { register, loading, error, token, user } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (token && user) {
      if (user.role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/home", { replace: true });
      }
    }
  }, [token, user, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!name || !username || !email || !password || !confirmPassword) {
      setFormError("Completá todos los campos para continuar");

      return;
    }

    if (password.length < 6) {
      setFormError("La contraseña debe tener al menos 6 caracteres");

      return;
    }

    if (password !== confirmPassword) {
      setFormError("Las contraseñas no coinciden");

      return;
    }

    setFormError(null);
    await register(username, email, password, name);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-b from-amber-50 via-background to-content1 px-4 py-10 transition-colors sm:px-8">
      <div className="pointer-events-none absolute -left-20 top-14 h-64 w-64 rounded-full bg-amber-200/35 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-14 h-64 w-64 rounded-full bg-primary-200/35 blur-3xl" />

      <div className="relative z-10 w-full max-w-[520px] animate-appearance-in">
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
              Crear cuenta
            </h1>
            <p className="mt-3 text-sm font-medium text-default-500">
              Registrate para comprar en Click Market
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <Input
                label="Nombre completo"
                placeholder="Tu nombre"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                isRequired
                variant="faded"
                classNames={{
                  inputWrapper:
                    "bg-default-50 border-divider shadow-none hover:bg-default-100 transition-colors",
                  label: "text-default-600 font-medium",
                }}
              />
              <Input
                label="Usuario"
                placeholder="@usuario"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                isRequired
                variant="faded"
                classNames={{
                  inputWrapper:
                    "bg-default-50 border-divider shadow-none hover:bg-default-100 transition-colors",
                  label: "text-default-600 font-medium",
                }}
              />
            </div>

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

            <div className="grid gap-5 sm:grid-cols-2">
              <Input
                label="Contraseña"
                placeholder="Mínimo 6 caracteres"
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
              <Input
                label="Confirmar contraseña"
                placeholder="Repetí tu contraseña"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                isRequired
                variant="faded"
                classNames={{
                  inputWrapper:
                    "bg-default-50 border-divider shadow-none hover:bg-default-100 transition-colors",
                  label: "text-default-600 font-medium",
                }}
              />
            </div>

            {(formError || error) && (
              <div className="rounded-2xl border border-danger-100 bg-danger-50 p-4 text-center text-sm font-medium text-danger">
                {formError || error}
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
              {loading ? "Creando cuenta..." : "Registrarme"}
            </Button>
          </form>

          <p className="mt-7 text-center text-sm text-default-600">
            ¿Ya tenés cuenta?{" "}
            <Link className="font-semibold text-primary hover:underline" to="/login">
              Iniciá sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
