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
import { fetchAllFilesByMarca } from "@/lib/actions/files.actions";
import { Label } from "@/components/ui/label";

export type FileType = "video" | "image" | "all";

function Placeholder() {
  return (
    <div className="flex flex-col gap-8 w-full items-center mt-24">
      <Image
        alt="an image of a picture and directory icon"
        width="300"
        height="300"
        src="/empty.svg"
      />
      <div className="text-2xl">You have no files, upload one now</div>
      {/* <UploadButton /> */}
    </div>
  );
}

export function FileBrowser({
  title,
  favoritesOnly = false,
  deletedOnly = false,
}: {
  title: string;
  favoritesOnly?: boolean;
  deletedOnly?: boolean;
}) {
  const { data: session } = useSession();
  const { marcaGlobalSeleccionada } = useContext(MisMarcasContext);

  const [query, setQuery] = useState("");
  const [files, setFiles] = useState<IFile[] | undefined>(undefined);

  const [type, setType] = useState<FileType>("all");

  let orgId: string | undefined = undefined;

  //TODO: DECIDIR SI ID DEL USUARIO O DE LA MARCA **CREEMOS QUE DE LA MARCA**
  if (session?.user) {
    orgId = session.user.id;
  }
  if (marcaGlobalSeleccionada) {
    orgId = marcaGlobalSeleccionada._id;
  }

  //TODO: QUERY TRAE TODOS LOS ARCHIVOS FAVORITOS DE UNA MARCA

  useEffect(() => {
    const fetchFiles = async () => {
      if (marcaGlobalSeleccionada) {
        const result = await fetchAllFilesByMarca(
          marcaGlobalSeleccionada._id as string,
          deletedOnly
        );
        setFiles([]);
        if (result.isOk && result.result) {
          setFiles(result.result);
        }
      } else {
        setFiles([]);
      }
    };

    fetchFiles();
  }, [marcaGlobalSeleccionada, deletedOnly]);

  // const favorites = useQuery(
  //   api.files.getAllFavorites,
  //   orgId ? { orgId } : "skip"
  // );

  // const files = useQuery(
  //   api.files.getFiles,
  //   orgId
  //     ? {
  //       orgId,
  //       type: type === "all" ? undefined : type,
  //       query,
  //       favorites: favoritesOnly,
  //       deletedOnly,
  //     }
  //     : "skip"
  // );

  const isLoading = files === undefined;

  //TODO: VERIFICAR SI SON FAVORITOS O NO
  var modifiedFiles =
    files?.map((file) => ({
      ...file,
      isFavorited: true,
    })) ?? [];  

    console.log(type)
    if(type === "video") 
      modifiedFiles = modifiedFiles.filter((file) => file.type === "video");
    if(type === "image")
      modifiedFiles = modifiedFiles.filter((file) => file.type === "image");


  console.log(modifiedFiles);
  // const modifiedFiles =
  //   files?.map((file) => ({
  //     ...file,
  //     isFavorited: (favorites ?? []).some(
  //       (favorite) => favorite.fileId === file._id
  //     ),
  //   })) ?? [];

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
          {modifiedFiles.length > 0 && (
            <DataTable columns={columns} data={modifiedFiles} />
          )}
          <div className="grid grid-cols-3 gap-4">
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
