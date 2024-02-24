const picturePane = document.querySelector('.inser-form');
const anima = document.getElementById('animaionBut');
const back =document.getElementById('animaionBut2');
const formDiv = document.getElementById('form2');

const myUploads = document.querySelector('.myUploads');

picturePane.style.animationPlayState = 'paused';

anima.addEventListener('click', ()=> {

    animaionBut.style.display = 'none';
    back.style.display = 'block';

    picturePane.classList.remove('reverse');
    picturePane.classList.add('forward');
    picturePane.style.animationPlayState = 'running';
    console.log('hello');

    formDiv.style.display = 'block';
    myUploads.style.display = 'none';
})

back.addEventListener('click', () => {

    picturePane.classList.remove('forward');
    picturePane.classList.toggle('reverse');
    picturePane.style.animationPlayState = 'running';
    formDiv.style.display = 'none';
   
    myUploads.style.display = 'flex';
    back.style.display = 'none';
    anima.style.display = 'block';
    
})
