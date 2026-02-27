import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
  Switch,
} from "@heroui/react";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import {
  FaLocationDot,
  FaMapLocationDot,
  FaNoteSticky,
  FaStar,
} from "react-icons/fa6";
import { CreateAddressPayload } from "../types/Address";

const addressSchema = z.object({
  address: z.string().min(5, "La dirección es muy corta"),
  neighborhood: z.string().min(3, "El barrio es muy corto"),
  deliveryNotes: z.string().optional(),
  isDefault: z.boolean(),
});

type AddressFormValues = z.infer<typeof addressSchema>;

interface AddAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateAddressPayload) => Promise<void>;
  isLoading: boolean;
}

export const AddAddressModal: React.FC<AddAddressModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}) => {
  const validate = (
    field: keyof AddressFormValues,
    value: any,
    allValues: AddressFormValues,
  ) => {
    const result = addressSchema.safeParse({ ...allValues, [field]: value });
    if (!result.success) {
      const error = result.error.errors.find((e) => e.path[0] === field);
      return error ? error.message : undefined;
    }
    return undefined;
  };

  const form = useForm({
    defaultValues: {
      address: "",
      neighborhood: "",
      deliveryNotes: "",
      isDefault: false,
    },
    onSubmit: async ({ value }: { value: AddressFormValues }) => {
      await onSubmit(value);
      form.reset();
    },
  });

  return (
    <Modal backdrop="blur" isOpen={isOpen} size="lg" onClose={onClose}>
      <ModalContent>
        {(onClose) => (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
            <ModalHeader className="flex flex-col gap-1">
              Nueva Dirección
            </ModalHeader>
            <ModalBody className="gap-4">
              <form.Field
                children={(field) => (
                  <Input
                    errorMessage={field.state.meta.errors.join(", ")}
                    isInvalid={!!field.state.meta.errors.length}
                    label="Dirección"
                    placeholder="Ej: Av. Siempreviva 742"
                    startContent={
                      <FaLocationDot className="text-default-400" />
                    }
                    value={field.state.value}
                    variant="bordered"
                    onBlur={field.handleBlur}
                    onValueChange={field.handleChange}
                  />
                )}
                name="address"
                validators={{
                  onChange: ({ value, fieldApi }) =>
                    validate("address", value, fieldApi.form.state.values),
                }}
              />

              <form.Field
                children={(field) => (
                  <Input
                    errorMessage={field.state.meta.errors.join(", ")}
                    isInvalid={!!field.state.meta.errors.length}
                    label="Barrio / Zona"
                    placeholder="Ej: Centro"
                    startContent={
                      <FaMapLocationDot className="text-default-400" />
                    }
                    value={field.state.value}
                    variant="bordered"
                    onBlur={field.handleBlur}
                    onValueChange={field.handleChange}
                  />
                )}
                name="neighborhood"
                validators={{
                  onChange: ({ value, fieldApi }) =>
                    validate("neighborhood", value, fieldApi.form.state.values),
                }}
              />

              <form.Field
                children={(field) => (
                  <Textarea
                    errorMessage={field.state.meta.errors.join(", ")}
                    isInvalid={!!field.state.meta.errors.length}
                    label="Notas de entrega (Opcional)"
                    placeholder="Ej: Portón blanco, dejar en recepción..."
                    startContent={
                      <FaNoteSticky className="text-default-400 mt-1" />
                    }
                    value={field.state.value}
                    variant="bordered"
                    onBlur={field.handleBlur}
                    onValueChange={field.handleChange}
                  />
                )}
                name="deliveryNotes"
              />

              <form.Field
                children={(field) => (
                  <div className="flex items-center justify-between p-3 bg-default-50 rounded-xl border border-divider">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-warning-100 text-warning-600 rounded-full">
                        <FaStar />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold">Principal</span>
                        <span className="text-xs text-default-500">
                          Establecer como dirección principal
                        </span>
                      </div>
                    </div>
                    <Switch
                      color="warning"
                      isSelected={field.state.value}
                      size="sm"
                      onValueChange={field.handleChange}
                    />
                  </div>
                )}
                name="isDefault"
              />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Cancelar
              </Button>
              <Button color="primary" isLoading={isLoading} type="submit">
                Agregar Dirección
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
};
