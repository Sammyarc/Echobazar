import multer from 'multer';
import storage, { profileStorage } from '../configs/cloudinary.js'; // Import the necessary storages

// Product upload configuration
const upload = multer({
    storage,
    limits: { fileSize: 3 * 1024 * 1024 }, // 3MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Not an image file! Please upload an image file'), false);
        }
    }
});

// Profile picture upload configuration
const uploadProfile = multer({
    storage: profileStorage,
    limits: { fileSize: 2 * 1024 * 1024 }, // Limit to 2MB for profile picture
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Not an image file! Please upload an image file'), false);
        }
    }
});

// Named exports for both configurations
export const uploadProducts = upload.array('files', 3);
export const uploadProfilePicture = uploadProfile.single('profileImage');
