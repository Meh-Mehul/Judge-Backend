// server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const submissionQueue = require('./controllers/queue');
const Submission = require('./models/submission'); 
const cors = require('cors');
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected For Message Queue'))
    .catch(err => console.error('MongoDB connection error for Message Queue:', err));

app.post('/add', async (req, res) => {
    try {
        const { submissionId } = req.body;
        const submission = await Submission.findById(submissionId);
        if (!submission) {
            return res.json({ message: 'Submission not found' });
        }
        await submissionQueue.add({ 
            lang: submission.lang,
            Qcode: submission.Qcode,
            Code: submission.Code,
            submissionId: submission._id.toString(),
        });

        res.status(200).json({ message: 'Submission queued for processing', submissionId });
    } catch (error) {
        console.error('Error queuing submission:', error);
        res.status(500).json({ message: 'Error processing submission' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Message Queue Server running on port ${PORT}`);
});
