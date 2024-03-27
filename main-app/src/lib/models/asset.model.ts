import mongoose from 'mongoose';

const assetSchema = new mongoose.Schema({
    uid: { type: String, required: true },
    contentType: { type: String, required: true },
    createdByIdentityId: { type: String, required: true },
    creationDate: { type: Date, required: true },
    deleted: { type: Boolean, required: true },
    extension: { type: String, required: true },
    fileSize: { type: Number, required: true },
    folderPath: { type: String, required: true },
    mediaHeight: { type: Number, required: true },
    mediaWidth: { type: Number, required: true },
    mediaUrl: { type: String, required: true },
    name: { type: String, required: true },
    thumbnailUrl: { type: String, required: true },
    type: { type: String, required: true },
    videoFormatValid: { type: Boolean, required: true },
});



const Asset = mongoose.model('Asset', assetSchema);

export default Asset;



//SAMPLE DATA
// {
//     "assets": [
//         {
//             "uid": "organization_451387_workspace_351291_assets_53wxUlBydE1fmf8h43oyUU.mp4",
//             "contentType": "video",
//             "createdByIdentityId": "141c90aa008c0d1c04d17952805412cb",
//             "creationDate": "2024-03-24T23:29:48.162Z",
//             "deleted": false,
//             "extension": "mp4",
//             "fileSize": 2.9425427E7,
//             "folderPath": "/",
//             "mediaHeight": 1920.0,
//             "mediaWidth": 1080.0,
//             "mediaUrl": "https://s3.eu-west-1.amazonaws.com/files.library.agorapulse.com/organizations/451387/workspaces/351291/assets/organization_451387_workspace_351291_assets_53wxUlBydE1fmf8h43oyUU.mp4",
//             "name": "2",
//             "thumbnailUrl": "https://s3.eu-west-1.amazonaws.com/files.library.agorapulse.com/organizations/451387/workspaces/351291/thumbnails/organization_451387_workspace_351291_assets_53wxUlBydE1fmf8h43oyUU.png",
//             "type": "media",
//             "videoFormatValid": true
//         },
//         {
//             "uid": "organization_451387_workspace_351291_assets_73cjDUeVsr7hVjv5FHsxC9.jpg",
//             "contentType": "image",
//             "createdByIdentityId": "141c90aa008c0d1c04d17952805412cb",
//             "creationDate": "2024-03-24T23:27:57.552Z",
//             "deleted": false,
//             "extension": "jpg",
//             "fileSize": 148604.0,
//             "folderPath": "/",
//             "mediaHeight": 642.0,
//             "mediaWidth": 463.0,
//             "mediaUrl": "https://s3.eu-west-1.amazonaws.com/files.library.agorapulse.com/organizations/451387/workspaces/351291/assets/organization_451387_workspace_351291_assets_73cjDUeVsr7hVjv5FHsxC9.jpg",
//             "name": "806377ebe38b9fb111e470ea06b856363216fd2578e3e97993888b2f84b62f4f",
//             "thumbnailUrl": "https://s3.eu-west-1.amazonaws.com/files.library.agorapulse.com/organizations/451387/workspaces/351291/thumbnails/organization_451387_workspace_351291_assets_73cjDUeVsr7hVjv5FHsxC9.jpg",
//             "type": "media",
//             "videoFormatValid": true
//         }
//     ]
// }
