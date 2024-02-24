const linkCloseButton = document.getElementById('linkCloseButton');
const showWhoLikes = document.getElementById('downloadSet2');
const showWhoLikes2 = document.getElementById('downloadSet1');

const allCover2 = document.querySelector('.allCover2');
const fixedLinks2 =document.getElementById('fixedLinks2');
//const notification2 = document.querySelector('.notification2');

// setTimeout(()=> {
//     updated.style.display = 'none';
// },3000)

showWhoLikes.addEventListener('click', ()=> {
    //allCover2.style.display= 'block';
    fixedLinks2.style.display= 'block';
    
})

showWhoLikes2.addEventListener('click', ()=> {
  //  allCover2.style.display= 'block';
    fixedLinks2.style.display= 'block';
    
})

linkCloseButton.addEventListener('click', ()=> {
   // allCover2.style.display= 'none';
    fixedLinks2.style.display= 'none';
})

// setTimeout(()=> {
//     notification2.style.display = 'none';
//   },3000)