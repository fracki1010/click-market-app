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
} from "@heroui/react";
import { FiSearch, FiFilter } from "react-icons/fi";

import { ProductFilters, type FilterState } from "../components/ProductFilter";
import { ProductList } from "../components/ProductList";
import { useProducts } from "../hooks/useProducts";
import { useInfiniteProducts } from "../hooks/useInfiniteProducts";
import { useCategories } from "../hooks/useCategory";
import type { IProduct } from "../types/Product";

const ITEMS_PER_PAGE = 12;
const toSingleCategory = (categories: string[] = []) =>
  categories.length ? [categories[0]] : [];

const normalizeCategoryName = (name: string) => name.trim().toLowerCase();

const filterProductsBySelectedCategories = (
  products: IProduct[],
  selectedCategories: string[],
) => {
  if (!selectedCategories.length) return products;

  const selectedNormalized = selectedCategories.map(normalizeCategoryName);

  return products.filter((product) =>
    selectedNormalized.every((selected) =>
      product.categories.some(
        (category) => normalizeCategoryName(category.name) === selected,
      ),
    ),
  );
};

// --- Versión Desktop con Paginación ---
const DesktopProducts = ({
  filters,
  onPageChange,
  isLoading,
  isFetching,
}: any) => {
  const { data: response } = useProducts(filters);
  const products = response?.data || [];
  const filteredProducts = filterProductsBySelectedCategories(
    products,
    filters.categories || [],
  );
  const pagination = response?.pagination;

  return (
    <>
      <div
        className={`transition-opacity duration-300 ${isFetching ? "opacity-50" : "opacity-100"}`}
      >
        <ProductList isLoading={isLoading} products={filteredProducts} />
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
  const filteredProducts = filterProductsBySelectedCategories(
    allProducts,
    filters.categories || [],
  );

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <Spinner color="primary" size="lg" />
        <p className="text-default-400 mt-4 text-sm animate-pulse">
          Cargando catálogo...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ProductList isLoading={false} products={filteredProducts} />

      {/* Sentinel para el scroll infinito */}
      <div
        ref={lastElementRef}
        className="h-20 flex items-center justify-center"
      >
        {isFetchingNextPage && <Spinner color="primary" size="md" />}
        {!hasNextPage && filteredProducts.length > 0 && (
          <p className="text-default-400 text-[10px] font-black uppercase tracking-[0.2em] opacity-40">
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
    categories: toSingleCategory(searchParams.getAll("categories")),
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
      categories: toSingleCategory(searchParams.getAll("categories")),
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
    toSingleCategory(newFilters.categories).forEach((cat) =>
      params.append("categories", cat),
    );
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

  const toggleCategory = (catName: string) => {
    const isSelected = filters.categories.includes(catName);
    const newCats = isSelected ? [] : [catName];
    updateUrl({ ...filters, categories: newCats, page: 1 });
  };

  const { data: response, isLoading, isFetching } = useProducts(filters);
  const totalItems = response?.pagination?.totalItems || 0;

  // Solo mostrar categorías raíz en la barra superior para mayor limpieza
  const rootCategories = categories.filter((c) => !c.parent);

  return (
    <main className="flex-grow bg-background transition-colors duration-500 min-h-screen">
      {/* 1. Header de sección Moderno */}
      <div className="bg-default-50/50 border-b border-divider pb-3 pt-4 md:pb-8 md:pt-10 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-3 md:gap-6">
            <div className="flex flex-col items-start text-left space-y-1 md:space-y-2">
              <div className="md:inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/10 text-primary font-black text-[10px] uppercase tracking-[0.28em] shadow-sm shadow-primary/10">
                <span className="w-7 h-[2px] bg-gradient-to-r from-primary to-secondary"></span>
                Explora
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-default-900 tracking-[-0.04em] leading-[0.95]">
                <span className="block text-5xl">Click</span>
                <span className="block text-transparent text-6xl pb-1 bg-clip-text bg-gradient-to-r from-primary via-sky-500 to-secondary drop-shadow-[0_8px_24px_rgba(59,130,246,0.18)]">
                  Catálogo
                </span>
              </h1>
            
            </div>

            <div className="flex items-center gap-2 md:gap-3 w-full md:w-auto">
              <div className="grow md:w-80">
                <Input
                  isClearable
                  classNames={{
                    inputWrapper:
                      "h-10 md:h-12 bg-content1 border-divider shadow-xl shadow-primary/5 rounded-2xl",
                    input: "text-sm font-medium",
                  }}
                  placeholder="Busca por nombre o marca..."
                  radius="none"
                  startContent={<FiSearch className="text-primary" size={18} />}
                  value={searchTerm}
                  onValueChange={setSearchTerm}
                />
              </div>
              <Button
                isIconOnly
                className="h-12 w-12 bg-content1 shadow-xl shadow-primary/5 rounded-2xl border-none"
                onClick={onOpen}
              >
                <FiFilter className="text-default-900" size={20} />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Barra de Filtros Horizontales (Modern Pills) */}
      <div className="sticky top-[56px] lg:top-[115px] z-30 bg-background/80 backdrop-blur-xl border-b border-divider py-5 md:py-4 mb-6 md:mb-8">
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

          <div className="hidden lg:flex shrink-0 border-l border-divider pl-4 items-center gap-3">
            <Select
              aria-label="Ordenar"
              className="w-36"
              selectedKeys={[filters.sort || "featured"]}
              size="sm"
              variant="flat"
              classNames={{
                trigger: "bg-transparent h-8 hover:bg-default-100",
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
                <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-full"></div>
                <div className="relative text-6xl">✨</div>
              </div>
              <h3 className="text-xl font-black text-default-900 tracking-tight">
                Vaya, no hay nada aquí
              </h3>
              <p className="text-default-400 text-sm mt-3 text-center max-w-xs leading-relaxed">
                Parece que esos filtros son muy específicos. ¡Prueba quitando
                algunos!
              </p>
              <Button
                className="mt-8 bg-primary text-primary-foreground font-black px-8 h-12 rounded-2xl shadow-xl shadow-primary/20"
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
        <DrawerContent className="bg-background">
          {(onClose) => (
            <>
              <DrawerHeader className="flex flex-col gap-1 border-b border-divider px-6 py-6">
                <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-widest">
                  <FiFilter /> Configuración Avanzada
                </div>
                <h2 className="text-2xl font-black tracking-tight text-default-900 leading-tight">
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
