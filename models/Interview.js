const mongoose = require('mongoose');
const Company = require('./Company');

const InterviewSchema=new mongoose.Schema({
    intDate:{
        type:Date,
        required:true
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:true
    },
    company:{
        type:mongoose.Schema.ObjectId,
        ref:'Company',
        required:true
    },
    matching_specialization: {
        type: [String],
        default: [],
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
},{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
});

InterviewSchema.pre('save', async function () {
  // Only run this if you want the backend to auto-calculate the match
  try {
    const User = mongoose.model('User');
    const Company = mongoose.model('Company');

    const userData = await User.findById(this.user);
    const companyData = await Company.findById(this.company);

    if (!userData || !companyData) {
        console.log('Match failed: User or Company doc not found');
        return;
    }

    // Find the intersection of both arrays
    const userSpecs = (userData.specializations || []).map(s => String(s).trim().toLowerCase());
    const companySpecs = (companyData.specializations || []).map(s => String(s).trim().toLowerCase());

    console.log('Normalized User Specs:', userSpecs);
    console.log('Normalized Company Specs:', companySpecs);

    // We filter the ORIGINAL user specializations but check against the normalized company list
    const originalUserSpecs = userData.specializations || [];
    
    this.matching_specialization = originalUserSpecs.filter(spec => {
      const cleanSpec = String(spec).trim().toLowerCase();
      return companySpecs.includes(cleanSpec);
    });

    console.log('Matches Found and Saved:', this.matching_specialization);

  } catch (err) {
    console.error('Logic Error:', err.message);
    throw err;
  }
});

InterviewSchema.virtual('live_match').get(function() {
  if (!this.user.specializations || !this.company.strengths) return [];
  return this.user.specializations.filter(spec => 
    this.company.strengths.includes(spec)
  );
});

module.exports=mongoose.model('Interview',InterviewSchema);