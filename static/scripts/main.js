class FileUploader {

  constructor(){
    this.dropArea = document.querySelector('.drop-area');
    this.gallery = document.querySelector('.drop-area__gallery');

    this.filesDone = 0;
    this.filesToDo = 0;
    this.url = '/upload-file';
  }

  preventDefaults = event => {
    event.preventDefault();
    event.stopPropagation();
  }

  handleFiles = files => {
    const tempFiles = [...files];
    tempFiles.forEach(this.uploadFile);
  }

  handleDrop = event => {
    let dt = event.dataTransfer
    let files = dt.files

    this.handleFiles(files)
  }

  uploadFile = file => {
    this.previewFile(file);

    let formData = new FormData();
    formData.append('file', file)

    fetch(this.url, {
      method: 'POST',
      body: formData
    }).then(previewFile(file))
  }

  previewFile = file => {
    let reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = () => {
      let img = document.createElement('img')
      img.src = reader.result;

      this.gallery.appendChild(img)
    }
  }

  init = () => {
    this.dropArea.addEventListener('dragenter', this.preventDefaults, false);
    this.dropArea.addEventListener('dragover', this.preventDefaults, false);
    this.dropArea.addEventListener('dragleave', this.preventDefaults, false);
    this.dropArea.addEventListener('drop', this.preventDefaults, false);

    this.dropArea.addEventListener('drop', this.handleDrop, false);
  }

}

function init(){
  
  generateGallery = paths => {
    paths.forEach(({ filePath }) => {
      let img = document.createElement('img')
      img.src = `http://localhost:3000/${filePath}`;
      document.querySelector('.drop-area__gallery').appendChild(img)
    })
  }

  const fileUploader = new FileUploader();
  fileUploader.init();

  fetch('/get-files')
    .then(response => response.json())
    .then(response => generateGallery(response.files))
}