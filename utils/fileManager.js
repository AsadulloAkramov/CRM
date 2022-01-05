/* eslint-disable consistent-return */
/* eslint-disable no-empty */
/* eslint-disable wrap-iife */
const path = require('path');
const fs = require('fs');
const { v4: uuid } = require('uuid');
const fetch = require('node-fetch');

const imageMimeTypes = [
  'image/x-xwindowdump',
  'image/x-xpixmap',
  'image/x-xbitmap',
  'image/x-rgb',
  'image/x-portable-pixmap',
  'image/x-portable-graymap',
  'image/x-portable-bitmap',
  'image/x-portable-anymap',
  'image/x-icon',
  'image/x-cmx',
  'image/x-cmu-raster',
  'image/tiff',
  'image/tiff',
  'image/svg+xml',
  'image/pipeg',
  'image/jpeg',
  'image/png',
  'image/ief',
  'image/gif',
  'image/cis-cod',
  'image/bmp'
];

class FileManager {
  constructor(targetFolder) {
    this.targetFolder = targetFolder;
    this.uploadsFolder = path.resolve('uploads');
    this.defaultImage = (async function getDefaultImage() {
      try {
        const response = await fetch(
          'https://www.kenyons.com/wp-content/uploads/2017/04/default-image-620x600.jpg'
        );

        const buffer = await response.buffer();
        const base64 = await Buffer.from(buffer, 'base64');

        return base64;
      } catch (e) {}
    })();
  }

  async read(filename, type, res) {
    const folderOfFiles = path.join(this.uploadsFolder, this.targetFolder);
    if (!fs.readdirSync(folderOfFiles).includes(filename)) {
      if (type === 'image') {
        res.writeHead(200, {
          'Content-Type': 'image/png',
          'Content-Length': (await this.defaultImage).length
        });

        return res.end(await this.defaultImage);
      }
    }

    return res.status(200).sendFile(path.join(folderOfFiles, filename));
  }

  write(file, type, res) {
    if (!fs.readdirSync(path.resolve(__dirname, '../')).includes('uploads')) {
      fs.mkdirSync(path.resolve(__dirname, '../', this.uploadsFolder));
    }

    if (type === 'image') {
      if (!imageMimeTypes.includes(file.mimetype)) {
        return res.sendStatus(422);
      }

      if (!file) {
        return res.status(404).json({
          message: 'Image not found'
        });
      }
    }

    if (!fs.readdirSync(this.uploadsFolder).includes(this.targetFolder)) {
      fs.mkdirSync(path.join(this.uploadsFolder, this.targetFolder));
    }

    const filename = uuid();

    file.mv(
      path.join(this.uploadsFolder, this.targetFolder, filename + path.extname(file.name)),
      (error) => {
        if (error) {
          return res.status(500).json({
            message: error.message
          });
        }
        return null;
      }
    );
    return filename + path.extname(file.name);
  }
}

module.exports = FileManager;
