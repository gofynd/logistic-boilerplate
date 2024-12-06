const axios = require("axios");
const fs = require("fs");

const sendWhatsAppMessage = async (number, text) => {
    try {
        const response = await fetch('https://graph.facebook.com/v20.0/<number>/messages', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.WHATSAPP_COMMERCE_MESSENGER_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                messaging_product: 'whatsapp',
                to: number,
                type: "text",
                text: { body: text }
            })
        })
        const data = await response.json()
        console.log(data)
    } catch (error) {
        console.error('Error sending message:', error)
    }
}


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
    sendWhatsAppMessage, 
    uploadFileToStorage
};