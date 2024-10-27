const Submissions = require('../models/submission');
const axios = require('axios');
const Outputs = require('../models/output');
import { AxiosError, AxiosResponse, responseEncoding } from "axios";
import { Request, Response, NextFunction } from "express";
// TODO:
    // 1. After MessageQ has been implemented, update the creation and pushing of Submission - DONE
    // 2. After the FE Server is set up,(Auth!) a submission shall also store the uname of its submitter.
const CreateSubmission = async (req:Request, res:Response, next:NextFunction)=>{
    /*
    {
        "lang":"cpp",
        "Qcode":"DOG",
        "Code":"#include<iostream> and rest of the BS",
    }
    */
   const {lang, Qcode, Code} = req.body;
   const Submission = new Submissions({lang:lang, Qcode:Qcode, Code:Code});
   Submission.save();
   // TODO:
   //   Call MessageQ to push to Queue
   let data = JSON.stringify({
    "submissionId": Submission._id
  });
  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${process.env.MSGQ_URI}/add`,
    headers: { 
      'Content-Type': 'application/json'
    },
    data : data
  };
    axios.request(config)
    .then((response:AxiosResponse) => {
        console.log(JSON.stringify(response.data));
        res.json({"message":"Submission Added to DB, and pushed to Queue", data:response.data});
    })
    .catch((error:AxiosError) => {
        console.log(error);
        res.json({"message":"Internal Server Error", data:error});
    });
   
};
const getSubmission = async (req:Request, res:Response, next:NextFunction)=>{
    const id = req.params.id;
    const sub = await Submissions.findById(id);
    try{
        if(sub){
            res.json({"message":"Submission Found!", data:sub});
        }
        else{
            res.json({"message":"Not Found any submission with this ID", data:null});
        }}
    catch{
        res.json({"message":"error in DB"});
    }
};
const getSTDOUT = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const outputs = await Outputs.find({submissionID:id});
        // Return the results in JSON format
        res.json(outputs);
    } catch (error) {
        console.error("Error fetching output data:", error);
        res.status(500).json({ message: "Error fetching output data." });
    }
};
module.exports = {CreateSubmission, getSubmission, getSTDOUT};