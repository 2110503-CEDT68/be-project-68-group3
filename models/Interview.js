const mongoose = require('mongoose');
const Company = require('./Company');

const InterviewSchema=new mongoose.Schema({
    intDate:{
        type:Date,
        required:true
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'user',
        required:true
    },
    company:{
        type:mongoose.Schema.ObjectId,
        ref:'company',
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
});

module.exports=mongoose.model('Interview',InterviewSchema);