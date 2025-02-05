"use client";

import { Chip } from "@jamsr-ui/react";
import { Transaction, TransactionStatus } from "@prisma/client";
import { type ColumnDef } from "@tanstack/react-table";

export type TypedColumnDef<T> = ColumnDef<T> & {
  accessorKey: keyof T;
};

export const columns: TypedColumnDef<Transaction>[] = [
  {
    accessorKey: "id",
    header: "Invoice Id",
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
  {
    accessorKey: "status",
    header: "Status",
    size: 140,
    cell: ({ row: { original } }) => {
      const { status } = original;
      return (
        <Chip
          color={
            (status === TransactionStatus.COMPLETED && "success") ||
            (status === TransactionStatus.PENDING && "warning") ||
            "danger"
          }
        >
          {status}{" "}
        </Chip>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    accessorFn: (row) => new Date(row.createdAt).toUTCString(),
  },
  {
    accessorKey: "updatedAt",
    header: "Last Processed",
    accessorFn: (row) => new Date(row.createdAt).toUTCString(),
  },
];
