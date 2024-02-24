const download =document.getElementById('download');
const downloadSet = document.getElementById('downloadSet');

async function fetchDownloadCount(e){

    const userId = e.target.dataset.useridnumber;

    try {
        const response = await fetch(`/user/all-post/${userId}/downloads`, { method: 'POST' });
        const data = await response.json();
        downloadSet.textContent = `${data.downloads}`;
    } catch (err) {
        console.error('Error liking:', err);
        alert('An error occurred. Please try again later.');
    }

    let imageUrl = `/${e.target.dataset.imgurl}`;
    console.log(imageUrl);
    
    let link = document.createElement('a');
    link.href = imageUrl;
    link.download = 'image.jpg';
    document.body.appendChild(link);
    link.click();
    
    document.body.removeChild(link);
}

download.addEventListener('click' , fetchDownloadCount);