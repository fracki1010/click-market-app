import type { IProduct } from "../types/Product";

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import {
  useSearchParams,
  useLocation,
  useNavigate,
  useNavigationType,
} from "react-router";
import { useSelector } from "react-redux";
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
import { useStorefrontSettings } from "../../Settings/hooks/useStorefrontSettings";
import {
  expandBlockedCategoryIds,
  filterVisibleCategories,
  isProductVisible,
  sanitizeSelectedCategories,
} from "../utils/categoryVisibility";
import { smartSearchProducts } from "../utils/smartProductSearch";
import { RootState } from "../../../store/store";

const ITEMS_PER_PAGE = 12;
const MAIN_FILTER_BEST_SELLERS = "best_sellers";

const toSingleCategory = (
  categories: string[] = [],
  blockedCategoryNames: string[] = [],
) =>
  sanitizeSelectedCategories(
    categories.length ? [categories[0]] : [],
    blockedCategoryNames,
  );

const normalizeCategoryName = (name: string) => name.trim().toLowerCase();

const filterProductsBySelectedCategories = (
  products: IProduct[],
  selectedCategories: string[],
  blockedCategoryIds: string[] = [],
) => {
  const visibleProducts = products.filter((product) =>
    isProductVisible(product, blockedCategoryIds),
  );

  if (!selectedCategories.length) return visibleProducts;

  const selectedNormalized = selectedCategories.map(normalizeCategoryName);

  return visibleProducts.filter((product) =>
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
  blockedCategoryIds,
  onPageChange,
  restoreProductId,
  onRestoreComplete,
}: any) => {
  const hasSearch = Boolean(filters.search?.trim());
  const { data: response, isLoading, isFetching } = useProducts(filters, {
    enabled: !hasSearch,
  });
  const { data: smartResponse, isLoading: isSmartLoading } = useProducts(
    {
      ...filters,
      search: undefined,
      page: 1,
      limit: 4000,
    },
    { enabled: hasSearch },
  );

  const products = hasSearch ? smartResponse?.data || [] : response?.data || [];
  const searchedProducts = hasSearch
    ? smartSearchProducts(products, filters.search || "")
    : products;
  const filteredProducts = filterProductsBySelectedCategories(
    searchedProducts,
    filters.categories || [],
    blockedCategoryIds,
  );

  const localPagination = {
    currentPage: Math.min(
      Math.max(1, Number(filters.page) || 1),
      Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)),
    ),
    totalPages: Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)),
  };
  const pagination = hasSearch ? localPagination : response?.pagination;

  const paginatedProducts = hasSearch
    ? filteredProducts.slice(
        (localPagination.currentPage - 1) * ITEMS_PER_PAGE,
        localPagination.currentPage * ITEMS_PER_PAGE,
      )
    : filteredProducts;

  return (
    <>
      <div
        className={`transition-opacity duration-300 ${(!hasSearch && isFetching) ? "opacity-50" : "opacity-100"}`}
      >
        <ProductList
          isLoading={hasSearch ? isSmartLoading : isLoading}
          products={paginatedProducts}
          restoreProductId={restoreProductId}
          onRestoreComplete={onRestoreComplete}
        />
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
const MobileProducts = ({
  filters,
  blockedCategoryIds,
  restoreProductId,
  onRestoreComplete,
}: any) => {
  const hasSearch = Boolean(filters.search?.trim());
  const { data: smartResponse, isLoading: isSmartLoading } = useProducts(
    {
      ...filters,
      search: undefined,
      page: 1,
      limit: 4000,
    },
    { enabled: hasSearch },
  );
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteProducts(filters, { enabled: !hasSearch });
  const observer = useRef<IntersectionObserver | null>(null);

  const lastElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (hasSearch) return;
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      });

      if (node) observer.current.observe(node);
    },
    [hasSearch, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage],
  );

  const allProducts = hasSearch
    ? smartSearchProducts(smartResponse?.data || [], filters.search || "")
    : data?.pages.flatMap((page) => page.data) || [];

  const visibleProducts = allProducts.filter((product) =>
    isProductVisible(product, blockedCategoryIds),
  );
  const filteredProducts = filterProductsBySelectedCategories(
    visibleProducts,
    filters.categories || [],
    blockedCategoryIds,
  );

  useEffect(() => {
    if (hasSearch) return;
    if (!restoreProductId) return;
    const found = filteredProducts.some(
      (product) => product.id === restoreProductId,
    );

    if (found) return;
    if (!hasNextPage || isFetchingNextPage) return;

    fetchNextPage();
  }, [
    restoreProductId,
    filteredProducts,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    hasSearch,
  ]);

  useEffect(() => {
    if (!restoreProductId) return;
    const found = filteredProducts.some(
      (product) => product.id === restoreProductId,
    );

    if (found || hasSearch || !hasNextPage) onRestoreComplete?.();
  }, [
    restoreProductId,
    filteredProducts,
    hasNextPage,
    onRestoreComplete,
    hasSearch,
  ]);

  if (hasSearch ? isSmartLoading : isLoading) {
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
      <ProductList
        isLoading={false}
        products={filteredProducts}
        restoreProductId={restoreProductId}
        onRestoreComplete={onRestoreComplete}
      />

      {/* Sentinel para el scroll infinito */}
      <div
        ref={lastElementRef}
        className="h-20 flex items-center justify-center"
      >
        {!hasSearch && isFetchingNextPage && <Spinner color="primary" size="md" />}
        {(hasSearch || !hasNextPage) && filteredProducts.length > 0 && (
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
  const location = useLocation();
  const navigate = useNavigate();
  const navigationType = useNavigationType();
  const productsStartRef = useRef<HTMLDivElement | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [restoreProductId, setRestoreProductId] = useState<string | null>(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { data: categories = [] } = useCategories();
  const { data: storefrontSettings } = useStorefrontSettings();
  const localBlockedCategoryIds = useSelector(
    (state: RootState) => state.settings.blockedCategoryIds || [],
  );
  const rawBlockedCategoryIds = storefrontSettings?.blockedCategoryIds?.length
    ? storefrontSettings.blockedCategoryIds
    : localBlockedCategoryIds;
  const blockedCategoryIds = useMemo(
    () => expandBlockedCategoryIds(categories, rawBlockedCategoryIds),
    [categories, rawBlockedCategoryIds],
  );
  const blockedCategoryNames = useMemo(
    () =>
      categories
        .filter((category) => blockedCategoryIds.includes(category.id))
        .map((category) => category.name),
    [categories, blockedCategoryIds],
  );
  const visibleCategories = useMemo(
    () => filterVisibleCategories(categories, blockedCategoryIds),
    [categories, blockedCategoryIds],
  );

  // Detección de mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const [filters, setFilters] = useState<FilterState>({
    categories: toSingleCategory(
      searchParams.getAll("categories"),
      blockedCategoryNames,
    ),
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

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      categories: toSingleCategory(
        searchParams.getAll("categories"),
        blockedCategoryNames,
      ),
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
  }, [searchParams, blockedCategoryNames]);

  const submitSearch = useCallback(
    (nextSearch: string) => {
      if (nextSearch === filters.search) return;
      updateUrl({ ...filters, search: nextSearch, page: 1 });
    },
    [filters],
  );

  useEffect(() => {
    const shouldFocusSearch = Boolean((location.state as any)?.focusSearch);

    if (!shouldFocusSearch) return;

    const timeoutId = window.setTimeout(() => {
      const input = document.getElementById(
        "products-search-input",
      ) as HTMLInputElement | null;

      if (input) {
        input.focus();
        input.select();
      }
    }, 80);

    navigate(`${location.pathname}${location.search}`, {
      replace: true,
      state: null,
    });

    return () => window.clearTimeout(timeoutId);
  }, [location, navigate]);

  useEffect(() => {
    if (location.pathname !== "/products" || navigationType !== "POP") return;

    const savedReturnTo = sessionStorage.getItem("products:returnTo");
    const currentPath = `${location.pathname}${location.search}`;
    const savedProductId = sessionStorage.getItem("products:returnProductId");

    if (!savedProductId) return;
    if (savedReturnTo && savedReturnTo !== currentPath) return;

    setRestoreProductId(savedProductId);
  }, [location.pathname, location.search, navigationType]);

  const handleRestoreComplete = useCallback(() => {
    setRestoreProductId(null);
    sessionStorage.removeItem("products:returnProductId");
    sessionStorage.removeItem("products:returnTo");
  }, []);

  const scrollToProductsStart = () => {
    productsStartRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const updateUrl = (
    newFilters: FilterState,
    options?: { scrollToProducts?: boolean },
  ) => {
    const params = new URLSearchParams();

    toSingleCategory(newFilters.categories, blockedCategoryNames).forEach(
      (cat) => params.append("categories", cat),
    );
    if (newFilters.price_min !== undefined)
      params.set("price_min", String(newFilters.price_min));
    if (newFilters.price_max !== undefined)
      params.set("price_max", String(newFilters.price_max));
    if (newFilters.sort) params.set("sort", newFilters.sort);
    params.set("page", String(newFilters.page || 1));
    if (newFilters.search) params.set("search", newFilters.search);
    setSearchParams(params);

    if (options?.scrollToProducts) {
      window.requestAnimationFrame(scrollToProductsStart);

      return;
    }

    if (!isMobile) window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleCategory = (catName: string) => {
    const isSelected = filters.categories.includes(catName);
    const newCats = isSelected ? [] : [catName];

    updateUrl(
      { ...filters, categories: newCats, page: 1 },
      { scrollToProducts: true },
    );
  };

  const isBestSellersMainFilterActive =
    filters.sort === MAIN_FILTER_BEST_SELLERS &&
    filters.categories.length === 0;
  const isAllMainFilterActive =
    filters.categories.length === 0 && !isBestSellersMainFilterActive;

  const hasSearch = Boolean(filters.search?.trim());
  const { data: response, isLoading } = useProducts(filters, {
    enabled: !hasSearch,
  });
  const { data: smartResponse, isLoading: isSmartLoading } = useProducts(
    {
      ...filters,
      search: undefined,
      page: 1,
      limit: 4000,
    },
    { enabled: hasSearch },
  );
  const totalItems = useMemo(() => {
    if (!hasSearch) return response?.pagination?.totalItems || 0;

    const baseProducts = smartResponse?.data || [];
    const searchedProducts = smartSearchProducts(baseProducts, filters.search || "");

    return filterProductsBySelectedCategories(
      searchedProducts,
      filters.categories || [],
      blockedCategoryIds,
    ).length;
  }, [
    hasSearch,
    response?.pagination?.totalItems,
    smartResponse?.data,
    filters.search,
    filters.categories,
    blockedCategoryIds,
  ]);

  // Solo mostrar categorías raíz en la barra superior para mayor limpieza
  const rootCategories = visibleCategories.filter((c) => !c.parent);

  return (
    <main className="min-h-screen-safe flex-grow bg-background transition-colors duration-500">
      {/* 1. Header de sección Moderno */}
      <div className="border-b border-divider bg-default-50/50 px-2 pb-3 pt-4 sm:px-4 md:pb-8 md:pt-10">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-end md:gap-6">
            <div className="flex flex-col items-start space-y-1 text-left md:space-y-2">
              <div className="md:inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/10 text-primary font-black text-[10px] uppercase tracking-[0.28em] shadow-sm shadow-primary/10">
                <span className="w-7 h-[2px] bg-gradient-to-r from-primary to-secondary" />
                Explora
              </div>
              <h1 className="text-2xl font-black leading-[0.95] tracking-[-0.04em] text-default-900 sm:text-4xl md:text-5xl">
                <span className="block text-3xl sm:text-5xl">Click</span>
                <span className="block bg-gradient-to-r from-primary via-sky-500 to-secondary bg-clip-text pb-1 text-4xl text-transparent drop-shadow-[0_8px_24px_rgba(59,130,246,0.18)] sm:text-6xl">
                  Catálogo
                </span>
              </h1>
            </div>

            <div className="flex w-full items-center gap-2 md:w-auto md:gap-3">
              <div className="grow md:w-80">
                <Input
                  key={`products-search-${filters.search || "empty"}`}
                  isClearable
                  classNames={{
                    inputWrapper:
                      "h-10 md:h-12 bg-content1 border-divider shadow-xl shadow-primary/5 rounded-2xl",
                    input: "text-sm font-medium",
                  }}
                  id="products-search-input"
                  placeholder="Busca por nombre o marca..."
                  radius="none"
                  startContent={<FiSearch className="text-primary" size={18} />}
                  defaultValue={filters.search || ""}
                  onClear={() => {
                    submitSearch("");
                  }}
                  onKeyDown={(event) => {
                    if (event.key !== "Enter") return;
                    const input = event.currentTarget as HTMLInputElement;

                    submitSearch(input.value.trim());
                  }}
                />
              </div>
              <Button
                isIconOnly
                className="h-10 w-10 rounded-xl border-none bg-content1 shadow-xl shadow-primary/5 md:h-12 md:w-12 md:rounded-2xl"
                onClick={onOpen}
              >
                <FiFilter className="text-default-900" size={20} />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Barra de Filtros Horizontales (Modern Pills) */}
      <div className="sticky top-[var(--app-header-height)] z-30 mb-6 border-b border-divider bg-background/80 py-3 backdrop-blur-xl md:mb-8 md:py-4">
        <div className="container mx-auto flex max-w-7xl items-center gap-3 px-0 sm:px-4 md:gap-4">
          <div className="flex-grow overflow-x-auto no-scrollbar flex items-center gap-2 pr-10">
            <Button
              className="ml-2 min-w-fit px-4 text-[10px] font-black uppercase tracking-wider"
              color={isAllMainFilterActive ? "primary" : "default"}
              radius="full"
              size="sm"
              variant={isAllMainFilterActive ? "solid" : "flat"}
              onClick={() =>
                updateUrl(
                  {
                    ...filters,
                    categories: [],
                    sort: isBestSellersMainFilterActive
                      ? "featured"
                      : filters.sort,
                    page: 1,
                  },
                  { scrollToProducts: true },
                )
              }
            >
              Todo
            </Button>
            <Button
              className="min-w-fit px-4 text-[10px] font-black uppercase tracking-wider"
              color={isBestSellersMainFilterActive ? "primary" : "default"}
              radius="full"
              size="sm"
              variant={isBestSellersMainFilterActive ? "solid" : "flat"}
              onClick={() =>
                updateUrl(
                  {
                    ...filters,
                    categories: [],
                    sort: isBestSellersMainFilterActive
                      ? "featured"
                      : MAIN_FILTER_BEST_SELLERS,
                    page: 1,
                  },
                  { scrollToProducts: true },
                )
              }
            >
              Más vendidos
            </Button>
            {rootCategories.map((cat) => (
              <Button
                key={cat.id}
                className="min-w-fit px-4 text-[10px] font-bold uppercase tracking-wider"
                color={
                  filters.categories.includes(cat.name) ? "primary" : "default"
                }
                radius="full"
                size="sm"
                variant={
                  filters.categories.includes(cat.name) ? "solid" : "flat"
                }
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
              classNames={{
                trigger: "bg-transparent h-8 hover:bg-default-100",
                value: "text-[10px] font-black uppercase tracking-widest",
              }}
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
              <SelectItem key="featured">Relevancia</SelectItem>
              <SelectItem key="best_sellers">Más vendidos</SelectItem>
              <SelectItem key="price_asc">Menor $</SelectItem>
              <SelectItem key="price_desc">Mayor $</SelectItem>
              <SelectItem key="newest">Nuevos</SelectItem>
            </Select>
          </div>
        </div>
      </div>

      <div
        ref={productsStartRef}
        className="container mx-auto max-w-7xl px-0 pb-[calc(var(--app-bottom-nav-height)+env(safe-area-inset-bottom,0px)+var(--app-bottom-nav-buffer))] sm:px-4 md:pb-20"
      >
        {/* 3. Rejilla de Productos Principal */}
        <div className="relative">
          {isMobile ? (
            <MobileProducts
              blockedCategoryIds={blockedCategoryIds}
              filters={filters}
              restoreProductId={restoreProductId}
              onRestoreComplete={handleRestoreComplete}
            />
          ) : (
            <DesktopProducts
              blockedCategoryIds={blockedCategoryIds}
              filters={filters}
              restoreProductId={restoreProductId}
              onPageChange={(p: number) => updateUrl({ ...filters, page: p })}
              onRestoreComplete={handleRestoreComplete}
            />
          )}

          {!(hasSearch ? isSmartLoading : isLoading) &&
            totalItems === 0 && (
            <div className="flex flex-col items-center justify-center py-32">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-full" />
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
        placement="right"
        size="sm"
        onOpenChange={onOpenChange}
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
