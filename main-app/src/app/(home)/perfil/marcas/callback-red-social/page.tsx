"use client";

import { MisMarcasContext } from "@/contexts/MisMarcasContext";
import { postOauthDataAction } from "@/lib/actions/oauth.actions";
import { IOauthPost } from "@/lib/models/Oauth.model";
import { el } from "date-fns/locale";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useContext, useEffect, useMemo } from "react";
import { toast } from "sonner";

export default function CallbackRedSocialPage() {
  const { data: session } = useSession();
  const userId: string = session?.user.id as string;

  const { marcaGlobalSeleccionada } = useContext(MisMarcasContext);
  const marcaId = marcaGlobalSeleccionada?._id as string;

  const searchParamsNext = useSearchParams();
  console.log(searchParamsNext);

  // Obtiene los parámetros de consulta
  const provider = searchParamsNext.get("provider")!;
  const oauthData = useMemo(() => {
    let oauthData: IOauthPost | undefined = undefined;
    oauthData = {
      provider: "null",
    };
    try {
      if (provider === "youtube") {
        const expires_in_seconds =
          Number(searchParamsNext.get("expires_in")) ?? 0;
        var fechaExp = new Date();
        fechaExp.setSeconds(fechaExp.getSeconds() + expires_in_seconds - 5); ///5 Segundo relativo al timepo que tarda esto en ejecutarse

        oauthData = {
          access_token: searchParamsNext.get("access_token")!,
          expires_in: fechaExp,
          refresh_token: searchParamsNext.get("refresh_token")!,
          scope: searchParamsNext.get("scope")!,
          token_type: searchParamsNext.get("token_type")!,
          provider: provider,
        };
      }
    } catch (error) {
      console.error("Error fetching channel data:", error);
      //REDIRECT A OTRA PAGINA ?? alerta
      oauthData.provider = "null";
    }
    return oauthData;
  }, [provider, searchParamsNext]);

  console.log(oauthData);

  // Llama a la función que obtiene los datos del canal de Youtube
  useEffect(() => {
    const postData = async (
      idMarca: string,
      userId: string,
      data: IOauthPost
    ) => {
      const response = await postOauthDataAction({
        marcaId: idMarca,
        userId: userId,
        oauthData: data,
      });
      console.log(response);
      if(response.isOk){
        toast.success(response.message!); 
      }
      else{
        toast.error("No se pudo agregar el canal de youtube");
        toast.error(response.message!);
      }

      //REDIRECT A OTRA PAGINA
    };
    if (marcaId && userId && oauthData) {
      postData(marcaId, userId, oauthData);
    } else {
      console.log("No se pudo obtener el canal de youtube");
    }
  }, [oauthData, marcaId, userId]);

  return (
    <div className="containser mx-auto">
      <h1>Callback</h1>

      {/* Renderiza los parámetros de consulta para verificar que se están recibiendo correctamente */}
      {/* <p>Token: {searchParams.get('token')}</p> */}
    </div>
  );
}
