const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const axios = require('axios');
const config = require('../config');
const encrypt_decrypt_tools = require('../utils/encrypt_decrypt_tools');
const {validateCookieExist} = require('../middleware/validation_user');
const {validateAdminRoute} = require('../middleware/validation_user');
const {validateDpmRoute} = require('../middleware/validation_user');
const {validateMemberRoute} = require('../middleware/validation_user');
const {getUserRole} = require('../utils/initial_data_tools');
const {getUserData} = require('../utils/initial_data_tools');

router.use(bodyParser.urlencoded({extended : false}));
router.use(bodyParser.json());
router.use(cookieParser());

router.get('/', validateCookieExist,validateAdminRoute,(req, res, next) => {
    res.render('regisEquipment',{title:'ลงทะเบียนครุภัณฑ์', udt : getUserData(req) , role : getUserRole(req)});
})
router.post('/PostRegisterEquip',(req,res,next)=>{
    var post_rfid = req.body.rfid;
    var post_equipment_name = req.body.equipment_name;
    var post_brand = req.body.brand;
    var post_model = req.body.model;
    var post_equipment_number = req.body.equipment_number;
    var post_serial_number = req.body.serial_number;
    var post_description = req.body.description;
    var post_datetime = req.body.datetime;
    var post_create_by = req.body.create_by;

    if(post_rfid && post_equipment_name && post_brand && post_model && post_equipment_number && post_description &&  post_datetime && post_create_by){ 
        //log
        axios
        .post(config.servurl + '/Backup',{
            backup_type: 2,
            admin_id: getUserData(req).id,
            edit_data: "equipment",
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
            type_user : 4,
            rfid : post_rfid,
            equipment_name : post_equipment_name,
            brand : post_brand,
            model : post_model,
            equipment_number : post_equipment_number,
            serial_number : post_serial_number,
            description : post_description,
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

router.post('/PostEditEquip',(req,res,next)=>{
    var post_id = req.body.id;
    var post_rfid = req.body.rfid;
    var post_equipment_name = req.body.equipment_name;
    var post_brand = req.body.brand;
    var post_model = req.body.model;
    var post_equipment_number = req.body.equipment_number;
    var post_serial_number = req.body.serial_number;
    var post_description = req.body.description;
    var post_datetime = req.body.datetime;
    var post_update_by = req.body.update_by;
    
    if(post_id){
      //log
      axios
      .post(config.servurl + '/Backup',{
          backup_type: 2,
          admin_id: getUserData(req).id,
          edit_data: "equipment",
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
        type_user : 4,
        id : post_id,
        rfid : post_rfid,
        equipment_name : post_equipment_name,
        brand : post_brand,
        model : post_model,
        equipment_number : post_equipment_number,
        serial_number : post_serial_number,
        description : post_description,
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
    } else{
      res.status(400).send('This request is not complete.'); //echo
      return;
    }
    
})

router.post('/PostDeleteEquip',(req,res,next)=>{
    var post_id = req.body.id;
    var post_datetime = req.body.datetime;
    if(post_id != null && post_datetime != null){
      //log
      axios
      .post(config.servurl + '/Backup',{
          backup_type: 2,
          admin_id: getUserData(req).id,
          edit_data: "equipment",
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
        type_user : 4,
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
    var rfid = req.body.rfid;
    var search = req.body.search;
    if(search != null){
      axios.post(config.servurl+'/GetData/DataEquip',{
        rfid : rfid,
        search_value : search
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
module.exports = router;