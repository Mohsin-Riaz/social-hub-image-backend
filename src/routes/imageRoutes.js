const express = require('express');
const router = express.Router();
const { postImage, deleteImage } = require('../controllers/imageController');

router.route('/:imageId').post(postImage).delete(deleteImage);

module.exports = router;
