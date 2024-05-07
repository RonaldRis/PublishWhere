"use client";

import { FileCard } from "./file-card";
import Image from "next/image";
import { GridIcon, Loader2, RowsIcon, TableIcon } from "lucide-react";
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
import { Label } from "@/components/ui/label";
import { BibliotecaContext } from "@/contexts/BibliotecaContext";
import { Button } from "@/components/ui/button";

function Placeholder({ text }: { text: string }) {
  return (
    <div className="flex flex-col gap-8 w-full items-center mt-24">
      <Image
        alt="an image of a picture and directory icon"
        width="300"
        height="300"
        src="/empty.svg"
      />
      <div className="text-2xl">{text}</div>
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
  const {
    files,
    type,
    setType,
    isLoading,
    modifiedFiles,
    fetchFilesContext,
    setDeletedOnly,
    setFavoritesOnly,
    setNotUsedOnly,
    setUsedOnly,
    setIsOpenModalNewFile,
  } = useContext(BibliotecaContext);

  //TODO: BARRA DE BUSQUEDA! PENDIENTE DE IMPLEMENTAR

  useEffect(() => {
    console.log("USE EFFECT: SET FILTERS CONTEXT");

    setDeletedOnly(deletedOnly);
    setFavoritesOnly(favoritesOnly);
    setNotUsedOnly(notUsedOnly);
    setUsedOnly(usedOnly);

    fetchFilesContext();
  }, []);

  useEffect(() => {
    //Para que no se ejecute al inicio
    if (marcaGlobalSeleccionada && session) {
      setDeletedOnly(deletedOnly);
      setFavoritesOnly(favoritesOnly);
      setNotUsedOnly(notUsedOnly);
      setUsedOnly(usedOnly);

      console.log("USE EFFECT: FETCH FILES CONTEXT");
      fetchFilesContext();
    }
  }, [
    marcaGlobalSeleccionada,
    session,
    deletedOnly,
    favoritesOnly,
    notUsedOnly,
    usedOnly,
  ]);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold w-1/3">{title}</h1>

        <div className="w-1/3">
          {/* <SearchBar query={query} setQuery={setQuery} />  TODO: HACER SEARCHBAR*/}
        </div>

        <Button onClick={() => setIsOpenModalNewFile(true)}>
          Sube un archivo
        </Button>
      </div>

      {marcaGlobalSeleccionada && session ? (
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
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="image">Imágenes</SelectItem>
                  <SelectItem value="video">Videos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {isLoading && (
            <div className="flex flex-col gap-8 w-full items-center mt-24">
              <Loader2 className="h-32 w-32 animate-spin text-gray-500" />
              <div className="text-2xl">Cargando tus ...</div>
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
      ) : (
        <Placeholder text="Selecciona una marca primero" />
      )}

      {files?.length === 0 && (
        <Placeholder text="No hay archivos, sube alguno" />
      )}
    </div>
  );
}
