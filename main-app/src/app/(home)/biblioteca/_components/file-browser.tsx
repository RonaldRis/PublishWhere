"use client";

import { UploadButton } from "./upload-button";
import { FileCard } from "./file-card";
import Image from "next/image";
import { GridIcon, Loader2, RowsIcon, TableIcon } from "lucide-react";
import { SearchBar } from "./search-bar";
import { useContext, useEffect, useState } from "react";
import { DataTable } from "./file-table";
import { columns } from "./columns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

//Que no tengo

//Mias
import { MisMarcasContext } from "@/contexts/MisMarcasContext";
import { useSession } from "next-auth/react";
import { IFile } from "@/lib/models/file.model";
import { fetchAllFilesByMarcaAction } from "@/lib/actions/files.actions";
import { Label } from "@/components/ui/label";
import { BibliotecaContext } from "@/contexts/BibliotecaContext";

function Placeholder() {
  return (
    <div className="flex flex-col gap-8 w-full items-center mt-24">
      <Image
        alt="an image of a picture and directory icon"
        width="300"
        height="300"
        src="/empty.svg"
      />
      <div className="text-2xl">No hay archivos</div>
      {/* <UploadButton /> */}
    </div>
  );
}

export function FileBrowser({
  title,
  favoritesOnly = false,
  deletedOnly = false,
  notUsedOnly = false,
  usedOnly = false,
}: {
  title: string;
  favoritesOnly?: boolean;
  deletedOnly?: boolean;
  notUsedOnly?: boolean;
  usedOnly?: boolean;
}) {
  const { data: session } = useSession();
  const { marcaGlobalSeleccionada } = useContext(MisMarcasContext);
  const { files, setFiles, type, setType, isLoading, modifiedFiles } =
    useContext(BibliotecaContext);

  //TODO: QUERY TRAE TODOS LOS ARCHIVOS FAVORITOS DE UNA MARCA

  useEffect(() => {
    //Para que no se ejecute al inicio
    if (marcaGlobalSeleccionada && session) {
      fetchAllFilesByMarcaAction(
        marcaGlobalSeleccionada._id as string,
        deletedOnly
      ).then((result) => {
        if (result.isOk)
          if (result.data) {
            var files = result.data;
            console.log("filesREQUEST", files.length);
            console.log("filesREQUEST", files);
            //TODO: Hacer tablas de Favoritos! Para verificar esa Query
            // if (favoritesOnly) {
            //   result.result = result.result?.filter((file: IFile) => file.isFavorited) ?? [];
            // }

            if (notUsedOnly) {
              files = result.data?.filter(
                (file: IFile) => file.alreadyUsed === false
              );
            }

            if (usedOnly) {
              files = result.data?.filter(
                (file: IFile) => file.alreadyUsed === true
              );
            }

            if (deletedOnly)
              files =
                result.data?.filter((file: IFile) => file.shouldDelete) ?? [];

            console.log("filesFILTER", files.length);
            console.log("filesFILTER", files);

            setFiles(files ?? []);
          }
      });
    }
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold w-1/3">{title}</h1>

        <div className="w-1/3">
          {/* <SearchBar query={query} setQuery={setQuery} /> */}
        </div>

        <div className="w-1/3 mr-0">{/* <UploadButton /> */}</div>
      </div>

      <Tabs defaultValue="grid">
        <div className="flex justify-between items-center">
          <TabsList className="mb-2">
            <TabsTrigger value="grid" className="flex gap-2 items-center">
              <GridIcon />
              Grid
            </TabsTrigger>
            <TabsTrigger value="table" className="flex gap-2 items-center">
              <RowsIcon /> Table
            </TabsTrigger>
          </TabsList>

          <div className="flex gap-2 items-center">
            <Label htmlFor="type-select">Type Filter</Label>
            <Select
              value={type}
              onValueChange={(newType) => {
                setType(newType as any);
              }}
            >
              <SelectTrigger id="type-select" className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="image">Image</SelectItem>
                <SelectItem value="video">Video</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading && (
          <div className="flex flex-col gap-8 w-full items-center mt-24">
            <Loader2 className="h-32 w-32 animate-spin text-gray-500" />
            <div className="text-2xl">Loading your files...</div>
          </div>
        )}

        <TabsContent value="grid">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {modifiedFiles?.map((file) => {
              return <FileCard key={file._id} file={file} />;
            })}
          </div>
        </TabsContent>
        <TabsContent value="table">
          {modifiedFiles.length > 0 && (
            <DataTable columns={columns} data={modifiedFiles} />
          )}
        </TabsContent>
      </Tabs>

      {files?.length === 0 && <Placeholder />}
    </div>
  );
}
