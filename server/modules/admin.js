const express = require('express');
const router = express.Router();
const DButilsAzure = require('../DButils');
const Joi = require('joi');

router.post('/', (req, res) => {
    let username = req.username;
    let admin = req.admin;
    
    console.log(admin);

});


function validPID(POI){
    const schema = {
       id: Joi.number().min(1).required()
    };

    return Joi.validate(POI, schema);
}

module.exports = router;