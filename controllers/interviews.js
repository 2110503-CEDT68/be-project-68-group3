const Interview = require('../models/Interview');
const Company = require('../models/Company');
const User = require('../models/User');

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

        const interviews = await query.populate({
            path: 'company',
            select: 'name website tel'
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
        const interview = await Interview.findById(req.params.id).populate({
            path: 'company',
            select: 'name website tel'
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
        req.body.user = req.user.id;
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


        const interview = await Interview.create(req.body);

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