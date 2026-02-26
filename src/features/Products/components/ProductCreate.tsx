import { useForm } from "@tanstack/react-form";

import { useCreateProduct } from "../hooks/useCreateProduct"; // Ajusta la ruta
import { useCategories } from "../hooks/useCategory";

type ProductCreateForm = {
  name: string;
  price: number;
  description: string;
  image_url: string;
  category_id: string;
  stock: number;
  stock_min: number;
};

interface ProductCreateProps {
  onClose: () => void;
}

export const ProductCreate = ({ onClose }: ProductCreateProps) => {
  const createProductMutation = useCreateProduct();
  const { data: categories } = useCategories();

  const form = useForm({
    defaultValues: {
      name: "",
      price: 0,
      description: "",
      category_id: "",
      image_url: "",
      stock: 0,
      stock_min: 0,
    } as ProductCreateForm,

    validators: {
      onSubmit: (values) => {
        const errors: Partial<Record<keyof ProductCreateForm, string[]>> = {};

        if (values.value.name.length < 3) {
          errors.name = ["El nombre debe tener al menos 3 caracteres."];
        }

        if (values.value.price <= 0 || isNaN(values.value.price)) {
          errors.price = ["El precio debe ser un número positivo."];
        }

        if (values.value.category_id === "") {
          errors.category_id = ["Debe seleccionar una categoría."];
        }

        return Object.keys(errors).length > 0 ? errors : undefined;
      },
    },

    onSubmit: async ({ value }) => {
      try {
        const selectedCategory = categories?.find(
          (c) => c.id === value.category_id,
        );

        await createProductMutation.mutateAsync({
          name: value.name,
          description: value.description,
          price: value.price,
          categories: selectedCategory ? [selectedCategory] : [],
          image_url: value.image_url,
          stock: value.stock,
          stock_min: value.stock_min,
        });

        onClose();
      } catch (error) {
        // El error ya es manejado por useMutation
        console.error("Falló la creación del producto:", error);
      }
    },
  });

  // Determina el estado de carga y envío
  const isSaving = form.state.isSubmitting || createProductMutation.isPending;

  return (
    <form
      className="space-y-4 overflow-auto max-h-[70vh] pa-4 px-10"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      {/* 1. Campo Nombre */}
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

      {/* 2. Campo Precio */}
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
              // Usamos el valor (que es 0 por defecto)
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
              Stock Actual
            </label>
            <input
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white p-2"
              id={field.name}
              min="0"
              name={field.name}
              type="number"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(parseInt(e.target.value, 10))}
            />
          </div>
        )}
        name="stock"
      />

      <form.Field
        children={(field) => (
          <div>
            <label
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              htmlFor={field.name}
            >
              Stock Mínimo
            </label>
            <input
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white p-2"
              id={field.name}
              min="0"
              name={field.name}
              type="number"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(parseInt(e.target.value, 10))}
            />
          </div>
        )}
        name="stock_min"
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
              type="text"
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

      {/* 3. Campo Categoría (Select) */}
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
              {categories ? (
                <>
                  <option value="">Seleccione una...</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </>
              ) : null}
            </select>
            {field.state.meta.errors ? (
              <em className="text-red-500 text-xs mt-1 block">
                {field.state.meta.errors.join(", ")}
              </em>
            ) : null}
          </div>
        )}
        name="category_id"
      />

      {/* Botones de Acción */}
      <div className="pt-4 flex justify-end space-x-3">
        <button
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 dark:bg-neutral-600 dark:text-gray-200 dark:hover:bg-neutral-500 transition-colors"
          disabled={isSaving}
          type="button"
          onClick={onClose}
        >
          Cancelar
        </button>

        <form.Subscribe
          children={(state) => (
            <button
              className={`px-4 py-2 text-sm font-medium text-white rounded-md transition-colors ${
                isSaving || !state.canSubmit
                  ? "bg-green-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
              disabled={!state.canSubmit || isSaving}
              type="submit"
            >
              {isSaving ? "Creando..." : "Crear Producto"}
            </button>
          )}
        />
      </div>
    </form>
  );
};
