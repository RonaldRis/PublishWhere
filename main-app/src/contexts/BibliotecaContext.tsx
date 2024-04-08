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

  //ESTADOS PARA HACER EL FETCH ALL FILES INICIAL
  favoritesOnly: boolean;
  deletedOnly: boolean;
  notUsedOnly: boolean;
  usedOnly: boolean;
  setFavoritesOnly: React.Dispatch<React.SetStateAction<boolean>>;
  setDeletedOnly: React.Dispatch<React.SetStateAction<boolean>>;
  setNotUsedOnly: React.Dispatch<React.SetStateAction<boolean>>;
  setUsedOnly: React.Dispatch<React.SetStateAction<boolean>>;
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

  //ESTADOS PARA HACER EL FETCH ALL FILES INICIAL
  favoritesOnly: false,
  deletedOnly: false,
  notUsedOnly: false,
  usedOnly: false,
  setFavoritesOnly: () => {},
  setDeletedOnly: () => {},
  setNotUsedOnly: () => {},
  setUsedOnly: () => {},
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

  var [favoritesOnly, setFavoritesOnly] = useLocalStorage(
    "favoritesOnly",
    false
  );
  var [deletedOnly, setDeletedOnly] = useLocalStorage("deletedOnly", false);
  var [notUsedOnly, setNotUsedOnly] = useLocalStorage("notUsedOnly", false);
  var [usedOnly, setUsedOnly] = useLocalStorage("usedOnly", false);

  const recalcutateModifiedFiles = () => {
    if (files === undefined) return [];

    var modifiedFilesNew =
      files?.map((file) => ({
        ...file,
        isFavorited: false,
      })) ?? [];

    if (type === "video")
      modifiedFilesNew = modifiedFilesNew.filter(
        (file) => file.type === "video"
      );
    else if (type === "image")
      modifiedFilesNew = modifiedFilesNew.filter(
        (file) => file.type === "image"
      );
    setModifiedFiles(modifiedFilesNew);
    //TODO: HACER LO DE SI SON ARCHIVOS FAVORITOS O NO?? NI IDEA XD
  };

  useEffect(() => {
    recalcutateModifiedFiles();
  }, [files, type]);

  const fetchFilesContext = async () => {
    if (marcaGlobalSeleccionada) {
      const result = await fetchAllFilesByMarcaAction(
        marcaGlobalSeleccionada._id as string,
        deletedOnly
      );
      setFiles([]);
      if (result.isOk && result.data) {
        //APLICO LOS FILTROS INICIALES
        var files = result.data;

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
          files = result.data?.filter((file: IFile) => file.shouldDelete) ?? [];

        console.log("fetchFilesContext","filesFILTER", files.length,  files);

        setFiles(files ?? []);
      }
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

  const handlerPostNewFile = async (file: IFile) => {};

  const isLoading = files === undefined;


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

        //Query inicial
        favoritesOnly: favoritesOnly,
        deletedOnly: deletedOnly,
        notUsedOnly: notUsedOnly,
        usedOnly: usedOnly,
        setFavoritesOnly: setFavoritesOnly,
        setDeletedOnly: setDeletedOnly,
        setNotUsedOnly: setNotUsedOnly,
        setUsedOnly: setUsedOnly,
      }}
    >
      {children}
    </BibliotecaContext.Provider>
  );
};

export { BibliotecaProvider, BibliotecaContext };