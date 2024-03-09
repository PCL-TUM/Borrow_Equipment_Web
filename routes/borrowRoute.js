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

router.get('/',validateCookieExist,validateAdminRoute, (req, res, next) => {
    res.render('borrow',{title:'ทำรายการยืม', udt : getUserData(req) , role : getUserRole(req)});
})
router.post('/PostReceiveMember',(req,res,next)=>{
    var post_member_rfid = req.body.member_rfid;
    if(post_member_rfid){ 
        axios
        .post(config.servurl + '/GetData/DataMember',{
            rfid : post_member_rfid,
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
router.post('/PostReceiveEquip',(req,res,next)=>{
    var post_equip_rfid = req.body.equip_rfid;
    if(post_equip_rfid){ 
        axios
        .post(config.servurl + '/GetData/DataEquip',{
            rfid : post_equip_rfid,
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

router.post('/PostBorrow',(req,res,next)=>{
    var post_member_id = req.body.member_id; 
    var post_equipment_id = req.body.equipment_id;
    var post_admin_approve_borrow = req.body.admin_approve_borrow;
    var post_borrow_date = req.body.borrow_date;

    if(post_member_id && post_equipment_id && post_admin_approve_borrow && post_borrow_date){ 
        axios
        .post(config.servurl + '/Borrowing/insertData',{
            member_id : post_member_id,
            equipment_id : post_equipment_id,
            admin_approve_borrow : post_admin_approve_borrow,
            borrow_date : post_borrow_date,
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
router.post('/search', (req, res, next) => {
    axios.post(config.servurl + '/GetData/DataBorrowing')
        .then(function(response) {
            res.send(response.data);
            return;
        })
        .catch(function(error) {
            console.log(error);
        })
})

module.exports = router;