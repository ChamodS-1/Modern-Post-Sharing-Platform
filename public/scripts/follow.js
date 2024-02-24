const followCount = document.getElementById('followCount');
const followingCount = document.getElementById('followingCount');

const followCount1 = document.querySelector('.followCount');
const followingCount1 = document.querySelector('.followingCount');

const flowersCountSet = document.getElementById('flowersCountSet');

followCount.addEventListener('click', followers);
followingCount.addEventListener('click', following);

async function followers(e){

    const currentUser = e.target.dataset.currentuser;
    const otheruser = e.target.dataset.otheruser;

    console.log(currentUser,otheruser);

    followCount1.style.display = 'none';
    followingCount1.style.display = 'block';

    try {
        const response = await fetch(`/find/${currentUser}/${otheruser}/increase`, { method: 'POST' });
        const followdata = await response.json();
        console.log(followdata);
        flowersCountSet.textContent = followdata.length;
       // downloadSet2.textContent = `${likedata.likes.likeCount}`;
        
    } catch (err) {
        console.error('Error liking:', err);
        alert('cant follow');
    }
}

async function following(e){
    const currentUser = e.target.dataset.currentuser;
    const otheruser = e.target.dataset.otheruser;

    console.log(currentUser,otheruser);

    followCount1.style.display = 'block';
    followingCount1.style.display = 'none';

    try {
        const response = await fetch(`/find/${currentUser}/${otheruser}/decrease`, { method: 'POST' });
        const followdata = await response.json();
        console.log(followdata);
        flowersCountSet.textContent = followdata.length;
       // downloadSet2.textContent = `${likedata.likes.likeCount}`;
        
    } catch (err) {
        console.error('Error liking:', err);
        alert('cant follow');
    }
}