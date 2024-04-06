"use client";

import {
  fetchAllMarcasAction,
  fetchMisMarcasAction,
} from "@/lib/actions/marcas.actions";
import { IMarca } from "@/lib/models/marca.model";
import { useSession } from "next-auth/react";
import React, {
  useState,
  useEffect,
  Context,
  createContext,
  ReactNode,
  useContext,
  use,
} from "react";
import { useLocalStorage } from "usehooks-ts";
import { MisMarcasContext } from "./MisMarcasContext";
import {
  deleteFileAction,
  fetchAllFilesByMarcaAction,
  restoreTrashFileAction,
  sendToTrashFileAction,
} from "@/lib/actions/files.actions";
import { IFile } from "@/lib/models/file.model";
import { toast } from "sonner";

interface IModifiedFile extends IFile {
  isFavorited: boolean;
}
export type FileType = "video" | "image" | "all";

interface IGlobalContextProps {
  isOpenModalNewFile: boolean;
  setIsOpenModalNewFile: React.Dispatch<React.SetStateAction<boolean>>;
  files: IFile[] | undefined;
  setFiles: React.Dispatch<React.SetStateAction<IFile[] | undefined>>;
  isFilesLoading: boolean;
  setFileLoading: React.Dispatch<React.SetStateAction<boolean>>;

  fetchFilesContext: (deletedOnly?: boolean) => Promise<void>;
  handlerRestoreFile: (fileId: string) => Promise<void>;
  handlerTrashFile: (fileId: string) => Promise<void>;
  handlerDeleteFile: (fileId: string) => Promise<void>;

  modifiedFiles: IModifiedFile[];
  type: FileType;
  setType: React.Dispatch<React.SetStateAction<FileType>>;
  isLoading: boolean;
}

// Contexto
const BibliotecaContext = React.createContext<IGlobalContextProps>({
  isOpenModalNewFile: false,
  setIsOpenModalNewFile: () => {},
  files: undefined,
  setFiles: () => {},
  isFilesLoading: false,
  setFileLoading: () => {},
  fetchFilesContext: async () => {},
  handlerRestoreFile: async () => {},
  handlerTrashFile: async () => {},
  handlerDeleteFile: async () => {},

  modifiedFiles: [],
  type: "all",
  setType: () => {},
  isLoading: false,
});

// Proveedor
const BibliotecaProvider = ({ children }: { children: ReactNode }) => {
  //Globales
  const { marcaGlobalSeleccionada } = useContext(MisMarcasContext);

  //Propios
  const [files, setFiles] = useState<IFile[] | undefined>(undefined);
  const [modifiedFiles, setModifiedFiles] = useState<IModifiedFile[]>([]);
  const [isFilesLoading, setFileLoading] = useState<boolean>(false);
  const [isOpenModalNewFile, setIsOpenModalNewFile] = useState<boolean>(false);
  const [type, setType] = useState<FileType>("all");
  const [query, setQuery] = useState("");

  const recalcutateModifiedFiles = () => {
    if (files === undefined) return [];

    var modifiedFilesNew =
      files?.map((file) => ({
        ...file,
        isFavorited: true,
      })) ?? [];

    console.log(type);
    if (type === "video")
      modifiedFilesNew = modifiedFilesNew.filter(
        (file) => file.type === "video"
      );
    else if (type === "image")
      modifiedFilesNew = modifiedFilesNew.filter(
        (file) => file.type === "image"
      );
    setModifiedFiles(modifiedFilesNew);
  };

  useEffect(() => {
    recalcutateModifiedFiles();
  }, [files, type]);

  const fetchFilesContext = async (deletedOnly = false) => {
    if (marcaGlobalSeleccionada) {
      const result = await fetchAllFilesByMarcaAction(
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

  const handlerRestoreFile = async (fileId: string) => {
    if (marcaGlobalSeleccionada) {
      const result = await restoreTrashFileAction(fileId);
      if (result.isOk) {
        const newFiles = files?.filter((file) => file._id !== fileId);
        setFiles(newFiles);
        toast.success("Archivo restaurado");
      }
    }
  };

  const handlerTrashFile = async (fileId: string) => {
    if (marcaGlobalSeleccionada) {
      const result = await sendToTrashFileAction(fileId);
      if (result.isOk) {
        const newFiles = files?.filter((file) => file._id !== fileId);
        setFiles(newFiles);
        toast.success("Archivo enviado a la papelera");
      }
    }
  };

  const handlerDeleteFile = async (fileId: string) => {
    const result = await deleteFileAction(fileId);
    if (result.isOk) {
      const newFiles = files?.filter((file) => file._id !== fileId);
      setFiles(newFiles);
      toast.success("Archivo eliminado");
    }
  };

  const isLoading = files === undefined;

  console.log(modifiedFiles);

  return (
    <BibliotecaContext.Provider
      value={{
        isOpenModalNewFile: isOpenModalNewFile,
        setIsOpenModalNewFile: setIsOpenModalNewFile,
        files: files,
        setFiles: setFiles,
        isFilesLoading: isFilesLoading,
        setFileLoading: setFileLoading,
        fetchFilesContext: fetchFilesContext,
        handlerRestoreFile: handlerRestoreFile,
        handlerTrashFile: handlerTrashFile,
        modifiedFiles: modifiedFiles,
        type: type,
        setType: setType,
        isLoading: isLoading,
        handlerDeleteFile: handlerDeleteFile,
      }}
    >
      {children}
    </BibliotecaContext.Provider>
  );
};

export { BibliotecaProvider, BibliotecaContext };
