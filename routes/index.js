const express = require('express');
const controller = require('../controllers/indexController');
const upload = require('../config/multer');
const router = express.Router();

console.log('router loaded');

router.get('/', controller.welcome);
router.get('/setspeedlimit/:speed', controller.setSpeedLimit);
router.get('/first', controller.first);
router.post('/saveFirst', controller.saveFirst);

router.get('/second', controller.second);
router.post('/saveSecond', controller.saveSecond);

router.get('/thrid', controller.third);
//router.post('/image', controller.image);

router.post('/imageview', upload.single('finalimage'), controller.handleUpload);

router.get('/imageview', (req, res)=>{
    res.send('Image uplaoded thanks, Have a good day <br> <a href = "/" > Home</a>');
})

//privite call at server side to convert blob to png ondemand
router.get('/convertblobTopng', controller.convertBlobToPNG);


module.exports = router;