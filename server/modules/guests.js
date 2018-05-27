const express = require('express');
const router = express.Router();
const DButilsAzure = require('../DButils');
const Joi = require('joi');

router.get('/poi/:id', (req,res)=> {
    const { error } = validPID(req.params);

    if(error){
        let message = "";
        error.details.forEach( (element) => {message += element.message;});
        return res.status(400).send(message);
    }

    let id = req.params.id;
    let getPOIByIDQueryQuery = `SELECT * FROM poi WHERE PID = '${id}'`;
    DButilsAzure.execQuery(getPOIByIDQueryQuery).then((response, err) =>{
        if (err) res.status(500).json({message: 'Sorry, there was a problem connecting to the server.'});
        else if (response.length == 0) res.status(400).json({message: 'Wrong ID'});
        else res.status(200).send(response);
    })
    .catch((err) =>{
        res.status(500).json({message: 'Sorry, we cant help you to find your POI by ID.'});
    })
});

router.get('/poi', (req,res)=> {
    let getPOIQueryQuery = `SELECT * FROM poi`;
    DButilsAzure.execQuery(getPOIQueryQuery).then((response, err) =>{
        if (err) res.status(500).json({message: 'Sorry, there was a problem connecting to the server.'});
        else if (response.length == 0) res.status(400).json({message: 'Wrong ID'});
        else res.status(200).send(response);
    })
    .catch((err) =>{
        res.status(500).json({message: 'Sorry, we cant help you to find your POI by ID.'});
    })
});

router.get('/poiRand/:number/:min', (req,res)=> {
    const { error } = validRandomPID(req.params);

    if(error){
        let message = "";
        error.details.forEach( (element) => {message += element.message;});
        return res.status(400).send(message);
    }

    let number = req.params.number;
    let min = req.params.min;
    let getPOIQueryQuery = `SELECT TOP ${number} * FROM poi WHERE Rating >= ${min} ORDER BY NEWID()`;
    console.log(getPOIQueryQuery);
    DButilsAzure.execQuery(getPOIQueryQuery).then((response, err) =>{
        if (err) res.status(500).json({message: 'Sorry, there was a problem connecting to the server.'});
        else if (response.length == 0) res.status(400).json({message: 'Wrong ID'});
        else res.status(200).send(response);
    })
    .catch((err) =>{
        res.status(500).json({message: 'Sorry, we cant help you to find your POI by minimum ranking.'});
    })
});

router.get('/review/:id/:number', (req,res)=> {
    const { error } = validReview(req.params);

    if(error){
        let message = "";
        error.details.forEach( (element) => {message += element.message;});
        return res.status(400).send(message);
    }

    let id = req.params.id;
    let number = req.params.number;
    let getPOIByIDQueryQuery = `SELECT TOP ${number} * FROM reviews WHERE PID = '${id}' ORDER BY Date DESC`;
    DButilsAzure.execQuery(getPOIByIDQueryQuery).then((response, err) =>{
        if (err) res.status(500).json({message: 'Sorry, there was a problem connecting to the server.'});
        else if (response.length == 0) res.status(400).json({message: 'Reviews does not exist for the given ID'});
        else res.status(200).send(response);
    })
    .catch((err) =>{
        res.status(500).json({message: 'Sorry, we cant help you to find reviews by ID.'});
    })
});

function validReview(POI){
    const schema = {
        number: Joi.number().min(1).required(),
        id: Joi.number().required()
    };

    return Joi.validate(POI, schema);
}

function validRandomPID(POI){
    const schema = {
        number: Joi.number().required(),
        min: Joi.number().min(0).max(5).required()
    };

    return Joi.validate(POI, schema);
}

function validPID(POI){
    const schema = {
       id: Joi.number().required()
    };

    return Joi.validate(POI, schema);
}

module.exports = router;