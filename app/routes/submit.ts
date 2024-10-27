import express from "express";
const {CreateSubmission, getSubmission, getSTDOUT} =require('../controllers/crud_submission');


// router for Handling All operations on Submission
// 1. Posting a Submission onto DB and MessageQ
// 2. Getting a Submission from DB
// 3. Getting the WA/AC/TLE/CE from Helper Server
// 4. to be added more later
const router = express.Router();
router.post('/user/submit', CreateSubmission);
router.get('/submission/:id', getSubmission);
router.get('/stdout/:id', getSTDOUT);

module.exports = router;