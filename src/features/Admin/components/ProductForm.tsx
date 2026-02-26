import React, { useEffect } from "react";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import {
  Input,
  Button,
  Textarea,
  ModalFooter,
  ModalBody,
  Autocomplete,
  AutocompleteItem,
  Chip,
} from "@heroui/react";

import { useCategories } from "../../Products/hooks/useCategory";

// 1. Esquema de Validación con Zod (Se mantiene igual)
const productSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  price: z.number().min(0.01, "El precio debe ser mayor a 0"),
  sku: z.string().min(3, "SKU requerido"),
  stock: z.number().int().min(0, "El stock no puede ser negativo"),
  stock_min: z.number().int().min(1, "El stock mínimo debe ser al menos 1"),
  category_ids: z.array(z.string()).min(1, "Selecciona al menos una categoría"),
  image_url: z
    .string()
    .url("Debe ser una URL válida")
    .optional()
    .or(z.literal("")),
  description: z.string().optional().or(z.literal("")),
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

  const getInitialCategoryIds = (): string[] => {
    if (!initialData) return [];

    // Si ya vienen categorías como objetos (que es lo más probable ahora)
    if (initialData.categories && Array.isArray(initialData.categories)) {
      return initialData.categories
        .map((c: any) => (c.id || c._id)?.toString())
        .filter(Boolean);
    }

    // Si por suerte ya viene el ID o IDs en planos
    if (initialData.category_ids && Array.isArray(initialData.category_ids)) {
      return initialData.category_ids.map((id: any) => id.toString());
    }

    if (initialData.category_id) return [initialData.category_id.toString()];

    // Compatibilidad: Si viene el NOMBRE ("category"), búscalo en la lista
    if (initialData.category) {
      const found = categories.find((c) => c.name === initialData.category);

      return found ? [found.id.toString()] : [];
    }

    return [];
  };

  // 2. Helper para validar campos individuales con Zod sin usar el adaptador global
  // Esto evita el error de tipos "validatorAdapter does not exist"
  const validate = (field: keyof ProductFormValues, value: any) => {
    // Extraemos la validación específica del campo desde el esquema grande
    const fieldSchema = productSchema.shape[field];
    const result = fieldSchema.safeParse(value);

    return result.success ? undefined : result.error.errors[0].message;
  };

  // 3. Hook de TanStack Form (Sin validatorAdapter para evitar el error)
  const form = useForm({
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      price: Number(initialData?.price) || 0,
      sku: initialData?.sku || "",
      stock: Number(initialData?.stock || 0),
      stock_min: Number(initialData?.stock_min || 5),
      category_ids: getInitialCategoryIds(),
      image_url: initialData?.imageUrl || "",
    },
    onSubmit: async ({ value }) => {
      // Validamos todo el formulario antes de enviar por seguridad
      const result = productSchema.safeParse(value);

      if (result.success) {
        await onSubmit(result.data);
      } else {
        console.error(result.error);
      }
    },
  });

  useEffect(() => {
    if (initialData && categories.length > 0) {
      // Si el formulario se montó vacío (ej: se abrió el modal de crear y luego se cerró)
      // o si cambiamos de producto a editar, reseteamos los campos principales.

      const ids = getInitialCategoryIds();

      if (ids.length > 0) {
        form.setFieldValue("category_ids", ids);
      }

      // También reseteamos otros campos para asegurar que el form refleje el initialData actual
      form.setFieldValue("name", initialData.name || "");
      form.setFieldValue("sku", initialData.sku || "");
      form.setFieldValue("price", Number(initialData.price) || 0);
      form.setFieldValue("stock", Number(initialData.stock || 0));
      form.setFieldValue("stock_min", Number(initialData.stock_min || 5));
      form.setFieldValue(
        "image_url",
        initialData.imageUrl || initialData.image_url || "",
      );
      form.setFieldValue("description", initialData.description || "");
    }
  }, [initialData?.id, categories.length]); // Solo re-ejecutamos si cambia el ID del producto o cargan categorías

  return (
    <form
      className="flex flex-col gap-4 max-h-[80vh] overflow-y-auto"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <ModalBody className="gap-4">
        {/* Campo Nombre */}
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
          validators={{
            onChange: ({ value }) => validate("name", value),
          }}
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
            validators={{
              onChange: ({ value }) => validate("sku", value),
            }}
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
            validators={{
              onChange: ({ value }) => validate("price", value),
            }}
          />
        </div>

        <div className="flex gap-4">
          <form.Field
            children={(field) => (
              <Input
                color="primary"
                errorMessage={field.state.meta.errors.join(", ")}
                isInvalid={!!field.state.meta.errors.length}
                label="Stock Actual"
                type="number"
                value={field.state.value.toString()}
                variant="flat"
                onValueChange={(val) => field.handleChange(Number(val))}
              />
            )}
            name="stock"
            validators={{
              onChange: ({ value }) => validate("stock", value),
            }}
          />
          <form.Field
            children={(field) => (
              <Input
                color="warning"
                errorMessage={field.state.meta.errors.join(", ")}
                isInvalid={!!field.state.meta.errors.length}
                label="Stock Mínimo"
                type="number"
                value={field.state.value.toString()}
                variant="flat"
                onValueChange={(val) => field.handleChange(Number(val))}
              />
            )}
            name="stock_min"
            validators={{
              onChange: ({ value }) => validate("stock_min", value),
            }}
          />
        </div>

        <div className="flex flex-col gap-2">
          <form.Field
            children={(field) => (
              <>
                <Autocomplete
                  label="Agregar Categoría"
                  placeholder="Busca una categoría para agregar..."
                  variant="bordered"
                  onSelectionChange={(key) => {
                    if (key) {
                      const currentIds = field.state.value || [];

                      if (!currentIds.includes(key as string)) {
                        field.handleChange([...currentIds, key as string]);
                      }
                    }
                  }}
                >
                  {categories.map((cat) => {
                    const parent = cat.parent
                      ? categories.find(
                          (p) => p.id.toString() === cat.parent?.toString(),
                        )
                      : null;

                    return (
                      <AutocompleteItem
                        key={cat.id.toString()}
                        textValue={
                          parent ? `${parent.name} > ${cat.name}` : cat.name
                        }
                      >
                        {parent ? (
                          <div className="flex flex-col">
                            <span className="text-small">{cat.name}</span>
                            <span className="text-tiny text-default-400">
                              Padre: {parent.name}
                            </span>
                          </div>
                        ) : (
                          cat.name
                        )}
                      </AutocompleteItem>
                    );
                  })}
                </Autocomplete>

                {/* Lista de Categorías Seleccionadas como Chips */}
                <div className="flex flex-wrap gap-2 mt-1">
                  {field.state.value.map((id: string) => {
                    const cat = categories.find(
                      (c) => c.id.toString() === id.toString(),
                    );

                    if (!cat) return null;

                    return (
                      <Chip
                        key={id}
                        color="secondary"
                        size="sm"
                        variant="flat"
                        onClose={() => {
                          const newIds = field.state.value.filter(
                            (cid: string) => cid !== id,
                          );

                          field.handleChange(newIds);
                        }}
                      >
                        {cat.name}
                      </Chip>
                    );
                  })}
                </div>
                {field.state.meta.errors.length > 0 && (
                  <p className="text-tiny text-danger">
                    {field.state.meta.errors.join(", ")}
                  </p>
                )}
              </>
            )}
            name="category_ids"
            validators={{
              onChange: ({ value }) => validate("category_ids", value),
            }}
          />
        </div>

        <form.Field
          children={(field) => (
            <Input
              errorMessage={field.state.meta.errors.join(", ")}
              isInvalid={!!field.state.meta.errors.length}
              label="URL Imagen"
              value={field.state.value || ""}
              variant="bordered"
              onValueChange={field.handleChange}
            />
          )}
          name="image_url"
          validators={{
            onChange: ({ value }) => validate("image_url", value),
          }}
        />

        <form.Field
          children={(field) => (
            <Textarea
              errorMessage={field.state.meta.errors.join(", ")}
              isInvalid={!!field.state.meta.errors.length}
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
