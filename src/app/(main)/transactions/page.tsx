import prisma from "@/lib/prisma";
import { DataTable } from "@jamsr-ui/react";
import { Metadata } from "next";
import { columns } from "./columns";

export const metadata: Metadata = {
  title: "Transactions",
};

const Page = async () => {
  const records = await prisma.transaction.findMany();
  return (
    <DataTable
      columns={columns}
      data={records}
      sorting={{ desc: true, id: "createdAt" }}
    />
  );
};

export default Page;
