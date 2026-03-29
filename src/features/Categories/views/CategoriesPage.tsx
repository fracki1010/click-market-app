import React from "react";
import { Link } from "react-router";
import { Card, CardBody, Input, Skeleton } from "@heroui/react";
import { FiSearch } from "react-icons/fi";

import { useCategoryBrowser } from "../hooks/useCategoryBrowser";
import { useCategoryPreviewImages } from "../hooks/useCategoryPreviewImages";
import {
  getCategoryInitials,
  getColorClassByName,
  getProductsByCategoryUrl,
} from "../utils/categoryTree";

export const CategoriesPage: React.FC = () => {
  const {
    categoryItems,
    isLoading,
    rootCategories,
    search,
    selectedRoot,
    setSearch,
    setSelectedRootId,
  } = useCategoryBrowser();
  const categoryPreviewMap = useCategoryPreviewImages(categoryItems);

  return (
    <div className="px-1 pb-6">
      <div className="grid grid-cols-[126px_1fr] gap-3 sm:grid-cols-[170px_1fr] sm:gap-4">
        <aside className="rounded-2xl border border-divider bg-content1">
          <div className="border-b border-divider px-3 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-default-500">
            Familias
          </div>

          <div className="h-[74vh] overflow-y-auto no-scrollbar py-1">
            {isLoading && (
              <div className="space-y-2 px-2 py-2">
                {Array.from({ length: 7 }).map((_, index) => (
                  <Skeleton key={index} className="h-10 rounded-xl" />
                ))}
              </div>
            )}

            {!isLoading &&
              rootCategories.map((root) => {
                const isActive = selectedRoot?.id === root.id;

                return (
                  <button
                    key={root.id}
                    className={`flex w-full items-center justify-between gap-2 border-l-2 px-3 py-3 text-left transition ${
                      isActive
                        ? "border-primary bg-primary-50 text-primary"
                        : "border-transparent text-default-700 hover:bg-default-100"
                    }`}
                    type="button"
                    onClick={() => setSelectedRootId(root.id)}
                  >
                    <span className="line-clamp-2 text-xs font-semibold leading-tight">
                      {root.name}
                    </span>
                  </button>
                );
              })}
          </div>
        </aside>

        <section className="rounded-2xl border border-divider bg-content1 p-3 sm:p-4">
          <div className="mb-3 flex flex-col gap-3 border-b border-divider pb-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-default-500">
                Categoría activa
              </p>
              <h2 className="truncate text-lg font-black tracking-tight text-default-900 sm:text-2xl">
                {selectedRoot?.name || "Sin categorías"}
              </h2>
              <p className="text-xs font-medium text-default-500">
                {categoryItems.length} resultado(s)
              </p>
            </div>

            <Input
              isClearable
              className="w-full sm:max-w-xs"
              classNames={{
                inputWrapper:
                  "h-10 border-divider bg-default-50 shadow-none hover:bg-default-100",
              }}
              placeholder="Buscar categoría..."
              startContent={<FiSearch className="text-default-400" />}
              value={search}
              onValueChange={setSearch}
            />
          </div>

          <div className="max-h-[62vh] overflow-y-auto no-scrollbar pr-1">
            {isLoading ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {Array.from({ length: 12 }).map((_, index) => (
                  <Skeleton key={index} className="h-24 rounded-2xl" />
                ))}
              </div>
            ) : categoryItems.length === 0 ? (
              <div className="flex min-h-[220px] flex-col items-center justify-center rounded-2xl border border-dashed border-divider px-4 text-center">
                <p className="text-sm font-semibold text-default-600">
                  No encontramos categorías con ese texto.
                </p>
                <p className="text-xs text-default-500">
                  Probá con otra búsqueda o elegí otra familia a la izquierda.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {categoryItems.map((category) => {
                  const colorClass = getColorClassByName(category.name);
                  const preview = categoryPreviewMap.get(category.id);
                  const imageUrl = preview?.imageUrl;
                  const isImageLoading = preview?.isLoading;

                  return (
                    <Card
                      key={category.id}
                      isPressable
                      as={Link}
                      className="group border border-divider/80 bg-content1 shadow-none transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
                      to={getProductsByCategoryUrl(category.name)}
                    >
                      <CardBody className="items-center gap-2 px-2 py-4 text-center">
                        <div className="h-12 w-12 overflow-hidden rounded-full bg-default-100 ring-1 ring-divider">
                          {isImageLoading ? (
                            <Skeleton className="h-full w-full rounded-full" />
                          ) : imageUrl ? (
                            <img
                              alt={category.name}
                              className="h-full w-full object-cover"
                              loading="lazy"
                              src={imageUrl}
                            />
                          ) : (
                            <div
                              className={`flex h-full w-full items-center justify-center bg-gradient-to-br text-sm font-black ${colorClass}`}
                            >
                              {getCategoryInitials(category.name)}
                            </div>
                          )}
                        </div>

                        <p className="line-clamp-2 text-xs font-semibold leading-tight text-default-700">
                          {category.name}
                        </p>
                      </CardBody>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};
