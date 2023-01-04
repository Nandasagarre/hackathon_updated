const imageInput = document.getElementById('imageInput');
const image = document.getElementById('image');
const uploadButton = document.getElementById('uploadButton');
const MAX_WIDTH = 320;
const MAX_HEIGHT = 180;
const MIME_TYPE = "image/jpeg";
const QUALITY = 0.8;
var BLOB = null;
imageInput.addEventListener('change', (event) => {
    const originalImageFile = event.target.files[0];
    displayInfo('Original file', originalImageFile);
   
    const fileReader = new FileReader();
    fileReader.readAsDataURL(originalImageFile);

    fileReader.onload = () => {
       
        const img = new Image();
        img.src = fileReader.result;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            const [newWidth, newHeight] = calculateSize(img, MAX_WIDTH, MAX_HEIGHT);
            canvas.width = newWidth;
            canvas.height = newHeight;
            ctx.drawImage(img, 0, 0, newWidth, newHeight);


            const dataURL = canvas.toDataURL('image/jpeg', QUALITY);
           
            console.log("dataUrl" ,dataURL)
            
            image.src = dataURL;
            BLOB = dataURLtoBlob(image.src);
            
            displayInfo('Compressed file', BLOB);
        };
    };
});

uploadButton.addEventListener('click', (event) => {
    event.preventDefault();   

    const formData = new FormData();

  //  const formData = new FormData();
    formData.append('finalimage', BLOB, "compressed_image.blb");
    
   // formData.append('image', image.src);

    fetch('/imageview', {
        method: 'POST',
        body: formData,
        mode: 'cors'
    })
        .then((response) => {
            // Handle the response here
            if (response.ok) {
                console.log('Image was uploaded successfully');
                window.location = '/imageview';

            } else {
                console.error('Error uploading image:', response.statusText);
            }
        })
        .catch((error) => {
            // Handle the error here
            console.error('Error uploading', error);
        });
})

function calculateSize(img, maxWidth, maxHeight) {
    let width = img.width;
    let height = img.height;

    // calculate the width and height, constraining the proportions
    if (width > height) {
        if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
        }
    } else {
        if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
        }
    }
    return [width, height];
}


function displayInfo(label, file) {
    const p = document.createElement('p');
    p.innerText = `${label} - ${readableBytes(file.size)}`;
    document.getElementById('root').append(p);
}

function readableBytes(bytes) {
    const i = Math.floor(Math.log(bytes) / Math.log(1024)),
        sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i];
}

function dataURLtoBlob(dataURL) {
    // Convert the data URL to a binary string
    const binaryString = atob(dataURL.split(',')[1]);

    // Create an array of bytes from the binary string
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }

    // Return the bytes as a blob
    return new Blob([bytes], { type: 'image/jpeg' });
}

