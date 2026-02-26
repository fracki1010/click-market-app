import React, { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardBody,
  CardFooter,
  Checkbox,
  Slider,
  Button,
  Divider,
  Skeleton,
} from "@heroui/react";

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

// --- Función para construir y ORDENAR el árbol (Flat List -> Tree) ---
function buildCategoryTree(categories: ICategory[]): ICategory[] {
  const map = new Map<string, ICategory>();
  const roots: ICategory[] = [];

  // 1. Inicializar mapa con hijos vacíos
  categories.forEach((cat) => {
    map.set(cat.id, { ...cat, children: [] });
  });

  // 2. Conectar padres e hijos
  categories.forEach((cat) => {
    const node = map.get(cat.id);

    if (node) {
      // Si tiene padre Y el padre existe en el mapa, es un hijo
      if (cat.parent && map.has(cat.parent)) {
        map.get(cat.parent)!.children!.push(node);
      } else {
        // Si no tiene padre o el padre no vino en la lista, es raíz
        roots.push(node);
      }
    }
  });

  // 3. FUNCION RECURSIVA PARA ORDENAR ALFABÉTICAMENTE (A-Z)
  const sortNodes = (nodes: ICategory[]) => {
    // Ordenamos el nivel actual por nombre
    nodes.sort((a, b) => a.name.localeCompare(b.name));

    // Ordenamos los hijos de cada nodo
    nodes.forEach((node) => {
      if (node.children && node.children.length > 0) {
        sortNodes(node.children);
      }
    });
  };

  // Aplicar ordenamiento
  sortNodes(roots);

  return roots;
}

// --- Componente Recursivo de Ítem de Categoría ---
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

  // Auto-expandir si un hijo está seleccionado
  useEffect(() => {
    if (hasChildren && !isOpen) {
      const childSelected = category.children!.some((c) =>
        selectedValues.includes(c.name),
      );

      if (childSelected) setIsOpen(true);
    }
  }, [selectedValues]);

  return (
    <div className="flex flex-col select-none">
      <div
        className="flex items-center gap-1 py-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded px-1 transition-colors"
        style={{ marginLeft: `${level * 12}px` }} // Indentación ajustada
      >
        {/* Botón de expandir (solo si tiene hijos) */}
        {hasChildren ? (
          <button
            className="p-1 text-gray-500 hover:text-primary focus:outline-none"
            onClick={(e) => {
              e.preventDefault();
              setIsOpen(!isOpen);
            }}
          >
            <svg
              className={`w-3 h-3 transition-transform duration-200 ${isOpen ? "rotate-90" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M9 5l7 7-7 7"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
          </button>
        ) : (
          // Espaciador para alinear items sin hijos
          <div className="w-5 h-4" />
        )}

        {/* Checkbox de selección */}
        <Checkbox
          classNames={{ label: "text-sm text-gray-700 dark:text-gray-200" }}
          isSelected={isSelected}
          size="sm"
          onValueChange={(checked) => onChange(category.name, checked)}
        >
          {category.name}
        </Checkbox>
      </div>

      {/* Renderizado recursivo de hijos */}
      {hasChildren && isOpen && (
        <div className="flex flex-col border-l border-gray-200 dark:border-gray-700 ml-4">
          {category.children!.map((child) => (
            <CategoryItem
              key={child.id}
              category={child}
              level={level + 1}
              selectedValues={selectedValues}
              onChange={onChange}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// --- Componente Principal ---
export const ProductFilters: React.FC<ProductFiltersProps> = ({
  currentFilters,
  onApply,
}) => {
  const { data: categories = [], isLoading } = useCategories();

  console.log("categories", categories);

  // Estado Local
  const [localFilters, setLocalFilters] = useState<FilterState>(currentFilters);

  // Sincronizar estado local si cambian los props
  useEffect(() => {
    setLocalFilters(currentFilters);
  }, [currentFilters]);

  // Construir el árbol usando useMemo
  const categoryTree = useMemo(
    () => buildCategoryTree(categories),
    [categories],
  );

  // Manejar cambio de checkbox (Nombre de la categoría)
  const handleCategoryToggle = (name: string, checked: boolean) => {
    setLocalFilters((prev) => {
      const currentCats = prev.categories || [];
      let newCats;

      if (checked) {
        newCats = [...currentCats, name];
      } else {
        newCats = currentCats.filter((c) => c !== name);
      }

      return { ...prev, categories: newCats };
    });
  };

  const handlePriceChange = (value: number | number[]) => {
    if (Array.isArray(value)) {
      setLocalFilters((prev) => ({
        ...prev,
        price_min: value[0],
        price_max: value[1],
      }));
    }
  };

  const handleApplyClick = () => {
    onApply(localFilters);
  };

  const handleClearClick = () => {
    const cleared = {
      categories: [],
      price_min: 0,
      price_max: 100000,
      sort: localFilters.sort,
      limit: localFilters.limit,
    };

    setLocalFilters(cleared);
    onApply(cleared);
  };

  return (
    <Card className="h-fit sticky top-24 shadow-sm border border-gray-100 dark:border-gray-800 w-full">
      <CardBody className="gap-6 p-5">
        {/* Sección Categorías */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-sm font-bold text-gray-800 dark:text-gray-100 uppercase">
              Categorías
            </h4>
            <span className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
              {categories.length}
            </span>
          </div>

          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="rounded-lg h-5 w-3/4" />
              <Skeleton className="rounded-lg h-5 w-1/2" />
              <Skeleton className="rounded-lg h-5 w-2/3" />
            </div>
          ) : (
            // AUMENTÉ EL MAX-HEIGHT A 60vh PARA QUE ENTREN MÁS CATEGORÍAS
            <div className="max-h-[60vh] overflow-y-auto pr-1 custom-scrollbar">
              {categoryTree.length > 0 ? (
                categoryTree.map((rootCat) => (
                  <CategoryItem
                    key={rootCat.id}
                    category={rootCat}
                    selectedValues={localFilters.categories || []}
                    onChange={handleCategoryToggle}
                  />
                ))
              ) : (
                <p className="text-xs text-gray-400 italic text-center py-4">
                  No se encontraron categorías.
                </p>
              )}
            </div>
          )}
        </div>

        <Divider />

        {/* Sección Precio */}
        <div>
          <h4 className="text-sm font-bold mb-3 text-gray-800 dark:text-gray-100 uppercase">
            Rango de Precio
          </h4>
          <Slider
            aria-label="Rango de precios"
            className="max-w-md"
            color="primary"
            maxValue={100000} // Valor más realista
            minValue={0}
            size="sm"
            step={500}
            value={[
              localFilters.price_min || 0,
              localFilters.price_max || 100000,
            ]}
            onChange={handlePriceChange}
          />
          <div className="flex justify-between text-xs text-gray-500 mt-2 font-medium">
            <span>${(localFilters.price_min || 0).toLocaleString()}</span>
            <span>${(localFilters.price_max || 100000).toLocaleString()}+</span>
          </div>
        </div>
      </CardBody>

      <Divider />

      <CardFooter className="p-4 gap-3 bg-gray-50 dark:bg-gray-900/50">
        <Button
          fullWidth
          color="danger"
          size="sm"
          variant="light"
          onPress={handleClearClick}
        >
          Limpiar
        </Button>
        <Button
          fullWidth
          className="font-semibold shadow-md shadow-primary/20"
          color="primary"
          size="sm"
          onPress={handleApplyClick}
        >
          Aplicar Filtros
        </Button>
      </CardFooter>
    </Card>
  );
};
