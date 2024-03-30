// INSTRUCCIONES:
//FILENAME: next-auth.d.ts
// Abre tu archivo tsconfig.json y AGREGA LO SIGUIENTE:
// "include": ["next-env.d.ts"],

// This file is used to extend the types of the NextAuth library
import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: string
      token: string
    } & DefaultSession["user"]
  }

  declare module 'next-auth/adapters' {
    interface AdapterUser extends IUser {
      id: string
      token: string


    }
  }
}



