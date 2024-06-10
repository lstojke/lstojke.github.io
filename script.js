document.getElementById('uploadTile').addEventListener('click', function () {
    document.getElementById('uploadFile').click();
});

document.getElementById('submitTile').addEventListener('click', function () {
    document.getElementById('submit').click();
});
const form = document.getElementById("form");
form.addEventListener("submit", (e) => {
    e.preventDefault();
    var allFiles = form.file.files;
    console.log('Uploading files: ', allFiles.length)
    if (allFiles.length == 0) {
        alert('No file selected!');
    } else {
        // Send each file at a time
        for (var fileNum = 0; fileNum < allFiles.length; fileNum++) {
            console.log(fileNum);
            uploadFileToDrive(allFiles[fileNum]);
        }
    }
}
);

function uploadFileToDrive(file) {
    const fr = new FileReader();
    fr.readAsArrayBuffer(file);
    fr.onload = (f) => {
        const url = "https://script.google.com/macros/s/AKfycbx44cr7BT3VZKlcweY9stliGb3n-cx5EKCUUQjkWESDHyp8vVDNEW7sp9gbv9x8zQ0Eog/exec"; // Please set the URL of Web Apps.
        const qs = new URLSearchParams({
            filename: file.name,
            mimeType: file.type,
        });
        fetch(`${url}?${qs}`, {
            method: "POST",
            body: JSON.stringify([...new Int8Array(f.target.result)]),
        })
        .then((res) => res.json())
        .then((data) => {
            while (preview.firstChild) {
                preview.removeChild(preview.firstChild);
            }
            console.log('Success:', data);
            const para = document.createElement("p");
            para.textContent = "Dzięki za udostępnienie!";
            para.style.color = 'green';
            para.style.fontWeight = 'bold';
            para.style.fontSize = 'x-large';
            preview.appendChild(para);
        })
        .catch(console.error);
    };
}


const uploadFile = document.getElementById("uploadFile");
const preview = document.querySelector(".preview");
uploadFile.addEventListener("change", updateImageDisplay);
function updateImageDisplay() {
    while (preview.firstChild) {
      preview.removeChild(preview.firstChild);
    }
  
    const curFiles = uploadFile.files;
    if (curFiles.length === 0) {
      const para = document.createElement("p");
      para.textContent = "No files currently selected for upload";
      preview.appendChild(para);
    } else {
      const list = document.createElement("ol");
      list.className = "horizontal"
      preview.appendChild(list);
  
      for (const file of curFiles) {
        const listItem = document.createElement("li");
        const para = document.createElement("p");
        para.textContent = `${file.name}, rozmiar ${returnFileSize(file.size)}.`;
        const image = document.createElement("img");
        image.src = URL.createObjectURL(file);
        image.alt = image.title = file.name;
        image.className = "img-preview"
        listItem.appendChild(image);
        listItem.appendChild(para);
  
        list.appendChild(listItem);
      }
    }
  }

  function returnFileSize(number) {
    if (number < 1024) {
      return `${number} bytes`;
    } else if (number >= 1024 && number < 1048576) {
      return `${(number / 1024).toFixed(1)} KB`;
    } else if (number >= 1048576) {
      return `${(number / 1048576).toFixed(1)} MB`;
    }
  }