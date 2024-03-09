const crypto = require('crypto');
const algorithm = 'aes-256-ctr';
const key = "9fa979f20196cb09aa695a8f995f6d85";
const iv = '15785ad36a5d9485';
// const iv = crypto.randomBytes(16);


module.exports = {
    encrypt : function (text){
        let cipher = crypto.createCipheriv(algorithm, key, iv);
        let encrypted = cipher.update(text, 'utf8', 'base64');
        encrypted += cipher.final('base64');
        return encrypted;

    },
    decrypt : function (encrypted){
        let decipher = crypto.createDecipheriv(algorithm, key, iv);
        let decrypted = decipher.update(encrypted, 'base64', 'utf8');
        return (decrypted + decipher.final('utf8'));
    }
}
