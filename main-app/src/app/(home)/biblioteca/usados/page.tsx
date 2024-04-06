"use client";

import { FileBrowser } from "../_components/file-browser";

export default function UsedFilesPage() {
  return (
    <div>
      <FileBrowser title="Usados" usedOnly />
    </div>
  );
}
