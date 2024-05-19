import { MongoDBAdapter } from '@auth/mongodb-adapter'
import { NextAuthOptions, Session, TokenSet, getServerSession } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import clientPromise, { connectToDB } from './mongoose'



///GOT FROM https://github.dev/joschan21/breadit 
export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise) as any,
  session: {
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  pages: {

    // signIn: '/sign-in',
  }, providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,

    })
  ],

  callbacks: {
    async session({ session, user, token, newSession }) {


      if (user) {
        session.user._id = user.id;
        session.user.id = user.id;
        session.user.email = user.email;
        session.user.name = user.name!;
        session.user.image = user.image!;
      }


      return session;
    },
    async signIn({ user, account, profile }) {

      return true
    },
    async redirect({ url, baseUrl }) {
      // Redirigir al calendario después de iniciar sesión
      return `${baseUrl}/calendario`;
    }

  },
};

export const getServerSessionAuth = () => getServerSession(authOptions);
