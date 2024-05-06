const { Router } = require('express');
const upload = require('../utils/uploadImageS3');
const MasterStory = require('../models/MasterStoryModel');

const { getAll, getOne, deleteOne, updateOne, createOne } = require('../controllers/handlerFactory');
const { decodeToken } = require("../controllers/authController");

const router = Router();

const imageUploadCallback = async function (req, file, callback) {
	const user = await decodeToken(req.header("authorization"));
	try {
		const masterstory = await MasterStory.findById(req.params.id);
		const imageArray = masterstory.image.split("/");
		const key = `${user.id}/master-stories/${imageArray[imageArray.length - 1]}`;
		await s3.deleteObject({ Bucket: process.env.S3_BUCKET, Key: key }).promise();
	} catch (err) { }
	req.body = {
		...req.body,
		[file.fieldname]: `https://${process.env.S3_BUCKET}.s3.${process.env.S3_REGION}.amazonaws.com/${user.id}/master-stories/${Date.now()}_${file.originalname}`,
	};
	callback(null, `${user.id}/master-stories/${Date.now()}_${file.originalname}`);
}


router
	.route('/')
	.get(getAll(MasterStory))
	.post(upload(imageUploadCallback).single('image'), createOne(MasterStory));

router
	.route('/:id')
	.get(getOne(MasterStory))
	.patch(upload(imageUploadCallback).single('image'), updateOne(MasterStory))
	.delete(deleteOne(MasterStory));

module.exports = router;
