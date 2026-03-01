import React, { useMemo } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  User,
  Chip,
  Button,
  Card,
  CardBody,
  Avatar,
} from "@heroui/react";
import {
  FaBoxesStacked,
  FaTriangleExclamation,
  FaArrowRight,
} from "react-icons/fa6";
import { Link } from "react-router";

import { IProduct } from "@/features/Products/types/Product";

interface LowStockTableProps {
  products: IProduct[];
}

export const LowStockTable: React.FC<LowStockTableProps> = ({ products }) => {
  const alertProducts = useMemo(() => {
    return products
      .filter((p) => p.stock === 0 || p.stock <= p.stock_min)
      .slice(0, 5);
  }, [products]);

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-base md:text-lg font-black text-red-600 dark:text-red-400 flex items-center gap-2">
          <FaTriangleExclamation /> Alertas de Inventario
        </h3>
        <Chip color="danger" size="sm" variant="flat">
          {alertProducts.length} Requieren Atención
        </Chip>
      </div>

      {/* ── MOBILE: Mini Cards ── */}
      <div className="flex flex-col gap-2 md:hidden">
        {alertProducts.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-6">
            Todo el inventario está saludable. ✅
          </p>
        ) : (
          alertProducts.map((product) => (
            <Card
              key={product.id}
              className="shadow-sm border border-slate-100 dark:border-zinc-800"
            >
              <CardBody className="p-3">
                <div className="flex items-center gap-3">
                  <Avatar
                    radius="md"
                    src={product.imageUrl}
                    fallback={<FaBoxesStacked className="text-slate-400" />}
                    size="sm"
                    className="shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-800 dark:text-white truncate">
                      {product.name}
                    </p>
                    <p className="text-xs text-slate-400">
                      Stock: <strong>{product.stock}</strong> · Mín:{" "}
                      {product.stock_min}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {product.stock === 0 ? (
                      <Chip color="danger" size="sm" variant="dot">
                        Agotado
                      </Chip>
                    ) : (
                      <Chip color="warning" size="sm" variant="dot">
                        Bajo
                      </Chip>
                    )}
                    <Button
                      as={Link}
                      color="primary"
                      size="sm"
                      to="/admin/inventory"
                      variant="light"
                      isIconOnly
                    >
                      <FaArrowRight className="text-xs" />
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))
        )}
      </div>

      {/* ── DESKTOP: Table ── */}
      <div className="hidden md:block">
        <Table removeWrapper aria-label="Tabla de bajo stock">
          <TableHeader>
            <TableColumn>PRODUCTO</TableColumn>
            <TableColumn>SKU</TableColumn>
            <TableColumn>STOCK</TableColumn>
            <TableColumn>ESTADO</TableColumn>
            <TableColumn>ACCIÓN</TableColumn>
          </TableHeader>
          <TableBody emptyContent="Todo el inventario está saludable.">
            {alertProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <User
                    avatarProps={{
                      radius: "lg",
                      src: product.imageUrl,
                      fallback: <FaBoxesStacked />,
                    }}
                    description={`Mínimo: ${product.stock_min}`}
                    name={product.name}
                  >
                    {product.name}
                  </User>
                </TableCell>
                <TableCell>{product.sku || "N/A"}</TableCell>
                <TableCell>
                  <span className="font-bold text-lg">{product.stock}</span>
                </TableCell>
                <TableCell>
                  {product.stock === 0 ? (
                    <Chip color="danger" size="sm" variant="dot">
                      Agotado
                    </Chip>
                  ) : (
                    <Chip color="warning" size="sm" variant="dot">
                      Bajo Stock
                    </Chip>
                  )}
                </TableCell>
                <TableCell>
                  <Button
                    as={Link}
                    color="primary"
                    size="sm"
                    to="/admin/inventory"
                    variant="light"
                  >
                    Reponer
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
