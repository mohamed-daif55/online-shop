const multer = require("multer");
// specify storage image location and customize image name to prevent conflict
exports.fileStorage = multer.diskStorage({
    destination : (req, file, cb) => {
        cb(null, "images");
    },
    filename : (req, file, cb) =>{
        cb(null, Math.random() + "-" + Math.random() + "-" + file.originalname);
    }
});
// specify which type of images to be applied in the site
exports.fileFilter = (req, file, cb) => {
    if(file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg"){
        cb(null, true);
    }else{
        cb(null, false);
        console.log("wrong file type");
    }
};