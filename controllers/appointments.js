const Appointment = require('../models/Appointment');
const Hospital = require('../models/Hospital');

//Get all appointments
//@route GET /api/v1/appointments
//public
exports.getAppointments= async (req,res,next)=>{
    try{
    let query;

    //users can see ONLY their appointments
    if(req.user.role !== 'admin'){
        query=Appointment.find({user:req.user.id}).populate({
            path:'hospital',
            select:'name province tel'
        });
    }else //admin can see all appointments
        {
            query=Appointment.find().populate({
            path:'hospital',
            select:'name province tel'
        });
    }

        const appointments= await query;

        res.status(200).json({
            success:true,
            count:appointments.length,
            data: appointments
        });
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,message:"Cannot find Appointment"
        }); 
    }
}; 

exports.getAppointment= async (req,res,next)=>{
    try{
        // 1. Check if we are searching for appointments for a specific hospital
        if (req.params.hospitalId) {
            query = Appointment.find({ hospital: req.params.hospitalId }).populate({
                path: 'hospital',
                select: 'name province tel'
            });
        } 
        // 2. Otherwise, handle general appointment requests based on role
        else {
            if (req.user.role !== 'admin') {
                query = Appointment.find({ user: req.user.id }).populate({
                    path: 'hospital',
                    select: 'name province tel'
                });
            } else {
                query = Appointment.find().populate({
                    path: 'hospital',
                    select: 'name province tel'
                });
            }
        }

        const appointment = await query;

        res.status(200).json({
            success:true,
            data: appointment
        });
    }catch(error){
        console.log(error);
        return res.status(500).json({success:false,message:"Cannot find Appointment"});
    }
};

exports.addAppointment= async (req,res,next)=>{
    try{
        req.body.hospital = req.params.hospitalId;
        const hospital = await Hospital.findById(req.params.hospitalId);

        if(!hospital){
            return res.status(404).json({success:false,message:`NO hospital with the id of ${req.params.hospitalId}`});
        }
        //add user to req.body
        req.body.user =req.user.id;
        //Check for existing appointments
        const existedAppointments = await Appointment.find({user:req.user.id});
        
        //if not admin ,max appt create = 3
        if(existedAppointments.length>=3 && req.user.role !== 'admin'){
            return res.status(400).json({success:false,message:`The user with ID ${req.user.id} has already made 3 appointments`});
        }

        const appointment = await Appointment.create(req.body);

        res.status(200).json({
            success:true,
            data:appointment
        });
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,message:"Cannot create Appointment"
        });
    }
};

//@desc update appointment
//@route PUT /api/v1/appointments/:_id
//@access Private
exports.updateAppointment = async (req,res,next)=>{
    try{
        let appointment = await Appointment.findById(req.params.id);
    
    if(!appointment){
        return res.status(404).json({success:false,message:`No appointment with the id of ${req.params.id}`});
    }

    if(appointment.user.toString()!== req.user.id && req.user.role !== 'admin'){
        return res.status(401).json({success:false,message:`User ${req.user.id} is not authorized to update this appointment`});
    }

    appointment= await Appointment.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true
    });

    res.status(200).json({
        success:true,
        data:appointment
    });

    }catch(error){
        console.log(error);
        res.status(500).json({success:false,message:"Cannot update Appointment"});
    }
};

exports.deleteAppointment = async (req,res,next) => {
    try{
        const appointment = await Appointment.findById(req.params.id);

        if(!appointment){
            return res.status(404).json({success:false,message:`No appointment with the id of ${req.params.id}`});
        }

        if(appointment.user.toString()!== req.user.id && req.user.role !== 'admin'){
        return res.status(401).json({success:false,message:`User ${req.user.id} is not authorized to delete this appointment`});
    }

        await appointment.deleteOne();

        res.status(200).json({success:true,data:{}});
    }catch(error){
        console.log(error);
        return res.status(500).json({success:false,message:"Cannot delete Appointment"});
    }
};
