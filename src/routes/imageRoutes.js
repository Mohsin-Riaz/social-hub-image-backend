const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();
const {
    createAvatarImage,
    deleteImage,
    createPostImage,
} = require('../controllers/imageController');

router.route('/a/:imageId').post(upload.single('avatar'), createAvatarImage);
router.route('/p/:imageId').post(upload.single('avatar'), createPostImage);
router.route('/d/:imageId').delete(deleteImage);
module.exports = router;
