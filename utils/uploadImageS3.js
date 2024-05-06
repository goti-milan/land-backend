const AWS = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");

AWS.config.update({
	accessKeyId: process.env.AWS_ACCESS_KEY,
	secretAccessKey: process.env.AWS_SECRET_KEY,
	region: process.env.AWS_REGION_KEY,
});

const s3 = new AWS.S3();

const upload = (key) => multer({
	storage: multerS3({
		s3: s3,
		bucket: process.env.S3_BUCKET,
		acl: "public-read",
		contentType: multerS3.AUTO_CONTENT_TYPE,
		key: key
	}),
});


module.exports = upload;