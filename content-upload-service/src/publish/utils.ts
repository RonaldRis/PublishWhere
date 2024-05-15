import axios from "axios";
import { Publication } from "shared-lib";
import fs from "fs";
import { IFile } from "shared-lib/models/file.model";



export const updateSocialMediaPost = async (publicationId: string, socialMediaId: string, newIdPublicacion: string, newUrlPost: string) => {
    try {
      await Publication.updateOne(
        { _id: publicationId, 'socialMedia.socialMedia': socialMediaId },
        {
          $set: {
            'socialMedia.$[elem].idPublicacionOnProvider': newIdPublicacion,
            'socialMedia.$[elem].urlPost': newUrlPost
          }
        },
        {
          arrayFilters: [{ 'elem.socialMedia': socialMediaId }]
        }
      );
      console.log('Update successful');
    } catch (error) {
      console.error('Error updating publication:', error);
    }
  };
  


  
export async function downloadMultimediaFileFromS3(fileDb: IFile): Promise<string | undefined> {
  try {
    const urlS3Image = "https://publishwhere-tfg.s3.eu-west-3.amazonaws.com/" + fileDb.bucketFileName;

    console.log("urlS3Image", urlS3Image);
    // Download the image
    const response = await axios({
      url: urlS3Image,
      method: 'GET',
      responseType: 'stream',
    });

    // Create a unique filename
    const filename = `./tmp/${Date.now()+fileDb.bucketFileName}`;

    // Write the image to a file
    console.log("Write the image to a file");
    const writer = fs.createWriteStream(filename);
    response.data.pipe(writer);

    // Wait for the file to finish writing
    console.log("Wait for the file to finish writing");
    await new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });

    console.log("file written");

    return filename;

   

  } catch (error) {
    console.error("Error uploading file to Twitter", error);
    return undefined;
  }

}



export async function deleteMultimediaFileFromS3(filename: string) {
  try {
    

    // Delete the file
    fs.unlink(filename, (error) => {

      console.log("error", error);
    });
    console.log("file deleted");


  } catch (error) {
    console.error("Error uploading file to Twitter", error);
    return undefined;
  }

}

