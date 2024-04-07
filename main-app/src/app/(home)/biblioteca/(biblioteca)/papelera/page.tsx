"use client";

import { FileBrowser } from "../../_components/file-browser";

export default function TrashCanFilesPage() {
  return (
    <div>
      <FileBrowser title="Papelera" deletedOnly />
    </div>
  );
}
