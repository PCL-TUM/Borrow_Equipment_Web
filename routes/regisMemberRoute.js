const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const axios = require('axios');
const config = require('../config');
const multer = require('multer');
const FormData = require('form-data');
const fs = require('fs');
const encrypt_decrypt_tools = require('../utils/encrypt_decrypt_tools');
const {validateCookieExist} = require('../middleware/validation_user');
const {validateAdminRoute} = require('../middleware/validation_user');
const {validateDpmRoute} = require('../middleware/validation_user');
const {validateMemberRoute} = require('../middleware/validation_user');
const {getUserRole} = require('../utils/initial_data_tools');
const {getUserData} = require('../utils/initial_data_tools');
const upload = multer({ dest:'./profiles' })

router.use(bodyParser.urlencoded({extended : false}));
router.use(bodyParser.json());
router.use(cookieParser());

router.get('/',validateCookieExist,validateAdminRoute, (req, res, next) => {
    res.render('regisMember',{title:'ลงทะเบียนบุคลากร', udt : getUserData(req) , role : getUserRole(req) });
})

//action => /UploadImageProfile
//post => /UploadImageProfile?post=true
//delete => /UploadImageProfile?clrimage=ce2786da9b29f4de11f942806841f14d

router.post('/UploadImageProfile',upload.single('file'),(req,res,next)=>{
    if(req.query.post){
      //request
      var post_filename = req.body.filename;
      var post_rfid = req.body.rfid;
      var post_datetime = req.body.datetime;
       //log
       axios
       .post(config.servurl + '/Backup',{
           backup_type: 2,
           admin_id: getUserData(req).id,
           edit_data: "member",
           edit_date: post_datetime,
       })
       .then(function(response){
           console.log(response.data);
       })
       .catch(function(err){
           console.log(error);
       })
      //post
      var form = new FormData();
      form.append('file',fs.readFileSync('./profiles/'+post_filename) ,post_rfid + Date.now() +'.jpg');
      form.append('rfid',post_rfid)
      axios({
      method: 'post',
      url: config.servurl + '/UploadFiles/uploadImageProfile',
      data: form,
      headers: {
          'Content-Type': `multipart/form-data; boundary=${form._boundary}`
      }
      })
      .then(function(response){
          res.status(200).send(response.data); 
          return;
      })
      .catch(function (error) {
          res.send(error); 
          return;
      });
    } else if(req.query.clrimage) {
      //delete
      let path = "./profiles/" + req.query.clrimage;

      //ลบรูปเก่า
      fs.unlink(path, function (err) {
        if (err) {
          console.error(err);
        } else {
          console.log("File removed:", path);
        }
      });
    }
    else{
      //action
      res.status(200).send(req.file); 
      return;
    }
})

router.post('/PostRegisterMember',(req,res,next)=>{
    //userdata
    var post_rfid = req.body.rfid;
    var post_username = req.body.username;
    var post_password = req.body.password;
    var post_firstname = req.body.firstname;
    var post_lastname = req.body.lastname;
    var post_gender = req.body.gender;
    var post_telephone = req.body.telephone;
    var post_datetime = req.body.datetime;
    var post_create_by = req.body.create_by;

    if(post_rfid && post_username && post_password && post_firstname && post_lastname && post_gender && post_telephone &&  post_datetime && post_create_by){ 
        //log
        axios
        .post(config.servurl + '/Backup',{
            backup_type: 2,
            admin_id: getUserData(req).id,
            edit_data: "member",
            edit_date: post_datetime,
        })
        .then(function(response){
            console.log(response.data);
        })
        .catch(function(err){
            console.log(error);
        })
        //post
        axios
        .post(config.servurl + '/Register/PostRegis',{
            type_user : 3,
            rfid : post_rfid,
            username : post_username,
            enc_password : post_password,
            firstname : post_firstname,
            lastname : post_lastname,
            gender : post_gender,
            telephone : post_telephone,
            datetime : post_datetime,
            create_by : post_create_by,
        })
        .then(function(response){
            res.status(200).send(response.data); 
            return;
        })
        .catch(function (error) {
            res.send(error); 
            return;
        });
    }else{
        res.status(400).send('This request is not complete.'); //echo
        return;
    }
})

router.post('/PostEditMember',(req,res,next)=>{
    var post_id = req.body.id;
    var post_rfid = req.body.rfid;
    var post_username = req.body.username;
    var post_password = req.body.password;
    var post_firstname = req.body.firstname;
    var post_lastname = req.body.lastname;
    var post_gender = req.body.gender;
    var post_telephone = req.body.telephone;
    var post_datetime = req.body.datetime;
    var post_update_by = req.body.update_by;

    if(post_id){
        //log
        axios
        .post(config.servurl + '/Backup',{
            backup_type: 2,
            admin_id: getUserData(req).id,
            edit_data: "member",
            edit_date: post_datetime,
        })
        .then(function(response){
            console.log(response.data);
        })
        .catch(function(err){
            console.log(error);
        })
        //post
        axios
        .post(config.servurl + '/EditData/UpdateData',{
            type_user : 3,
            id : post_id,
            rfid : post_rfid,
            username : post_username,
            enc_password : post_password,
            firstname : post_firstname,
            lastname : post_lastname,
            gender : post_gender,
            telephone : post_telephone,
            datetime : post_datetime,
            update_by : post_update_by,
        })
        .then(function(response){
            res.status(200).send(response.data); 
            return;
        })
        .catch(function (error) {
            res.send(error); 
            return;
        });
    }else{
        res.status(400).send('This request is not complete.'); //echo
        return;
    }
})

router.post('/PostDeleteMember',(req,res,next)=>{
    var post_id = req.body.id;
    var post_datetime = req.body.datetime;
    if(post_id != null && post_datetime != null){
      //log
      axios
      .post(config.servurl + '/Backup',{
          backup_type: 2,
          admin_id: getUserData(req).id,
          edit_data: "member",
          edit_date: post_datetime,
      })
      .then(function(response){
          console.log(response.data);
      })
      .catch(function(err){
          console.log(error);
      })
      //post
      axios.post(config.servurl+'/DeleteData/',{
        type_user : 3,
        id : post_id,
        datetime : post_datetime
      })
      .then(function (response) {
        res.status(200).send(response.data);
        return;
      })
      .catch(function (error) {
        res.send(error); 
        return;
      })
    }else{
      res.status(400).send('This request is not complete.'); //echo
      return;
    }
})

router.post('/search',(req,res,next)=>{
    var post_search = req.body.search;
    var post_rfid = req.body.rfid;
    
    axios.post(config.servurl+'/GetData/DataMember',{
      search_value : post_search,
      rfid : post_rfid
    })
    .then(function (response) {
      res.status(200).send(response.data);
      return;
    })
    .catch(function (error) {
      res.send(error); 
      return;
    })
})
module.exports = router;