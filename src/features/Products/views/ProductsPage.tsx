import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Select,
  SelectItem,
  Spinner,
  Pagination, // <--- 1. Importar el componente Pagination
} from "@heroui/react";

import { ProductFilters, type FilterState } from "../components/ProductFilter";
import { ProductList } from "../components/ProductList";
import { useProducts } from "../hooks/useProducts";

const ITEMS_PER_PAGE = 3; // Cantidad de productos por página

export const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // 2. Leer la página actual de la URL (por defecto 1)
  const currentPage = Number(searchParams.get("page")) || 1;

  const [filters, setFilters] = useState<FilterState>({
    categories: [] as string[],
    price_min: undefined as number | undefined,
    price_max: undefined as number | undefined,
    sort: "featured",
    // Ya no guardamos 'page' aquí para evitar doble estado, usamos la URL directamente
  });

  useEffect(() => {
    const categoryParams = searchParams.getAll("category");
    const minPrice = searchParams.get("min")
      ? Number(searchParams.get("min"))
      : undefined;
    const maxPrice = searchParams.get("max")
      ? Number(searchParams.get("max"))
      : undefined;
    const sortParam = searchParams.get("sort") || "featured";

    setFilters({
      categories: categoryParams,
      price_min: minPrice,
      price_max: maxPrice,
      sort: sortParam,
    });
  }, [searchParams]);

  const handleFilterChange = (newFilters: typeof filters) => {
    const params = new URLSearchParams();
    newFilters.categories.forEach((cat) => params.append("category", cat));
    if (newFilters.price_min)
      params.set("min", newFilters.price_min.toString());
    if (newFilters.price_max)
      params.set("max", newFilters.price_max.toString());

    // Al filtrar, reiniciamos a la página 1
    params.set("page", "1");

    setSearchParams(params);
  };

  const handleSortChange = (keys: any) => {
    const selectedSort = Array.from(keys)[0] as string;
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set("sort", selectedSort);
      // Al reordenar, es buena práctica volver a la página 1
      newParams.set("page", "1");
      return newParams;
    });
  };

  // 3. Función para cambiar de página
  const handlePageChange = (page: number) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set("page", page.toString());
      return newParams;
    });
    // Opcional: Hacer scroll al inicio de la lista
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 4. Llamamos al hook pasando los filtros y la paginación
  const { data: response, isLoading } = useProducts({
    ...filters,
    page: currentPage,
    limit: ITEMS_PER_PAGE,
  });

  // 5. Desestructuramos la respuesta de forma segura
  const products = response?.data || [];
  const pagination = response?.pagination;

  console.log(products);

  console.log(pagination);

  return (
    <main className="flex-grow container mx-auto px-4 py-8 bg-gray-50 dark:bg-neutral-900 transition-colors">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Catálogo Educativo
        </h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="w-full lg:w-64 flex-shrink-0">
          <ProductFilters
            currentFilters={filters}
            onApply={handleFilterChange}
          />
        </aside>

        <div className="flex-grow">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 bg-white dark:bg-neutral-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-neutral-700">
            <span className="text-gray-500 text-sm">
              {/* 6. Mostrar información real de paginación */}
              Mostrando {products.length} de {pagination?.totalItems || 0}{" "}
              productos
            </span>

            <div className="w-full sm:w-auto">
              <Select
                label="Ordenar por"
                placeholder="Selecciona orden"
                className="w-52"
                size="sm"
                variant="bordered"
                selectedKeys={filters.sort ? [filters.sort] : ["featured"]}
                onSelectionChange={handleSortChange}
              >
                <SelectItem key="featured">Destacados</SelectItem>
                <SelectItem key="price_asc">Precio: Bajo a Alto</SelectItem>
                <SelectItem key="price_desc">Precio: Alto a Bajo</SelectItem>
                <SelectItem key="newest">Más recientes</SelectItem>
              </Select>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <Spinner label="Cargando..." />
            </div>
          ) : (
            <>
              {/* 7. Pasar SOLAMENTE el array de productos a la lista */}
              <ProductList isLoading={isLoading} products={products} />

              {/* 8. Componente de Paginación */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex justify-center mt-12 mb-8">
                  <Pagination
                    showControls
                    isCompact
                    color="primary"
                    variant="flat"
                    page={currentPage} // Página actual desde la URL
                    total={pagination.totalPages} // Total de páginas desde el backend
                    onChange={handlePageChange} // Función al hacer click
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
};
