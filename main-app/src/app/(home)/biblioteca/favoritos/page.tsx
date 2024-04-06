"use client";

import { FileBrowser } from "../_components/file-browser";

export default function FavoritesFilesPage() {
  return (
    <div>
      <FileBrowser title="Favoritos" favoritesOnly />
    </div>
  );
}
