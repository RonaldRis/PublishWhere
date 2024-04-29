"use client";

import { MisMarcasContext } from "@/contexts/MisMarcasContext";
import { postOauthDataActionYoutube } from "@/lib/actions/oauth.actions";
import { IOauthPost } from "@/lib/models/Oauth.model";
import { el } from "date-fns/locale";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useContext, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

export default function CallbackRedSocialPage() {
  const { data: session } = useSession();
  const userId: string = session?.user.id as string;
  const [counterOnce, setCounterOnce] = useState(1);

  const { marcaGlobalSeleccionada, fetchRefreshMarcas } = useContext(MisMarcasContext);
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
        console.log("Expires in seconds: ", expires_in_seconds);
        var fechaExp = new Date();
        fechaExp.setSeconds(fechaExp.getSeconds() + expires_in_seconds - 5); ///5 Segundo relativo al timepo que tarda esto en ejecutarse

        //TODO: IMPORTANTE! PROBLEMA DE FECHA DE EXPIRACION LAS HORAS NO SON LAS MISMAS. new Date() devuelve HORA DISTINTA A LA DE MI COMPUTADORA
        console.log("Fecha actual: ", new Date());
        console.log("Fecha de expiración: ", fechaExp);
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
      const response = await postOauthDataActionYoutube({
        marcaId: idMarca,
        userId: userId,
        oauthData: data,
      });
      console.log(response);
      if (response.isOk) {

        toast.success(response.message!);
        await fetchRefreshMarcas();
      } else {
        toast.error("No se pudo agregar el canal de youtube");
        toast.error(response.message!);
      }

      //REDIRECT A OTRA PAGINA
    };
    if (marcaId && userId && oauthData && counterOnce > 0 ) {
      console.log("CounterOnce: ", counterOnce)
      setCounterOnce(0);
      console.log("Posteando data");
      postData(marcaId, userId, oauthData);
    } else {
      console.log("No se pudo obtener el canal de youtube");
    }
  }, [oauthData, marcaId, userId, counterOnce, fetchRefreshMarcas]);

  return (
    <div className="containser mx-auto">
      <h1>Callback</h1>

      {/* Renderiza los parámetros de consulta para verificar que se están recibiendo correctamente */}
      {/* <p>Token: {searchParams.get('token')}</p> */}
    </div>
  );
}
