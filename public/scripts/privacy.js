const notification4 = document.querySelector('.notification4');


//download
const toggleCheckbox = document.getElementById('toggle');
toggleCheckbox.addEventListener('change', function(e) {

    const postId = e.target.dataset.postid;
    let result = this.checked ? true : false;

    console.log(result);

    if(result){
        enableDownload(postId);
        
    }else{
        disableDownload(postId);
        
    }
      
  });


  async function enableDownload(postID){

    notification4.style.display= 'block';
    notification4.innerHTML = "";
    notification4.innerHTML = `<p>Setting Saved.</p>`;

    setTimeout(()=>{
        notification4.style.display= 'none';
    },3000)


    try {
        const savedResponse = await fetch(`/account/edit/privacy/${postID}/enable`, { method: 'POST' });
        const savedData = await savedResponse.json();
         console.log('enabled');    
    } catch (err) {
        console.error('Error liking:', err);
        alert('cant enabled');
    }
    
  }

  async function disableDownload(postID){

    notification4.style.display= 'block';
    notification4.innerHTML = "";
    notification4.innerHTML = `<p>Setting Saved.</p>`;

    setTimeout(()=>{
        notification4.style.display= 'none';
    },3000)
    
    try {
        const savedResponse = await fetch(`/account/edit/privacy/${postID}/disable`, { method: 'POST' });
        const savedData = await savedResponse.json();
         console.log('disable');    
    } catch (err) {
        console.error('Error liking:', err);
        alert('cant disable');
    }
  }

  //comments

const toggleCheckbox2 = document.getElementById('toggle2');
toggleCheckbox2.addEventListener('change', function(e) {

    const postId = e.target.dataset.postid;
    let result = this.checked ? true : false;

    console.log(result);

    if(result){
        enableComments(postId);
        
    }else{
        disableComments(postId);
        
    }
      
  });


  async function enableComments(postID){

    notification4.style.display= 'block';
    notification4.innerHTML = "";
    notification4.innerHTML = `<p>Setting Saved.</p>`;

    setTimeout(()=>{
        notification4.style.display= 'none';
    },3000)


    try {
        const savedResponse = await fetch(`/account/edit/privacy/${postID}/enablecomments`, { method: 'POST' });
        const savedData = await savedResponse.json();
         console.log('enabled');    
    } catch (err) {
        console.error('Error liking:', err);
        alert('cant enabled');
    }
    
  }

  async function disableComments(postID){

    notification4.style.display= 'block';
    notification4.innerHTML = "";
    notification4.innerHTML = `<p>Setting Saved.</p>`;

    setTimeout(()=>{
        notification4.style.display= 'none';
    },3000)
    
    try {
        const savedResponse = await fetch(`/account/edit/privacy/${postID}/disablecomments`, { method: 'POST' });
        const savedData = await savedResponse.json();
         console.log('disable');    
    } catch (err) {
        console.error('Error liking:', err);
        alert('cant disable');
    }
  }
