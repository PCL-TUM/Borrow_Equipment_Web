const express = require('express');
const config = require('./config');
const app = express();

try {
    //Listen on port [config.port = 8000]
    app.listen(config.port, 
        function(){
            console.info(`[SERVER] Listening on port ${config.port}`)

            //Static File
            app.use(express.static('public'));
            app.use('/', express.static(__dirname));

            //Set Views engine
            app.set('views', './views');
            app.set('view engine', 'ejs');

            //Setup Routes
            var indexRoute = require('./routes/indexRoute');
            var signinRoute = require('./routes/signinRoute');
            var reportRoute = require('./routes/reportRoute');
            var borrowRoute = require('./routes/borrowRoute');
            var returnRoute = require('./routes/returnRoute');
            var regisEquipmentRoute = require('./routes/regisEquipmentRoute');
            var regisMemberRoute = require('./routes/regisMemberRoute');
            var departmentRoute = require('./routes/departmentRoute');
            var notificationRoute = require('./routes/notificationRoute');
            var logoutRoute = require('./routes/logoutRoute');

            //Initial Routes
            app.use('/', indexRoute);
            app.use('/signin', signinRoute);
            app.use('/report', reportRoute);
            app.use('/borrow', borrowRoute);
            app.use('/return', returnRoute);
            app.use('/regisEquipment', regisEquipmentRoute);
            app.use('/regisMember', regisMemberRoute);
            app.use('/department', departmentRoute);
            app.use('/notification', notificationRoute);
            app.use('/logout',logoutRoute);

        }
    );

    module.exports = app;
} catch (e) {
    console.log('\x1b[36m%s\x1b[0m', 'Exception:' + e)
}