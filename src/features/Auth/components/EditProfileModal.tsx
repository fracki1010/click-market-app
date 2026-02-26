import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Switch,
  Divider,
} from "@heroui/react";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { FaUser, FaEnvelope, FaLock, FaKey } from "react-icons/fa6";

const profileSchema = z
  .object({
    name: z.string().min(3, "El nombre es muy corto"),
    email: z.string().email("Correo inválido"),
    username: z.string().min(3, "Usuario muy corto"),
    changePassword: z.boolean(),
    password: z.string().optional(),
    confirmPassword: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.changePassword) {
      if (!data.password || data.password.length < 6) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Mínimo 6 caracteres",
          path: ["password"],
        });
      }
      if (data.password !== data.confirmPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "No coinciden",
          path: ["confirmPassword"],
        });
      }
    }
  });

type ProfileFormValues = z.infer<typeof profileSchema>;

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  onSubmit: (data: any) => Promise<void>;
  isLoading: boolean;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onSubmit,
  isLoading,
}) => {
  // Estado local para animación visual del switch
  const [showPasswordFields, setShowPasswordFields] = useState(false);

  // Helper de validación manual (Igual que en ProductForm)
  const validate = (
    field: keyof ProfileFormValues,
    value: any,
    allValues: ProfileFormValues,
  ) => {
    // Para validaciones complejas
    const result = profileSchema.safeParse({ ...allValues, [field]: value });

    if (!result.success) {
      // Buscamos el error específico de este campo
      const error = result.error.errors.find((e) => e.path[0] === field);

      return error ? error.message : undefined;
    }

    return undefined;
  };

  const form = useForm({
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      username: user?.username || "",
      changePassword: false,
      password: "",
      confirmPassword: "",
    },
    onSubmit: async ({ value }: { value: ProfileFormValues }) => {
      const payload: any = {
        name: value.name,
        email: value.email,
        username: value.username,
      };

      if (value.changePassword && value.password) {
        payload.password = value.password;
      }
      await onSubmit(payload);
    },
  });

  return (
    <Modal backdrop="blur" isOpen={isOpen} size="lg" onClose={onClose}>
      <ModalContent>
        {(onClose) => (
          <form
            className="flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
            <ModalHeader className="flex flex-col gap-1">
              Editar Perfil
            </ModalHeader>

            <ModalBody className="gap-4">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                Información Pública
              </p>

              <form.Field
                children={(field) => (
                  <Input
                    errorMessage={field.state.meta.errors.join(", ")}
                    isInvalid={!!field.state.meta.errors.length}
                    label="Nombre Completo"
                    startContent={<FaUser className="text-default-400" />}
                    value={field.state.value}
                    variant="bordered"
                    onBlur={field.handleBlur}
                    onValueChange={field.handleChange}
                  />
                )}
                name="name"
                validators={{
                  onChange: ({ value, fieldApi }) =>
                    validate("name", value, fieldApi.form.state.values),
                }}
              />

              <div className="flex gap-4">
                <form.Field
                  children={(field) => (
                    <Input
                      className="flex-1"
                      errorMessage={field.state.meta.errors.join(", ")}
                      isInvalid={!!field.state.meta.errors.length}
                      label="Usuario"
                      startContent={
                        <span className="text-default-400 text-sm">@</span>
                      }
                      value={field.state.value}
                      variant="bordered"
                      onBlur={field.handleBlur}
                      onValueChange={field.handleChange}
                    />
                  )}
                  name="username"
                  validators={{
                    onChange: ({ value, fieldApi }) =>
                      validate("username", value, fieldApi.form.state.values),
                  }}
                />
                <form.Field
                  children={(field) => (
                    <Input
                      className="flex-1"
                      errorMessage={field.state.meta.errors.join(", ")}
                      isInvalid={!!field.state.meta.errors.length}
                      label="Correo"
                      startContent={<FaEnvelope className="text-default-400" />}
                      value={field.state.value}
                      variant="bordered"
                      onBlur={field.handleBlur}
                      onValueChange={field.handleChange}
                    />
                  )}
                  name="email"
                  validators={{
                    onChange: ({ value, fieldApi }) =>
                      validate("email", value, fieldApi.form.state.values),
                  }}
                />
              </div>

              <Divider className="my-2" />

              {/* Sección Seguridad */}
              <div className="flex justify-between items-center bg-gray-50 dark:bg-neutral-800 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-warning-100 text-warning-600 rounded-full">
                    <FaLock />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold">Seguridad</span>
                    <span className="text-xs text-gray-500">
                      ¿Cambiar contraseña?
                    </span>
                  </div>
                </div>

                <form.Field
                  children={(field) => (
                    <Switch
                      color="warning"
                      isSelected={field.state.value}
                      size="sm"
                      onValueChange={(val) => {
                        field.handleChange(val);
                        setShowPasswordFields(val);
                        if (!val) {
                          form.setFieldValue("password", "");
                          form.setFieldValue("confirmPassword", "");
                        }
                      }}
                    />
                  )}
                  name="changePassword"
                />
              </div>

              {/* Campos Condicionales */}
              {showPasswordFields && (
                <div className="space-y-4 animate-appearance-in">
                  <form.Field
                    children={(field) => (
                      <Input
                        color="warning"
                        errorMessage={field.state.meta.errors.join(", ")}
                        isInvalid={!!field.state.meta.errors.length}
                        label="Nueva Contraseña"
                        startContent={<FaKey className="text-default-400" />}
                        type="password"
                        value={field.state.value || ""}
                        variant="flat"
                        onBlur={field.handleBlur}
                        onValueChange={field.handleChange}
                      />
                    )}
                    name="password"
                    validators={{
                      onChange: ({ value, fieldApi }) =>
                        validate("password", value, fieldApi.form.state.values),
                    }}
                  />
                  <form.Field
                    children={(field) => (
                      <Input
                        color="warning"
                        errorMessage={field.state.meta.errors.join(", ")}
                        isInvalid={!!field.state.meta.errors.length}
                        label="Confirmar"
                        startContent={<FaKey className="text-default-400" />}
                        type="password"
                        value={field.state.value || ""}
                        variant="flat"
                        onBlur={field.handleBlur}
                        onValueChange={field.handleChange}
                      />
                    )}
                    name="confirmPassword"
                    validators={{
                      onChange: ({ value, fieldApi }) =>
                        validate(
                          "confirmPassword",
                          value,
                          fieldApi.form.state.values,
                        ),
                    }}
                  />
                </div>
              )}
            </ModalBody>

            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Cancelar
              </Button>
              <Button color="primary" isLoading={isLoading} type="submit">
                Guardar Cambios
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
};
