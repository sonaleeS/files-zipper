# File Zipper

A simple Node.js utility that downloads multiple PDF files (supports
**online URLs** and **local file paths**) and bundles them into a single
ZIP file.

Perfect for servers, APIs, automation scripts, or batch-download
workflows.

## ✨ Features

-   Download PDFs from:
    -   `https://` or `http://` URLs\
    -   Local files using `file://`
-   Automatically bundles all PDFs into a ZIP file
-   Gracefully skips broken URLs and returns failed items
-   Cleans up temporary files automatically
-   Works seamlessly in Node.js apps, APIs, and scripts

## 📦 Installation

``` sh
npm install file-zipper
```

## 🚀 Quick Start

``` js
const { zipFiles } = require("file-zipper");

async function run() {
    const pdfUrls = [
        "https://example.com/sample1.pdf",
        "file:///home/user/documents/sample2.pdf"
    ];

    const result = await zipFiles(pdfUrls, "myPDFs.zip");

    console.log("ZIP created at:", result.zipPath);
    console.log("Failed URLs:", result.errorUrls);
}

run();
```

## 📘 API Reference

### `zipFiles(pdfUrls, zipName?)`

Bundles multiple PDF files into a single ZIP.

#### Parameters

  --------------------------------------------------------------------------
  Name        Type         Description
  ----------- ------------ -------------------------------------------------
  `pdfUrls`   `string[]`   Array of PDF URLs or `file://` local paths

  `zipName`   `string`     (Optional) Output zip file name (default:
                           `"files.zip"`)
  --------------------------------------------------------------------------

#### Returns

``` js
{
    zipPath: "/absolute/path/to/created.zip",
    errorUrls: [ /* list of invalid or failed URLs */ ]
}
```

## 🧩 How It Works (Internal Flow)

### 1. `downloadPDF(url, outputPath)`

Downloads a PDF from an online URL or a local `file://` path.

-   If URL starts with `file://`, it copies the local file\
-   Otherwise, it downloads using Axios stream\
-   Saves each file into a temporary folder

### 2. `zipFiles(pdfUrls, zipName)`

-   Iterates through all URLs\
-   Downloads each file\
-   Adds them to a ZIP using `archiver`\
-   Deletes temporary files after completion\
-   Returns ZIP path + list of failed URLs

## 📂 Example Use-Cases

-   API endpoint for downloading and bundling documents\
-   Automation scripts for archiving reports\
-   Server-side file bundling utilities\
-   Bulk download functionality in dashboards

## 📁 Folder Structure

    root/
    ├── index.js
    ├── package.json
    └── README.md

## 🤝 Contributing

Contributions are welcome!\
Feel free to submit issues or pull requests.

## 📄 License

MIT License --- free to use and modify.
