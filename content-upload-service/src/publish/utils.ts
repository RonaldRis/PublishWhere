import { Publication } from "shared-lib";



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
  