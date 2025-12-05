const ImageKit = require("imagekit");

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

async function uploadFile(buffer, fileName) {
  try {
    const base64 = buffer.toString("base64");

    const result = await imagekit.upload({
      file: base64,
      fileName,
    });

    return result;
  } catch (err) {
    console.error("ImageKit Upload Error:", err);
    throw err;
  }
}

module.exports = { uploadFile };
