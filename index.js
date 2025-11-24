const fs = require("fs-extra");
const axios = require("axios");
const archiver = require("archiver");
const path = require("path");

//  DOWNLOAD PDF  (supports file:// & https://)
async function downloadPDF(url, outputPath) {
    try {
        // Local file (file://)
        if (url.startsWith("file://")) {
            const localPath = url.replace("file://", "");
            await fs.copy(localPath, outputPath);
            return;
        }

        // Online URL
        const response = await axios({
            url,
            method: "GET",
            responseType: "stream",
            timeout: 10000,
            headers: { "User-Agent": "Mozilla/5.0" }
        });

        return new Promise((resolve, reject) => {
            const writer = fs.createWriteStream(outputPath);
            response.data.pipe(writer);
            writer.on("finish", resolve);
            writer.on("error", reject);
        });

    } catch (err) {
        throw new Error(`Failed to download: ${url}`);
    }
}

//  ZIP CREATOR 
async function zipFiles(pdfUrls, zipName = "files.zip") {
    if (!Array.isArray(pdfUrls)) pdfUrls = [pdfUrls];

    const tempFolder = "./temp_pdf_zip";
    await fs.ensureDir(tempFolder);

    const errorUrls = [];
    const successPaths = [];

    for (let i = 0; i < pdfUrls.length; i++) {
        const filePath = path.join(tempFolder, `file_${i}.pdf`);

        try {
            await downloadPDF(pdfUrls[i], filePath);
            successPaths.push(filePath);
        } catch (err) {
            console.error(err.message);
            errorUrls.push(pdfUrls[i]);
        }
    }

    const outputZipPath = path.join(process.cwd(), zipName);
    const output = fs.createWriteStream(outputZipPath);
    const archive = archiver("zip", { zlib: { level: 9 } });

    archive.pipe(output);

    successPaths.forEach((filePath, index) => {
        archive.file(filePath, { name: `document_${index + 1}.pdf` });
    });

    await archive.finalize();
    await fs.remove(tempFolder); 

    return { zipPath: outputZipPath, errorUrls };
}

module.exports = { zipFiles };
