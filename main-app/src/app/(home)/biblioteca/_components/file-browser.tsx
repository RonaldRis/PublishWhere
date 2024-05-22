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
import { CalendarioContext } from "@/contexts/CalendarioContext";
import UploadNewFileButton from "./UploadNewFileButton";
import { Input } from "@/components/ui/input";
import { getMediaUrl } from "@/lib/constantes";
import axios from "axios";

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
  publicadosOnly = false,
  programadosOnly = false
}: {
  title: string;
  favoritesOnly?: boolean;
  deletedOnly?: boolean;
  notUsedOnly?: boolean;
  usedOnly?: boolean;
  publicadosOnly?: boolean;
  programadosOnly?: boolean;
}) {
  const { data: session } = useSession();
  const { marcaGlobalSeleccionada } = useContext(MisMarcasContext);
  const {
    files,
    type,
    setType,
    isFilesLoading,
    setFileLoading,
    modifiedFiles,
    setFilesFilterStatus,
    query, setQuery
  } = useContext(BibliotecaContext);




  //TODO: BARRA DE BUSQUEDA! PENDIENTE DE IMPLEMENTAR

  useEffect(() => {

    setFileLoading(true); //Que empiece cargando al recien abrir la pagina


    var FileBrowserStatus = {
      deletedOnly: deletedOnly,
      favoritesOnly: favoritesOnly,
      notUsedOnly: notUsedOnly,
      usedOnly: usedOnly,
      programadosOnly: programadosOnly,
      publicadosOnly: publicadosOnly
    }

    if (typeof window !== 'undefined') { // Comprueba si estamos en el cliente
      setFilesFilterStatus(FileBrowserStatus)
    }

    console.log("USE EFFECT: SET FILTERS CONTEXT");
    console.log("FileBrowserStatus", FileBrowserStatus)
  }, []);



  useEffect(() => {
    console.log("FILES MODIFIED: ", isFilesLoading, modifiedFiles);
  }, [modifiedFiles]);

  return (
    <div>
      <div className="flex justify-between flex-wrap items-center mb-8">
        <h1 className="text-4xl font-bold w-1/3">{title}</h1>

        <div className="py-4 w-1/2">
          {
            setQuery &&
            <Input placeholder="Buscar por nombre" value={query}
              onChange={(e) => {
                setQuery(e.target.value);
              }}

            />
          }
        </div>

        {/* //TODO: QUITAR BOTON CUANDO SE ABRE DESDE CALENDARIO */}

        {/* <UploadNewFileButton /> */}
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

          {isFilesLoading && (
            <div className="flex flex-col gap-8 w-full items-center mt-24">
              <Loader2 className="h-32 w-32 animate-spin text-gray-500" />
              <div className="text-2xl">Cargando tus archivos...</div>
            </div>
          )}

          <TabsContent value="grid">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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

      {modifiedFiles?.length === 0 && (
        <Placeholder text="No hay archivos" />
      )}
    </div>
  );
}
