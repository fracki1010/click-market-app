import React, { useState, useEffect, useMemo } from "react";
import { Checkbox, Slider, Button, Divider, Skeleton } from "@heroui/react";
import { FiFilter, FiX, FiChevronRight } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

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
            ? "bg-indigo-50 dark:bg-indigo-500/10"
            : "hover:bg-gray-50 dark:hover:bg-neutral-800/50"
        }`}
        style={{ marginLeft: `${level * 8}px` }}
      >
        {hasChildren ? (
          <button
            className={`p-1 rounded-md transition-colors ${
              isOpen
                ? "text-indigo-600 bg-indigo-50 dark:bg-indigo-500/20"
                : "text-gray-400 group-hover:text-gray-600"
            }`}
            onClick={(e) => {
              e.preventDefault();
              setIsOpen(!isOpen);
            }}
          >
            <FiChevronRight
              className={`w-3.5 h-3.5 transition-transform duration-300 ${isOpen ? "rotate-90 text-indigo-500" : ""}`}
            />
          </button>
        ) : (
          <div className="w-5.5 h-4" />
        )}

        <Checkbox
          classNames={{
            label: `text-sm font-medium transition-colors ${isSelected ? "text-indigo-600 dark:text-indigo-400" : "text-gray-600 dark:text-neutral-400"}`,
            wrapper: "after:bg-indigo-600 before:border-indigo-600",
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
            className="overflow-hidden border-l-2 border-gray-100 dark:border-neutral-800 ml-4.5 mt-1 pb-1"
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
      const currentCats = prev.categories || [];
      const newCats = checked
        ? [...currentCats, name]
        : currentCats.filter((c) => c !== name);
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
          <div className="p-2 bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-xl shadow-sm text-indigo-500">
            <FiFilter size={18} />
          </div>
          <div>
            <h3 className="text-sm font-black text-gray-800 dark:text-white uppercase tracking-tight">
              Filtros
            </h3>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
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

      <div className="bg-white dark:bg-neutral-900 rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-gray-50 dark:border-neutral-800/50 space-y-8">
        {/* Sección Categorías */}
        <section>
          <h4 className="text-[11px] font-black text-gray-400 dark:text-neutral-500 uppercase tracking-widest mb-4 flex items-center gap-2">
            Categorías
            <span className="w-1 h-1 bg-indigo-500 rounded-full"></span>
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
            <h4 className="text-[11px] font-black text-gray-400 dark:text-neutral-500 uppercase tracking-widest flex items-center gap-2">
              Rango de Precio
              <span className="w-1 h-1 bg-indigo-500 rounded-full"></span>
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
                track: "bg-gray-100 dark:bg-neutral-800 h-1.5",
                filler: "bg-indigo-500",
                thumb:
                  "bg-white border-2 border-indigo-500 shadow-md w-4 h-4 after:bg-indigo-500",
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
              <div className="bg-gray-50 dark:bg-neutral-800/50 px-3 py-1.5 rounded-xl border border-gray-100 dark:border-neutral-800">
                <p className="text-[9px] text-gray-400 font-bold uppercase block">
                  Mín
                </p>
                <span className="text-xs font-black text-gray-700 dark:text-neutral-200">
                  ${(localFilters.price_min || 0).toLocaleString()}
                </span>
              </div>
              <div className="bg-gray-50 dark:bg-neutral-800/50 px-3 py-1.5 rounded-xl border border-gray-100 dark:border-neutral-800 text-right">
                <p className="text-[9px] text-gray-400 font-bold uppercase block">
                  Máx
                </p>
                <span className="text-xs font-black text-gray-700 dark:text-neutral-200">
                  ${(localFilters.price_max || 100000).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </section>

        <Button
          fullWidth
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-widest h-12 shadow-xl shadow-indigo-500/20 rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98]"
          onPress={() => onApply(localFilters)}
        >
          Aplicar Cambios
        </Button>
      </div>
    </div>
  );
};
