import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams } from "react-router";
import {
  Select,
  SelectItem,
  Spinner,
  Pagination,
  Input,
  Button,
} from "@heroui/react";
import { FiSearch } from "react-icons/fi";

import { ProductFilters, type FilterState } from "../components/ProductFilter";
import { ProductList } from "../components/ProductList";
import { useProducts } from "../hooks/useProducts";
import { useInfiniteProducts } from "../hooks/useInfiniteProducts";

const ITEMS_PER_PAGE = 12;

// --- Versión Desktop con Paginación ---
const DesktopProducts = ({
  filters,
  onPageChange,
  isLoading,
  isFetching,
}: any) => {
  const { data: response } = useProducts(filters);
  const products = response?.data || [];
  const pagination = response?.pagination;

  return (
    <>
      <div
        className={`transition-opacity duration-300 ${isFetching ? "opacity-50" : "opacity-100"}`}
      >
        <ProductList isLoading={isLoading} products={products} />
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center mt-12 mb-8">
          <Pagination
            isCompact
            showControls
            classNames={{ cursor: "bg-primary text-white font-bold" }}
            color="primary"
            page={pagination.currentPage}
            total={pagination.totalPages}
            variant="flat"
            onChange={onPageChange}
          />
        </div>
      )}
    </>
  );
};

// --- Versión Mobile con Infinite Scroll ---
const MobileProducts = ({ filters }: any) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteProducts(filters);
  const observer = useRef<IntersectionObserver | null>(null);

  const lastElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      });

      if (node) observer.current.observe(node);
    },
    [isLoading, hasNextPage, fetchNextPage, isFetchingNextPage],
  );

  const allProducts = data?.pages.flatMap((page) => page.data) || [];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <Spinner color="primary" size="lg" />
        <p className="text-gray-400 mt-4 text-sm">Cargando catálogo...</p>
      </div>
    );
  }

  return (
    <>
      <ProductList isLoading={false} products={allProducts} />

      {/* Sentinel para el scroll infinito */}
      <div
        ref={lastElementRef}
        className="h-20 flex items-center justify-center"
      >
        {isFetchingNextPage && <Spinner color="primary" size="md" />}
        {!hasNextPage && allProducts.length > 0 && (
          <p className="text-gray-400 text-xs font-medium uppercase tracking-widest">
            Has llegado al final
          </p>
        )}
      </div>
    </>
  );
};

export const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isMobile, setIsMobile] = useState(false);

  // Detección de mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024); // lg breakpoint
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const [filters, setFilters] = useState<FilterState>({
    categories: searchParams.getAll("categories"),
    price_min: searchParams.get("price_min")
      ? Number(searchParams.get("price_min"))
      : undefined,
    price_max: searchParams.get("price_max")
      ? Number(searchParams.get("price_max"))
      : undefined,
    sort: searchParams.get("sort") || "featured",
    page: Number(searchParams.get("page")) || 1,
    limit: ITEMS_PER_PAGE,
    search: searchParams.get("search") || "",
  });

  const [searchTerm, setSearchTerm] = useState(filters.search || "");

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      categories: searchParams.getAll("categories"),
      price_min: searchParams.get("price_min")
        ? Number(searchParams.get("price_min"))
        : undefined,
      price_max: searchParams.get("price_max")
        ? Number(searchParams.get("price_max"))
        : undefined,
      sort: searchParams.get("sort") || "featured",
      page: Number(searchParams.get("page")) || 1,
      search: searchParams.get("search") || "",
    }));
    setSearchTerm(searchParams.get("search") || "");
  }, [searchParams]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchTerm !== filters.search) {
        updateUrl({ ...filters, search: searchTerm, page: 1 });
      }
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const updateUrl = (newFilters: FilterState) => {
    const params = new URLSearchParams();
    newFilters.categories?.forEach((cat) => params.append("categories", cat));
    if (newFilters.price_min !== undefined)
      params.set("price_min", String(newFilters.price_min));
    if (newFilters.price_max !== undefined)
      params.set("price_max", String(newFilters.price_max));
    if (newFilters.sort) params.set("sort", newFilters.sort);
    params.set("page", String(newFilters.page || 1));
    if (newFilters.search) params.set("search", newFilters.search);
    setSearchParams(params);
    if (!isMobile) window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Solo para desktop se usa useProducts para el conteo de resultados
  const { data: response, isLoading, isFetching } = useProducts(filters);
  const totalItems = response?.pagination?.totalItems || 0;

  return (
    <main className="flex-grow container mx-auto px-4 py-8 bg-gray-50 dark:bg-black transition-colors min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-800 dark:text-white tracking-tight">
            Catalogo
          </h1>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mt-1">
            Explora nuestras ofertas
          </p>
        </div>
        <div className="hidden md:block w-full md:w-96">
          <Input
            isClearable
            classNames={{
              inputWrapper:
                "bg-white dark:bg-neutral-900 border-gray-100 dark:border-neutral-800 shadow-sm",
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
        <aside className="w-full lg:w-64 shrink-0">
          <ProductFilters
            currentFilters={filters}
            onApply={(f) => updateUrl({ ...f, page: 1 })}
          />
        </aside>

        <div className="grow">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 bg-white dark:bg-neutral-900 p-4 rounded-2xl shadow-sm border border-gray-50 dark:border-neutral-800">
            <span className="text-gray-500 text-xs font-bold uppercase tracking-widest">
              {isLoading ? "Buscando..." : `${totalItems} Resultados`}
            </span>
            <div className="w-full sm:w-auto">
              <Select
                aria-label="Ordenar"
                className="w-full sm:w-48"
                selectedKeys={[filters.sort || "featured"]}
                size="sm"
                variant="flat"
                onSelectionChange={(k) =>
                  updateUrl({
                    ...filters,
                    sort: Array.from(k)[0] as string,
                    page: 1,
                  })
                }
              >
                <SelectItem key="featured">Destacados</SelectItem>
                <SelectItem key="price_asc">Menor Precio</SelectItem>
                <SelectItem key="price_desc">Mayor Precio</SelectItem>
                <SelectItem key="newest">Novedades</SelectItem>
              </Select>
            </div>
          </div>

          {isMobile ? (
            <MobileProducts filters={filters} />
          ) : (
            <DesktopProducts
              filters={filters}
              isFetching={isFetching}
              isLoading={isLoading}
              onPageChange={(p: number) => updateUrl({ ...filters, page: p })}
            />
          )}

          {!isLoading && totalItems === 0 && (
            <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-neutral-900 rounded-3xl border-2 border-dashed border-gray-100 dark:border-neutral-800">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-lg font-black text-gray-800 dark:text-gray-200">
                No hay productos
              </h3>
              <p className="text-gray-400 text-sm mt-2 text-center max-w-xs">
                Intenta ajustar los filtros de búsqueda.
              </p>
              <Button
                className="mt-6 font-bold"
                color="primary"
                variant="flat"
                onPress={() =>
                  updateUrl({ categories: [], page: 1, sort: "featured" })
                }
              >
                Limpiar filtros
              </Button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};
