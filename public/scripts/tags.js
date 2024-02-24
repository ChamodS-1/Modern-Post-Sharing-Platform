const tagsSection = document.querySelector('.tagsSection');
const hashTags = document.getElementById('hashTags');
const addTags = document.getElementById('addTags');

const tagsClick = document.getElementById('tagsClick');
const tagsInsert = document.querySelector('.tagsInsert');
const tagsInput = document.getElementById('tagsInput');
const tagsClickCancle = document.getElementById('tagsClickCancle');
const balckScreen = document.querySelector('.balckScreen');

const errorMsg = document.getElementById('errorMsg');

const posttitle2 = document.querySelector('#form2 .addAllTgas');

const textSizeNumber = document.querySelector('.textSizeNumber');
const textSizeNumber2 = document.querySelector('.textSizeNumber2');
const postcontent =  document.getElementById('post-content');
const posttitle = document.getElementById('post-title');
const tagLengthFinal  =document.querySelector('.tagLengthFinal')

const animaionBut2 = document.getElementById('animaionBut2');

let allCloseButtons;

let myTags = [];
let count = -1;

addTags.addEventListener('click', ()=> {

    errorMsg.textContent = "";
    balckScreen.style.display = 'block';
    tagsInsert.style.display = 'block';

    animaionBut2.style.display = 'none';
})

tagsClickCancle.addEventListener('click', ()=> {
    tagsInput.value = "";
    balckScreen.style.display = 'none';
    tagsInsert.style.display = 'none';
    animaionBut2.style.display = 'block';
})

tagsClick.addEventListener('click' , ()=> {

    if(myTags.length>5){
        addTags.style.display = 'none';
    }

    if(tagsInput.value.trim().length===0){
        errorMsg.textContent = 'Add a Tag to continue';
        return;
    }

    tagsSection.style.display = 'block'
    animaionBut2.style.display = 'block';
    posttitle2.style.display = 'none';

    myTags.push(tagsInput.value.trim());

    iterateTags(myTags);

   // console.log(myTags);
    tagsInput.value = "";
    balckScreen.style.display = 'none';
    tagsInsert.style.display = 'none';
   
})


function getIndex(value){

    for(key of myTags){
        count++;
        if(key===value)
        return count;
    }
}

function iterateTags(array){
    tagsSection.innerHTML = "";
    hashTags.textContent = "";
    hashTags.value = "";
    let combinedTags = "";
  
    for(const tag of array){
        const span = document.createElement('span');
        span.innerHTML = `<button value="${tag}" class="closeBut animaclass">${tag}</button>`;
        tagsSection.append(span);

        combinedTags+=tag+',';
    }

   // hashTags.textContent = combinedTags;
    hashTags.value = combinedTags.slice(0, -1);

    allCloseButtons = document.querySelectorAll('.closeBut');

    allCloseButtons.forEach( button => {
        button.addEventListener('click', e => {

            if(myTags.length<8){
                addTags.style.display = 'block';
            }

            if(myTags.length===1){
                posttitle2.style.display = 'block';
                tagsSection.style.display = 'none';
            }

            count = -1;
            let x =  getIndex(e.target.value);
    
            myTags.splice(x,1);
            iterateTags(myTags);
            
        })
    } )
}

postcontent.addEventListener('input', e => {
    
    textSizeNumber.textContent = e.target.value.trim().length;
})

posttitle.addEventListener('input', e => {
    
    textSizeNumber2.textContent = e.target.value.trim().length;
})

tagsInput.addEventListener('input', e => {
    
    tagLengthFinal.textContent = e.target.value.trim().length;
})