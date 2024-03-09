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

router.get('/', validateCookieExist,validateAdminRoute, (req, res, next) => {
    res.render('report', { title: 'รายงาน', udt: getUserData(req), role: getUserRole(req) });
})

router.post('/search', (req, res, next) => {
    var Post_typeSearch = req.body.typeSearch;
    var Post_firstDate = req.body.firstDate;
    var Post_untilDate = req.body.untilDate;
    if (Post_typeSearch != null && Post_firstDate != null && Post_untilDate != null) {
        axios.post(config.servurl + '/GetData/DataReport', {
                typeSearch: Post_typeSearch,
                firstDate: Post_firstDate,
                untilDate: Post_untilDate
            })
            .then(function(response) {
                res.send(response.data);
                return;
            })
            .catch(function(error) {
                console.log(error);
            })
    } else {
        res.status(400).send('This request is not complete.'); //echo
        return;
    }
})
module.exports = router;