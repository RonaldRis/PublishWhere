"use client";

import { ColumnDef } from "@tanstack/react-table";
import { formatRelative } from "date-fns";
import { es } from "date-fns/locale";
import { FileCardActions } from "./file-card-actions";
import { IFile } from "shared-lib/models/file.model";
import { IUser } from "shared-lib/models/user.model";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Check } from "lucide-react";
import { typesMultimedia } from "@/lib/constantes";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function UserCell({ user }: { user: IUser }) {
  return (
    <div className="flex gap-2 text-xs text-gray-700 w-40 items-center">
      <Avatar className="w-6 h-6">
        <AvatarImage src={user?.image} />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      {user?.name}
    </div>
  );
}

export const columns: ColumnDef<IFile & { isFavorited: boolean }>[] = [
  
  {
    accessorKey: "alreadyUsed",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Usado
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <div>{row.original.alreadyUsed ? <Check /> : "No"}</div>;
    },
  },
  {
    accessorKey: "type",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tipo
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const data = typesMultimedia.find(
        (type) => type.value === row.original.type
      );

      return (
        <div className="mr-2 flex h-4 w-4 items-center justify-center ">
          <span>
            {data?.icon && (
              <data.icon className="mr-2 h-4 w-4 text-muted-foreground" />
            )}
          </span>
          <span>{data?.value}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nombre
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  
  {
    accessorKey: "creatorId.name", //TODO: REVVVISAR SI FUNCIONA EL CREADOR CUANDO HAYAN MAS USUARIOS
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Creador
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return <UserCell user={row.original.creatorId as IUser} />;
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Fecha de creación
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div>
          {formatRelative(new Date(row.original.createdAt), new Date(), {
            locale: es,
          })}
        </div>
      );
    },
  },
  {
    header: "Acciones",
    cell: ({ row }) => {
      return (
        <div>
          <FileCardActions
            file={row.original}
            isFavorited={row.original.isFavorited}
          />
        </div>
      );
    },
  },
];
