const mongoose = require('mongoose');
const quest = require('../models/quest')

var LIMIT = false;
var SPEED = 800;  // master variable
var TYPE = '4g';
var currentSpeed = null;


//to set the sped limit
module.exports.setSpeedLimit = function (req, res) {
    SPEED = req.params.speed;
    console.log(SPEED);
    return res.send(`Done, Now we will switch to lighter workflow if user speed is below ${SPEED} kbps`);
}



//starting page
module.exports.welcome = function (req, res) {
    req.flash('success', 'Hi Lets Get started!');
    res.render('welcome');
}


//first 
module.exports.first = function (req, res) {
    //console.log("this", req.cookies.page1type);
    // reset prev values;
    LIMIT = false;
    TYPE = '4g'
    //from DB find the page 1 question 
    quest.find({ page: 1 }, (err, quest) => {
        if (err) {
            console.log('error in db query', err);
            return;
        }

        // there is a cookie saved in client machine that says which connection user is in;
        if (req.cookies.page1type) {
            console.log("cookie found and updated p1");
            TYPE = req.cookies.page1type;
            // also there a download seepd in cookies
            currentSpeed = req.cookies.page1dl;

            // if its less than the confuigured speed then we will limit/ switch to lighter workflow
            if (currentSpeed < SPEED) {
                LIMIT = true;
            }
        };

        

        // configuring message color to show to user;
        var messagetype = null;
        if (LIMIT) {
            messagetype = 'error';  
        } else {
            messagetype = 'success'; 
        }

        // notify user with his current speed;
        req.flash(messagetype, `Current speed ${currentSpeed}kbps `);

        
        //if 4g normal workflow
        if (LIMIT==false && TYPE === '4g') {
            
            return res.render("first", { "que": quest[0].questions });
        }

        //if 3g or limit only required question
        else if (LIMIT || TYPE === '3g') {
            //filter out optional questions and send only required 
            const finalize = quest[0].questions.filter((q) => {
                return typeof q.r != 'undefined';
            });
            return res.render("first", { "que": finalize });
        }

        //if 2g or limit only required question
        else if (LIMIT || TYPE === '2g') {
            //filter out optional questions and send only required 
            const finalize = quest[0].questions.filter((q) => {
                return typeof q.r != 'undefined';
            });
            return res.render("first", { "que": finalize });
        }
           
    })

}

// smimilarly page 2
module.exports.second = function (req, res) {
    LIMIT = false;
    TYPE = '4g';
    quest.find({ page: 2 }, (err, quest) => {
        if (err) {
            console.log('error in db query', err);
            return;
        }

        
        if (req.cookies) {
            //console.log("cookie found and updated p2");
            TYPE = req.cookies.page2type;
             currentSpeed = req.cookies.page2dl;
            if (currentSpeed < SPEED) { LIMIT = true; }
        };
        
        //notify user in red or green
        var messagetype = null;
        if (LIMIT) {
            messagetype = 'error';  
        } else {
            messagetype = 'success';   
        }
        req.flash(messagetype, `Current speed ${currentSpeed} kbps`);

        // if 4g work as normal
        if (LIMIT == false  && TYPE == '4g') {
            return res.render("second", { "que": quest[0].questions });
        }

        //if 3g or limit show only required question
        else if (LIMIT || TYPE == '3g') {
            //filter out optional questions and send only required 
            const finalize = quest[0].questions.filter((q) => {
                return typeof q.r != 'undefined';
            });
            return res.render("second", { "que": finalize });
        }


        //if 2g or limit only required question
        else if (LIMIT || TYPE == '2g') {
            //filter out optional questions and send only required 
            const finalize = quest[0].questions.filter((q) => {
                return typeof q.r != 'undefined';
            });
            return res.render("second", { "que": finalize });
        }
        
    })
}

module.exports.saveFirst = function (req, res) {
    //TO DO save the page 1 data
   // console.log('hit save 1: redirect to 2');
    res.redirect("second");
}

module.exports.saveSecond = function (req, res) {
    //TO DO save the page 2 data
    res.redirect("thrid");
}

module.exports.third = function (req, res) {

    LIMIT = false;
    TYPE = '4g';
    if (req.cookies.page2type) {
        //console.log("cookie found and updated p2");
        TYPE = req.cookies.page3type;
        currentSpeed = req.cookies.page3dl;
        if (currentSpeed < SPEED) { LIMIT = true; }

    };

    //notify user speed
    var messagetype = null;
    if (LIMIT) {
        messagetype = 'error';
        
    } else {
        messagetype = 'success';
        
    }
    req.flash(messagetype, `Current speed ${currentSpeed} kbps`);


    // apply image compression logic only in 3g or 2g or limit
    if (LIMIT || TYPE === '3g' || TYPE === '2g') {
        res.render('thrid', { "imageCompression": true });
    } else {
        // if no limit TODO add image enhancment alorithms
        res.render('thrid', { "imageCompression": false});
    }
    
}


module.exports.handleUpload = function (req, res, next) {
    //console.log('blob file', req.body.finalimage);
    // req.file is the `profile-file` file
    // req.body will hold the text fields, if there were any
    console.log('File details here: ',JSON.stringify(req.file))
    //  var response = '<a href="/">Home</a><br>'
    //  response += "Files uploaded successfully.<br>"
    // response += `<img src="${req.file.path}" /><br>`
    
     return res.render('imageview', { imgsource: req.file.path });
    
     
    //return res.render('imageview');
}

//for converting binary file to image inside server


module.exports.convertBlobToPNG = function (req, res)  {
    const fs = require('fs');
    const mime = require('mime');

    const binaryString = fs.readFileSync('compressed_image.blb');

    const buffer = Buffer.from(binaryString, 'binary').toString('binary');

    
    const mimeType = mime.getType('compressed_image.txt');
    console.log(mimeType);
    const sharp = require('sharp');

    sharp(buffer, {
        create: {
            width: 100,
            height: 100,
            channels: 4,
            background: 'white',
        },
    })
        .toFormat('jpeg')
        .toFile('image.png', (err) => {
            if (err) {
                console.error(err);
            } else {
                console.log("done converting")
            }
        });
    res.send('seems fine for now');
};
