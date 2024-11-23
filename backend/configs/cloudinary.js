import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'products',
        allowed_formats: ['jpg', 'png'],
    },
});

// Storage configuration for profile pictures
const profileStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'profile_pictures', // A separate folder for profile pictures
        allowed_formats: ['jpg', 'jpeg', 'png'], // Only allow specific formats
    },
});

export { profileStorage };
export default storage;

