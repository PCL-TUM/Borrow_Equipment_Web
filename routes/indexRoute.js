const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const axios = require('axios');
const config = require('../config');
const encrypt_decrypt_tools = require('../utils/encrypt_decrypt_tools');
const {validateCookieExist} = require('../middleware/validation_user');
const {validateAdminRoute} = require('../middleware/validation_user');
const {validateNotDpmRoute} = require('../middleware/validation_user');
const {validateMemberRoute} = require('../middleware/validation_user');
const {getUserRole} = require('../utils/initial_data_tools');
const {getUserData} = require('../utils/initial_data_tools');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
router.use(cookieParser());

router.get('/',validateCookieExist,validateNotDpmRoute,(req,res,next)=>{
    res.render('index',{title:'ข้อมูลครุภัณฑ์' ,udt : getUserData(req) , role : getUserRole(req)});
})

router.post('/search', (req, res, next) => {
    var search = req.body.search;
    if(search != null){
      axios.post(config.servurl+'/GetData/DataEquipRemain',{
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