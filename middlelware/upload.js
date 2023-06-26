// import multer from "multer";
// import GridFsStorage from "multer-gridfs-storage";

// // const storage = multer.diskStorage({
// //    destination: (_, __, cb) => {
// //      cb(null, "src/assets/uploads");
// //    },
// //    filename: (_, file, cb) => {
// //      cb(null, file.originalname);
// //    },
// //  });

// //  const upload = multer({ storage });

// const storage = new GridFsStorage({
//   url: process.env.DB,
//   options: { userNewUrlParcer: true, useUnifieldTopology: true },
//   file: (req, file) => {
//     const match = ["image/png", "image/jpeg"];
//     if(match.indexOf(file.mimetype)=== -1){
//       const filename = `${Date.now()}-any-name-${file.originalname}`
//       return filename
//     }
//     return {
//       bucketName:"photos",
//       filename:`${Date.now()}-any-name-${file.originalname}`
//     }
//   },
// });

// export const upload = multer({storage})