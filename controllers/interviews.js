const Interview = require('../models/Interview');
const Company = require('../models/Company');
const User = require('../models/User');
async function safeSendEmail(options) {
  try {
    // dynamic require
    const sendEmail = require('../utils/sendEmail');
    return await sendEmail(options);
  } catch (err) {
    // if error then continue without stopping process
    console.warn('sendEmail module not found or failed. Skipping email send. Error:', err && err.message);
    return;
  }
}

// @desc      Get all interviews
// @route     GET /api/v1/interviews
// @access    Private
exports.getInterviews = async (req, res, next) => {
    try {
        let query;

        // Logic: Users see only their interviews; Admins see everything
        if (req.user.role !== 'admin') {
            query = Interview.find({ user: req.user.id });
        } else {
            query = Interview.find();
        }

        const interviews = await query
        .populate({
            path: 'company',
            select: 'name website tel specializations'
        })
        .populate({
            path: 'user',
            select: 'name email specializations'
        });

        res.status(200).json({
            success: true,
            count: interviews.length,
            data: interviews
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Cannot find Interviews" });
    }
};

// @desc      Get single interview
// @route     GET /api/v1/interviews/:id
// @access    Private
exports.getInterview = async (req, res, next) => {
    try {
        const interview = await Interview.findById(req.params.id)
        .populate({
            path: 'company',
            select: 'name website tel specializations'
        })
        .populate({
            path: 'user',
            select: 'name email specializations'
        });

        if (!interview) {
            return res.status(404).json({ success: false, message: `No interview with id of ${req.params.id}` });
        }

        // Authorization check: User must own the interview or be an admin
        if (interview.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, message: "Not authorized to access this interview" });
        }

        res.status(200).json({ success: true, data: interview });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

// @desc      Add interview
// @route     POST /api/v1/companies/:companyId/interviews
// @access    Private
exports.addInterview = async (req, res, next) => {
    try {
        req.body.company = req.params.companyId;
        //req.body.user = req.user.id;
        console.log(req.params.companyId);
        console.log(req.user.id);

        const company = await Company.findById(req.params.companyId);
        if (!company) { 
            return res.status(404).json({ success: false, message: `No company with id of ${req.params.companyId}` });
        }

        const user = await User.findById(req.user.id);
        if(!user){
            return res.status(404).json({ success: false, message: `User with id of ${req.user.id} not found`});
        }

        const userSpecs = Array.isArray(user.specializations) ? user.specializations : [];
        const companySpecs = Array.isArray(company.specializations) ? company.specializations : [];

        const cleanUserSpecs = userSpecs.map(s => String(s).trim());
        const cleanCompanySpecs = companySpecs.map(s => String(s).trim());

        req.body.matching_specialization = cleanUserSpecs.filter(spec => 
            cleanCompanySpecs.includes(spec)
        );

        // Business Logic: Max 3 interviews per user (unless Admin)
        const existedInterviews = await Interview.find({ user: req.user.id });
        if (existedInterviews.length >= 3 && req.user.role !== 'admin') {
            return res.status(400).json({ 
                success: false, 
                message: `The user with ID ${req.user.id} has already made 3 interviews` 
            });
        }

        const intDate = new Date(req.body.intDate);
        const startDate = new Date('2022-05-10T00:00:00Z');
        const endDate = new Date('2022-05-13T23:59:59Z');
        if(intDate < startDate || intDate > endDate){
            return res.status(400).json({success:false,message:'Interview date must be between 10-05-2022 and 13-05-2022'});
        }

        // 3. Create the Interview record
        const interview = await Interview.create(req.body);

        // 4. Prepare English Email Content
        const message = `Dear ${user.name},\n\n` +
            `Your job interview session has been successfully booked with the following details:\n\n` +
            `- Company: ${company.name}\n` +
            `- Interview Date: ${intDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}\n` +
            `- Your Contact Number: ${user.telephone_number}\n` + 
            `- Specialization: ${user.specialization || 'General'}\n\n` +
            `We wish you the best of luck with your upcoming interview!\n\n` +
            `Best regards,\n` +
            `3Job (Online Job Fair Registration System)`;

        // 5. Send Confirmation Email (Async)
        safeSendEmail({
    email: user.email,
    subject: 'Job Interview Appointment Confirmation',
    message, // Fallback for plain text
    html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="text-align: center; margin-bottom: 20px;">
            <img 
            src="https://lh3.googleusercontent.com/u/0/d/1P7a6Xmb7CL8w7akMWOejJb1hKop-PSP3" 
            alt="3Job Logo" 
            style="width: 150px; height: auto; display: block; margin: 0 auto;"
            >
            </div>
            <h2 style="color: #ffffff;background-color: #1656AD; padding: 15px 20px; border-radius: 5px;"> Interview Confirmed!</h2>
            <p>Dear <strong>${user.name}</strong>,</p>
            <p>Your job interview session has been successfully booked.</p>
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Company</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">${company.name}</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Date</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">${intDate.toDateString()}</td>
                </tr>
            </table>
            <p>Best of luck!</p>
            <hr>
            <small>Sent via 3Job Online Registration</small>
        </div>
    `
});
        res.status(201).json({ success: true, data: interview });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Cannot create Interview" });
    }
};

// @desc      Update interview
// @route     PUT /api/v1/interviews/:id
// @access    Private
exports.updateInterview = async (req, res, next) => {
    try {
        let interview = await Interview.findById(req.params.id);

        if (!interview) {
            return res.status(404).json({ success: false, message: `No interview with id of ${req.params.id}` });
        }

        if (interview.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, message: "Not authorized to update this interview" });
        }

        const userId = req.body.user || interview.user;
        const companyId = req.body.company || interview.company;

        const [userData, companyData] = await Promise.all([
            User.findById(userId),
            Company.findById(companyId)
        ]);

        if (userData && companyData) {
            const userSpecs = userData.specializations || [];
            const companySpecs = companyData.specializations || [];
            
            req.body.matching_specializations = userSpecs.filter(spec => 
                companySpecs.includes(spec)
            );
        }

        interview = await Interview.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: interview });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Cannot update Interview" });
    }
};

// @desc      Delete interview
// @route     DELETE /api/v1/interviews/:id
// @access    Private
exports.deleteInterview = async (req, res, next) => {
    try {
        const interview = await Interview.findById(req.params.id);

        if (!interview) {
            return res.status(404).json({ success: false, message: `No interview with id of ${req.params.id}` });
        }

        if (interview.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, message: "Not authorized to delete this interview" });
        }

        await interview.deleteOne();

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Cannot delete Interview" });
    }
};