import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import { Select, SelectItem, Spinner, Pagination, Input } from "@heroui/react";
import { FiSearch } from "react-icons/fi";

// Asegúrate de que las rutas de importación sean correctas según tu estructura
import { ProductFilters, type FilterState } from "../components/ProductFilter";
import { ProductList } from "../components/ProductList"; // Asumo que tienes este componente
import { useProducts } from "../hooks/useProducts";

const ITEMS_PER_PAGE = 12;

export const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // 1. Estado inicial basado en la URL
  const initialPage = Number(searchParams.get("page")) || 1;

  const [filters, setFilters] = useState<FilterState>({
    categories: searchParams.getAll("categories"), // Leemos array de la URL
    price_min: searchParams.get("price_min")
      ? Number(searchParams.get("price_min"))
      : undefined,
    price_max: searchParams.get("price_max")
      ? Number(searchParams.get("price_max"))
      : undefined,
    sort: searchParams.get("sort") || "featured",
    page: initialPage,
    limit: ITEMS_PER_PAGE,
    search: searchParams.get("search") || "",
  });

  const [searchTerm, setSearchTerm] = useState(filters.search || "");

  // 2. Sincronizar Estado cuando cambia la URL (Navegación atrás/adelante)
  useEffect(() => {
    const currentCategories = searchParams.getAll("categories");
    const currentMin = searchParams.get("price_min");
    const currentMax = searchParams.get("price_max");
    const currentSort = searchParams.get("sort") || "featured";
    const currentPage = Number(searchParams.get("page")) || 1;
    const currentSearch = searchParams.get("search") || "";

    setFilters({
      categories: currentCategories,
      price_min: currentMin ? Number(currentMin) : undefined,
      price_max: currentMax ? Number(currentMax) : undefined,
      sort: currentSort,
      page: currentPage,
      limit: ITEMS_PER_PAGE,
      search: currentSearch,
    });
    setSearchTerm(currentSearch);
  }, [searchParams]);

  // 2.5 Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchTerm !== filters.search) {
        updateUrl({ ...filters, search: searchTerm, page: 1 });
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  // 3. Hook de Datos (React Query)
  const { data: response, isLoading, isFetching } = useProducts(filters);

  const products = response?.data || [];
  const pagination = response?.pagination;

  // 4. Manejadores de Eventos (Actualizan la URL)

  const updateUrl = (newFilters: FilterState) => {
    const params = new URLSearchParams();

    // Categorías (pueden ser múltiples)
    if (newFilters.categories && newFilters.categories.length > 0) {
      newFilters.categories.forEach((cat) => params.append("categories", cat));
    }

    // Precios
    if (newFilters.price_min !== undefined)
      params.set("price_min", String(newFilters.price_min));
    if (newFilters.price_max !== undefined)
      params.set("price_max", String(newFilters.price_max));

    // Orden y Paginación
    if (newFilters.sort) params.set("sort", newFilters.sort);

    // IMPORTANTE: Si cambiamos filtros, volvemos a página 1. Si solo cambiamos página, usamos la nueva.
    params.set("page", String(newFilters.page || 1));

    if (newFilters.search) params.set("search", newFilters.search);

    setSearchParams(params);
    // Scroll arriba suave
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFilterApply = (appliedFilters: FilterState) => {
    // Al aplicar filtros desde el sidebar, reseteamos a página 1
    updateUrl({ ...appliedFilters, page: 1 });
  };

  const handlePageChange = (newPage: number) => {
    updateUrl({ ...filters, page: newPage });
  };

  const handleSortChange = (keys: any) => {
    const selectedSort = Array.from(keys)[0] as string;

    // Al cambiar orden, volvemos a página 1
    updateUrl({ ...filters, sort: selectedSort, page: 1 });
  };

  return (
    <main className="flex-grow container mx-auto px-4 py-8 bg-gray-50 dark:bg-black transition-colors min-h-screen">
      {/* Cabecera */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Catálogo de Productos
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Explora nuestras categorías y ofertas
          </p>
        </div>

        {/* Buscador central/derecha */}
        <div className="w-full md:w-96">
          <Input
            isClearable
            classNames={{
              inputWrapper:
                "bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800",
            }}
            placeholder="Buscar productos..."
            radius="lg"
            startContent={<FiSearch className="text-gray-400" />}
            value={searchTerm}
            variant="bordered"
            onValueChange={setSearchTerm}
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Barra Lateral de Filtros (Árbol de Categorías) */}
        <aside className="w-full lg:w-72 flex-shrink-0">
          <ProductFilters
            currentFilters={filters}
            onApply={handleFilterApply}
          />
        </aside>

        {/* Contenido Principal */}
        <div className="flex-grow">
          {/* Barra de Control (Resultados y Ordenar) */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 bg-white dark:bg-neutral-900 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-neutral-800">
            <span className="text-gray-500 text-sm font-medium">
              {isLoading ? (
                "Buscando productos..."
              ) : (
                <>
                  Mostrando <strong>{products.length}</strong> de{" "}
                  <strong>{pagination?.totalItems || 0}</strong> resultados
                </>
              )}
            </span>

            <div className="w-full sm:w-auto">
              <Select
                aria-label="Ordenar por"
                className="w-full sm:w-52"
                placeholder="Selecciona orden"
                selectedKeys={filters.sort ? [filters.sort] : ["featured"]}
                size="sm"
                variant="faded"
                onSelectionChange={handleSortChange}
              >
                <SelectItem key="featured">Destacados</SelectItem>
                <SelectItem key="price_asc">Precio: Bajo a Alto</SelectItem>
                <SelectItem key="price_desc">Precio: Alto a Bajo</SelectItem>
                <SelectItem key="newest">Más recientes</SelectItem>
              </Select>
            </div>
          </div>

          {/* Lista de Productos */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32">
              <Spinner color="primary" size="lg" />
              <p className="text-gray-400 mt-4 text-sm animate-pulse">
                Cargando catálogo...
              </p>
            </div>
          ) : products.length > 0 ? (
            <>
              {/* Aquí renderizas tus productos */}
              <div
                className={`transition-opacity duration-300 ${isFetching ? "opacity-50" : "opacity-100"}`}
              >
                {/* Asegúrate de que ProductList acepte el prop 'products' */}
                <ProductList isLoading={isLoading} products={products} />
              </div>

              {/* Paginación */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex justify-center mt-12 mb-8">
                  <Pagination
                    isCompact
                    showControls
                    classNames={{
                      cursor: "bg-primary text-white font-bold",
                    }}
                    color="primary"
                    page={pagination.currentPage}
                    total={pagination.totalPages}
                    variant="flat"
                    onChange={handlePageChange}
                  />
                </div>
              )}
            </>
          ) : (
            // Estado Vacío
            <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-neutral-900 rounded-2xl border border-dashed border-gray-300 dark:border-neutral-700">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
                No se encontraron productos
              </h3>
              <p className="text-gray-500 mt-2 text-center max-w-md">
                Intenta ajustar los filtros de precio o selecciona otra
                categoría.
              </p>
              <button
                className="mt-6 text-primary hover:underline font-medium"
                onClick={() =>
                  updateUrl({ categories: [], page: 1, sort: "featured" })
                }
              >
                Limpiar todos los filtros
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};
