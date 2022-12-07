const multer = require("multer");
const fs = require("fs");
const path = require("path");
require("dotenv").config();
const imageValidation = require('../validators/imageValidation')
var IMAGE_FOLDER = '/src/upload/image'
console.log(process.cwd())
var currentImagePath = path.join(process.cwd(),IMAGE_FOLDER)
console.log(currentImagePath)
const storage = multer.diskStorage({ 
    destination:(req,file,callback)=>{ 
    
        callback(null,currentImagePath);
    },
    
    filename:(req,file,callback)=>{ 
      //console.log(file)
       const fileExt = path.extname(file.originalname); 
       const filename = file.originalname.replace(fileExt,"").toLowerCase().split(" ").join("-")+"-"+Date.now();

       callback(null,filename+fileExt);

    }
})

var upload = multer({
    //dest:"./uploads" //dest - Where to store the files
  storage: storage, 
  limits: {
    fileSize: 1000000, // Limits of the uploaded data
  },
  fileFilter:imageValidation 
}).single('profile')

module.exports = upload;