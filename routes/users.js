const express = require('express');
const router = express.Router();
var DButilsAzure = require('../DButils');
const Joi = require('joi'); //return class


router.get('/', (req, res) => {
    DButilsAzure.execQuery("SELECT * FROM users")
    .then(function (response){
        res.send(response)
    })

    .catch((err) => {
        console.log(err)
    })
});

router.post('/post1', (req, res) => {

    const { error } = validateUser(req.body);

    if(error){
        //400 Bad request
        let message = "";
        error.details.forEach( (element) => {
            message += element.message;
        });
        return res.status(400).send(message);
    }

    const course = { 
        firstName: req.body.firstName,
        lastName: req.body.firstName
    };

    res.send(course)
});


/**
 * For this example, we'll grab a parameter directly from the URL.
 *  Let's say we are using the example URL: http://example.com/api/users?id=4&token=sdfa3&geo=us
 */
router.get('/get2', (req, res) => {
    var user_id = req.param('id');
    var token = req.param('token');
    var geo = req.param('geo');  
  
    res.send(user_id + ' ' + token + ' ' + geo);
  });

  router.delete('/:id', (req, res) => {
    res.end();
});

function validateUser(user){
    const schema = {
       firstName: Joi.string().min(3).required(),
       lastName: Joi.string().min(3).required(),
       password: Joi.String().regex(/[a-zA-Z0-9]{3,30}/).path('super_password'),
       birthday: Joi.Object({
         year: Joi.Number().min(1850).max(2012).path('birthday[year]'),
         day: Joi.Number().min(1).max(31).path('birthday[day]')
       }).required()
    };

    return Joi.validate(req.body, schema);
}


module.exports = router;