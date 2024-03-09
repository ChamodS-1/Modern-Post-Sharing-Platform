const picUpload = document.getElementById('fileInput');
const pickedImage = document.getElementById('profDP');

const limitation = document.querySelector('.limitation');
const spanCount = document.getElementById('spanCount');
const profileName = document.getElementById('profileName');

const notification = document.querySelector('.notification');

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

spanCount.textContent=+profileName.value.trim().length;

profileName.addEventListener('input', e => {
  limitation.style.display = 'block';
  spanCount.textContent = +e.target.value.trim().length
  
})

setTimeout(()=> {
  notification.style.display = 'none';
},4000)


document.addEventListener("DOMContentLoaded", function() {
  const form = document.querySelector("form");
  const submitButton = document.getElementById("submitOne");
  const loadingIndicator = document.querySelector(".loader");

  form.addEventListener("submit", function(event) {
    event.preventDefault(); 

    loadingIndicator.style.display = "block";

    submitButton.disabled = true;

    setTimeout(function() {
      form.submit();
    }, 2000); 
  });
});



