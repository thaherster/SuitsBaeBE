const multer = require("multer");
const multerS3 = require("multer-s3");
const aws = require("aws-sdk");
const { secretAccessKey, accessKeyId, region } = require("../config/keys");

aws.config.update({
  secretAccessKey: secretAccessKey,
  accessKeyId: accessKeyId,
  region: region // region of your bucket
});

const s3 = new aws.S3();
var maxSize = 5 * 1024 * 1024; //5mb
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "suitsresume",
    contentType: multerS3.AUTO_CONTENT_TYPE,

    metadata: function(req, file, cb) {
      console.log(file);
      cb(null, { fieldName: file.fieldname });
    },
    key: function(req, file, cb) {
      cb(null, Date.now().toString() + file.originalname);
    }
  }),
  limits: { fileSize: maxSize }
});

module.exports = upload;
