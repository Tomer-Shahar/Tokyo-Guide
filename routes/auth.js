const express = require('express');
const router = express.Router();
var DButilsAzure = require('../DButils');
const Joi = require('joi'); //return class
const jwt = require('jsonwebtoken');
const secretkey = 'khalifa_in_the_middle_attack';

router.post('/login', (req, res) => {
    const { error } = validateLogin(req.body);

    if(error){
        let message = "";
        error.details.forEach( (element) => {message += element.message;});
        return res.status(400).send(message);
    }
    
    let username = req.param('username');
    let password = req.param('password');
    let checkIfValidUserQuery = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;

    DButilsAzure.execQuery(checkIfValidUserQuery).then((response, err) =>{
        if (err) res.status(500).json({message: 'Sorry, there was a problem connecting to the server.'});
        else if (response.length == 0) res.status(400).json({message: 'Username or password is incorrect'});
        else
            const token = jwt.sign({user:response}, secretkey, (err, token) => { res.json({token: token}); expiresIn: "1d";});
    })
});

router.post('/register', (req, res) => {
    const { error } = validateUser(req.body);
    if(error){
        let message = "";
        error.details.forEach( (element) => {message += element.message;});
        return res.status(400).send(message);
    }

    let username = req.param('username'), password = req.param('password'), firstName = req.param('firstName');
    let lastName = req.param('lastName'), city = req.param('city'), country = req.param('country'), email = req.param('email');
    let questionID1 = req.param('questionID1'), answer1 = req.param('answer1'), questionID2 = req.param('questionID2');
    let answer2 = req.param('answer2');
    let checkIfUserNameExistQuery = `SELECT * FROM users WHERE username = '${username}'`;
    let checkIfQuestionsExistQuery = `SELECT * FROM questions WHERE QuestionID = '${questionID1}' OR QuestionID  = '${questionID2}' `;
    let insertNewUserQuery = `INSERT INTO users(Username, Password, FirstName, LastName, City, Country, Email)
    VALUES ('${username}', '${password}', '${firstName}', '${lastName}', '${city}', '${country}', '${email}');`;
    let insertUserQuestionsQuery = `INSERT INTO user_qa(Username, QuestionID1, Answer1, QuestionID2, Answer2)
    VALUES ('${username}', '${questionID1}', '${answer1}', '${questionID2}', '${answer2}');`
                                        
    DButilsAzure.execQuery(checkIfUserNameExistQuery).then((response, err) => {
        if (response.length != 0) res.status(400).json({message: 'The username already exist'});
        else {
            DButilsAzure.execQuery(checkIfQuestionsExistQuery).then((response, err) => {
                if (response.length != 2) res.status(400).json({message: 'At least one question id not exist'});
                else {
                    DButilsAzure.execQuery(insertNewUserQuery).then((response, err) =>{
                        if (err) res.status(500).json({message: 'Sorry, there was a problem connecting to the server.'});
                        else {
                            DButilsAzure.execQuery(insertUserQuestionsQuery).then((response, err)=>{
                                const token = jwt.sign({user:response}, secretkey, (err, token) => {
                                    res.json({sucess: true, username: username, token: token});
                                    expiresIn: "1d";
                                });
                            })
                        }
                    })
                }
            })
        }
    })
});

router.post('/forgetPassword', (req, res) => {
    const { error } = validateForgetPassword(req.body);

    if(error){
        let message = "";
        error.details.forEach( (element) => {message += element.message;});
        return res.status(400).send(message);
    }
    
    let username = req.param('username');
    let questionID1 = req.param('questionID1');
    let answer1 = req.param('answer1');
    let questionID2 = req.param('questionID2');
    let answer2 = req.param('answer2');
    let checkQAValidtionQuery=`SELECT * FROM user_qa WHERE username = '${username}' AND QuestionID1 = '${questionID1}' AND Answer1 = '${answer1}'
    AND QuestionID2 = '${questionID2}' AND Answer2 = '${answer2}'`;
    let getUsernameAndPasswordQuery = `SELECT username, password FROM users WHERE username = '${username}'`;

    DButilsAzure.execQuery(checkQAValidtionQuery).then((response) => {
        if (response.length == 0) res.status(400).json({message: 'Wrong answers, please try again.'});
        else {
            DButilsAzure.execQuery(getUsernameAndPasswordQuery).then((response, err) =>{
                if(err) res.status(500).json({message: 'Sorry, there was a problem connecting to the server.'});
                else res.send(response);
            })
        }
    })
});

router.get('/protected', ensureToken, (req, res) =>{
    jwt.verify(req.token, secretkey, (err,data) =>{
        if(err) res.sendStatus(403);
        else {
            res.json({
                sucess: true,
                message: 'Enjoy your token!',
                data: data
            });
        }
    });
});

function ensureToken(req, res, next){
    const bearerHeader = req.headers["authorization"];
    if(typeof bearerHeader !== 'undefined'){
        const bearer = bearerHeader.split(" ");
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else res.sendStatus(403);
}

function validateForgetPassword(user){
    const schema = {
       username: Joi.string().min(3).required(),
       questionID1: Joi.number().required(),
       answer1: Joi.string().min(3).required(),
       questionID2: Joi.number().required(),
       answer2: Joi.string().min(3).required()
    };

    return Joi.validate(user, schema);
}

function validateLogin(user){
    const schema = {
       username: Joi.string().min(3).required(),
       password: Joi.string().min(3).required(),
    };

    return Joi.validate(user, schema);
}

function validateUser(user){
    const schema = {
        //a required string, must contain only alphanumeric characters, at least 3 characters long but no more than 30, 
        //must be accompanied by birthyear
        username: Joi.string().alphanum().min(3).max(30).required(),
        password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
        firstName: Joi.string().min(3).required(),
        lastName: Joi.string().min(3).required(),
        city: Joi.string().min(3).required(),
        country: Joi.string().min(3).required(),
        email: Joi.string().email().required(),
        questionID1: Joi.number().required(),
        answer1: Joi.string().min(3).required(),
        questionID2: Joi.number().required(),
        answer2: Joi.string().min(3).required()
    };

    return Joi.validate(user, schema);
}

module.exports = router;