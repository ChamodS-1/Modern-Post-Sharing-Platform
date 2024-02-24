const picUpload = document.getElementById('picUpload');
const pickedImage = document.getElementById('picSignUpPic');

picUpload.addEventListener('change', (event)=> {

    const files = picUpload.files;

    if(!files || files.length === 0 ){
        pickedImage.style.display = 'none';
        return;
    }

    const picked = files[0];
    pickedImage.src = URL.createObjectURL(picked);
    pickedImage.style.display = 'block';


    const file = event.target.files[0];
    const img = new Image();
  
    img.onload = function() {
      const maxWidth = 800; // Set your maximum width
      const maxHeight = 600; // Set your maximum height
  
      if (img.width > maxWidth || img.height > maxHeight) {
        alert('Image resolution exceeds the maximum allowed.');
        // Optionally clear the file input
        event.target.value = '';
      } else {
        
      }
    };

    animaionBut.style.display = 'block';
    back.style.display = 'none';
})

const notification2 = document.querySelector('.notification2');

setTimeout(()=> {
    notification2.style.display = 'none';
},3000)

