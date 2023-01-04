const { urlencoded } = require('body-parser');
const db = require('./config/mongoose')
const express = require('express');
const multer = require('multer');
const cookieParser = require('cookie-parser');

const app = express();
const session = require('express-session');
const flash = require('connect-flash');
const flashmw = require('./config/flashmw');

const port = 8000;

//multer

app.use(express.urlencoded({ extended: false }));

app.use(express.static('./assests'));
app.use('/uploads', express.static('./uploads'));

app.use(cookieParser());

app.use(session({
    secret:'hack',
    saveUninitialized: true,
    resave: true
}));
  
app.use(flash());
app.use(flashmw.setFlash);
app.set('view engine', 'ejs');
app.set('views', './views');

app.use('/', require('./routes'));
// TODOD add compatabilty check for chrome apis
app.listen(port, function (err) {
    if (err) {
        console.log(`Error in running the server: ${err}`);
    }

    console.log(`Server is running on port: ${port}`);
});
