const axios = require("axios");
const fs = require("fs");

async function uploadFileToStorage(uploadUrl, filePath, mimeType) {
    try {
        // Read the file as a buffer
        const fileBuffer = fs.readFileSync(filePath);

        // Make the PUT request to upload the file
        const response = await axios.put(uploadUrl, fileBuffer, {
            headers: {
                "Content-Type": mimeType,
            },
        });

        console.log("File uploaded successfully:", response.status, response.statusText);
    } catch (error) {
        console.error("Error uploading file:", error.response?.status, error.response?.data || error.message);
    }
}

module.exports = {
    uploadFileToStorage
};