
// ============================================================
// MULTER + CRYPTO
// File Upload Storage Configuration
// ============================================================


// ------------------------------------------------------------
// 1. IMPORT MODULES
// ------------------------------------------------------------

// Node's built-in crypto module.
//
// We use it to generate cryptographically secure random bytes.
//
// IMPORTANT:
// crypto is NOT a third-party package.
// It comes with Node.js.
const crypto = require('crypto')


// Multer is a third-party middleware used for handling
// multipart/form-data.
//
// multipart/form-data is the encoding normally used when
// uploading files from an HTML form.
//
// Example:
// <form enctype="multipart/form-data">
//     <input type="file" name="profile">
// </form>
const multer = require('multer')


// ============================================================
// 2. CONFIGURE MULTER STORAGE
// ============================================================

// multer.diskStorage() creates a storage engine.
//
// We are telling Multer:
//
// "Store uploaded files on the server's filesystem."
//
// diskStorage() accepts an object containing functions that
// determine:
// 1. WHERE the file should be stored
// 2. WHAT the file should be called
const storage = multer.diskStorage({


  // ==========================================================
  // 3. DESTINATION
  // ==========================================================

  // destination() decides WHERE the uploaded file is stored.
  //
  // Parameters:
  //
  // req  -> Express request object
  // file -> information about the uploaded file
  // cb   -> callback function provided by Multer
  //
  destination: function (req, file, cb) {

    // cb() means "callback".
    //
    // General form:
    //
    // cb(error, result)
    //
    // null means:
    // "There is no error."
    //
    // '/tmp/my-uploads' means:
    // "Store the file inside this directory."
    cb(null, '/tmp/my-uploads')
  },


  // ==========================================================
  // 4. FILENAME
  // ==========================================================

  // filename() decides WHAT NAME the uploaded file will have.
  //
  // We don't simply use the original filename.
  //
  // Instead, we generate a random filename.
  filename: function (req, file, cb) {


    // --------------------------------------------------------
    // 5. GENERATE RANDOM BYTES
    // --------------------------------------------------------

    // crypto.randomBytes(16)
    //
    // Generates 16 cryptographically secure random bytes.
    //
    // 1 byte = 8 bits
    //
    // Therefore:
    //
    // 16 bytes × 8
    // = 128 bits
    //
    // 128 bits of randomness makes collisions extremely
    // unlikely.
    //
    // randomBytes() uses Node's cryptographically secure
    // random number generation facilities.
    crypto.randomBytes(16, function (err, raw) {


      // ------------------------------------------------------
      // 6. ERROR HANDLING
      // ------------------------------------------------------

      // If crypto.randomBytes() fails, `err` will contain
      // information about the error.
      //
      // We pass that error to Multer.
      //
      // return is important here because it stops execution
      // of the rest of this callback.
      if (err) return cb(err)


      // ------------------------------------------------------
      // 7. CONVERT RANDOM BYTES TO HEX
      // ------------------------------------------------------

      // raw is a Node.js Buffer.
      //
      // Example conceptually:
      //
      // raw
      // ↓
      // <Buffer 7f 3a 91 c4 ...>
      //
      // We convert the Buffer into a hexadecimal string.
      //
      // .toString('hex')
      //
      // Example:
      //
      // Buffer
      // ↓
      // "7f3a91c4e8b21d..."
      //
      // 16 bytes produce 32 hexadecimal characters because
      // every byte requires 2 hexadecimal characters.
      const randomName = raw.toString('hex')


      // ------------------------------------------------------
      // 8. CREATE FINAL FILENAME
      // ------------------------------------------------------

      // file.fieldname is the name of the form field.
      //
      // Example HTML:
      //
      // <input type="file" name="profile">
      //
      // Then:
      //
      // file.fieldname
      // ↓
      // "profile"
      //
      // We combine it with our random string.
      //
      // Example:
      //
      // profile + "-" + 7f3a91c4...
      //
      // Result:
      //
      // profile-7f3a91c4e8b21d...
      const filename = file.fieldname + '-' + randomName


      // ------------------------------------------------------
      // 9. GIVE FILENAME TO MULTER
      // ------------------------------------------------------

      // Tell Multer:
      //
      // "There was no error, and this is the filename
      // that you should use."
      //
      // cb(error, filename)
      //
      // null = no error
      cb(null, filename)
    })
  }
})


// ============================================================
// 10. CREATE MULTER UPLOAD MIDDLEWARE
// ============================================================

// Now we create the actual Multer middleware.
//
// storage: storage
//
// tells Multer to use the storage configuration we created
// above.
const upload = multer({
  storage: storage
})


// ============================================================
// HOW THIS WORKS
// ============================================================
//
// Client uploads:
//
//     photo.jpg
//
//             ↓
//
//      multipart/form-data
//
//             ↓
//
//        Express request
//
//             ↓
//
//          Multer
//
//             ↓
//
//     diskStorage engine
//             │
//             ├───────────────┐
//             ↓               ↓
//       destination()      filename()
//             ↓               ↓
//    /tmp/my-uploads      crypto.randomBytes(16)
//                             ↓
//                       random Buffer
//                             ↓
//                       .toString('hex')
//                             ↓
//                    "7f3a91c4e8..."
//                             ↓
//                 "profile-7f3a91c4..."
//                             │
//                             ↓
//                    File saved on disk
//
// ============================================================


// ============================================================
// IMPORTANT CONCEPT: FIELDNAME vs ORIGINALNAME
// ============================================================
//
// Suppose the user uploads:
//
//     my-vacation-photo.jpg
//
// and the HTML field is:
//
//     <input type="file" name="profile">
//
// Then:
//
// file.originalname
//     ↓
// "my-vacation-photo.jpg"
//
// file.fieldname
//     ↓
// "profile"
//
// Our code uses:
//
// file.fieldname
//
// NOT:
//
// file.originalname
//
// Therefore the final filename might be:
//
// profile-7f3a91c4e8b21d...
//
// Notice that ".jpg" is not included.
//
// ============================================================


// ============================================================
// WHY GENERATE A RANDOM FILENAME?
// ============================================================
//
// Imagine 100 users upload:
//
//     profile.jpg
//
// If we simply stored:
//
//     profile.jpg
//
// every upload would overwrite the previous file.
//
// BAD:
//
// user 1 → profile.jpg
// user 2 → profile.jpg
// user 3 → profile.jpg
//
//
//
// Instead:
//
// user 1 → profile-a81f3c....
// user 2 → profile-93bd21....
// user 3 → profile-f7218a....
//
//
//
// Now the filenames are different.
//
// This prevents filename collisions.
//
// ============================================================


// ============================================================
// WHY crypto.randomBytes()?
// ============================================================
//
// We could technically use:
//
// Math.random()
//
// But Math.random() is NOT designed for security.
//
// For identifiers where unpredictability matters, use:
//
// crypto.randomBytes()
//
// Node's crypto module provides cryptographically secure
// random number generation.
//
//
//
// Math.random()
//     ↓
// General-purpose pseudo-random numbers
//
// crypto.randomBytes()
//     ↓
// Cryptographically secure random bytes
//
// ============================================================


// ============================================================
// IMPORTANT: RANDOM ≠ ENCRYPTION
// ============================================================
//
// This code:
//
// crypto.randomBytes(16)
//
// DOES NOT encrypt the file.
//
// It only generates a random identifier.
//
//
//
// Encryption:
//
// plaintext
//     ↓
// encryption algorithm + key
//     ↓
// ciphertext
//
//
// Random filename:
//
// random bytes
//     ↓
// random identifier
//     ↓
// filename
//
//
// These are completely different concepts.
//
// ============================================================


// ============================================================
// WHAT IS A BUFFER?
// ============================================================
//
// randomBytes() returns a Buffer.
//
// A Buffer is Node.js's way of representing raw binary data
// in memory.
//
// Example:
//
// const data = crypto.randomBytes(4)
//
// You might conceptually have:
//
// <Buffer 4a 7f 21 c8>
//
// These are raw bytes.
//
// When we call:
//
// data.toString('hex')
//
// Node converts those binary bytes into readable text:
//
// "4a7f21c8"
//
// ============================================================


// ============================================================
// WHY HEX?
// ============================================================
//
// Binary data isn't convenient to use directly as a filename.
//
// Hexadecimal provides a text representation.
//
// One byte:
//
// 10101111
//
// becomes:
//
// af
//
// Therefore:
//
// 16 bytes
// ↓
// 32 hex characters
//
// Example:
//
// 7f3a91c4e8b21d0a5f...
//
// ============================================================


// ============================================================
// CALLBACK PATTERN
// ============================================================
//
// Multer expects these functions to call a callback.
//
// Example:
//
// cb(null, '/tmp/my-uploads')
//
// means:
//
// "I finished successfully.
//  Here is the destination."
//
//
// And:
//
// cb(null, filename)
//
// means:
//
// "I finished successfully.
//  Here is the filename."
//
//
// If something fails:
//
// cb(err)
//
// means:
//
// "Something went wrong."
//
// This is a common Node.js callback pattern.
//
// ============================================================


// ============================================================
// WHY `return cb(err)`?
// ============================================================
//
// Consider:
//
// if (err) cb(err)
//
// cb(null, filename)
//
// If an error occurs, the first callback runs.
//
// But execution could continue.
//
// Using:
//
// if (err) return cb(err)
//
// does two things:
//
// 1. Sends the error to Multer
// 2. Immediately exits the callback
//
// Therefore:
//
// if error
//     ↓
// cb(err)
//     ↓
// return
//     ↓
// STOP
//
// ============================================================


// ============================================================
// HOW YOU WOULD USE `upload`
// ============================================================
//
// The `upload` variable is middleware.
//
// For example:
//
// app.post(
//   '/upload',
//   upload.single('profile'),
//   (req, res) => {
//
//     console.log(req.file)
//
//     res.send('File uploaded!')
//   }
// )
//
//
//
// upload.single('profile')
//
// means:
//
// "Expect exactly one uploaded file whose form field
// is called `profile`."
//
// ============================================================


// ============================================================
// WHAT DOES req.file CONTAIN?
// ============================================================
//
// After Multer processes the upload:
//
// req.file
//
// contains metadata about the uploaded file.
//
// For example:
//
// req.file = {
//   fieldname: 'profile',
//   originalname: 'photo.jpg',
//   encoding: '7bit',
//   mimetype: 'image/jpeg',
//   destination: '/tmp/my-uploads',
//   filename: 'profile-7f3a91c4...',
//   path: '/tmp/my-uploads/profile-7f3a91c4...',
//   size: 245678
// }
//
//
//
// The exact object can contain additional properties depending
// on the storage engine and Multer version.
//
// ============================================================


// ============================================================
// COMPLETE MENTAL MODEL
// ============================================================
//
// Multer answers:
//
// "How do I receive files from an HTTP request?"
//
// diskStorage answers:
//
// "Where do I put those files?"
//
// destination answers:
//
// "Which directory?"
//
// filename answers:
//
// "What name should the file have?"
//
// crypto.randomBytes answers:
//
// "How do I generate an unpredictable random identifier?"
//
// Buffer answers:
//
// "How does Node represent raw binary data?"
//
// callback answers:
//
// "How do I tell Multer that this asynchronous operation
// finished?"
//
// ============================================================
