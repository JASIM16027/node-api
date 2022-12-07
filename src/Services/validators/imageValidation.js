const multer = require("multer");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

module.exports = (req, file, callback) => { // fileFilter - Function to control which files are accepted
  console.log('----------------------------------------------------------------------------')
    
    if(file.fieldname ==='profile'){
        if (
            file.mimetype === "image/png" ||
            file.mimetype === "image/jpg" ||
            file.mimetype === "image/jpeg"
          ) {
            callback(null, true);
          } else {
            callback(new Error("ONly .jpg, .png or .jpeg format allowed!"));
          }
    
    }else{
        callback(new Error('unexpected error has been happened'));
    }
  }