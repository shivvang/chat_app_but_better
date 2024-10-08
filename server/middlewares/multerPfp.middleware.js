import multer from "multer";
//cb stands for callback function
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    //path to temporary storage
    cb(null, "./public/pfp");
  },
  filename: function (req, file, cb) {
    //save the file name as it is saved
    cb(null, file.originalname);
  },
});

export const uploadPfp = multer({ storage });
