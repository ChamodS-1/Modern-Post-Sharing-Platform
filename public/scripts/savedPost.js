const savedButton = document.getElementById('savedButton');
const notsavedButton = document.getElementById('notsavedButton');

const savePost = document.getElementById('savePost');
const notsavePost = document.getElementById('notsavePost');

const notification3 = document.querySelector('.notification3');

savedButton.addEventListener('click', savethePost);

async function savethePost(e){

    const postID = e.target.dataset.postidnumber;
    const useridNumber = e.target.dataset.userid;
    
    savePost.style.display = 'none';
    notsavePost.style.display = 'block';

    notification3.style.display= 'block';
    notification3.innerHTML = "";
    notification3.innerHTML = `<p>Post Saved.</p>`;

    setTimeout(()=>{
        notification3.style.display= 'none';
    },3000)

    try {
        const savedResponse = await fetch(`/user/all-post/${postID}/saved?value=${useridNumber}`, { method: 'POST' });
        const savedData = await savedResponse.json();
        // console.log(savedData);    
    } catch (err) {
        console.error('Error liking:', err);
        alert('cant saved');
    }
}


notsavedButton.addEventListener('click', removeSavePost);

async function removeSavePost(e){
    const postID = e.target.dataset.postidnumber;
    const useridNumber = e.target.dataset.userid;

    savePost.style.display = 'block';
    notsavePost.style.display = 'none';

    notification3.style.display= 'block';
    notification3.innerHTML = "";
    notification3.innerHTML = `<p>Post Removed.</p>`;

    setTimeout(()=>{
        notification3.style.display= 'none';
    },3000)

    try {
        const savedResponse = await fetch(`/user/all-post/${postID}/removed?value=${useridNumber}`, { method: 'POST' });
        const savedData = await savedResponse.json();
        // console.log(savedData);    
    } catch (err) {
        console.error('Error liking:', err);
        alert('cant removed');
    }
}


