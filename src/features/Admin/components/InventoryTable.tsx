import React from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { useNavigate } from "react-router";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  User,
  Chip,
  Tooltip,
  Pagination,
} from "@heroui/react";
import { FaPencil, FaTrash } from "react-icons/fa6";
import { FiEye } from "react-icons/fi";
import { formatPrice } from "@/utils/currencyFormat";

// Definición de tipos para la tabla
type InventoryProduct = {
  id: string;
  name: string;
  sku: string;
  costPrice: number;
  price: number;
  stock: number;
  stockMin: number;
  category: string;
  imageUrl: string;
};

interface InventoryTableProps {
  data: InventoryProduct[];
  onEdit: (product: InventoryProduct) => void;
  onDelete: (id: string) => void;
}

const columnHelper = createColumnHelper<InventoryProduct>();

export const InventoryTable: React.FC<InventoryTableProps> = ({
  data,
  onEdit,
  onDelete,
}) => {
  const navigate = useNavigate();

  // 1. Definición de Columnas con TanStack Table
  const columns = [
    columnHelper.accessor("name", {
      header: "PRODUCTO",
      cell: (info) => (
        <User
          avatarProps={{
            radius: "lg",
            src: info.row.original.imageUrl,
            className: "cursor-pointer",
          }}
          description={info.row.original.sku}
          name={info.getValue()}
          className="cursor-pointer hover:text-indigo-600 transition-colors"
          onClick={() => navigate(`/admin/inventory/${info.row.original.id}`)}
        >
          {info.getValue()}
        </User>
      ),
    }),
    columnHelper.accessor("category", {
      header: "CATEGORÍA",
      cell: (info) => (
        <span className="capitalize text-sm">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor("costPrice", {
      header: "COSTO",
      cell: (info) => (
        <span className="text-sm text-slate-500">
          ${formatPrice(info.getValue())}
        </span>
      ),
    }),
    columnHelper.accessor("price", {
      header: "VENTA",
      cell: (info) => (
        <span className="font-bold text-indigo-600 dark:text-indigo-400">
          ${formatPrice(info.getValue())}
        </span>
      ),
    }),
    columnHelper.accessor("stock", {
      header: "STOCK",
      cell: (info) => {
        const stock = info.getValue();
        const min = info.row.original.stockMin;

        // Lógica de Semáforo (RF-INV-02)
        let color: "success" | "warning" | "danger" = "success";
        let text = "Normal";

        if (stock === 0) {
          color = "danger";
          text = "Agotado";
        } else if (stock <= min) {
          color = "warning";
          text = "Bajo";
        }

        return (
          <Chip color={color} size="sm" variant="flat">
            {text} ({stock})
          </Chip>
        );
      },
    }),
    columnHelper.display({
      id: "actions",
      header: "ACCIONES",
      cell: (info) => (
        <div className="relative flex items-center gap-2">
          <Tooltip content="Ver Detalle">
            <span
              className="text-lg text-indigo-500 cursor-pointer active:opacity-50"
              onClick={() =>
                navigate(`/admin/inventory/${info.row.original.id}`)
              }
            >
              <FiEye />
            </span>
          </Tooltip>
          <Tooltip content="Editar">
            <span
              className="text-lg text-default-400 cursor-pointer active:opacity-50"
              onClick={() => onEdit(info.row.original)}
            >
              <FaPencil />
            </span>
          </Tooltip>
          <Tooltip color="danger" content="Eliminar">
            <span
              className="text-lg text-danger cursor-pointer active:opacity-50"
              onClick={() => onDelete(info.row.original.id)}
            >
              <FaTrash />
            </span>
          </Tooltip>
        </div>
      ),
    }),
  ];

  // 2. Hook de TanStack Table
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
    <div className="flex flex-col gap-4">
      <Table
        aria-label="Tabla de Inventario"
        bottomContent={
          <div className="flex w-full justify-center">
            <Pagination
              isCompact
              showControls
              showShadow
              color="primary"
              page={table.getState().pagination.pageIndex + 1}
              total={table.getPageCount()}
              onChange={(page) => table.setPageIndex(page - 1)}
            />
          </div>
        }
      >
        <TableHeader>
          {table.getFlatHeaders().map((header) => (
            <TableColumn key={header.id}>
              {flexRender(header.column.columnDef.header, header.getContext())}
            </TableColumn>
          ))}
        </TableHeader>
        <TableBody emptyContent={"No hay productos en inventario."}>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
