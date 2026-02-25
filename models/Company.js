const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
    name: {
        type:String,
        required: [true,'Please add a name'],
        unique : true,
        trim : true,
        maxlength:[100,'Name can not be more than 100 characters']
    },
    address:{
        type:String,
        required:[true,'Please add an address']
    },
    website:{
        type:String,
        required:[true,'Please add a company\'s website']
    },
    description:{
        type:String,
        required: [true,'Please add description'],
    },
    tel:{
        type:String,
        required:[true,'Please add a telephone number']
    }
},{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
});

//Reverse populate with virtuals
CompanySchema.virtual('interviews',{
    ref: 'Interview',
    localField: '_id',
    foreignField: 'company',
    justOne: false
});


module.exports = mongoose.model('Company',CompanySchema);