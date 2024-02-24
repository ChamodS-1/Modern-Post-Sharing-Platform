//const updated = document.querySelector('.updated');
const okButton = document.getElementById('okButton');

const linkCloseButton = document.getElementById('linkCloseButton');
const sizePredictor = document.getElementById('sizePredictor');

const allCover = document.querySelector('.allCover');
const fixedLinks =document.getElementById('fixedLinks');
const notification2 = document.querySelector('.notification2');

setTimeout(()=> {
    notification2.style.display = 'none';
},3000)

sizePredictor.addEventListener('click', ()=> {
    allCover.style.display= 'block';
    fixedLinks.style.display= 'block';
    
})

linkCloseButton.addEventListener('click', ()=> {
    allCover.style.display= 'none';
    fixedLinks.style.display= 'none';
})
