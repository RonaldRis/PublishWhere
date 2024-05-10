"use client";

import { MisMarcasContext } from "@/contexts/MisMarcasContext";
import { postOauthDataActionYoutube } from "@/lib/actions/oauth.actions";
import { IOauthPost } from "@/lib/models/Oauth.model";
import { el } from "date-fns/locale";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useContext, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

export default function CallbackRedSocialPage() {
  const { data: session } = useSession();
  const userId: string = session?.user.id as string;

  const { marcaGlobalSeleccionada, fetchRefreshMarcas, updateMarcaGlobal } =
    useContext(MisMarcasContext);
  const marcaId = marcaGlobalSeleccionada?._id as string;

  const router = useRouter();

  const searchParamsNext = useSearchParams();

  // Obtiene los parámetros de consulta
  const provider = searchParamsNext.get("provider")!;

  // Llama a la función que obtiene los datos del canal de Youtube
  useEffect(() => {
    const saveData = async () => {
      let oauthData: IOauthPost = {
        provider: "null",
      };

      try {
        if (provider === "youtube") {
          const expires_in_seconds =
            Number(searchParamsNext.get("expires_in")) ?? 0;
          var fechaExp = new Date();
          fechaExp.setSeconds(fechaExp.getSeconds() + expires_in_seconds - 5); ///5 Segundo relativo al timepo que tarda esto en ejecutarse

          //TODO: IMPORTANTE! PROBLEMA DE FECHA DE EXPIRACION LAS HORAS NO SON LAS MISMAS. new Date() devuelve HORA DISTINTA A LA DE MI COMPUTADORA
          oauthData = {
            access_token: searchParamsNext.get("access_token")!,
            expires_in: fechaExp,
            refresh_token: searchParamsNext.get("refresh_token")!,
            scope: searchParamsNext.get("scope")!,
            token_type: searchParamsNext.get("token_type")!,
            provider: provider,
          };
        } else {
          oauthData.provider = "NINGUNO"; //TODO: MANEJAR ESTO
        }
      } catch (error) {
        console.error("Error fetching channel data:", error);
        //REDIRECT A OTRA PAGINA ?? alerta
        oauthData.provider = "null";
      }


      if (marcaId && userId && oauthData) {

        const response = await postOauthDataActionYoutube({
          marcaId: marcaGlobalSeleccionada?._id as string,
          userId: userId,
          oauthData: oauthData,
        });
        if (response.isOk) {
          toast.success(response.message!);
          await fetchRefreshMarcas();
          // await updateMarcaGlQWJLKMQL,´Ñobal();  //TODO: SHIT HAPPENS! Y NO SE ACTUALIZA LA MARCCA GLOBAL SELECCIONADA

          //Redirecciono a la pagina de marcas
          router.push("/perfil/marcas");
        } else {
          toast.error("No se pudo agregar el canal de youtube");
          toast.error(response.message!);
        }
      } else {
        console.log("No se pudo obtener el canal de youtube");
      }
    };

    saveData();
  }, []);

  return (
    <div className="containser mx-auto">
      <h1>Callback</h1>

      {/* Renderiza los parámetros de consulta para verificar que se están recibiendo correctamente */}
      {/* <p>Token: {searchParams.get('token')}</p> */}
    </div>
  );
}
