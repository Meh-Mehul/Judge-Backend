const Questions = require('../models/ques');
import { Request, Response, NextFunction } from "express";
// TODO:
//  1. Make Route to Update Question Details
// We dont delete Questions Here ;)
const CreateQuestion = async (req:Request, res:Response, next:NextFunction)=>{
    /*
    {   
        "Qcode":"DOG",
        "title":"First Time?",
        "PS": "Is it the first time?",
        "description":"description",
        "TL":"1",
        "ML":"512",
        "STDIN":"Big ass STD here",
    }
    */
   const { Qcode,title, PS,description,TL,ML,STDIN} = req.body;
   const Ques = new Questions({Qcode:Qcode, title:title, PS:PS, description:description, TL:TL, ML:ML, STDIN:STDIN});
   Ques.save();
   res.json({"message":"Question added to DB", data:Qcode});
};
const getQuestion = async (req:Request, res:Response, next:NextFunction)=>{
    const id = req.params.id;
    const ques = await Questions.findById(id);
    try{if(ques){
        res.json({"message":"Question Found!", data:ques});
    }
    else{
        res.json({"message":"Not Found any Question with this ID", data:null});
    }}
    catch{
        res.json({"message":"error in DB"});
    }
};

module.exports = {CreateQuestion, getQuestion};