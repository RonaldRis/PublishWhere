"use server"
import { fetchAllMarcasAction, fetchMarcaAction, deleteMarcaAction, deleteTeamMembersOnMarcaAction, fetchMisMarcasAction, postCrearMarcaAction, postNewTeamMembersOnMarcaAction, renameMarcaAction } from "./marcas.actions";
import { fetchAllUserAction, fetchUserAction, updateUserAction} from "./users.actions";

export const marcasActions = {
    fetchMarca: fetchMarcaAction,
    fetchAllMarcas: fetchAllMarcasAction,
    deleteMarca: deleteMarcaAction,
    deleteTeamMembersOnMarca: deleteTeamMembersOnMarcaAction,
    fetchMisMarcas: fetchMisMarcasAction,
    postCrearMarca: postCrearMarcaAction,
    postNewTeamMembersOnMarca: postNewTeamMembersOnMarcaAction,
    renameMarca: renameMarcaAction


};


export const usersActions = {
    fetchUser: fetchUserAction,
    fetchAllUser: fetchAllUserAction,
    updateUser: updateUserAction

};