const express = require('express')
const AircraftParameter = require('../models/AircraftParameter');
const User = require('../models/User');
const list = async (req,res,next)=>{
    try
    {
        const { page =1,limit =10 } = req.query;
        const parameters=await AircraftParameter.find()
        .limit(limit*1)
        .skip((page -1) * limit);
        res.status(200).json({total:parameters.length,parameters});
    }
    catch(err){
        res.json({"err":err})
    }

}
const create = async (req,res,next) =>{
    try{
        const param =await new AircraftParameter({
           
           name:req.body.name,
           title:req.body.title,
           group:req.body.group,
           unit:req.body.unit,
           max:req.body.max,
           min:req.body.min,
           value:req.body.value,
           graph_color:req.body.graph_color,
           max_color:req.body.max_color,
           min_color:req.body.min_color,
           csv_column:req.body.csv_column,
           csv_title:req.body.csv_title
          
       });
       const save=await param.save();
       res.status(200).json(save);
   }catch (err){
       res.json({"err":err})
   }
}

const getbyid = async (req,res,next) =>{
    try
    {
       
        const getbyID=await AircraftParameter.findById(req.params.id);
        res.status(200).json(getbyID);
    }
    catch(err){
        res.json({"err":err})
    }
}


const update = async(req,res,next) =>{
    try
    {
        const updUser=await AircraftParameter.updateOne({_id:req.params.id},{$set:
            {
                name:req.body.name,
                title:req.body.title,
                group:req.body.group,
                unit:req.body.unit,
                max:req.body.max,
                min:req.body.min,
                value:req.body.value,
                graph_color:req.body.graph_color,
                max_color:req.body.max_color,
                min_color:req.body.min_color,
                csv_column:req.body.csv_column,
                csv_title:req.body.csv_title}});
        res.status(200).json(updUser);
    }
    catch(err){
        res.json({"err":err})
    }
}

const remove = async (req,res,next) =>{
    try
    {
        const delUser=await AircraftParameter.remove({_id:req.params.id});
        res.status(200).json(delUser);
    }
    catch(err){
        res.json({"err":err})
    }
}
const searchbyname = async(req,res) =>{
    var regex = new RegExp(req.params.name,'i');
    AircraftParameter.findOne({ name: regex }).then((result) =>{
        res.status(200).json(result);
    })
}

const searchbygroup = async(req,res) =>{
    var regex = new RegExp(req.params.group,'i');
    AircraftParameter.findOne({ group: regex }).then((result) =>{
        res.status(200).json(result);
    })
}


module.exports = {
    list,create,getbyid,update,remove,searchbyname,searchbygroup
}