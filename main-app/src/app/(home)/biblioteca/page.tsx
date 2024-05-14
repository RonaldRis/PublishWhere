"use client";
import { useEffect, useState } from 'react';
import { FileBrowser } from "./_components/file-browser";
import { useLocalStorage } from 'usehooks-ts';

function BibliotecaPage() {

  /// EVITA ERRORES DE HIDRATACIÓN
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  if (!isClient) {
    return <div>Loading...</div>;
  }

  // This will render on client-side
  return <FileBrowser title="Tus archivos" />;
}

export default BibliotecaPage;