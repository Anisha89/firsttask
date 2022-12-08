const mongoose = require('mongoose');
const Schema = mongoose.Schema

const userSchema = new Schema({
    name:{
        type:String
    },
    designation:{
        type:String
    },
    department:{
        type:String
    },
    email:{
        type:String
    },
    password:{
        type:String
    },
    phone:{
        type:Number
    },
    extno:{
        type:Number
    },
    created: {
        type: Date,
        default: Date.now
      },
    reset_password_token: {
        type: String
      },
    reset_password_expires: {
        type: Date
      }
})
const User =mongoose.model('User',userSchema)
module.exports = User