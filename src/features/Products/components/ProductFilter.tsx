import React, { useState, useEffect, useMemo } from "react";
import { Checkbox, Slider, Button, Divider, Skeleton } from "@heroui/react";
import { FiFilter, FiX, FiChevronRight } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { formatPrice } from "@/utils/currencyFormat";

import { useCategories } from "../../Products/hooks/useCategory";
import { ICategory } from "../../Products/types/Product";

// --- Tipos ---
export interface FilterState {
  categories: string[];
  price_min?: number;
  price_max?: number;
  sort?: string;
  page?: number;
  limit?: number;
  search?: string;
}

interface ProductFiltersProps {
  currentFilters: FilterState;
  onApply: (filters: FilterState) => void;
}

// --- Helper Functions ---
function buildCategoryTree(categories: ICategory[]): ICategory[] {
  const map = new Map<string, ICategory>();
  const roots: ICategory[] = [];

  categories.forEach((cat) => {
    map.set(cat.id, { ...cat, children: [] });
  });

  categories.forEach((cat) => {
    const node = map.get(cat.id);
    if (node) {
      if (cat.parent && map.has(cat.parent)) {
        map.get(cat.parent)!.children!.push(node);
      } else {
        roots.push(node);
      }
    }
  });

  const sortNodes = (nodes: ICategory[]) => {
    nodes.sort((a, b) => a.name.localeCompare(b.name));
    nodes.forEach((node) => {
      if (node.children && node.children.length > 0) {
        sortNodes(node.children);
      }
    });
  };

  sortNodes(roots);
  return roots;
}

// --- Componente de Ítem de Categoría Refinado ---
const CategoryItem = ({
  category,
  selectedValues,
  onChange,
  level = 0,
}: {
  category: ICategory;
  selectedValues: string[];
  onChange: (name: string, checked: boolean) => void;
  level?: number;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = category.children && category.children.length > 0;
  const isSelected = selectedValues.includes(category.name);

  useEffect(() => {
    if (hasChildren && !isOpen) {
      const childSelected = category.children!.some((c) =>
        selectedValues.includes(c.name),
      );
      if (childSelected) setIsOpen(true);
    }
  }, [selectedValues]);

  return (
    <div className="flex flex-col">
      <div
        className={`group flex items-center gap-2 py-1.5 rounded-xl px-2 transition-all duration-200 ${
          isSelected
            ? "bg-primary-50 dark:bg-primary-500/10"
            : "hover:bg-default-100"
        }`}
        style={{ marginLeft: `${level * 8}px` }}
      >
        {hasChildren ? (
          <button
            className={`p-1 rounded-md transition-colors ${
              isOpen
                ? "text-primary bg-primary-50 dark:bg-primary-500/20"
                : "text-default-400 group-hover:text-default-600"
            }`}
            onClick={(e) => {
              e.preventDefault();
              setIsOpen(!isOpen);
            }}
          >
            <FiChevronRight
              className={`w-3.5 h-3.5 transition-transform duration-300 ${isOpen ? "rotate-90 text-primary" : ""}`}
            />
          </button>
        ) : (
          <div className="w-5.5 h-4" />
        )}

        <Checkbox
          classNames={{
            label: `text-sm font-medium transition-colors ${isSelected ? "text-primary" : "text-default-600"}`,
            wrapper: "after:bg-primary before:border-primary",
          }}
          isSelected={isSelected}
          size="sm"
          onValueChange={(checked) => onChange(category.name, checked)}
        >
          {category.name}
        </Checkbox>
      </div>

      <AnimatePresence>
        {hasChildren && isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-l-2 border-divider ml-4.5 mt-1 pb-1"
          >
            {category.children!.map((child) => (
              <CategoryItem
                key={child.id}
                category={child}
                level={level}
                selectedValues={selectedValues}
                onChange={onChange}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  currentFilters,
  onApply,
}) => {
  const { data: categories = [], isLoading } = useCategories();
  const [localFilters, setLocalFilters] = useState<FilterState>(currentFilters);

  useEffect(() => {
    setLocalFilters(currentFilters);
  }, [currentFilters]);

  const categoryTree = useMemo(
    () => buildCategoryTree(categories),
    [categories],
  );

  const handleCategoryToggle = (name: string, checked: boolean) => {
    setLocalFilters((prev) => {
      const newCats = checked ? [name] : [];
      return { ...prev, categories: newCats };
    });
  };

  const handleClear = () => {
    const cleared = {
      categories: [],
      price_min: 0,
      price_max: 100000,
      sort: localFilters.sort,
      page: 1,
    };
    setLocalFilters(cleared);
    onApply(cleared);
  };

  const activeCount =
    (localFilters.categories?.length || 0) +
    (localFilters.price_min && localFilters.price_min > 0 ? 1 : 0) +
    (localFilters.price_max && localFilters.price_max < 100000 ? 1 : 0);

  return (
    <div className="flex flex-col gap-6 sticky top-24">
      {/* Header con indicador de activos */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-content1 border border-divider rounded-xl shadow-sm text-primary">
            <FiFilter size={18} />
          </div>
          <div>
            <h3 className="text-sm font-black text-default-800 uppercase tracking-tight">
              Filtros
            </h3>
            <p className="text-[10px] text-default-400 font-bold uppercase tracking-wider">
              Refina tu búsqueda
            </p>
          </div>
        </div>
        {activeCount > 0 && (
          <Button
            variant="flat"
            color="danger"
            size="sm"
            radius="full"
            className="h-7 px-3 min-w-unit-0 font-bold text-[10px]"
            onClick={handleClear}
            startContent={<FiX size={12} />}
          >
            Limpiar ({activeCount})
          </Button>
        )}
      </div>

      <div className="bg-content1 rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-divider space-y-8">
        {/* Sección Categorías */}
        <section>
          <h4 className="text-[11px] font-black text-default-500 uppercase tracking-widest mb-4 flex items-center gap-2">
            Categorías
            <span className="w-1 h-1 bg-primary rounded-full"></span>
          </h4>

          {isLoading ? (
            <div className="space-y-3 px-2">
              <Skeleton className="rounded-xl h-8 w-full" />
              <Skeleton className="rounded-xl h-8 w-3/4" />
              <Skeleton className="rounded-xl h-8 w-5/6" />
            </div>
          ) : (
            <div className="max-h-[50vh] overflow-y-auto pr-1 custom-scrollbar space-y-1">
              {categoryTree.map((rootCat) => (
                <CategoryItem
                  key={rootCat.id}
                  category={rootCat}
                  selectedValues={localFilters.categories || []}
                  onChange={handleCategoryToggle}
                />
              ))}
            </div>
          )}
        </section>

        <Divider className="opacity-50" />

        {/* Sección Precio */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-[11px] font-black text-default-500 uppercase tracking-widest flex items-center gap-2">
              Rango de Precio
              <span className="w-1 h-1 bg-primary rounded-full"></span>
            </h4>
          </div>

          <div className="px-2">
            <Slider
              aria-label="Precio"
              color="primary"
              size="sm"
              step={500}
              minValue={0}
              maxValue={100000}
              value={[
                localFilters.price_min || 0,
                localFilters.price_max || 100000,
              ]}
              classNames={{
                track: "bg-default-100 h-1.5",
                filler: "bg-primary",
                thumb:
                  "bg-white border-2 border-primary shadow-md w-4 h-4 after:bg-primary",
              }}
              onChange={(val) =>
                Array.isArray(val) &&
                setLocalFilters((p) => ({
                  ...p,
                  price_min: val[0],
                  price_max: val[1],
                }))
              }
            />

            <div className="flex justify-between mt-4">
              <div className="bg-default-50 px-3 py-1.5 rounded-xl border border-divider">
                <p className="text-[9px] text-default-400 font-bold uppercase block">
                  Mín
                </p>
                <span className="text-xs font-black text-default-700">
                  ${formatPrice(localFilters.price_min || 0)}
                </span>
              </div>
              <div className="bg-default-50 px-3 py-1.5 rounded-xl border border-divider text-right">
                <p className="text-[9px] text-default-400 font-bold uppercase block">
                  Máx
                </p>
                <span className="text-xs font-black text-default-700">
                  ${formatPrice(localFilters.price_max || 100000)}
                </span>
              </div>
            </div>
          </div>
        </section>

        <Button
          fullWidth
          className="bg-primary hover:bg-primary-600 text-primary-foreground font-black text-xs uppercase tracking-widest h-12 shadow-xl shadow-primary/20 rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98]"
          onPress={() => onApply(localFilters)}
        >
          Aplicar Cambios
        </Button>
      </div>
    </div>
  );
};
