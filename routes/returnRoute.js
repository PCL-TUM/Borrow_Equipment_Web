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
    res.render('return',{title:'ทำรายการคืน', udt : getUserData(req) , role : getUserRole(req)});
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

router.post('/PostReturn',(req,res,next)=>{
    var post_equipment_id = req.body.equipment_id;
    var post_admin_approve_return = req.body.admin_approve_return;
    var post_return_date = req.body.return_date;

    if(post_equipment_id && post_admin_approve_return && post_return_date){ 
        axios
        .post(config.servurl + '/Reverting/UpdateData',{
            equipment_id : post_equipment_id,
            admin_approve_return : post_admin_approve_return,
            return_date : post_return_date,
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
    axios.post(config.servurl + '/GetData/DataReverting')
        .then(function(response) {
            res.send(response.data);
            return;
        })
        .catch(function(error) {
            console.log(error);
        })
})

module.exports = router;