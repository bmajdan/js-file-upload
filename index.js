const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'static/photos')
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  }
})
const upload = multer({ storage: storage })
const app = express();
const port = 3000;

app.use(express.static(__dirname + '/static'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/html/index.html'));
});

app.post('/upload-file', upload.any('file-to-upload'), (req, res) => {
  res.status(200).json({'status': 'OK'})
});

const getAllPhotos = async () => {
  const files = [];
  await fs.readdirSync(__dirname + '/static/photos').forEach(file => {
    if (/.(?:jpg|gif|png)/.test(file)){
      files.push({
        'filePath': `photos/${file}`
      })
    }
  });

  return files;
}

app.get('/get-files', async (req, res) => {
  const files = await getAllPhotos();
  res.status(200).json({files});
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
})