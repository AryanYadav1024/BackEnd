// ============================================================
// CLOUDINARY FILE UPLOAD
// ============================================================
//
// Flow:
//
// Client
//    ↓
// Express
//    ↓
// Multer
//    ↓
// Temporary file on local server
//    ↓
// uploadOnCloudinary()
//    ↓
// Cloudinary
//    ↓
// Cloudinary URL
//    ↓
// Save URL in database
//    ↓
// Delete temporary local file
//
// ============================================================


// ============================================================
// 1. IMPORT CLOUDINARY
// ============================================================

// `cloudinary` is a third-party package.
//
// `v2` is the version of Cloudinary's API that we are using.
//
// `as cloudinary` gives the imported `v2` object the local
// variable name `cloudinary`.
import { v2 as cloudinary } from 'cloudinary'


// ============================================================
// 2. IMPORT FILE SYSTEM MODULE
// ============================================================

// `fs` = File System
//
// This is a built-in Node.js module.
//
// It allows Node.js to work with files and directories.
//
// We use it here to delete the temporary file after
// uploading it to Cloudinary.
import fs from 'fs'


// ============================================================
// 3. IMPORT DOTENV
// ============================================================

// `dotenv` loads variables from the `.env` file into:
//
// process.env
//
// Example `.env`:
//
// CLOUDINARY_CLOUD_NAME=xxxxx
// CLOUDINARY_API_KEY=xxxxx
// CLOUDINARY_API_SECRET=xxxxx
import dotenv from 'dotenv'


// ============================================================
// 4. LOAD ENVIRONMENT VARIABLES
// ============================================================

// Reads the `.env` file and loads its values into:
//
// process.env
//
// After this:
//
// process.env.CLOUDINARY_CLOUD_NAME
// process.env.CLOUDINARY_API_KEY
// process.env.CLOUDINARY_API_SECRET
//
// can be accessed by our application.
dotenv.config()


// ============================================================
// 5. CONFIGURE CLOUDINARY
// ============================================================

// We provide Cloudinary with the credentials required
// to authenticate our requests.
//
// IMPORTANT:
// Never hardcode the API secret directly in the source code.
//
// Instead, keep it inside `.env`.
cloudinary.config({

    // Cloudinary account / cloud name
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,

    // Cloudinary API key
    api_key: process.env.CLOUDINARY_API_KEY,

    // Cloudinary API secret
    //
    // This is sensitive information.
    // NEVER expose this to the frontend.
    api_secret: process.env.CLOUDINARY_API_SECRET
})


// ============================================================
// 6. CREATE CLOUDINARY UPLOAD FUNCTION
// ============================================================

// `async` means this function can use `await`.
//
// `localFilePath` is the path of the file stored temporarily
// on our local server.
//
// Example:
//
// localFilePath =
// "/tmp/my-uploads/profile-abc123"
//
// The function will:
//
// 1. Check if a file path exists
// 2. Upload the file to Cloudinary
// 3. Receive Cloudinary's response
// 4. Return the response
//
// If the upload fails:
//
// 1. Delete the temporary local file
// 2. Return null
const uploadOnCloudinary = async (localFilePath) => {

    try {

        // ====================================================
        // 7. CHECK FILE PATH
        // ====================================================

        // If no file path was provided, there is nothing
        // to upload.
        //
        // `!localFilePath` checks for values such as:
        //
        // undefined
        // null
        // ""
        // false
        //
        // In those cases, return null.
        if (!localFilePath) return null


        // ====================================================
        // 8. UPLOAD FILE TO CLOUDINARY
        // ====================================================

        // `cloudinary.uploader.upload()` uploads the file
        // located at `localFilePath`.
        //
        // This is an asynchronous network operation.
        //
        // Therefore it returns a Promise.
        //
        // `await` waits for that Promise to resolve before
        // continuing this function.
        const res = await cloudinary.uploader.upload(
            localFilePath,

            {
                // `resource_type: "auto"` tells Cloudinary
                // to automatically determine the resource type.
                //
                // It can handle different types of resources,
                // such as images and videos.
                resource_type: "auto"
            }
        )


        // ====================================================
        // 9. UPLOAD SUCCESSFUL
        // ====================================================

        // Cloudinary returns an object containing information
        // about the uploaded file.
        //
        // `res.url` contains the URL of the uploaded resource.
        console.log("Uploaded successfully", res.url)


        // Return the complete Cloudinary response.
        //
        // The caller can then access:
        //
        // res.url
        // res.secure_url
        // res.public_id
        // res.resource_type
        // res.format
        // res.bytes
        // etc.
        return res


    } catch (error) {

        // ====================================================
        // 10. UPLOAD FAILED
        // ====================================================

        // If the Cloudinary upload fails, execution jumps
        // from the `try` block to the `catch` block.
        //
        // The file was temporarily stored on our server,
        // so we should remove it if the upload failed.
        //
        // Otherwise unnecessary files would keep accumulating
        // on our server's disk.
        fs.unlinkSync(localFilePath)


        // Return null to indicate that the upload failed.
        return null
    }
}


// ============================================================
// 11. EXPORT FUNCTION
// ============================================================

// Export the function so other files can use it.
//
// Example:
//
// import { uploadOnCloudinary } from "./cloudinary.js"
//
// Then:
//
// const response = await uploadOnCloudinary(filePath)
export { uploadOnCloudinary }


// ============================================================
// IMPORTANT CONCEPTS
// ============================================================
//
// 1. `dotenv`
//    Loads environment variables from `.env`.
//
// 2. `process.env`
//    Provides access to environment variables.
//
// 3. `cloudinary.config()`
//    Configures/authenticates the Cloudinary SDK.
//
// 4. `cloudinary.uploader.upload()`
//    Uploads a local file to Cloudinary.
//
// 5. `async/await`
//    Handles the asynchronous upload operation.
//
// 6. `fs.unlinkSync()`
//    Deletes the temporary local file.
//
// 7. `res`
//    Contains Cloudinary's response and metadata.
//
// 8. `res.url`
//    URL of the uploaded resource.
//
// ============================================================


// ============================================================
// COMPLETE FLOW
// ============================================================
//
// Suppose the user uploads:
//
//     profile.jpg
//
//                 ↓
//
//              Multer
//
//                 ↓
//
//     /tmp/my-uploads/profile-abc123
//
//                 ↓
//
//     uploadOnCloudinary(localFilePath)
//
//                 ↓
//
//     cloudinary.uploader.upload()
//
//                 ↓
//
//            Cloudinary
//
//                 ↓
//
//       Cloudinary response
//
//                 ↓
//
//          res.secure_url
//
//                 ↓
//
//        Save URL in database
//
//                 ↓
//
//     Delete temporary local file
//
// ============================================================


// ============================================================
// WHY DO WE NEED A TEMPORARY LOCAL FILE?
// ============================================================
//
// Multer can receive the uploaded file and save it locally.
//
// Then we give that local file path to Cloudinary.
//
// So the local file acts as temporary storage:
//
// HTTP request
//      ↓
//    Multer
//      ↓
// Local temporary file
//      ↓
// Cloudinary
//      ↓
// Permanent cloud storage
//
// After Cloudinary has the file, the local copy is no longer
// necessary.
//
// ============================================================


// ============================================================
// IMPORTANT: CLOUDINARY DOES NOT RETURN THE FILE ITSELF
// ============================================================
//
// Cloudinary stores the file and returns metadata.
//
// Example:
//
// res = {
//     public_id: "...",
//     resource_type: "image",
//     secure_url: "https://...",
//     format: "jpg",
//     bytes: 245678
// }
//
// We normally store the Cloudinary URL or public_id
// in our database instead of storing the actual image.
//
// Example database:
//
// {
//     username: "Aryan",
//     avatar: "https://res.cloudinary.com/..."
// }
//
// ============================================================


// ============================================================
// WHY USE ENVIRONMENT VARIABLES?
// ============================================================
//
// DON'T DO THIS:
//
// cloudinary.config({
//     cloud_name: "my-cloud",
//     api_key: "123456",
//     api_secret: "my-secret"
// })
//
// Instead:
//
// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET
// })
//
// And store the actual values in `.env`.
//
// `.env` should be added to `.gitignore`.
//
// This prevents sensitive credentials from accidentally
// being committed to GitHub.
// ============================================================


// ============================================================
// RANDOM IMPORTANT POINT
// ============================================================
//
// `cloudinary.uploader.upload()`
//
// is a NETWORK operation.
//
// The file travels:
//
// Your server
//      ↓
// Internet
//      ↓
// Cloudinary servers
//
// Therefore the operation can take time or fail due to:
//
// - Network failure
// - Invalid credentials
// - Cloudinary error
// - Invalid file
// - File too large
//
// That's why we use:
//
// async/await + try/catch
//
// ============================================================