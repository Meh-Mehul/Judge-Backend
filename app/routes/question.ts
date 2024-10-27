// This File Handles Creating a Question as well as fetching its details for the frontend server
// TODO:
//  1. Route to Create and push question to quesDB
//  2. Route to fetch questions from quesDB
//  3. Edit Route
import express from 'express';
const {CreateQuestion, getQuestion} = require('../controllers/crud_ques');

const router = express.Router();
router.post('/add', CreateQuestion);
router.get('/get/:id', getQuestion);


module.exports = router;