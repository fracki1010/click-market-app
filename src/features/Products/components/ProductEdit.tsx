import type { IProduct } from "../types/Product";

import { useForm } from "@tanstack/react-form";

import { useUpdateProduct } from "../hooks/useUpdateProduct";
import { useCategories } from "../hooks/useCategory";

type ProductEditForm = {
  name: string;
  price: number;
  category: string;
  image_url: string;
};

interface ProductEditProps {
  product: IProduct;
  onClose: () => void;
  onSave: (updatedProduct: IProduct) => void;
}

export const ProductEdit = ({ product, onClose, onSave }: ProductEditProps) => {
  const updateProductMutation = useUpdateProduct();
  const { data: categories } = useCategories();

  const form = useForm({
    defaultValues: {
      name: product.name,
      description: product.description,
      image_url: product.imageUrl || "",
      price: product.price,
      category: product.categories?.[0]?.id || "",
    },

    validators: {
      onSubmit: (values) => {
        const errors: Partial<Record<keyof ProductEditForm, string[]>> = {};

        if (values.value.name.length < 3) {
          errors.name = ["El nombre debe tener al menos 3 caracteres."];
        }

        if (values.value.price <= 0 || isNaN(values.value.price)) {
          errors.price = ["El precio debe ser un número positivo."];
        }

        if (
          values.value.category.length === 0 ||
          values.value.category === "Seleccione una..."
        ) {
          errors.category = ["Debe seleccionar una categoría."];
        }

        return Object.keys(errors).length > 0 ? errors : undefined;
      },
      onSubmitAsync: async ({ value }) => {
        try {
          await updateProductMutation.mutateAsync({
            id: product.id,
            ...value,
          });

          const updatedProduct = {
            id: product.id,
            name: (value as any).name,
            description: (value as any).description,
            imageUrl: (value as any).image_url,
            price: (value as any).price,
            categories:
              categories?.filter((c) => c.id === String(value.category)) || [],
            stock: product.stock,
            stock_min: product.stock_min,
            sku: product.sku,
          } as IProduct;

          onSave(updatedProduct);
          onClose();
        } catch (error) {
          console.error("Falló el guardado del formulario:", error);
        }
      },
    },
  });

  return (
    <form
      className="space-y-4 overflow-auto p-4 max-h-[70vh]"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <form.Field
        children={(field) => (
          <div>
            <label
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              htmlFor={field.name}
            >
              Nombre del Producto
            </label>
            <input
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white p-2"
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
            {field.state.meta.errors ? (
              <em className="text-red-500 text-xs mt-1 block">
                {field.state.meta.errors.join(", ")}
              </em>
            ) : null}
          </div>
        )}
        name="name"
      />

      <form.Field
        children={(field) => (
          <div>
            <label
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              htmlFor={field.name}
            >
              Descripción
            </label>
            <textarea
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white p-2"
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
            {field.state.meta.errors ? (
              <em className="text-red-500 text-xs mt-1 block">
                {field.state.meta.errors.join(", ")}
              </em>
            ) : null}
          </div>
        )}
        name="description"
      />

      <form.Field
        children={(field) => (
          <div>
            <label
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              htmlFor={field.name}
            >
              URL de la Imagen
            </label>
            <input
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white p-2"
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
            {field.state.meta.errors ? (
              <em className="text-red-500 text-xs mt-1 block">
                {field.state.meta.errors.join(", ")}
              </em>
            ) : null}
          </div>
        )}
        name="image_url"
      />

      <form.Field
        children={(field) => (
          <div>
            <label
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              htmlFor={field.name}
            >
              Precio
            </label>
            <input
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white p-2"
              id={field.name}
              min="0"
              name={field.name}
              step="0.01"
              type="number"
              value={field.state.value}
              onBlur={field.handleBlur}
              // Convertimos el valor a float al cambiar el campo
              onChange={(e) => field.handleChange(parseFloat(e.target.value))}
            />
            {field.state.meta.errors ? (
              <em className="text-red-500 text-xs mt-1 block">
                {field.state.meta.errors.join(", ")}
              </em>
            ) : null}
          </div>
        )}
        name="price"
      />

      <form.Field
        children={(field) => (
          <div>
            <label
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              htmlFor={field.name}
            >
              Categoría
            </label>
            <select
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white p-2"
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            >
              {categories?.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {field.state.meta.errors ? (
              <em className="text-red-500 text-xs mt-1 block">
                {field.state.meta.errors.join(", ")}
              </em>
            ) : null}
          </div>
        )}
        name="category"
      />

      <div className="pt-4 flex justify-end space-x-3">
        <button
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 dark:bg-neutral-600 dark:text-gray-200 dark:hover:bg-neutral-500 transition-colors"
          disabled={form.state.isSubmitting}
          type="button"
          onClick={onClose}
        >
          Cancelar
        </button>

        <form.Subscribe
          children={(state) => (
            <button
              className={`px-4 py-2 text-sm font-medium text-white rounded-md transition-colors ${
                state.isSubmitting || !state.canSubmit
                  ? "bg-indigo-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
              disabled={!state.canSubmit || state.isSubmitting}
              type="submit"
            >
              {state.isSubmitting ? "Guardando..." : "Guardar Cambios"}
            </button>
          )}
        />
      </div>
    </form>
  );
};
