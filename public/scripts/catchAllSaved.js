const getsaved = document.getElementById('getsaved');
const mainDashboard = document.querySelector('.mainDashboard');

const selectThis = document.querySelector('.selectThis');
const selectThis2 = document.querySelector('.selectThis2');

getsaved.addEventListener('click', getAllSavedPosts);

async function getAllSavedPosts(e){

    selectThis.classList.add('myBorder');
    selectThis2.classList.remove('myBorder');

    const useridNumber = e.target.dataset.userid;
    
    try {
        const savedAllPosts = await fetch(`/user/myposts/${useridNumber}/saved`, { method: 'POST' });
        const savedPosts = await savedAllPosts.json();
        console.log(savedPosts);
        
        createSavedList(savedPosts);

        function createSavedList(array){

            mainDashboard.innerHTML = '';
            //console.log(id)
        
            for (const iterator of array) {
        
                const li = document.createElement('li');
                li.innerHTML = `<main>
                            <a href="/user/all-post/${iterator._id}?value=${useridNumber}">
                                <div class = "card">
                                <img src="${iterator.file}" alt="picture" id="mainImage">
                            <div class="card-content">
                            
                                <p>
                                        <span id="spanFlex">
                                            <img src="/image/icons8-view-30.png" alt="" id="view">
                                            <h3 id="viewsCount">${iterator.viewCount}</h3>
                                        </span>
                                        <div id="buttons">
                                        </div>
                                </p>
                            </div>
                            </div>
                        </a>
                        </main>`
            
                  mainDashboard.append(li);         
            }
        }


    } catch (err) {
        console.error('Error liking:', err);
        alert('cant get');
    }
}

