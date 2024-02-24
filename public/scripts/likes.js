const increse = document.querySelector('.increse');
const decrease = document.querySelector('.decrease');

const increseLikes = document.getElementById('increseLikes');
const decreseLikes = document.getElementById('decreseLikes');

const downloadSet1  =document.getElementById('downloadSet1');
const downloadSet2  =document.getElementById('downloadSet2');

increseLikes.addEventListener('click' , increaseLikedCount);

async function increaseLikedCount(e){

    const userId = e.target.dataset.useridnumber;
    const userid = e.target.dataset.userid;
    decrease.style.display = 'flex';
    increse.style.display = 'none';

    try {
        const response = await fetch(`/user/all-post/${userId}/increseLikes?value=${userid}`, { method: 'POST' });
        const likedata = await response.json();
        console.log(likedata);
        downloadSet2.textContent = `${likedata.likes.likeCount}`;
        
    } catch (err) {
        console.error('Error liking:', err);
        alert('error');
    }
}

decreseLikes.addEventListener('click' , decreaseLikedCount);

async function decreaseLikedCount(e){

    const userId = e.target.dataset.useridnumber;
    const userid = e.target.dataset.userid;
    console.log(userId)
    decrease.style.display = 'none';
    increse.style.display = 'flex';

    try {
        const response = await fetch(`/user/all-post/${userId}/decreseLikes?value=${userid}`, { method: 'POST' });
        const likedata = await response.json();
        console.log(likedata);
        downloadSet1.textContent = `${likedata.likes.likeCount}`;
        
    } catch (err) {
        console.error('Error liking:', err);
        alert('error');
    }


}