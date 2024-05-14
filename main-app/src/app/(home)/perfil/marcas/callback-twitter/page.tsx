"use client";

import { MisMarcasContext } from "@/contexts/MisMarcasContext";
import { postOauthDataActionTwitter, postOauthDataActionYoutube } from "@/lib/actions/oauth.actions";
import { IOauthPost } from "shared-lib/models/Oauth.model";
import { ISocialMediaAccountPost } from "shared-lib/models/socialMediaAccount.model";
import { el } from "date-fns/locale";
import { LoaderCircleIcon } from "lucide-react";
import { set } from "mongoose";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useContext, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

export default function CallbackRedSocialPage() {
  const { data: session } = useSession();
  const { marcaGlobalSeleccionada, fetchRefreshMarcas, updateMarcaGlobal } =
    useContext(MisMarcasContext);
  const marcaId = marcaGlobalSeleccionada?._id as string;
  const router = useRouter();
  const searchParamsNext = useSearchParams();

  // Llama a la función que obtiene los datos del canal de Youtube
  useEffect(() => {
    const saveData = async () => {
      const userId: string = session?.user.id as string;
      const marcaId:string = marcaGlobalSeleccionada?._id as string;

      // searchParamsNext.forEach((value, key) => {
      //   console.log(key, value);
      // });


      //Convierte el string 'expires_in' a Fecha
      const expires_in = searchParamsNext.get("expires_in")!;
      const expiresInNumber = Number(expires_in);
      const now = new Date();
      const expiryDate = new Date(now.getTime() + expiresInNumber);



      let oauthData: IOauthPost = {
        provider: "twitter",
        access_token: searchParamsNext.get("access_token")!,
        refresh_token: searchParamsNext.get("refresh_token")!,
        scope: searchParamsNext.get("scope")!,
        token_type: searchParamsNext.get("token_type")!,
        expires_in: expiryDate, ///Nunca prácticamente, su valor es muy alto
      };
      

      let socialData: ISocialMediaAccountPost = {
        _idOnProvider: searchParamsNext.get("_idOnProvider")!,
        username: searchParamsNext.get("username")!,
        name: searchParamsNext.get("name")!,
        thumbnail: searchParamsNext.get("thumbnail")!,
        provider: searchParamsNext.get("provider")!, //twitter
        userCreator: userId,
        urlPage: searchParamsNext.get("urlPage")!,
        kind: "user",
        oauthID: "",
      };



      const response = await postOauthDataActionTwitter({
        marcaId: marcaId,
        userId: userId,
        socialMediaData: socialData,
        oauthData: oauthData,
      });

      if (response.isOk) {
        toast.success(response.message!);
        await fetchRefreshMarcas();
        await updateMarcaGlobal(marcaId);

        //Redirecciono a la pagina de marcas
      } else {
        toast.error(response.message!);
      }

      router.push("/perfil/marcas");

    };

    saveData();
  }, []);

  return (
    <div className="w-full h-full flex justify-center items-center">

      <LoaderCircleIcon className="w-16 h-16 animate-spin" />

      {/* Renderiza los parámetros de consulta para verificar que se están recibiendo correctamente */}
      {/* <p>Token: {searchParams.get('token')}</p> */}
    </div>
  );
}
