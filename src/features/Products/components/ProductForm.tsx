import React from "react";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import {
  Input,
  Button,
  Select,
  SelectItem,
  Textarea,
  ModalFooter,
  ModalBody,
} from "@heroui/react";

import { useCategories } from "../../Products/hooks/useCategory";

const productSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  description: z.string().min(10, "La descripción es muy corta"),
  price: z.number().min(0.01, "El precio debe ser mayor a 0"),
  sku: z.string().min(3, "SKU requerido"), // Requisito RF-INV-01
  stock_current: z.number().int().min(0, "El stock no puede ser negativo"),
  stock_min: z.number().int().min(1, "El stock mínimo debe ser al menos 1"),
  category_id: z.string().min(1, "Selecciona una categoría"), // Select devuelve string usualmente
  image_url: z
    .string()
    .url("Debe ser una URL válida")
    .optional()
    .or(z.literal("")),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  initialData?: any;
  onSubmit: (data: ProductFormValues) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
}) => {
  const { data: categories = [] } = useCategories();

  // TanStack Form
  const form = useForm({
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      price: initialData?.price || 0,
      sku: initialData?.sku || "",
      stock_current: initialData?.stock || 0,
      stock_min: initialData?.stock_min || 5,
      category_id: initialData?.category_id?.toString() || "",
      image_url: initialData?.imageUrl || "",
    } as ProductFormValues,
    // validatorAdapter: zodValidator(),
    validators: {
      onChange: productSchema,
    },
    onSubmit: async ({ value }) => {
      // Conversión de tipos si es necesario antes de enviar
      await onSubmit(value);
    },
  });

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <ModalBody className="gap-4">
        <form.Field
          children={(field) => (
            <Input
              errorMessage={field.state.meta.errors.join(", ")}
              isInvalid={!!field.state.meta.errors.length}
              label="Nombre del Producto"
              placeholder="Ej: Tablet Educativa"
              value={field.state.value}
              variant="bordered"
              onBlur={field.handleBlur}
              onValueChange={field.handleChange}
            />
          )}
          name="name"
        />

        <div className="flex gap-4">
          <form.Field
            children={(field) => (
              <Input
                className="flex-1"
                errorMessage={field.state.meta.errors.join(", ")}
                isInvalid={!!field.state.meta.errors.length}
                label="SKU"
                placeholder="TEC-001"
                value={field.state.value}
                variant="bordered"
                onBlur={field.handleBlur}
                onValueChange={field.handleChange}
              />
            )}
            name="sku"
          />
          <form.Field
            children={(field) => (
              <Input
                className="flex-1"
                errorMessage={field.state.meta.errors.join(", ")}
                isInvalid={!!field.state.meta.errors.length}
                label="Precio ($)"
                type="number"
                value={field.state.value.toString()}
                variant="bordered"
                onBlur={field.handleBlur}
                onValueChange={(val) => field.handleChange(Number(val))}
              />
            )}
            name="price"
          />
        </div>

        <div className="flex gap-4">
          <form.Field
            children={(field) => (
              <Input
                color="primary"
                label="Stock Actual"
                type="number"
                value={field.state.value.toString()}
                variant="flat"
                onValueChange={(val) => field.handleChange(Number(val))}
              />
            )}
            name="stock_current"
          />
          <form.Field
            children={(field) => (
              <Input
                color="warning"
                label="Stock Mínimo"
                type="number"
                value={field.state.value.toString()}
                variant="flat"
                onValueChange={(val) => field.handleChange(Number(val))}
              />
            )}
            name="stock_min"
          />
        </div>

        <form.Field
          children={(field) => (
            <Select
              errorMessage={field.state.meta.errors.join(", ")}
              isInvalid={!!field.state.meta.errors.length}
              label="Categoría"
              selectedKeys={field.state.value ? [field.state.value] : []}
              variant="bordered"
              onSelectionChange={(keys) =>
                field.handleChange(Array.from(keys)[0] as string)
              }
            >
              {categories.map((cat) => (
                <SelectItem key={cat.id} textValue={cat.id.toString()}>
                  {cat.name}
                </SelectItem>
              ))}
            </Select>
          )}
          name="category_id"
        />

        <form.Field
          children={(field) => (
            <Input
              label="URL Imagen"
              value={field.state.value || ""}
              variant="bordered"
              onValueChange={field.handleChange}
            />
          )}
          name="image_url"
        />

        <form.Field
          children={(field) => (
            <Textarea
              label="Descripción"
              value={field.state.value}
              variant="bordered"
              onValueChange={field.handleChange}
            />
          )}
          name="description"
        />
      </ModalBody>

      <ModalFooter>
        <Button color="danger" variant="light" onPress={onCancel}>
          Cancelar
        </Button>
        <Button color="primary" isLoading={isLoading} type="submit">
          {initialData ? "Guardar Cambios" : "Crear Producto"}
        </Button>
      </ModalFooter>
    </form>
  );
};
