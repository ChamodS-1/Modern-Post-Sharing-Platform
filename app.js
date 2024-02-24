const path = require('path');
const fs = require('fs');

const express = require('express');
const app = express();

const bcryptjs =  require('bcryptjs');
const uuid = require('uuid');

const multer = require('multer');
const configStatus = multer.diskStorage({
    destination : function(req,file,cb){
        cb(null,'images')
    },
    filename : function(req,file,cb){
        cb(null,Date.now()+'-'+ file.originalname)
    }
})

//console.log(`Your port is ${process.env.PORT}`); // undefined
const dotenv = require('dotenv');
dotenv.config();
const port = process.env.PORT || 4000;
console.log(port)

let id;
const upload  = multer({storage:configStatus });

const mongodb = require('mongodb');
const ObjectId = mongodb.ObjectId;

const db = require('./database/database');
const mailer = require('./mail/mailer');
 
app.use(express.static('public'))
app.use('/images',express.static('images'))
app.use('/user/images',express.static('images'));
app.use('/user/myposts/images',express.static('images'));
app.use('/user/all-post/images',express.static('images'));
app.use('/user/images',express.static('images'));
app.use('/account/edit/images',express.static('images'));
app.use('/user/create-post/images',express.static('images'));
app.use('/user/edite/images',express.static('images'));
app.use('/account/edit/password/images',express.static('images'));
app.use('/account/edit/privacy/images',express.static('images'));
app.use('/find/images',express.static('images'));

app.use(express.urlencoded({ extended: false }));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs')

app.get('/blog-home', function (req, res) {

    res.render('main');
});

app.get('/user/create-post/:id', async(req, res) => {

    const id = req.params.id;

    try {
        
    const activeUser = await db.DbConn().collection('users').findOne({userId:id});

    if(!activeUser.loginStatus){
        return res.redirect('/login?userInactive=false'); 
    }

    const user =  await db.DbConn().collection('users').find({userId:id}).toArray();

        const documents =   await db.DbConn().collection('author').find().toArray();
        res.render('post',{documents:documents,user:user});

    } catch (error) {
        res.status(500).send(`<h1>Server Error</h1><p>${error.message}</p>`)
    }
});

app.post('/user/create-post/:id', upload.single('image'),async (req, res)=> {

    const userID = req.params.id;

    const fileUpload = req.file;
    const authorid = new ObjectId(req.body.select);

    const user =  await db.DbConn().collection('users').findOne({userId:userID});

    const newPost = {
        userID:userID,
        title : req.body.titlepost,
        postcontent : req.body.postcontent,
        hastags:req.body.hashTags,
        date : new Date().toDateString(),
        edited : false,
        downloads : 0,
        likes : {
            likeCount : 0,
            likeList : []
        },
        saved : [],
        file : fileUpload.path,
        viewCount : 0,
        downloadPrivacy : true,
        commentsPrivacy : true,
        author : {
            authName : user.userName,
            authEmail : user.email,
            authorPic : user.file
        }
    }

    const postResults =  await db.DbConn().collection('posts').insertOne(newPost);

    const notificationUsers = await db.DbConn().collection('users').findOne({userId:userID});
    
    let newNotification = {
        title : req.body.titlepost,
        date : new Date().toDateString()
    }

    notificationUsers.notifications.push(newNotification);

    let updatedNotification = {
        notifications : notificationUsers.notifications
    }
    try {
        const UpdatedCountresult =  await db.DbConn().collection('users').updateOne({userId:userID}, {$set : updatedNotification});
        console.log('new Notification insert')
    } catch (error) {
        console.log(error.message);
    }


    res.redirect('/user/myposts/'+userID);

});

app.get('/user/myposts/:id', async(req, res) => {

    const id = req.params.id;

    try {
    
    const activeUser = await db.DbConn().collection('users').findOne({userId:id});

    if(!activeUser.loginStatus){
        return res.redirect('/login?userInactive=false'); 
    }

    const data = req.query.data;
    const data2 = req.query.data2;
    const resetted = req.query.resetted;
    const profedite = req.query.profedite;
 
    const user =  await db.DbConn().collection('users').find({userId:id}).toArray();
    let devidedUserName;

    if(user[0].userName.split(' ')[1]){
        
        devidedUserName = user[0].userName.split(' ')[0]+user[0].userName.split(' ')[1].charAt(0);
    }else{
        devidedUserName = user[0].userName.split(' ')[0];
    }
    
    const allUserPosts =  await db.DbConn().collection('posts').find({userID:id}).toArray();
    const ReverseallUserPosts=allUserPosts.reverse();

    let linkArray = [];

    for(const keys of user[0].link){
        if(keys.linkName && keys.linkAdd){
            linkArray.push(keys);
        }
    }

    let size;

    if(linkArray.length==4){
        size =linkArray.length-2; 
        linkArray.pop();
        linkArray.pop();
    }

    if(linkArray.length==3){
        size =linkArray.length-2; 
        linkArray.pop();
    }

    res.render('userPage',{user:user,allPosts:ReverseallUserPosts,idOne:id,count:allUserPosts.length,count2:undefined,isUpdated:data,isDelete:data2,devidedUserName:devidedUserName,userSet:'active',linkArray:linkArray,size:size,resetted:resetted,style1:'addthis',style:'',profedite:profedite});

    } catch (error) {
       res.status(500).send(`<h1>Server Error</h1><p>${error.message}</p>`)  
    }
});

//other users
app.get('/find/:id', async(req, res) => {

    const id = req.params.id;
    const otherUser = req.query.userID;

    try {
        
    const activeUser = await db.DbConn().collection('users').findOne({userId:id});

    if(!activeUser.loginStatus){
        return res.redirect('/login?userInactive=false'); 
    }

    const data = req.query.data;
    const data2 = req.query.data2;
    const resetted = req.query.resetted;
 
    const user =  await db.DbConn().collection('users').find({userId:id}).toArray();
    const otheuser =  await db.DbConn().collection('users').find({userId:otherUser}).toArray();
    
    let devidedUserName;

    if(user[0].userName.split(' ')[1]){
        
        devidedUserName = otheuser[0].userName.split(' ')[0]+otheuser[0].userName.split(' ')[1].charAt(0);
    }else{
        devidedUserName = otheuser[0].userName.split(' ')[0];
    }

    const allUserPosts =  await db.DbConn().collection('posts').find({userID:otherUser}).toArray();
    const ReverseallUserPosts=allUserPosts.reverse();

    let linkArray = [];

    for(const keys of otheuser[0].link){
        if(keys.linkName && keys.linkAdd){
            linkArray.push(keys);
        }
    }

    let size;

    if(linkArray.length==4){
        size =linkArray.length-2; 
        linkArray.pop();
        linkArray.pop();
    }

    if(linkArray.length==3){
        size =linkArray.length-2; 
        linkArray.pop();
    }

    let style = '/style/notfollow.css';

    const currentUserFo =  await db.DbConn().collection('users').findOne({userId:id});
    
        if(currentUserFo.following.includes(otherUser)){
                style = '/style/follow.css'
        }
    res.render('otherUser',{user:user,allPosts:ReverseallUserPosts,otheuser:otheuser,idOne:id,count:allUserPosts.length,count2:undefined,isUpdated:data,isDelete:data2,devidedUserName:devidedUserName,linkArray:linkArray,size:size,resetted:resetted,style:style});

    } catch (error) {
       res.status(500).send(`<h1>Server Error</h1><p>${error.message}</p>`)   
    }

});


app.get('/account/edit/:id', async (req,res) => {

    const id = req.params.id;

    try {
        
    const activeUser = await db.DbConn().collection('users').findOne({userId:id});

    if(!activeUser.loginStatus){
        return res.redirect('/login?userInactive=false'); 
    }

    const user =  await db.DbConn().collection('users').find({userId:id}).toArray();
     let devidedUserName;

    if(user[0].userName.split(' ')[1]){
        
        devidedUserName = user[0].userName.split(' ')[0]+user[0].userName.split(' ')[1].charAt(0);
    }else{
        devidedUserName = user[0].userName.split(' ')[0];
    }

    res.render('profile',{user:user,devidedUserName:devidedUserName,empty:req.query.empty})

    } catch (error) {
        res.status(500).send(`<h1>Server Error</h1><p>${error.message}</p>`)      
    }
})

app.post('/account/edit/:id', upload.single('image2'),async (req, res)=> {

   const userID = req.params.id;
   const fileUpload = req.file;

   if(req.body.profilename.trim().length<5){
        return res.redirect('/account/edit/'+userID+'?empty=true');
   }

   const bioStatus = [

    {bioId : 1, msg : req.body.bio1},
    {bioId : 2, msg : req.body.bio2},
    {bioId : 3, msg : req.body.bio3},
    {bioId : 4, msg : req.body.bio4}
   ]

   const links = [
    {linkId : 1 , linkName : req.body.linkname1 , linkAdd : req.body.linkaddress1},
    {linkId : 2 , linkName : req.body.linkname2 , linkAdd : req.body.linkaddress2},
    {linkId : 3 , linkName : req.body.linkname3 , linkAdd : req.body.linkaddress3},
    {linkId : 4 , linkName : req.body.linkname4 , linkAdd : req.body.linkaddress4}
   ]

   const updatedProfile = {
       
       userName : req.body.profilename,
       bio: bioStatus,
       link:links,
       date : new Date().toDateString(),  
    }
    
    if(fileUpload){
      let path=fileUpload.path;
      updatedProfile.file = path;

      const updateProfilePostPic = {
          author : {

              authName : req.body.profilename.trim(),
              authorPic : path
          }
      }

      const updatedComments = {
        autherPic : path
      }

      try {
        const userComments =  await db.DbConn().collection('comments').updateMany({autherEmail:req.body.emailAdd},{$set : updatedComments});
    } catch (e) {
        console.log(e.message);
    }

      try {
          const user =  await db.DbConn().collection('posts').updateMany({userID:userID},{$set : updateProfilePostPic});
      } catch (e) {
          console.log(e.message);
      }

    }

    try{
        const UpdatedCountresult =  await db.DbConn().collection('users').updateOne({userId:userID}, {$set : updatedProfile});
    }catch(e){
        console.log(e.message);
    }

    const updatedCommentsName = {
        authorPost : req.body.profilename
      }

      try {
        const userCommentsnames =  await db.DbConn().collection('comments').updateMany({autherEmail:req.body.emailAdd},{$set : updatedCommentsName});
        
    } catch (e) {
        console.log(e.message);
    }

    res.redirect('/user/myposts/'+userID+'?profedite=true');

});


app.get('/account/edit/privacy/:postid', async (req,res) => {
    
    try {

    const id = req.query.userID;
    const postID = new ObjectId(req.params.postid);

    const activeUser = await db.DbConn().collection('users').findOne({userId:id});

    if(!activeUser.loginStatus){
        return res.redirect('/login?userInactive=false'); 
    }

        const user =  await db.DbConn().collection('users').find({userId:id}).toArray();
        const postResult =  await db.DbConn().collection('posts').find({_id : postID}).toArray();

        res.render('privacy',{user:user,postResult:postResult})
    } catch (error) {
        res.status(500).send(`<h1>Server Error</h1><p>${error.message}</p>`);
    }

})

//download settings

app.post('/account/edit/privacy/:id/disable', async (req, res) => {
    
    const postID = new ObjectId(req.params.id);
    
    try {
        const finalResults =  await db.DbConn().collection('posts').findOne({_id : postID});

        let disable = {
            downloadPrivacy : false
        }

        const UpdatedCountresult =  await db.DbConn().collection('posts').updateOne({_id : postID}, {$set : disable});
        const afterDisable =  await db.DbConn().collection('posts').findOne({_id : postID});
        res.json(afterDisable);
        console.log('disabled')

    } catch (error) {
        console.log(error.message);
    }
});

app.post('/account/edit/privacy/:id/enable', async (req, res) => {
    
    const postID = new ObjectId(req.params.id);
    
    try {
        const finalResults =  await db.DbConn().collection('posts').findOne({_id : postID});

        let enable = {
            downloadPrivacy : true
        }

        const UpdatedCountresult =  await db.DbConn().collection('posts').updateOne({_id : postID}, {$set : enable});
        const afterEnable =  await db.DbConn().collection('posts').findOne({_id : postID});
        res.json(afterEnable);
            console.log('enable')

    } catch (error) {
        console.log(error.message);
    }
});

//comments settings
app.post('/account/edit/privacy/:id/disablecomments', async (req, res) => {
    
    const postID = new ObjectId(req.params.id);
    
    try {
        const finalResults =  await db.DbConn().collection('posts').findOne({_id : postID});

        let disableCom = {
            commentsPrivacy : false
        }

        const UpdatedCountresult =  await db.DbConn().collection('posts').updateOne({_id : postID}, {$set : disableCom});
        const afterDisable =  await db.DbConn().collection('posts').findOne({_id : postID});
        res.json(afterDisable);
        console.log('disabledCom')

    } catch (error) {
        console.log(error.message);
    }
});

app.post('/account/edit/privacy/:id/enablecomments', async (req, res) => {
    
    const postID = new ObjectId(req.params.id);
    
    try {
        const finalResults =  await db.DbConn().collection('posts').findOne({_id : postID});

        let enableCom = {
            commentsPrivacy : true
        }

        const UpdatedCountresult =  await db.DbConn().collection('posts').updateOne({_id : postID}, {$set : enableCom});
        const afterDisable =  await db.DbConn().collection('posts').findOne({_id : postID});
        res.json(afterDisable);
        console.log('enabledCom')

    } catch (error) {
        res.status(500).send(`<h1>Server Error</h1><p>${error.message}</p>`);
    }
});


app.get('/account/edit/password/:id', async (req,res) => {

    try {
    
    const id = req.params.id;
    const activeUser = await db.DbConn().collection('users').findOne({userId:id});

    if(!activeUser.loginStatus){
        return res.redirect('/login?userInactive=false'); 
    }

    const user =  await db.DbConn().collection('users').find({userId:id}).toArray();
   
    
    res.render('password',{user:user,empty1:req.query.empty1,passmatch:req.query.passmatch,notmatch:req.query.notmatch})
    
    } catch (error) {
        res.status(500).send(`<h1>Server Error</h1><p>${error.message}</p>`);
    }

})

app.post('/account/edit/password/:id', async (req, res)=> {

    const currentPass = req.body.currentPass;

    const passUser = await db.DbConn().collection('users').findOne({userId:req.params.id});
    const  passEqual = await bcryptjs.compare(currentPass,passUser.password);

    if(!passEqual){
        return res.redirect('/account/edit/password/'+req.params.id+'?passmatch=false');
    }
    
    if(req.body.newPass.trim().length<5){
        return res.redirect('/account/edit/password/'+req.params.id+'?empty1=true');
    }
    
    if(!(req.body.newPass.trim() === req.body.confirmPass.trim())){

         return res.redirect('/account/edit/password/'+req.params.id+'?notmatch=true');
    }


   const hashedpass = await bcryptjs.hash(req.body.newPass,12);

   const updatedPass = {
       password:hashedpass
   }

   try{
       const UpdatedCountresult =  await db.DbConn().collection('users').updateOne({userId:req.params.id}, {$set : updatedPass});
       console.log('updated!!');
   }catch(e){
       console.log(e.message);
   }

   res.redirect('/user/myposts/'+req.params.id+'?resetted=true');

})

app.get('/sign-up', async(req, res) => {

    const emailstatus = req.query.emailstatus;
    const passwordstatus = req.query.passwordstatus;
    const emailpasswordstatus = req.query.emailpasswordstatus;
    const existing = req.query.existing;
    res.render('signup',{emailstatus:emailstatus,passwordstatus:passwordstatus,emailpasswordstatus:emailpasswordstatus,existing:existing});
});

app.post('/sign-up',upload.single('image1'),async(req, res) => {

    const fileUpload = req.file;
    const details = req.body;
    const email = details.email;
    const userName = details.userName;
    const confirmEmail = details.reemail;
    const password = details.password;

    if(email!==confirmEmail && password.trim().length<4){
        return res.redirect('/sign-up?emailpasswordstatus=true');
    }

    if(email!==confirmEmail){
        return res.redirect('/sign-up?emailstatus=true');
    }

    if(password.trim().length<4){
        return res.redirect('/sign-up?passwordstatus=true');
    }

    if(!email || !confirmEmail || !password || password.trim().length<4 || email!==confirmEmail || !email.includes('@') || userName.trim()<6){
        console.log('invalid data');
        return res.redirect('/sign-up');
    }

    const existingUserEmail =  await db.DbConn().collection('users').findOne({email:email});
    if(existingUserEmail){

        return res.redirect('/sign-up?existing=true');
    }

    const hashedpass = await bcryptjs.hash(password,12);
    let userIdURL = uuid.v4();

    const newUser = {

        userName:userName,
        email : email,
        password : hashedpass,
        file : fileUpload.path,
        userId : userIdURL,
        userActive:false,
        loginStatus:false,
        bio : [
            {bioId : 1,msg:''},
            {bioId : 2,msg:''},
            {bioId : 3,msg:''},
            {bioId : 4,msg:''}
        ],
        date:'',
        link : [
            {linkId:1,linkName:'',linkAdd:''},
            {linkId:2,linkName:'',linkAdd:''},
            {linkId:3,linkName:'',linkAdd:''},
            {linkId:4,linkName:'',linkAdd:''}
        ],
        followers : [],
        following : [],
        savedList : [],
        notifications : []
    }

    const userResult =  await db.DbConn().collection('users').insertOne(newUser);

    let userURL = 'https://modern-post-sharing-platform.onrender.com/user/'+userIdURL+'?profileActive=true';

   mailer.mainEmail(email,userURL);
   console.log(userURL)

   res.redirect('/userValidate?email='+email);
   
});

app.post('/login', async(req, res) => {

    const details = req.body;
    const userEmail = details.email;
    const userPass = details.password;

    const existingUser =  await db.DbConn().collection('users').findOne({email:userEmail});
    
    if(!existingUser){
        return res.redirect('/login?notUser=true')
    }

    if(!existingUser.userActive){
        return res.redirect('/login?notActive=true');
    }
        

    const updateUserLoginState = {
        loginStatus : true
    }

    try{
        const UpdatedUserLogin =  await db.DbConn().collection('users').updateOne({email:userEmail}, {$set : updateUserLoginState});
    }catch(e){
        console.log(e.message);
    }

   const  passEqual = await bcryptjs.compare(userPass,existingUser.password);

   if(!passEqual){
    console.log('pass not match');
    return res.redirect('/login?password=true')
   }

   res.redirect('/user/'+existingUser.userId);
});


app.get('/userValidate',(req,res)=> {

    const emailAd = req.query.email;
    res.render('email',{emailAd:emailAd});
})

app.get('/login', async(req, res) => {

    try {
        
   if(req.query.userEnable){
    
    const updateUserLoginState2 = {
        loginStatus : false
    }

    try{
        const UpdatedUserLogin2 =  await db.DbConn().collection('users').updateOne({userId:req.query.userEnable}, {$set : updateUserLoginState2});
    }catch(e){
        console.log(e.message);
    }
   }
   
    const notUser = req.query.notUser;
    const password = req.query.password;
    const passreset = req.query.passreset;

    res.render('login',{notUser:notUser,password:password,passreset:passreset,enable:req.query.userInactive,active:req.query.notActive,profileActive:req.query.profileActive});

    } catch (error) {
       res.status(500).send(`<h1>Server Error</h1><p>${error.message}</p>`);
    }
});

app.get('/reset', async(req, res) => {

    const notUser = req.query.notUser;
   
    res.render('reset',{notUser:notUser});
});

app.post('/reset', async(req, res) => {

    try {
        
    

    const details = req.body;
    const userEmail = details.email;
    const userPass = details.password;

    const existingUser =  await db.DbConn().collection('users').findOne({email:userEmail});
    
    if(!existingUser){
        console.log('not found!');
        return res.redirect('/reset?notUser=true')
    }


    if(!existingUser.userActive){
        return res.redirect('/login?notActive=true');
    }


    const hashedpass = await bcryptjs.hash(userPass,12);

    const updatedPass = {
        password:hashedpass
    }

    try{
        const UpdatedCountresult =  await db.DbConn().collection('users').updateOne({email:userEmail}, {$set : updatedPass});
        //console.log('updated!!');
    }catch(e){
        console.log(e.message);
    }
   
   res.redirect('/login?passreset=true');

    } catch (error) {
        res.status(500).send(`<h1>Server Error</h1><p>${error.message}</p>`); 
    }
});

app.get('/user/:id', async(req, res) => {

    const id = req.params.id;

    try {
        
    const activeUser = await db.DbConn().collection('users').findOne({userId:id});

    if(req.query.profileActive){

        if(activeUser.userActive){
          return res.redirect('/login?profileActive=true');   
        }
    
        const updateUserState = {
            userActive:true
        }
    
        const UpdatedStatus =  await db.DbConn().collection('users').updateOne({userId:id}, {$set : updateUserState});
    }

    if(!activeUser.loginStatus){
        return res.redirect('/login?userInactive=false'); 
    }

    const user =  await db.DbConn().collection('users').find({userId:id}).toArray();

    let devidedUserName = user[0].userName.split(' ').join('');
    const allPosts =  await db.DbConn().collection('posts').find().toArray();

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
      }
      
      shuffleArray(allPosts);
      
    const allUserPosts =  await db.DbConn().collection('posts').find({userID:id}).toArray();

    res.render('userPage',{user:user,allPosts:allPosts,idOne:id,count2:allUserPosts.length,count:undefined,isUpdated:false,isDelete:false,devidedUserName:devidedUserName,userSet:undefined,resetted:false,style1:'',style:'addthis',profedite:false});

    } catch (error) {
      res.status(500).send(`<h1>Server Error</h1><p>${error.message}</p>`)
}
});

// app.get('/user/redirect/:id1/:id2', function (req, res) {

//     const id = req.params.id1

//     res.render('successful');
//    // res.redirect('/user/myposts/'+id);

//     setTimeout(() => {
//         res.redirect('/user/myposts/'+id); // Redirect to the specific route after 2 seconds
//       }, 2000); // 2000 milliseconds = 2 seconds

// });

app.get('/updated', function (req, res) {

    res.render('updated');
});

app.get('/deleted', function (req, res) {

    res.render('deleted');
});

app.get('/user/all-post/:id',  async(req, res) => {

    try {
    
    const receivedValue = req.query.value;
    const activeUser = await db.DbConn().collection('users').findOne({userId:receivedValue});

    if(!activeUser.loginStatus){
        return res.redirect('/login?userInactive=false'); 
    }

    // const id = req.params.id;

    // const activeUser = await db.DbConn().collection('users').findOne({userId:id});
    // if(!activeUser.loginStatus){
    //     return res.redirect('/login?userInactive=false'); 
    // }

    const postID = new ObjectId(req.params.id);
    const resultBefore =  await db.DbConn().collection('posts').findOne({_id : postID});

    if(resultBefore.edited){
        let timeDiff =  timeAgo(resultBefore.lastEdite);

        let newTimegap = {
            timedifference : timeDiff
        }
        try {
            const UpdatedCountresultTime =  await db.DbConn().collection('posts').updateOne({_id : postID}, {$set : newTimegap});
            console.log('time updated')
        } catch (error) {
            console.log(error.message);
        }    
    }

    const updatedCount = {
        viewCount:++resultBefore.viewCount
    }
    const UpdatedCountresult =  await db.DbConn().collection('posts').updateOne({_id : postID}, {$set : updatedCount});

    const result =  await db.DbConn().collection('posts').find({_id : postID}).toArray();
    let hastags;

    const wordLimit = result[0].postcontent.length>500 ? result[0].postcontent.slice(0,500) + '...' : result[0].postcontent;

    if(result[0].hastags===""){
        hastags = undefined;
    }else{
        hastags = result[0].hastags.split(',');
    }
    
    const Commentsresult =  await db.DbConn().collection('comments').find({postId : postID}).toArray();

    const updatePromises = [];

    for (const comment of Commentsresult) {

        let diffTime =  timeAgo(comment.date);

        let differentDate = {
            dateDiff: diffTime
        };
    
        updatePromises.push(db.DbConn().collection('comments').updateOne({ _id: comment._id }, { $set: differentDate }));
    }
    
    try { 
        await Promise.all(updatePromises);

    } catch (e) {
        console.log('Error updating comments:', e.message);
    }

    const likesRresults =  await db.DbConn().collection('posts').findOne({_id : postID});

    const updateLikesListPromises = [];

    for(const oneUser of likesRresults.likes.likeList){
        updateLikesListPromises.push(db.DbConn().collection('users').findOne({ userId: oneUser }));
    }

    let likedArray = [];

    try { 
         const awaitedResult =  await Promise.all(updateLikesListPromises);
    
        for(const oneLikeUser of awaitedResult){
            likedArray.push(oneLikeUser);
        }
    } catch (e) {
        console.log('Error updating comments:', e.message);
    }
  
    let cssLink = '/style/showme.css';
    let cssLink2 = '/';
   
    if(resultBefore.likes.likeList.includes(receivedValue)){
        cssLink = '/style/notShow.css';  
        cssLink2 = '/style/shotShow2.css';   
    }

    let saved = '/style/saved.css';

    if(resultBefore.saved.includes(receivedValue)){
        saved ='/style/notsaved.css';
    }

    const user =  await db.DbConn().collection('users').find({userId:receivedValue}).toArray();
    
     res.render('viwpost', {user:user, result: result,length:Commentsresult.length,receivedValue:receivedValue,hastags:hastags,wordLimit:wordLimit,cssLink:cssLink,cssLink2:cssLink2,likedArray:likedArray,saved:saved});

    } catch (error) {
        res.status(500).send(`<h1>Server Error</h1><p>${error.message}</p>`);
    }
});

app.get('/all-post/:id/comments',  async(req, res) => {

    try {
        
   const postID = new ObjectId(req.params.id);
   const Commentsresult =  await db.DbConn().collection('comments').find({postId : postID}).toArray();
   
   res.json(Commentsresult); 

    } catch (error) {
      res.status(500).send(`<h1>Server Error</h1><p>${error.message}</p>`);   
    }

});

//download 

app.post('/user/all-post/:id/downloads', async (req, res) => {
    
    const postID = new ObjectId(req.params.id);

    try {
        const finalResults =  await db.DbConn().collection('posts').findOne({_id : postID});
        
        const updatedDowloads = {
            downloads:++finalResults.downloads
        }
        const UpdatedCountresult =  await db.DbConn().collection('posts').updateOne({_id : postID}, {$set : updatedDowloads});

        const finalResults2 =  await db.DbConn().collection('posts').findOne({_id : postID});
        res.json(finalResults2); 

    } catch (error) {
        res.status(500).send(`<h1>Server Error</h1><p>${error.message}</p>`);
    }

});

//notification
app.post('/user/notification/:userId', async (req, res) => {
    
    const userId = req.params.userId;
    
    try {
        const finalResults =  await db.DbConn().collection('users').findOne({userId : userId});
        if(finalResults.notifications){
            res.json(finalResults.notifications); 
        }
        
    } catch (error) {
        res.status(500).send(`<h1>Server Error</h1><p>${error.message}</p>`);
    }
});


//likes
app.post('/user/all-post/:id/increseLikes', async (req, res) => {

    try {
    
    const postID = new ObjectId(req.params.id);
    
        const finalResults =  await db.DbConn().collection('posts').findOne({_id : postID});
        if(!(finalResults.likes.likeList.includes(req.query.value))){
            finalResults.likes.likeList.push(req.query.value);
        }
        
        const incresedLikes = {
            likes : {
                likeCount:++finalResults.likes.likeCount,
                likeList : finalResults.likes.likeList
            }
        }
        const UpdatedCountresult =  await db.DbConn().collection('posts').updateOne({_id : postID}, {$set : incresedLikes});

        const finalLiked =  await db.DbConn().collection('posts').findOne({_id : postID});
        res.json(finalLiked); 

    } catch (error) {
        res.status(500).send(`<h1>Server Error</h1><p>${error.message}</p>`);
    }
});

app.post('/user/all-post/:id/decreseLikes', async (req, res) => {
    
    try {
    const postID = new ObjectId(req.params.id);
    //console.log(req.query.value);

        const finalResults =  await db.DbConn().collection('posts').findOne({_id : postID});

        if(finalResults.likes.likeList.includes(req.query.value)){
           let x = finalResults.likes.likeList.indexOf(req.query.value);
           finalResults.likes.likeList.splice(x,1);

           const decresedLikes = {
               likes : {
                   likeCount:--finalResults.likes.likeCount,
                   likeList : finalResults.likes.likeList
               }
           }
           const UpdatedCountresult =  await db.DbConn().collection('posts').updateOne({_id : postID}, {$set : decresedLikes});
        }
        
        const finalLikeddec =  await db.DbConn().collection('posts').findOne({_id : postID});
        res.json(finalLikeddec); 

    } catch (error) {
        res.status(500).send(`<h1>Server Error</h1><p>${error.message}</p>`);
    }
});

//saved
app.post('/user/all-post/:id/saved', async (req, res) => {
    
    try {
    const postID = new ObjectId(req.params.id);
    
        const finalResults =  await db.DbConn().collection('posts').findOne({_id : postID});
        if(!(finalResults.saved.includes(req.query.value))){
            finalResults.saved.push(req.query.value);

            const selectUser =  await db.DbConn().collection('users').findOne({userId:req.query.value});
            selectUser.savedList.push(finalResults);  

            const savedPost = {
                    saved : finalResults.saved   
            }
            const toSaved = {
                savedList : selectUser.savedList
            }

            const UpdatedCountresult =  await db.DbConn().collection('posts').updateOne({_id : postID}, {$set : savedPost});
            const user =  await db.DbConn().collection('users').updateOne({userId:req.query.value}, {$set : toSaved});    
        }

        const finalLiked =  await db.DbConn().collection('posts').findOne({_id : postID});
        res.json(finalLiked); 

    } catch (error) {
        res.status(500).send(`<h1>Server Error</h1><p>${error.message}</p>`);
    }
});

app.post('/user/all-post/:id/removed', async (req, res) => {

   // let index = -1;
    
   try {
    const postID = new ObjectId(req.params.id);

        const finalResults =  await db.DbConn().collection('posts').findOne({_id : postID});

        if(finalResults.saved.includes(req.query.value)){
           let x = finalResults.saved.indexOf(req.query.value);
           finalResults.saved.splice(x,1);

           const savedPost = {
                saved : finalResults.saved   
            }
           const UpdatedCountresult =  await db.DbConn().collection('posts').updateOne({_id : postID}, {$set : savedPost});

        const selectUser =  await db.DbConn().collection('users').findOne({userId:req.query.value});

        let findedindex = findIndex(selectUser.savedList);
        console.log('removing index ' +findedindex);
        selectUser.savedList.splice(findedindex,1);
        
        function findIndex(array){
            
            index = -1;

            for(key of array){
                 console.log(key._id.toString(),req.params.id);

                index++;
                if(key._id.toString() === req.params.id){
                    console.log('removed item found');
                    return index;
                }
            }
        }

        const removedPost = {
            savedList : selectUser.savedList
        }

        const user =  await db.DbConn().collection('users').updateOne({userId:req.query.value}, {$set : removedPost});    
        }
        
        const removedPost =  await db.DbConn().collection('posts').findOne({_id : postID});
        res.json(removedPost); 

    } catch (error) {
        res.status(500).send(`<h1>Server Error</h1><p>${error.message}</p>`);
    }
});

//displaySaved
app.post('/user/myposts/:id/saved', async (req, res) => {
    
    try {
    const userIDNumber = req.params.id;
    // let allUserArray = [];
    // let allUpdatedPromises = [];
    

        const selectUser =  await db.DbConn().collection('users').findOne({userId:userIDNumber});
        // const allPostGet =  await db.DbConn().collection('posts').find({}, { _id: 1 }).toArray();

        // for (const iterator of allPostGet) {
        //     allUserArray.push(iterator._id.toString());
        // }

        // for (const iterator2 of selectUser.savedList) {
        //     if(!(allUserArray.includes(iterator2._id.toString()))){

        //         let findedindex = findIndex(iterator2._id.toString(),selectUser.savedList);
        //         console.log('nothing index' + findedindex);
        //         selectUser.savedList.splice(findedindex,1);

        //         const removedPost = {
        //             savedList : selectUser.savedList
        //         }

        //         allUpdatedPromises.push(db.DbConn().collection('users').updateOne({userId:userIDNumber}, { $set: removedPost }));
                
        //         try { 
        //             const awaitedResult =  await Promise.all(allUpdatedPromises);
        //             console.log(awaitedResult);
               
        //        } catch (e) {
        //            console.log('Error updating ssaved:', e.message);
        //        } 
        //     };    
        // }

        // function findIndex(idNumber,array){
                    
        //     index = -1;

        //     for(key of array){
        //          console.log(idNumber,key._id.toString());

        //         index++;
        //         if(key._id.toString() === idNumber){
        //             console.log('match found '+index);
        //             return index;
        //         }
        //     }
        // }

        if(selectUser.savedList){
          
            res.json(selectUser.savedList); 
            console.log('all sent')
        }

    } catch (error) {
        res.status(500).send(`<h1>Server Error</h1><p>${error.message}</p>`);
    }
});

//followers
app.post('/find/:currentuser/:otheruser/increase', async (req, res) => {
    
    try {
    const currentuser = req.params.currentuser;
    const otheruser = req.params.otheruser;
    
        
        const currentUserFo =  await db.DbConn().collection('users').findOne({userId:currentuser});
        const otheruserFo =  await db.DbConn().collection('users').findOne({userId:otheruser});

        if(!(currentUserFo.following.includes(otheruser))){
            currentUserFo.following.push(otheruser);

            let updateFollowing = {
                following : currentUserFo.following
            }

            const user =  await db.DbConn().collection('users').updateOne({userId:currentuser}, {$set : updateFollowing});  
            console.log('step 1 com')  
        }

        if(!(otheruserFo.followers.includes(currentuser))){
            otheruserFo.followers.push(currentuser);

            let updateFollowingusers = {
                followers : otheruserFo.followers
            }

            const user =  await db.DbConn().collection('users').updateOne({userId:otheruser}, {$set : updateFollowingusers});
            const followers =  await db.DbConn().collection('users').findOne({userId:otheruser});
              
            
            console.log('step 2 com')
            res.json(followers.followers); 
        }

    } catch (error) {
        res.status(500).send(`<h1>Server Error</h1><p>${error.message}</p>`);
    }
});


app.post('/find/:currentuser/:otheruser/decrease', async (req, res) => {
    
    try {
    const currentuser = req.params.currentuser;
    const otheruser = req.params.otheruser;
    
        
        const currentUserFo =  await db.DbConn().collection('users').findOne({userId:currentuser});
        const otheruserFo =  await db.DbConn().collection('users').findOne({userId:otheruser});

        if(currentUserFo.following.includes(otheruser)){
            
            let matchingIndex =  findIndex(otheruser,currentUserFo.following);
            console.log('matching following index is '+matchingIndex);

            currentUserFo.following.splice(matchingIndex,1);

                const removeFollowing = {
                    following : currentUserFo.following
                }

            const user =  await db.DbConn().collection('users').updateOne({userId:currentuser}, {$set : removeFollowing});  
            console.log('step 1 remove com')  
        }

        if(otheruserFo.followers.includes(currentuser)){

            let matchingIndex =  findIndex(currentuser,otheruserFo.followers);
            console.log('matching follower index is '+matchingIndex);

            otheruserFo.followers.splice(matchingIndex,1);

                const removeFollower = {
                    followers : otheruserFo.followers
                }

           
            const user =  await db.DbConn().collection('users').updateOne({userId:otheruser}, {$set : removeFollower});
            const followers =  await db.DbConn().collection('users').findOne({userId:otheruser});
              
            
            console.log('step 2 com')
            res.json(followers.followers); 
        }

        function findIndex(idNumber,array){
                    
            index = -1;

            for(key of array){
                 console.log(idNumber,key);

                index++;
                if(key === idNumber){
                    console.log('match follower found '+index);
                    return index;
                }
            }
        }

    } catch (error) {
        res.status(500).send(`<h1>Server Error</h1><p>${error.message}</p>`);
    }
});


//comentsDelete
app.post('/user/all-post/:id/commentdelete', async (req, res) => {
    
    try {
    const usercomid = new ObjectId(req.query.usercom);
    const comID = new ObjectId(req.params.id);
    
        const deletedResults =  await db.DbConn().collection('comments').deleteOne({_id : comID});
        const finalCommets =  await db.DbConn().collection('comments').find({postId:usercomid}).toArray();
        res.json(finalCommets); 

    } catch (error) {
        res.status(500).send(`<h1>Server Error</h1><p>${error.message}</p>`);
    }
});

//comments

app.post('/user/all-post/:id',  async(req, res) => {

    try {
        
    const value = req.query.value
    const commentID = new ObjectId(req.params.id);
    const user =  await db.DbConn().collection('users').findOne({userId:value});
    
    const newComment = {
        postId : commentID,
        comment : req.body.titlesummery,
        authorID : user.userId,
        authorPost : user.userName,
        autherEmail : user.email,
        autherPic : user.file,
        date : new Date()
    }

    const commentResult =  await db.DbConn().collection('comments').insertOne(newComment);
    res.redirect('/user/all-post/'+req.params.id+'?value='+value);  

    } catch (error) {
       res.status(500).send(`<h1>Server Error</h1><p>${error.message}</p>`);   
    }
 });

app.get('/user/edite/:id', async (req, res)=>{
    
    try {
    const userID = req.query.userID;
    const editepostID = new ObjectId(req.params.id);

       const result =  await db.DbConn().collection('posts').find({_id : editepostID}).toArray();
       const user =  await db.DbConn().collection('users').find({userId:userID}).toArray();

       res.render('editepost', { user:user,result: result,userID:userID });
   } catch (error) {
        res.status(500).send(`<h1>Server Error</h1><p>${error.message}</p>`);
   }

});

app.post('/user/edite/:id', async (req, res) => {

    const id = req.query.userID;
   // const id2 = req.params.id;

    const updatedPost = {

        title : req.body.titlepost,
        hastags : req.body.hashTags,
        edited : true,
        postcontent : req.body.postcontent,
        lastEdite : new Date()
    }

    const updatepostID = new ObjectId(req.params.id);
    try{
        const result =  await db.DbConn().collection('posts').updateOne({_id : updatepostID}, {$set : updatedPost});
        res.redirect('/user/myposts/'+id+'?data=true');
    }catch(e){
        console.log(e.message);
    }
});

app.get('/user/delete/:id2/:id', async (req, res) => {
    
    try{
    const id2 = req.params.id2;
    const deletepostID = new ObjectId(req.params.id);


        const selectUser =  await db.DbConn().collection('users').findOne({userId:id2});

        const oneItem =   selectUser.savedList.filter( item => {
            if(item.userID === id2){
                return item;
            }
        })

        if(oneItem){
            let findedindex = findIndex(selectUser.savedList);
            console.log('deleted index '+findedindex);
            selectUser.savedList.splice(findedindex,1);
            
            function findIndex(array){
                
                index = -1;
    
                for(key of array){
                     console.log(key._id.toString(),req.params.id);
    
                    index++;
                    if(key._id.toString() === req.params.id){
                        console.log(' deleted found yess');
                        return index;
                    }
                }
            }

            const removedPost = {
                savedList : selectUser.savedList
            }
    
            const user =  await db.DbConn().collection('users').updateOne({userId:id2}, {$set : removedPost});    
        }

        const result =  await db.DbConn().collection('posts').deleteOne({_id : deletepostID});
        const result2 =  await db.DbConn().collection('comments').deleteMany({postId : deletepostID});

        let allUserArray = [];
        let allUpdatedPromises = [];
        

       // const selectUser =  await db.DbConn().collection('users').findOne({userId:userIDNumber});
        const allPostGet =  await db.DbConn().collection('posts').find({}, { _id: 1 }).toArray();

        for (const iterator of allPostGet) {
            allUserArray.push(iterator._id.toString());
        }

        for (const iterator2 of selectUser.savedList) {
            if(!(allUserArray.includes(iterator2._id.toString()))){

                let findedindex = findIndex(iterator2._id.toString(),selectUser.savedList);
                console.log('nothing index' + findedindex);
                selectUser.savedList.splice(findedindex,1);

                const removedPost = {
                    savedList : selectUser.savedList
                }

                allUpdatedPromises.push(db.DbConn().collection('users').updateOne({userId:userIDNumber}, { $set: removedPost }));
                
                try { 
                    const awaitedResult =  await Promise.all(allUpdatedPromises);
                    console.log(awaitedResult);
               
               } catch (e) {
                   console.log('Error updating ssaved:', e.message);
               } 
            };    
        }

        function findIndex(idNumber,array){
                    
            index = -1;

            for(key of array){
                 console.log(idNumber,key._id.toString());

                index++;
                if(key._id.toString() === idNumber){
                    console.log('match found '+index);
                    return index;
                }
            }
        }

       
        res.redirect('/user/myposts/'+id2+'?data2=true');
    }catch(e){
        res.status(500).send(`<h1>Server Error</h1><p>${error.message}</p>`);
    }
});

app.use('/',function (req, res) {

    res.render('404');
});


db.connectTo().then(() => {
    app.listen(port);
}).catch((err) => console.log(err.message));


function timeAgo(date) {
    const now = new Date();
    const diff = now - date;

    const seconds = Math.floor(diff / 1000);

if(seconds < 1) {
    return "Just Now";
} else if (seconds < 60) {
    return seconds + "sec ago";
} else if (seconds < 60 * 60) {
    const minutes = Math.floor(seconds / 60);
    return minutes + "m ago";
} else if (seconds < 60 * 60 * 24) {
    const hours = Math.floor(seconds / (60 * 60));
    return hours + "h ago";
} else if (seconds < 60 * 60 * 24 * 7) {
    const days = Math.floor(seconds / (60 * 60 * 24));
    return days + "d ago";
} else if (seconds < 60 * 60 * 24 * 365) {
    const weeks = Math.floor(seconds / (60 * 60 * 24 * 7));
    return weeks + "w ago";
} else {
    const years = Math.floor(seconds / (60 * 60 * 24 * 365));
    return years + "y ago";
}
}
