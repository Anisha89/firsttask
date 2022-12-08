const express = require('express')
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const async = require('async')
const crypto = require('crypto')
const email = 'shabanu08@gmail.com';
const pass = 'Anisha124';
const _= require('lodash')

var smtpTransport = nodemailer.createTransport({
    service:  'Gmail',
    auth: {
      user: email,
      pass: pass
    }
  });

const register = (req,res,next) =>{
    bcrypt.hash(req.body.password,10,function(err, hashedPass){
        if(err){
            res.json({
                error:err
            })
        }
        let user = new User({
            name:req.body.name,
            designation:req.body.designation,
            department:req.body.department,
            email:req.body.email,
            password:hashedPass,
            phone:req.body.phone,
            extno:req.body.extno
        })
    
        user.save()
        .then(user =>{
            res.json({
                message:'User Added Successfully!'
            })
        })
        .catch(error =>{
            res.json({
                message:'An Error Occured!'
            })
        })
    })
    
}

const login =async(req,res,next) =>{
    var username = req.body.username
    var password = req.body.password
    User.findOne({$or: [{email:username},{phone:username}]})
    .then(user =>{
        if(user){
          bcrypt.compare(password,user.password,function(err,results){
              if(err){
                  res.json({
                      error:err
                  })
              }
             if(results){
                 let token = jwt.sign({name:user.name},'AZQ,PI)0(',{expiresIn:'1h'})
                 res.json({
                     message:'Login Successful!!!!',
                     token
                 })
             }
             else{
                 res.json({
                     message:'password does not matched!!!'
                 })
             }
          })
        }
        else{
            res.json({
                message:'no user found'
            })
        }
    })
}


const forgot_password = async(req, res) =>{
    async.waterfall([
      function(done) {
        User.findOne({
          email: req.body.email
        }).exec(function(err, user) {
          if (user) {
            done(err, user);
          } else {
            done('User not found.');
          }
        });
      },
      function(user, done) {
        // create the random token
        crypto.randomBytes(20, function(err, buffer) {
          var token = buffer.toString('hex');
          done(err, user, token);
        });
      },
      function(user, token, done) {
        User.findByIdAndUpdate({ _id: user._id }, { reset_password_token: token, reset_password_expires: Date.now() + 86400000 }, { upsert: true, new: true }).exec(function(err, new_user) {
          done(err, token, new_user);
        });
      },
      function(token, user, done) {
        var data = {
          to: user.email,
          from: email,
          template: 'forgot-password-email',
          subject: 'Password help has arrived!',
          html:`<h2> please click on given link to reset your password</h2>
                <p>${'http://localhost:3000/api/user/reset_password/'}/${token}</p>
          
          `,
          context: {
            url: 'http://localhost:3000/auth/reset_password?token=' + token,
            name: user.name.split(' ')[0]
          }
        
          
        };
  
        smtpTransport.sendMail(data, function(err) {
          if (!err) {
              console.log(data.response)
            return res.json({ message: 'Kindly check your email for further instructions' });
          } else {
            return done(err);
          }
        });
      }
    ], function(err) {
      return res.status(422).json({ message: err });
    });
  };

  
    
    
const reset_password = async(req,res) =>{

  const {reset_password_token,newpass} = req.body;
  User.findOne({reset_password_token},(err,user)=>
  {
    if(err || !user)
    {
      return res.status(400).json({error:"user does not exist"});
    }
    const obj ={
      password: newpass
    }
    user = _.extend(user,obj);
    user.save((err,result) =>
    {
      if(err){
        return res.status(400).json({error:"reset password error"});
      }
      else{
        return res.status(200).json({message:'Your password changed Successfully'})
      }
    
    })
  })

}







const list = async (req,res,next)=>{
    try
    {
        const getAll=await User.find();
        res.status(200).json(getAll);
    }
    catch(err){
        res.json({"err":err})
    }

}


const getbyid = async (req,res,next) =>{
    try
    {
       
        const getbyID=await User.findById(req.params.id);
        res.status(200).json(getbyID);
    }
    catch(err){
        res.json({"err":err})
    }
}


const update = async(req,res,next) =>{
    try
    {
        const updUser=await User.updateOne({_id:req.params.id},{$set:
            {
                name:req.body.name,
                
                 designation:req.body.designation,
                 department:req.body.department,
                 email:req.body.email,
                 password:req.body.password,
                 phone:req.body.phone,
                 extno:req.body.extno}});
        res.status(200).json(updUser);
    }
    catch(err){
        res.json({"err":err})
    }
}

const remove = async (req,res,next) =>{
    try
    {
        const delUser=await User.remove({_id:req.params.id});
        res.status(200).json(delUser);
    }
    catch(err){
        res.json({"err":err})
    }
}

module.exports = {
    register,login,forgot_password, reset_password,list,getbyid,update,remove
}