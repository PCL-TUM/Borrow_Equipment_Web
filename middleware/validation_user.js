const config = require('../config');
const encrypt_decrypt_tools = require('../utils/encrypt_decrypt_tools');

module.exports = {
    accessCookieExist : function (req,res,next){
        const {cookies} = req;
        if(Object.keys(cookies).length > 0){
            res.status(200).redirect(config.weburl);
            return;
        }else{
            next();
        }
    },
    validateAdminRoute:function(req,res,next){
        const {cookies} = req;
        var user_data = JSON.parse(encrypt_decrypt_tools.decrypt(cookies.UDT));
        if(user_data.role === 'admin'){
            next();
        }else{
            res.status(404).send('404');
            return;
        }
    },
    validateDpmRoute:function(req,res,next){
        const {cookies} = req;
        var user_data = JSON.parse(encrypt_decrypt_tools.decrypt(cookies.UDT));
        if(user_data.role === 'dpm'){
            next();
        }else{
            res.status(404).send('404');
            return;
        }
    },
    validateMemberRoute:function(req,res,next){
        const {cookies} = req;
        var user_data = JSON.parse(encrypt_decrypt_tools.decrypt(cookies.UDT));
        if(user_data.role === 'member'){
            next();
        }else{
            res.status(404).send('404');
            return;
        }
    },
    validateNotDpmRoute:function(req,res,next){
        const {cookies} = req;
        var user_data = JSON.parse(encrypt_decrypt_tools.decrypt(cookies.UDT));
        if(user_data.role !== 'dpm'){
            next();
        }else{
            res.status(404).send('404');
            return;
        }
    },
    validateCookieExist : function (req,res,next){
        const {cookies} = req;
        if(Object.keys(cookies).length > 0){
            next();
        }else{
            res.status(200).redirect(config.weburl + 'signin');
            return;
        }
    }
    
}