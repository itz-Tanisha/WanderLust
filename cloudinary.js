import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

// UPLOAD FUNCTION 

export function uploadToCloudinary(buffer){

    return new Promise((resolve, reject) => {

        const uploadStream = cloudinary.uploader.upload_stream(
            { 
                folder : "wanderlust",
                allowed_formats: ["jpg", "jpeg", "png"]
            },
            (error, result) => {
                if(error) reject(error);
                else resolve(result);
            }
        );

        streamifier.createReadStream(buffer).pipe(uploadStream);
    });
}