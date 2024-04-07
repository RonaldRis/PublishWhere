
"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";


import { getServerSessionAuth } from "@/lib/auth";
import { postCreateFileAction } from '@/lib/actions/files.actions';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';



export async function createPost({
  content,
  fileId,
}: {
  content: string;
  fileId?: number;
}): Promise<{ failure: string } | undefined> {
  const session = await getServerSessionAuth();

  if (!session) {
    return { failure: "not authenticated" };
  }

  if (content.length < 1) {
    return { failure: "not enough content" };
  }

  if (fileId) {
    const result = await db
      .select({ id: mediaTable.id })
      .from(mediaTable)
      .where(
        and(eq(mediaTable.id, fileId), eq(mediaTable.userId, session.user.id))
      )
      .then((rows) => rows[0]);

    if (!result) {
      return { failure: "image not found" };
    }
  }

  const results = await db
    .insert(postsTable)
    .values({
      content,
      userId: session.user.id,
    })
    .returning();

  if (fileId) {
    await db
      .update(mediaTable)
      .set({ postId: results[0].id })
      .where(eq(mediaTable.id, fileId));
  }

  revalidatePath("/");
  redirect("/");
}




