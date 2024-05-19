"use client";

import {
  fetchAllMarcasAction,
  fetchMisMarcasAction,
} from "@/lib/actions/marcas.actions";
import { IMarca } from "shared-lib/models/marca.model";
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
  fetchAllFilesNOTUsedByMarcaAction,
  fetchAllFilesScheduleByMarcaAction,
  fetchAllFilesUsedByMarcaAction,
  restoreTrashFileAction,
  sendToTrashFileAction,
} from "@/lib/actions/files.actions";
import { IFile } from "shared-lib/models/file.model";
import { toast } from "sonner";
import { set } from "mongoose";
import { IUser } from "shared-lib/models/user.model";

interface IModifiedFile extends IFile {
  isFavorited: boolean;
}

interface IFileStatusFilter {
  favoritesOnly: boolean;
  deletedOnly: boolean;
  notUsedOnly: boolean;
  usedOnly: boolean;
  programadosOnly: boolean;
  publicadosOnly: boolean;
}


export type FileType = "video" | "image" | "all";

interface IGlobalContextProps {
  isOpenModalNewFile: boolean;
  setIsOpenModalNewFile: React.Dispatch<React.SetStateAction<boolean>>;
  files: IFile[] | undefined;
  setFiles: React.Dispatch<React.SetStateAction<IFile[] | undefined>>;
  isFilesLoading: boolean;
  setFileLoading: React.Dispatch<React.SetStateAction<boolean>>;

  fetchFilesContext: () => Promise<void>;
  handlerRestoreFile: (fileId: string) => Promise<void>;
  handlerTrashFile: (fileId: string) => Promise<void>;
  handlerDeleteFile: (fileId: string) => Promise<void>;

  modifiedFiles: IModifiedFile[];
  type: FileType;
  setType: React.Dispatch<React.SetStateAction<FileType>>;
  //ESTADOS PARA HACER EL FETCH ALL FILES INICIAL
  filesFilterStatus: IFileStatusFilter;
  setFilesFilterStatus: React.Dispatch<React.SetStateAction<IFileStatusFilter>>;

  query: string;
  setQuery?: React.Dispatch<React.SetStateAction<string>>;
}

// Contexto
const BibliotecaContext = React.createContext<IGlobalContextProps>({
  isOpenModalNewFile: false,
  setIsOpenModalNewFile: () => { },
  files: undefined,
  setFiles: () => { },
  isFilesLoading: false,
  setFileLoading: () => { },
  fetchFilesContext: async () => { },
  handlerRestoreFile: async () => { },
  handlerTrashFile: async () => { },
  handlerDeleteFile: async () => { },

  modifiedFiles: [],
  type: "all",
  setType: () => { },
  //ESTADOS PARA HACER EL FETCH ALL FILES INICIAL
  filesFilterStatus: {
    favoritesOnly: false,
    deletedOnly: false,
    notUsedOnly: false,
    usedOnly: false,
    programadosOnly: false,
    publicadosOnly: false,
  },

  setFilesFilterStatus: () => { },

  query: "",
  setQuery: () => { },
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

  var [filesFilterStatus, setFilesFilterStatus] = useLocalStorage(
    "filesFilterStatus",
    {
      favoritesOnly: false,
      deletedOnly: false,
      notUsedOnly: false,
      usedOnly: false,
      programadosOnly: false,
      publicadosOnly: false,
    }
  );
  const recalcutateModifiedFiles = () => {
    if (files === undefined) return [];

    var modifiedFilesNew =
      files?.map((file) => ({
        ...file,
        isFavorited: false,
      })) ?? [];

    if (type == "video" || type == "image") {
      modifiedFilesNew = modifiedFilesNew.filter(
        (file) => file.type === type
      );
    }

    console.log(modifiedFilesNew)

    if (query && query.length > 0)
      modifiedFilesNew = modifiedFilesNew.filter((file) => {
        return file.name.toLowerCase().includes(query.toLowerCase())
        || (file.creatorId as IUser).name.toLowerCase().includes(query.toLowerCase())
      });


    setModifiedFiles(modifiedFilesNew);
  };

  useEffect(() => {
    recalcutateModifiedFiles();
  }, [files, type, query]);


  //TODO: HACER ESTO MAÑANA
  const fetchFilesContext = async () => {

    setFileLoading(true);
    setFiles(undefined);


    if (!marcaGlobalSeleccionada) {
      setFileLoading(false);
      return;
    }

    if (filesFilterStatus.deletedOnly) {
      console.log("deletedOnly")
      const result = await fetchAllFilesByMarcaAction(marcaGlobalSeleccionada._id, true);
      if (result.isOk) {
        setFiles(result.data ?? []);
      }
      setFileLoading(false);
      return;
    }

    if (filesFilterStatus.programadosOnly) {
      console.log("programadosOnly")
      const result = await fetchAllFilesScheduleByMarcaAction(marcaGlobalSeleccionada._id);
      if (result.isOk) {
        setFiles(result.data ?? []);
      }
      setFileLoading(false);

      return;
    }

    if (filesFilterStatus.usedOnly) {
      console.log("usedOnly")

      const result = await fetchAllFilesUsedByMarcaAction(marcaGlobalSeleccionada._id);
      if (result.isOk) {
        setFiles(result.data ?? []);
      }
      setFileLoading(false);

      return;
    }

    if (filesFilterStatus.notUsedOnly) {
      console.log("notUsedOnly")

      const result = await fetchAllFilesNOTUsedByMarcaAction(marcaGlobalSeleccionada._id);
      if (result.isOk) {
        setFiles(result.data ?? []);
      }
      setFileLoading(false);

      return;
    }

    console.log("ALL FILES - no filter ")

    const result = await fetchAllFilesByMarcaAction(marcaGlobalSeleccionada._id);
    if (result.isOk) {
      setFiles(result.data ?? []);
      setFileLoading(false);

      return;
    }

    setFiles([]);
    setFileLoading(false);


  };


  useEffect(() => {
    fetchFilesContext();
  }, [marcaGlobalSeleccionada, filesFilterStatus]);

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
        handlerDeleteFile: handlerDeleteFile,

        //Query inicial
        filesFilterStatus: filesFilterStatus,
        setFilesFilterStatus: setFilesFilterStatus,
        query: query,
        setQuery: setQuery,
      }}
    >
      {children}
    </BibliotecaContext.Provider>
  );
};

export { BibliotecaProvider, BibliotecaContext };
