const sharp = require('sharp');
const getPixels = require('get-pixels');
const { encode } = require('blurhash');

async function imageToBlurHash(imagePath) {
    try {
        // Resize the image to a fixed size (32x32 pixels) disregarding aspect ratio
        const resizedImageBuffer = await sharp(imagePath)
            .resize(32, 32, {
                fit: 'fill' // Disregard aspect ratio
            })
            .toBuffer();

        // Get the pixel data from the resized image
        const pixels = await new Promise((resolve, reject) => {
            getPixels(resizedImageBuffer, 'image/png', (err, pixels) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(pixels.data);
                }
            });
        });

        // Encode the pixel data into BlurHash
        const blurhash = encode(pixels, 32, 32, 4, 3); // You can adjust x and y components according to your needs

        return blurhash;
    } catch (error) {
        console.error("Error:", error);
        return null;
    }
}

// Example usage
const imagePath = 'Fortnite-Save-The-World.png';
imageToBlurHash(imagePath)
    .then(blurhash => {
        console.log("BlurHash:", blurhash);
    })
    .catch(err => {
        console.error("Error:", err);
    });
