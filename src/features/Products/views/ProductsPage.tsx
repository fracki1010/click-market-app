import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams } from "react-router";
import {
  Select,
  SelectItem,
  Spinner,
  Pagination,
  Input,
  Button,
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  useDisclosure,
  Chip,
} from "@heroui/react";
import { FiSearch, FiFilter } from "react-icons/fi";

import { ProductFilters, type FilterState } from "../components/ProductFilter";
import { ProductList } from "../components/ProductList";
import { useProducts } from "../hooks/useProducts";
import { useInfiniteProducts } from "../hooks/useInfiniteProducts";
import { useCategories } from "../hooks/useCategory";

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
        <p className="text-gray-400 mt-4 text-sm animate-pulse">
          Cargando catálogo...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ProductList isLoading={false} products={allProducts} />

      {/* Sentinel para el scroll infinito */}
      <div
        ref={lastElementRef}
        className="h-20 flex items-center justify-center"
      >
        {isFetchingNextPage && <Spinner color="primary" size="md" />}
        {!hasNextPage && allProducts.length > 0 && (
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] opacity-40">
            Fin del catálogo
          </p>
        )}
      </div>
    </div>
  );
};

export const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isMobile, setIsMobile] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { data: categories = [] } = useCategories();

  // Detección de mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
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

  const removeCategory = (catName: string) => {
    const newCats = filters.categories.filter((c) => c !== catName);
    updateUrl({ ...filters, categories: newCats, page: 1 });
  };

  const toggleCategory = (catName: string) => {
    const isSelected = filters.categories.includes(catName);
    const newCats = isSelected
      ? filters.categories.filter((c) => c !== catName)
      : [...filters.categories, catName];
    updateUrl({ ...filters, categories: newCats, page: 1 });
  };

  const { data: response, isLoading, isFetching } = useProducts(filters);
  const totalItems = response?.pagination?.totalItems || 0;

  // Solo mostrar categorías raíz en la barra superior para mayor limpieza
  const rootCategories = categories.filter((c) => !c.parent);

  return (
    <main className="flex-grow bg-white dark:bg-neutral-950 transition-colors duration-500 min-h-screen">
      {/* 1. Header de sección Moderno */}
      <div className="bg-gray-50/50 dark:bg-neutral-900/40 border-b border-gray-100 dark:border-neutral-900 pb-8 pt-10 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-black text-[10px] uppercase tracking-[0.3em]">
                <span className="w-8 h-[2px] bg-current opacity-30"></span>
                Explora
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tighter">
                Click{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">
                  Catálogo
                </span>
              </h1>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="grow md:w-80">
                <Input
                  isClearable
                  classNames={{
                    inputWrapper:
                      "h-12 bg-white dark:bg-neutral-900 border-none shadow-xl shadow-indigo-500/5 rounded-2xl",
                    input: "text-sm font-medium",
                  }}
                  placeholder="Busca por nombre o marca..."
                  radius="none"
                  startContent={
                    <FiSearch className="text-indigo-500" size={18} />
                  }
                  value={searchTerm}
                  onValueChange={setSearchTerm}
                />
              </div>
              <Button
                isIconOnly
                className="h-12 w-12 bg-white dark:bg-neutral-900 shadow-xl shadow-indigo-500/5 rounded-2xl border-none"
                onClick={onOpen}
              >
                <FiFilter className="text-gray-900 dark:text-white" size={20} />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Barra de Filtros Horizontales (Modern Pills) */}
      <div className="sticky top-[115px] z-30 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-xl border-b border-gray-100 dark:border-neutral-900 py-4 mb-8">
        <div className="container mx-auto max-w-7xl px-4 flex items-center gap-4">
          <div className="flex-grow overflow-x-auto no-scrollbar flex items-center gap-2 pr-10">
            <Button
              variant={filters.categories.length === 0 ? "solid" : "flat"}
              color={filters.categories.length === 0 ? "primary" : "default"}
              size="sm"
              radius="full"
              className="font-black text-[10px] uppercase tracking-wider px-5 min-w-fit"
              onClick={() => updateUrl({ ...filters, categories: [], page: 1 })}
            >
              Todo
            </Button>
            {rootCategories.map((cat) => (
              <Button
                key={cat.id}
                variant={
                  filters.categories.includes(cat.name) ? "solid" : "flat"
                }
                color={
                  filters.categories.includes(cat.name) ? "primary" : "default"
                }
                size="sm"
                radius="full"
                className="font-bold text-[10px] uppercase tracking-wider px-5 min-w-fit"
                onClick={() => toggleCategory(cat.name)}
              >
                {cat.name}
              </Button>
            ))}
          </div>

          <div className="hidden lg:flex shrink-0 border-l border-gray-100 dark:border-neutral-800 pl-4 items-center gap-3">
            <Select
              aria-label="Ordenar"
              className="w-36"
              selectedKeys={[filters.sort || "featured"]}
              size="sm"
              variant="flat"
              classNames={{
                trigger:
                  "bg-transparent h-8 hover:bg-gray-50 dark:hover:bg-neutral-900",
                value: "text-[10px] font-black uppercase tracking-widest",
              }}
              onSelectionChange={(k) =>
                updateUrl({
                  ...filters,
                  sort: Array.from(k)[0] as string,
                  page: 1,
                })
              }
            >
              <SelectItem key="featured">Relevancia</SelectItem>
              <SelectItem key="price_asc">Menor $</SelectItem>
              <SelectItem key="price_desc">Mayor $</SelectItem>
              <SelectItem key="newest">Nuevos</SelectItem>
            </Select>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 pb-20">
        {/* Chips de filtros activos */}
        <div className="flex flex-wrap gap-2 mb-8">
          {filters.categories.map((cat) => (
            <Chip
              key={cat}
              onClose={() => removeCategory(cat)}
              className="bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold text-[10px] uppercase border-none"
              variant="flat"
            >
              {cat}
            </Chip>
          ))}
          {(filters.price_min && filters.price_min > 0) ||
          (filters.price_max && filters.price_max < 100000) ? (
            <Chip
              className="bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-[10px] uppercase border-none"
              variant="flat"
              onClose={() =>
                updateUrl({ ...filters, price_min: 0, price_max: 100000 })
              }
            >
              Precio: ${filters.price_min || 0} - ${filters.price_max || 100000}
            </Chip>
          ) : null}
        </div>

        {/* 3. Rejilla de Productos Principal */}
        <div className="relative">
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
            <div className="flex flex-col items-center justify-center py-32">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-indigo-500/10 blur-3xl rounded-full"></div>
                <div className="relative text-6xl">✨</div>
              </div>
              <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">
                Vaya, no hay nada aquí
              </h3>
              <p className="text-gray-400 text-sm mt-3 text-center max-w-xs leading-relaxed">
                Parece que esos filtros son muy específicos. ¡Prueba quitando
                algunos!
              </p>
              <Button
                className="mt-8 bg-indigo-600 text-white font-black px-8 h-12 rounded-2xl shadow-xl shadow-indigo-600/20"
                onPress={() =>
                  updateUrl({
                    categories: [],
                    page: 1,
                    sort: "featured",
                    price_min: 0,
                    price_max: 100000,
                  })
                }
              >
                Resetear todo
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* 4. Drawer de Filtros Avanzados */}
      <Drawer
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="sm"
        placement="right"
      >
        <DrawerContent className="bg-white dark:bg-neutral-950">
          {(onClose) => (
            <>
              <DrawerHeader className="flex flex-col gap-1 border-b border-gray-100 dark:border-neutral-900 px-6 py-6">
                <div className="flex items-center gap-2 text-indigo-600 font-black text-[10px] uppercase tracking-widest">
                  <FiFilter /> Configuración Avanzada
                </div>
                <h2 className="text-2xl font-black tracking-tight dark:text-white leading-tight">
                  Ajusta tu búsqueda
                </h2>
              </DrawerHeader>
              <DrawerBody className="px-6 py-8 custom-scrollbar">
                <ProductFilters
                  currentFilters={filters}
                  onApply={(f) => {
                    updateUrl(f);
                    onClose();
                  }}
                />
              </DrawerBody>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </main>
  );
};
