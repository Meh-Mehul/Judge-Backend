import mongoose from 'mongoose';

const SubmissionSchema = new mongoose.Schema({
    lang:{
        type:String,
        required:true,
    },
    Qcode:{
        type:String,
        required:true,
    },
    Code:{
        type:String,
        required:true,
    },
    submitTime:{
        type:Date,
        default:Date.now(),
    },
    status:{
        type: String,
        enum: ['WA', 'AC', 'TLE', 'MLE', 'CE', 'IQ'],
        default:'IQ'
    }
});
module.exports = mongoose.model('Submissions', SubmissionSchema);