"use server"
import { fetchAllMarcas, fetchMarca, deleteMarca, deleteTeamMembersOnMarca, fetchMisMarcas, postCrearMarca, postNewTeamMembersOnMarca, renameMarca } from "./marcas.actions";
import { fetchAllUser, fetchUser, updateUser} from "./users.actions";

export const marcasActions = {
    fetchMarca: fetchMarca,
    fetchAllMarcas: fetchAllMarcas,
    deleteMarca: deleteMarca,
    deleteTeamMembersOnMarca: deleteTeamMembersOnMarca,
    fetchMisMarcas: fetchMisMarcas,
    postCrearMarca: postCrearMarca,
    postNewTeamMembersOnMarca: postNewTeamMembersOnMarca,
    renameMarca: renameMarca


};


export const usersActions = {
    fetchUser: fetchUser,
    fetchAllUser: fetchAllUser,
    updateUser: updateUser

};