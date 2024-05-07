"use client";
import { use } from "passport";
import React, { Suspense, useContext, useEffect } from "react";

function NuevaRedSocialPage() {


  useEffect(() => {
    if (typeof window !== 'undefined') {
      console.log("Nueva red social page supposed");
    }
  }, []);

  return <h1>Nueva red social page supposed</h1>;
}

export default NuevaRedSocialPage;
