let Mobile = require('./mobileModel.js');
let Feed = require('../feed/feed.js')
var nodemailer = require('nodemailer');

module.exports = {
  
  getAllMobiles: function(req, res) {
        Mobile.find({}, function(err, AllMobile) {
            if(err) {
                res.status(500).send('err');
            }else{
                res.json(AllMobile);
            }
        });
    },
    getAllMobile: function(req, res) {
        Mobile.find({company: req.params.company}, function(err, AllMobile) {
            if(err) {
                res.status(500).send('err');
            }else{
                res.json(AllMobile);
            }
        });
    },
    insertMobile: function(req, res) {
        Mobile.findOne({name: req.body.name})
        .exec(function(err, mobile) {

            if(mobile) {
                res.json(new Error('mobile already exists'));
            }else{
                let newMobile = new Mobile({
                    name: req.body.name,
                    company: req.body.company,
                    color: req.body.color,
                    os: req.body.os,
                    size: req.body.size,
                    camera: req.body.camera,
                    battery: req.body.battery,
                    memory: req.body.memory,
                    processor: req.body.processor,
                    image: req.body.image,
                    display: req.body.display,
                });
                newMobile.save(function(err, newMobile) {
                    var emails = [];
                    if(err) {
                        res.status(500).send(err);
                    }else{
                        Feed.find({},function(err,data){
                            for(let i of data){
                                emails.push(i.email)
                            }
                            var transporter = nodemailer.createTransport({
                             service: 'gmail',
                             auth: {
                                 user: 'smartmobilytech@gmail.com', 
                                 pass: 'mosm1234' 
                             }
                         });

                            var mailOptions = {
                              from: 'smartmobilytech@gmail.com', 
                              to: emails, 
                              subject: 'Email Example',
                              text: "hi come to us to see the new Mobile",
                               html: '<b>hi come to us to see the new Mobile✔</b>' 
                          };
                          transporter.sendMail(mailOptions, function(error, info){
                              if(error){
                                 console.log(error);
                             }else{
                              console.log('Message sent: ' + info.response);
                          };
                      });
                      })
                        res.json(newMobile);
                    }
                });
            }
        });
    },
    editMobile : function(req,res){
      console.log(req.body)
      var id=req.body.id;
      delete req.body['id'];
      
      Mobile.update({_id:id},req.body,function(err,data){
        if (err){
          res.json(err)
        }else{
          res.json("updated done!!")
        }
      })
      
      
  },
  removeMob :function(req,res){
    console.log(req.body)
      var id=req.body.id;
      Mobile.remove({_id:id},function(err,done){
        if (err){
          res.json(err)
        }else{
          res.json("Removed done!!")
        }
      })

  },
  getmobile :function(req,res){
    var name=req.params.name;
    console.log(name)
    Mobile.findOne({name:name},function(err,mobile){
      console.log(mobile)
      if(err) {
                res.status(500).send('err');
            }else{
                res.json(mobile);
            }
    })
  }
};
