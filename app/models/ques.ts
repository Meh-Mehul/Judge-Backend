import mongoose from 'mongoose';
const QuestionSchema = new mongoose.Schema({
    Qcode:{
        type:String,
        required:true,
    },
    title: {
        type: String,
        required: true,
    },
    PS:{
        type:String,
        required:true,
    },
    description: {
        type: String,
        required: true,
    },
    TL:{
        type:String,
        required:true,
    },
    ML:{
        type:String,
        required:true,
    },
    STDIN:{
        type:Array,
        default:[String],
        required:true,
    },
    EPOUT:{
        type:Array,
        default:[String],
        required:true,
    }
});
module.exports = mongoose.model('Questions', QuestionSchema);