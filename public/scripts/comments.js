const loadsComments = document.getElementById('loadsComments');
const postPane = document.querySelector('.postPane');

loadsComments.click();

window.onload = function() {
    
    document.getElementById('loadsComments').click();
};

let userid;

async function fetchComments(e){
    const postId = e.target.dataset.postnumber;
    userid = e.target.dataset.userid;

    let authorName;
    let addButton;

    const result = await fetch(`/all-post/${postId}/comments`);
    
    const data = await result.json();
  
        fechingComments(data,userid)
        loadsComments.style.display = 'none';
}

function fechingComments(data,userid){

    postPane.innerHTML = "";

    const p = document.createElement('p');

    if(data.length==0){
        p.innerHTML = "";
        p.innerHTML = `<p class="noComments">No Comments</p>`;
        postPane.appendChild(p);
        loadsComments.style.display = 'none';
        return;
    }

    for(key of data){

        if(key.authorID === userid){
            authorName = 'You';
            addButton  = `<button class="commaButtons" data-commentidenty=${key._id} data-usercomid="${key.postId}">Delete</button>`;
            
        }else{
            authorName = `${key.authorPost}`;
            addButton = '';
        }    
           
        const li = document.createElement('li');
        li.innerHTML = ` <div id="post-pane2">

        <img src="${key.autherPic}" alt="picture" id="mainImage3">

        <div class="topicDetails">
        <div class="topicData">
        
        <p id="authorName">${authorName}</p>
        <p>${key.comment}</p>
        ${addButton}
        </div>
        <p id="myDate">${key.dateDiff}</p>
        </div>   
    </div>`

    postPane.appendChild(li);
    
    }
   
const commaButtons = document.querySelectorAll('.commaButtons');

commaButtons.forEach( oneButton => {
    oneButton.addEventListener('click', deletingComments);
})

}

loadsComments.addEventListener('click', fetchComments);

async function deletingComments(e){
    
    const x = e.target.dataset.commentidenty;
    const usercomid = e.target.dataset.usercomid;

    try {
        const response = await fetch(`/user/all-post/${x}/commentdelete?usercom=${usercomid}`, { method: 'POST' });
        const comdata = await response.json();
        console.log(comdata);
        fechingComments(comdata,userid);
    
        
    } catch (err) {
        console.error('Error liking:', err);
        alert('error');
    }
}


//security
document.addEventListener('contextmenu', function(event) {
    if (event.target.tagName === 'IMG') {
        event.preventDefault();
    }
});


document.getElementById('mainImagePic').ondragstart = function() { return false; };
