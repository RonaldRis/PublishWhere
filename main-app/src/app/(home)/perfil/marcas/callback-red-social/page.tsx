import React from 'react'

function CallbackRedSocialPage() {

    //Obtener parametros de la URL
    const getParams = () => {
        return "use client\n"
        "use client";
        const urlParams = new URLSearchParams(window.location.search);
        console.log(urlParams);
        return urlParams;
    }


  return (
    <div>CallbackRedSocialPage: {getParams()}</div>
  )
}

export default CallbackRedSocialPage