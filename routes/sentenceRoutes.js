const { Router } = require("express");

const {
  createOne,
  updateOne,
  deleteOne,
} = require("../controllers/handlerFactory");
const { getSentences } = require("../controllers/sentenceController");
const Sentence = require("../models/sentenceModel");
const { decodeToken } = require("../controllers/authController");
const upload = require("../utils/uploadImageS3");

const imageUploadCallback = async function (req, file, callback) {
  const user = await decodeToken(req.header("authorization"));
  try {
    const sentence = await Sentence.findById(req.params.id);
    const imageArray = sentence.image.split("/");
    const key = `${user.id}/sentence/${file.fieldname}/${imageArray[imageArray.length - 1]
      }`;
    s3.deleteObject({ Bucket: process.env.S3_BUCKET, Key: key }).promise();
  } catch (err) { }
  req.body = {
    ...req.body,
    [file.fieldname]: `https://${process.env.S3_BUCKET}.s3.${process.env.S3_REGION}.amazonaws.com/${user.id}/sentence/${file.fieldname}/${Date.now()}_${file.originalname}`,
  };
  callback(
    null,
    `${user.id}/sentence/${file.fieldname}/${Date.now()}_${file.originalname}`
  );
}

const router = Router();

router.route("/").post(upload(imageUploadCallback).none(), createOne(Sentence));
router.get("/:id", getSentences());
router
  .route("/:id")
  .patch(
    upload(imageUploadCallback).fields([
      { name: "image", maxCount: 1 },
      { name: "audio", maxCount: 1 },
    ]),
    updateOne(Sentence)
  )
  .delete(deleteOne(Sentence));

module.exports = router;
