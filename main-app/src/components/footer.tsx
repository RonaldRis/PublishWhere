import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (

    <footer className="bg-white rounded-lg shadow m-4 dark:bg-gray-800 bottom-0">
      <div className="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
        <Link href="/" className="hover:underline flex items-center">

          <Image
            src="/logotfg.png"
            alt="Kibo Logo"
            width={32}
            height={32}
          />
          <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2024 PublishWhere™. All Rights Reserved.

          </span>
        </Link>
        <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
          <li>
            <Link href="/terminos-servicio" className="hover:underline me-4 md:me-6">Términos y condiciones</Link>
          </li>
          <li>
            <Link href="/politica-privacidad" className="hover:underline me-4 md:me-6">Políticas de privacidad</Link>
          </li>
          {/* <li>
            <a href="#" className="hover:underline me-4 md:me-6">Licensing</a>
          </li>
          <li>
            <a href="#" className="hover:underline">Contact</a>
          </li> */}
        </ul>
      </div>
    </footer>
  );
}
