const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const axios = require('axios');
const config = require('../config');
const encrypt_decrypt_tools = require('../utils/encrypt_decrypt_tools');
const { validateCookieExist } = require('../middleware/validation_user');
const { validateAdminRoute } = require('../middleware/validation_user');
const { validateDpmRoute } = require('../middleware/validation_user');
const { validateMemberRoute } = require('../middleware/validation_user');
const { getUserRole } = require('../utils/initial_data_tools');
const { getUserData } = require('../utils/initial_data_tools');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
router.use(cookieParser());

router.get('/', validateCookieExist,validateDpmRoute, (req, res, next) => {
    res.render('department', { title: 'department', udt: getUserData(req), role: getUserRole(req) });
})

router.post('/PostEquipDmp', (req, res, next) => {
    var post_rfid = req.body.rfid;
    var post_dpmID = req.body.dpmID;
    var post_datetime = req.body.datetime;
    console.log(post_rfid);
    console.log(post_dpmID);
    console.log(post_datetime);
    if (post_rfid != null && post_dpmID != null && post_datetime != null) {
        axios
            .post(config.servurl + '/SetData/setDpmID', {
                rfid: post_rfid,
                dpmID: post_dpmID,
                datetime: post_datetime,
            })
            .then(function(response) {
                res.status(200).send(response.data);
                return;
            })
            .catch(function(error) {
                res.send(error);
                return;
            });
    } else {
        res.status(400).send('This request is not complete.'); //echo
        return;
    }
})
module.exports = router;