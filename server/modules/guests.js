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
    let getPOIByIDQueryQuery = `SELECT * FROM poi INNER JOIN categories ON poi.CategoryId=categories.CategoryId WHERE PID = '${id}';`;
    DButilsAzure.execQuery(getPOIByIDQueryQuery).then((response) =>{
        if (response.length !== 1) res.status(400).json({message: 'Wrong ID'});
        else {
            let views = response[0].Views + 1;
            let POIresponse = response;
            let increaseQuery = `UPDATE poi SET Views = '${views}' WHERE PID = '${id}'`;
            DButilsAzure.execQuery(increaseQuery).then((response) =>{
                res.status(200).send(POIresponse[0]);
            }).catch((err) =>{
                res.status(500).json({message: 'Sorry, An error has occurred on the server. Please, try your request again later.'});
            });
        }
    })
    .catch((err) =>{
        res.status(500).json({message: 'Sorry, An error has occurred on the server. Please, try your request again later.'});
    });
});

router.get('/poi', (req,res)=> {
    let getPOIQueryQuery = `SELECT * FROM poi INNER JOIN categories ON poi.CategoryId=categories.CategoryId;`;
    DButilsAzure.execQuery(getPOIQueryQuery).then((response) =>{
        res.status(200).json({ POIs: response });
    })
    .catch((err) =>{
        res.status(500).json({message: 'Sorry, An error has occurred on the server. Please, try your request again later.'});
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
    let getPOIQueryQuery = `SELECT TOP ${number} * FROM poi INNER JOIN categories ON poi.CategoryId=categories.CategoryId WHERE Rating >= ${min} ORDER BY NEWID();`;
    DButilsAzure.execQuery(getPOIQueryQuery).then((response) =>{
        if (response.length == 0) res.status(400).json({message: 'Wrong ID'});
        else res.status(200).json({POIs: response});
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

router.get('/review/:id', (req,res)=> {
    const { error } = validPID(req.params);

    if(error){
        let message = "";
        error.details.forEach( (element) => {message += element.message;});
        return res.status(400).send(message);
    }

    let id = req.params.id;
    let getPOIByIDQueryQuery = `SELECT * FROM reviews WHERE PID = '${id}' ORDER BY Date DESC`;
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
        id: Joi.number().min(1).required()
    };

    return Joi.validate(POI, schema);
}

function validRandomPID(POI){
    const schema = {
        number: Joi.number().min(1).required(),
        min: Joi.number().min(0).max(5).required()
    };

    return Joi.validate(POI, schema);
}

function validPID(POI){
    const schema = {
       id: Joi.number().min(1).required()
    };

    return Joi.validate(POI, schema);
}

module.exports = router;