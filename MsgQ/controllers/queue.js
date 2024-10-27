const Queue = require('bull');
const axios = require('axios');
const Questions = require('../models/question');
const Output = require('../models/output');
const submissionQueue = new Queue('submissionQueue');
const Submission = require('../models/submission'); 
submissionQueue.process(async (job, done) => {
    try {
        const { lang, Qcode, Code, submissionId } = job.data;
        console.log(`Processing job for submissionId: ${submissionId}`);
        // TODO: Get STDIN Array From Questions DB and request each Test Case one by one
        const submissionResponse = await axios.post(`${process.env.JUDGE0_URL}/submissions`, {
            source_code: Code,
            language_id: lang,
            expected_output: Qcode,
        });

        const token = submissionResponse.data.token;
        console.log(`Received token for submission ${submissionId}: ${token}`);

        let result = null;
        let maxAttempts = 2; 
        let attempt = 0;

        while (!result && attempt < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            const resultResponse = await axios.get(`http://localhost:2358/submissions/${token}`);
            const resultData = resultResponse.data;
            // console.log(resultResponse.data);
            if (resultData.status ) {
                result = resultData;
                //TODO: Store STDOUT For Each of the submission in output DB (each run has same submission ID)
                const op = new Output({stdout:resultData.stdout, time:resultData.time, memory:resultData.memory, stderr:resultData.stderr, token:resultData.token, compile_output:resultData.compile_output, message:resultData.message, status:resultData.status,submissionID:submissionId});
                op.save();
                let substat = '';
                if(resultData.stderr){
                    substat = 'CE';
                }
                else{
                    if(resultData.status.description === 'Accepted'){
                        substat = 'AC';
                    }
                    else{
                        substat = 'WA';
                    }
                }
                const sub = await Submission.findByIdAndUpdate(submissionId, {status:substat});
                // console.log(`Received result for submission ${submissionId}:`, resultData);
            // } else if (resultData.status && resultData.status.description !== 'In Queue') {
            //     console.log(`Non-successful status for submission ${submissionId}:`, resultData.status.description);
            //     result = resultData;
            //     break;
            }

            attempt += 1;
        }
        if (!result) {
            console.log(`Max attempts reached for submission ${submissionId}, could not retrieve result.`);
        }
        done();
    } catch (error) {
        console.error(`Error processing submission ${job.data.submissionId}:`, error);
        done(error);
    }
});

module.exports = submissionQueue;
