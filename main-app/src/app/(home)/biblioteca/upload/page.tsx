
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import CreatePostForm from "../../../../components/files/create-post-form"
import { authOptions } from "@/lib/auth"

// export const runtime = 'edge'

export default async function Create() {
  const session = await getServerSession(authOptions)
  console.log("SESION: ", session)
  if (!session?.user) {
    redirect("/api/auth/signin?callbackUrl=/create")
  }

  return <CreatePostForm user={session.user} />
}
