const AWS = require('aws-sdk');
const jimp = require('jimp');

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

const postImage = async (req, res) => {
    const { imageId } = req.params;
    const { imageData, imageType } = req.body;

    if (!imageId || !imageData)
        return res.status(400).json({
            success: false,
            message: 'No image data or image id provided',
        });

    const image = await imageBuffer(imageData, imageType, imageId);
    const thumbnail = await thumbnailBuffer(imageData, imageType);
    var uploadImage = new AWS.S3.ManagedUpload({
        params: {
            Bucket: bucketName,
            Key: imageId + '.webp',
            Body: image,
        },
    });

    var uploadThumbnail = new AWS.S3.ManagedUpload({
        params: {
            Bucket: bucketName,
            Key: imageId + '-thumbnail.webp',
            Body: thumbnail,
        },
    });

    uploadImage.promise().then(
        uploadThumbnail.promise().then(
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
        )
    );
};

const deleteImage = async (req, res) => {
    const { imageId } = req.params;

    if (!imageId)
        return res
            .status(404)
            .json({ success: true, message: 'No image id provided' });

    var photoKey = imageId + '.webp';
    var thumbnailKey = imageId + '-thumbnail.webp';

    s3.deleteObjects(
        {
            Bucket: bucketName,
            Delete: { Objects: [{ Key: thumbnailKey }, { Key: photoKey }] },
        },
        (err, data) => {
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

const imageBuffer = async (imageData, imageType) => {
    const image = imageData.split(';base64,').pop();
    const buffer = Buffer.from(image, 'base64');
    if (imageType?.toLowerCase() === 'post') {
        return jimp
            .read(buffer)
            .then((image) =>
                image
                    .resize(900, 600)
                    .cover(900, 600)
                    .background(0x1e1e1eff)
                    .getBufferAsync(jimp.AUTO)
            );
    }
    return jimp
        .read(buffer)
        .then((image) =>
            image
                .resize(350, 233)
                .cover(350, 233)
                .background(0x1e1e1eff)
                .getBufferAsync(jimp.AUTO)
        );
};

const thumbnailBuffer = async (imageData, imageType) => {
    const image = imageData.split(';base64,').pop();
    const buffer = Buffer.from(image, 'base64');
    if (imageType?.toLowerCase() === 'post') {
        return jimp
            .read(buffer)
            .then((image) =>
                image
                    .resize(150, 100)
                    .cover(150, 100)
                    .background(0x1e1e1eff)
                    .getBufferAsync(jimp.AUTO)
            );
    }
    return jimp
        .read(buffer)
        .then((image) =>
            image
                .resize(50, 33)
                .cover(50, 33)
                .background(0x1e1e1eff)
                .getBufferAsync(jimp.AUTO)
        );
};

module.exports = { postImage, deleteImage };
