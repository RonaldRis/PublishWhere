"use client";
import { FileBrowser } from "../../_components/file-browser";
import { useEffect, useState } from "react";

export default function FilesPage() {
  /// EVITA ERRORES DE HIDRATACIÓN
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  if (!isClient) {
    return <div className="w-full h-full flex items-center justify-center"><p>
      Cargando...
    </p></div>;
  }

  return <FileBrowser title="Tus archivos" />;
}
