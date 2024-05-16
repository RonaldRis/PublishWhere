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
  fetchAllFilesPostedByMarcaAction,
  fetchAllFilesScheduleByMarcaAction,
  restoreTrashFileAction,
  sendToTrashFileAction,
} from "@/lib/actions/files.actions";
import { IFile } from "shared-lib/models/file.model";
import { toast } from "sonner";

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
  isLoading: boolean;

  //ESTADOS PARA HACER EL FETCH ALL FILES INICIAL
  filesFilterStatus: IFileStatusFilter;
  setFilesFilterStatus: React.Dispatch<React.SetStateAction<IFileStatusFilter>>;

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
  isLoading: false,

  //ESTADOS PARA HACER EL FETCH ALL FILES INICIAL
  filesFilterStatus: {
    favoritesOnly: false,
    deletedOnly: false,
    notUsedOnly: false,
    usedOnly: false,
    programadosOnly: false,
    publicadosOnly: false,
  },

  setFilesFilterStatus: () => { }
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

    //TODO: CAMBIAR AL MOMENTO DE HACER LOS ARCHIVOS FAVORITOS, LEER DE LA BASE DE DATOS
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


  //TODO: HACER ESTO MAÑANA
  const fetchFilesContext = async () => {
    if (marcaGlobalSeleccionada) {
      const result = await fetchAllFilesByMarcaAction(
        marcaGlobalSeleccionada._id as string,
        filesFilterStatus.deletedOnly
      );

      if (!result.isOk)
        setFiles([]);

      if (result.isOk && result.data) {
        //APLICO LOS FILTROS INICIALES
        var filesNew = result.data;

        if (filesFilterStatus.notUsedOnly) {
          filesNew = result.data?.filter(
            (file: IFile) => file.alreadyUsed === false
          );
        }

        if (filesFilterStatus.usedOnly) {
          filesNew = result.data?.filter(
            (file: IFile) => file.alreadyUsed === true
          );
        }

        if (filesFilterStatus.deletedOnly)
          filesNew = result.data?.filter((file: IFile) => file.shouldDelete) ?? [];

        // if(filesFilterStatus.favoritesOnly)
        //TODO: HACER LO DE LOS FAVORITOS

        if (filesFilterStatus.programadosOnly) {
          //Tengo que comprobarlo con el servidor
          const filesProgramados = await fetchAllFilesPostedByMarcaAction(marcaGlobalSeleccionada._id as string);
          if (filesProgramados.isOk) {
            filesNew = filesProgramados.data!;
          }

        }

        if (filesFilterStatus.publicadosOnly) {
          //Tengo que comprobarlo con el servidor
          const filesPublicados = await fetchAllFilesScheduleByMarcaAction(marcaGlobalSeleccionada._id as string);
          if (filesPublicados.isOk) {
            filesNew = filesPublicados.data!;
          }
        }


        console.log("fetchFilesContext", "filesFILTER", filesNew.length, filesNew);

        setFiles(filesNew ?? []);
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

  const handlerPostNewFile = async (file: IFile) => { };

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
        filesFilterStatus: filesFilterStatus,
        setFilesFilterStatus: setFilesFilterStatus,
      }}
    >
      {children}
    </BibliotecaContext.Provider>
  );
};

export { BibliotecaProvider, BibliotecaContext };
