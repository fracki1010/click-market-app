import { Link, useNavigate } from "react-router";
import { Card, CardHeader, CardBody, CardFooter, Divider } from "@heroui/react";
import { FaUserPlus } from "react-icons/fa6";

import { useAuth } from "../hooks/useAuth";
import { AuthForm } from "../../../components/ui/AuthForm";

export const RegisterPage = () => {
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (data: Record<string, string>) => {
    try {
      await register(data.username, data.email, data.password, data.name);
      navigate("/home");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 transition-colors">
      <Card className="w-full max-w-md shadow-xl border border-divider bg-content1">
        <CardHeader className="flex flex-col gap-1 items-center pb-0 pt-8">
          <div className="p-3 bg-primary-50 rounded-full text-primary mb-2">
            <FaUserPlus className="text-2xl" />
          </div>
          <h1 className="text-2xl font-bold text-default-800">Crear cuenta</h1>
          <p className="text-sm text-default-500">
            Únete a la comunidad de Click Market
          </p>
        </CardHeader>

        <Divider className="my-4 opacity-50" />

        <CardBody>
          <AuthForm
            fields={[
              { name: "name", label: "Nombre completo", type: "text" },
              { name: "username", label: "Usuario", type: "text" },
              { name: "email", label: "Correo electrónico", type: "email" },
              { name: "password", label: "Contraseña", type: "password" },
            ]}
            submitLabel={loading ? "Creando..." : "Registrarse"}
            onSubmit={handleRegister}
          />
        </CardBody>

        <Divider />

        <CardFooter className="justify-center py-6 bg-default-50">
          <p className="text-sm text-default-600">
            ¿Ya tienes una cuenta?{" "}
            <Link
              className="text-primary font-bold hover:underline transition-colors"
              to="/login"
            >
              Inicia sesión
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};
