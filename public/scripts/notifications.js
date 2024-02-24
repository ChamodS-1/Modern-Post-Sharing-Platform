const catchNotifications = document.querySelector('.catchNotifications');
const notificationCenter = document.querySelector('.notificationCenter');

const notificationHolder = document.querySelector('.notificationHolder');
const notificationImage = document.getElementById('notificationImage');

const showHeart = document.getElementById('showHeart');
const notShowHeart = document.getElementById('notShowHeart');

notificationCenter.style.animationPlayState = 'paused';
notificationCenter.style.display = 'none';

catchNotifications.addEventListener('click', fetchNoti);
let status1 = false;

function fetchNoti(e){

    let userImage = catchNotifications.getAttribute('data-userimage');
    notificationImage.setAttribute('src', userImage); 
    console.log(userImage);
 
   changeStatus(status1);
   console.log(changeStatus(status1));

    if(changeStatus(status1)){
        forward(e);
    }else{
        backward(e);
    }    
}

async function forward(e){
    console.log('forwared');

    showHeart.style.display = 'none';
    notShowHeart.style.display = 'block';

    notificationCenter.style.display = 'block';
    notificationCenter.classList.remove('backwardAni');
    notificationCenter.classList.add('forwardAni');

    notificationCenter.style.animationPlayState = 'running';

    let userId = catchNotifications.getAttribute('data-user');
    console.log(userId)

    try {
        const notificationData = await fetch(`/user/notification/${userId}`, { method: 'POST' });
        const myData = await notificationData.json();
        console.log(myData);
        
        createNotification(myData);
    } catch (err) {
        console.error('Error liking:', err);
        alert('cannot get notifications');
    } 
}

function backward(e){

    showHeart.style.display = 'block';
    notShowHeart.style.display = 'none';

    console.log('backward');
    notificationCenter.style.display = 'block';
    notificationCenter.classList.remove('forwardAni');
    notificationCenter.classList.add('backwardAni');
    notificationCenter.style.animationPlayState = 'running';
}

function changeStatus(status){
    if(status) {
    status1 = false;
     return false;
    }else{
    status1 = true;
    return true;
    }        
}

function createNotification(myData){
    notificationHolder.innerHTML = "";

   

    for (const oneData of myData) {
        
        const li = document.createElement('li');
        li.innerHTML = `<div class="actualNotifications">
                        <p class="title">You Uploaded new Post</p>
                        <p class="note">${oneData.title}</p>
                        <p class="date">${oneData.date}</p>
                    </div>`

     notificationHolder.append(li);

    }

}