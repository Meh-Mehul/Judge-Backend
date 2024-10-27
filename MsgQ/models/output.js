const mongoose = require('mongoose');
const submission = require('./submission');

const Judge0ResultSchema = new mongoose.Schema({
    stdout: {
        type: String,
        default: null,
    },
    submissionID:{
        type:String,
        required:true,
    },
    time: {
        type: String,
        default: null,
    },
    memory: {
        type: Number,
        default: null,
    },
    stderr: {
        type: String,
        default: null,
    },
    token: {
        type: String,
        required: true,
        unique: true,
    },
    compile_output: {
        type: String,
        default: null,
    },
    message: {
        type: String,
        default: null,
    },
    status: {
        id: {
            type: Number,
            required: true,
        },
        description: {
            type: String,
            required: true,
        }
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('Outputs', Judge0ResultSchema);
