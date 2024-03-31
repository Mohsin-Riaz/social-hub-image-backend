const AWS = require('aws-sdk');
const jimp = require('jimp-compact');

const region = process.env.AWS_S3_REGION;
const bucketName = process.env.AWS_BUCKET_NAME;

const credentials = {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    // sessionToken: process.env.AWS_SESSION_TOKEN || null,
};

AWS.config.update({
    region: region,
    credentials: credentials,
});

const s3 = new AWS.S3();

const createAvatarImage = async (req, res) => {
    const { imageId } = req.params;
    const { buffer } = req.file;

    if (!imageId || !buffer)
        return res.status(400).json({
            success: false,
            message: 'No image data or image id provided',
        });

    const image = await imageResize(buffer, 'avatar');
    var uploadImage = new AWS.S3.ManagedUpload({
        params: {
            Bucket: bucketName,
            Key: imageId + '.webp',
            Body: image,
        },
    });

    uploadImage.promise().then(
        () => {
            return res.status(200).json({
                success: true,
                message: 'Successfully uploaded photo',
            });
        },
        (err) => {
            return res.status(400).json({
                success: false,
                message: 'There was an error uploading your photo',
                error: err.message,
            });
        }
    );
};

const createPostImage = async (req, res) => {
    const { imageId } = req.params;
    const { buffer } = req.file;
    if (!imageId || !buffer)
        return res.status(400).json({
            success: false,
            message: 'No image data or image id provided',
        });

    const image = await imageResize(buffer, 'post');

    var uploadImage = new AWS.S3.ManagedUpload({
        params: {
            Bucket: bucketName,
            Key: imageId + '.webp',
            Body: image,
        },
    });
    uploadImage.promise().then(
        () => {
            return res.status(200).json({
                success: true,
                message: 'Successfully uploaded photo',
            });
        },
        (err) => {
            return res.status(400).json({
                success: false,
                message: 'There was an error uploading your photo',
                error: err.message,
            });
        }
    );
};

const imageResize = async (buffer, imageType) => {
    var width = 900;
    var height = 600;
    if (imageType === 'avatar') {
        var width = 300;
        var height = 300;
    }
    return jimp
        .read(buffer)
        .then((image) =>
            image
                .contain(width, height)
                .background(0x1e1e1eff)
                .getBufferAsync(jimp.AUTO)
        );
};

const deleteImage = async (req, res) => {
    const { imageId } = req.params;
    if (!imageId)
        return res
            .status(404)
            .json({ success: true, message: 'No image id provided' });

    var photoKey = imageId + '.webp';

    s3.deleteObjects(
        {
            Bucket: bucketName,
            Delete: { Objects: [{ Key: photoKey }] },
        },
        (err, _) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    message: 'There was an error deleting your photo: ',
                    error: err.message,
                });
            }
            return res.status(200).json({
                success: true,
                message: 'Successfully deleted photo.',
            });
        }
    );
};

module.exports = { createPostImage, createAvatarImage, deleteImage };
