const express = require('express');
const router = express.Router();
const DButilsAzure = require('../DButils');
const Joi = require('joi'); //return class
const jwt = require('jsonwebtoken');
const xml2js = require('xml2js');
const fs = require('fs');
let optionalCountries = getCountries();
const secretkey = "khalifa_in_the_middle_attack";
const expiresInTime = "1d";

router.post('/login', (req, res) => {
    const { error } = validateLogin(req.body);

    if(error){
        let message = "";
        error.details.forEach( (element) => {message += element.message;});
        return res.status(400).send(message);
    }
    
    let username = req.body.username;
    let password = req.body.password;
    let checkIfValidUserQuery = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;

    DButilsAzure.execQuery(checkIfValidUserQuery).then((response) =>{
        if (response.length == 0) 
            res.status(400).json({message: 'Username or password is incorrect'});
        else {   
            let usernameForToken = response[0].Username;
            let firstNameForToken = response[0].FirstName;
            let lastNameForToken = response[0].LastName;
            var payload = { username: usernameForToken, firstName: firstNameForToken, lastname: lastNameForToken }
            var token = jwt.sign(payload, secretkey, {expiresIn: expiresInTime}, (err, token) => { res.json({token: token}); });
        }
    }).catch((err) => {
        res.status(500).json({message: 'Sorry, An error has occurred on the server. Please, try your request again later.'});
    });
});

router.post('/register', (req, res) => {
    const { error } = validateUser(req.body);

    if(error){
        let message = "";
        error.details.forEach( (element) => {message += element.message;});
        return res.status(400).send(message);
    }

    let username = req.body.username, password = req.body.password, firstName = req.body.firstName;
    let lastName = req.body.lastName, city = req.body.city, country = req.body.country, email = req.body.email;
    let questionID1 = req.body.questionID1, answer1 = req.body.answer1, questionID2 = req.body.questionID2;
    let answer2 = req.body.answer2, category1 = req.body.category1, category2 = req.body.category2;
    let category3 = req.body.category3, category4 = req.body.category4;
    let checkIfUserNameExistQuery = `SELECT * FROM users WHERE username = '${username}'`;
    let checkIfQuestionsExistQuery = `SELECT * FROM questions WHERE QuestionID = '${questionID1}' OR QuestionID  = '${questionID2}' `;
    let insertNewUserQuery = `INSERT INTO users(Username, Password, FirstName, LastName, City, Country, Email)
    VALUES ('${username}', '${password}', '${firstName}', '${lastName}', '${city}', '${country}', '${email}');`;
    let insertUserQuestionsQuery = `INSERT INTO user_qa(Username, QuestionID1, Answer1, QuestionID2, Answer2)
    VALUES ('${username}', '${questionID1}', '${answer1}', '${questionID2}', '${answer2}');`;
    let checkIfCategoryExistQurey = `SELECT * FROM categories WHERE CategoryID = '${category1}' OR CategoryID = '${category2}' `;
    let insertNewUserCategoryQuery = `INSERT INTO user_categories(Username, CategoryID)  
    VALUES ('${username}', '${category1}'), ('${username}', '${category2}')`;
    let categoriesLength = 2;
    if(category1 == category2) 
        return res.status(400).json({ message: 'Duplicate categories' }); 
    if (category3 !== undefined) {
        checkIfCategoryExistQurey += `OR CategoryID = ${category3} `;
        insertNewUserCategoryQuery += `, ('${username}', '${category3}')`;
        categoriesLength++;
        if(category3 == category1 || category3 == category2)
            return res.status(400).json({ message: 'Duplicate categories' }); 
    }
    if (category4 !== undefined) {
        checkIfCategoryExistQurey += `OR CategoryID = ${category4}`;
        insertNewUserCategoryQuery += `, ('${username}', '${category4}')`;
        categoriesLength++;
        if(category4 == category1 || category4 == category2 || category4 == category3)
            return res.status(400).json({ message: 'Duplicate categories' }); 
    }
    insertNewUserCategoryQuery += `;`;
                                        
    execRegisterQueries(checkIfUserNameExistQuery, res, checkIfQuestionsExistQuery, checkIfCategoryExistQurey, categoriesLength, insertNewUserQuery, insertUserQuestionsQuery, insertNewUserCategoryQuery);
});


router.get('/register', (req, res) => {

    let getCategoriesQuery = `SELECT * FROM categories`;
    DButilsAzure.execQuery(getCategoriesQuery).then((response) => {
                
        res.status(200).json({
            categories: response,
            countries: optionalCountries
        });
    })
    .catch((err) =>{
        res.status(500).json({message: 'Sorry, An error has occurred on the server. Please, try your request again later.'});
    });


});

router.post('/forgetPassword', (req, res) => {
    const { error } = validateForgetPassword(req.body);

    if(error){
        let message = "";
        error.details.forEach( (element) => {message += element.message;});
        return res.status(400).send(message);
    }
    
    let username = req.body.username;
    let questionID1 = req.body.questionID1;
    let answer1 = req.body.answer1;
    let questionID2 = req.body.questionID2;
    let answer2 = req.body.answer2;
    let checkQAValidtionQuery=`SELECT * FROM user_qa WHERE username = '${username}' AND QuestionID1 = '${questionID1}' AND Answer1 = '${answer1}'
    AND QuestionID2 = '${questionID2}' AND Answer2 = '${answer2}'`;
    let getUsernameAndPasswordQuery = `SELECT username, password FROM users WHERE username = '${username}'`;

    DButilsAzure.execQuery(checkQAValidtionQuery).then((response) => {
        if (response.length == 0) res.status(400).json({message: 'Wrong answers, please try again.'});
        else {
            DButilsAzure.execQuery(getUsernameAndPasswordQuery).then((response) =>{
                res.status(200).json({
                    username: response[0].username,
                    password: response[0].password
                });
            }).catch((err) =>{
                res.status(500).json({message: 'Sorry, An error has occurred on the server. Please, try your request again later.'});
            });
        }
    }).catch((err) =>{
        res.status(500).json({message: 'Sorry, An error has occurred on the server. Please, try your request again later.'});
    });
});

router.use('/protected/*', ensureToken, (req, res, next) =>{
    jwt.verify(req.token, secretkey, (err,data) =>{
        if(err) res.sendStatus(403);
        else {
            req.username = data.username;
            req.firstName = data.firstName;
            req.lastname = data.lastname;
            next('route');
        }
    });
});


router.post('/question', (req, res) => {
    const { error } = validateID(req.body);

    if(error){
        let message = "";
        error.details.forEach( (element) => {message += element.message;});
        return res.status(400).send(message);
    }
    
    let username = req.body.username;
    if (username === undefined) return res.status(400).json({ message: 'Wrong ID' });
    let getUserQuestionsQuery = `SELECT QuestionId1, QuestionId2 FROM user_qa WHERE Username = '${username}'`;
    execQuestion(getUserQuestionsQuery, res);
});


function execQuestion(getUserQuestionsQuery, res) {
    DButilsAzure.execQuery(getUserQuestionsQuery).then((response) => {
        if (response.length == 0)
            res.status(400).json({ message: 'Wrong ID' });
        else {
            let QuestionId1 = response[0].QuestionId1;
            let QuestionId2 = response[0].QuestionId2;
            let getQuestionsQuery = `SELECT QuestionID, QuestionText FROM questions WHERE QuestionID = '${QuestionId1}' OR QuestionID = '${QuestionId2}'`;
            DButilsAzure.execQuery(getQuestionsQuery).then((response, err) => {
                res.status(200).send(response);
            }).catch((err) => {res.status(500).json({ message: err }); });
        }
    }).catch((err) => {res.status(500).json({ message: err }); });
}

function getCountries() {
    var parser = new xml2js.Parser({explicitArray : false});
    var xml = fs.readFileSync(__dirname + '\\countries.xml', {encoding: 'utf-8'});
    let arrayOfCountries = new Array();
    parser.parseString(xml,function(err,result){
        let countries = JSON.parse(JSON.stringify(result))['Countries']['Country'];
        for (key in countries)
            arrayOfCountries.push(countries[key]['Name']); 
    });
    return arrayOfCountries;
  }
  

function execRegisterQueries(checkIfUserNameExistQuery, res, checkIfQuestionsExistQuery, checkIfCategoryExistQurey, categoriesLength, insertNewUserQuery, insertUserQuestionsQuery, insertNewUserCategoryQuery) {
    DButilsAzure.execQuery(checkIfUserNameExistQuery).then((response) => {
        if (response.length != 0)
            res.status(400).json({ message: 'The username already exist' });
        else {
            DButilsAzure.execQuery(checkIfQuestionsExistQuery).then((response) => {
                if (response.length != 2)
                    res.status(400).json({ message: 'At least one question id not exist' });
                else {
                    DButilsAzure.execQuery(checkIfCategoryExistQurey).then((response) => {
                        if (response.length != categoriesLength)
                            res.status(400).json({ message: 'At least one category id not exist' });
                        else {
                            DButilsAzure.execQuery(insertNewUserQuery).then((response) => {
                                DButilsAzure.execQuery(insertUserQuestionsQuery).then((response, err) => {
                                    DButilsAzure.execQuery(insertNewUserCategoryQuery).then((response, err) => {
                                        res.status(200).json({ message: 'Successful Registration to our system. You can login now.' });
                                    }).catch((err) => {
                                        res.status(500).json({message: 'Sorry, An error has occurred on the server. Please, try your request again later.'});
                                    });
                                }).catch((err) => {
                                    res.status(500).json({message: 'Sorry, An error has occurred on the server. Please, try your request again later.'});
                                });
                            }).catch((err) => {
                                res.status(500).json({message: 'Sorry, An error has occurred on the server. Please, try your request again later.'});
                            });
                        }
                    }).catch((err) => {
                        res.status(500).json({message: 'Sorry, An error has occurred on the server. Please, try your request again later.'});
                    });
                }
            }) .catch((err) => {
                res.status(500).json({message: 'Sorry, An error has occurred on the server. Please, try your request again later.'});
            });
        }
    }).catch((err) => {
        res.status(500).json({message: 'Sorry, An error has occurred on the server. Please, try your request again later.'});
    });
}

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

function validateID(user){
    const schema = {
       username: Joi.string().min(3).required()
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
        username: Joi.string().min(3).max(8).regex(/^[a-zA-Z]+$/).required(),
        password: Joi.string().min(5).max(10).regex(/^[a-zA-Z0-9]+$/).required(),
        firstName: Joi.string().min(3).required(),
        lastName: Joi.string().min(3).required(),
        city: Joi.string().min(3).required(),
        country: Joi.string().valid(optionalCountries).required(),
        email: Joi.string().email().required(),
        questionID1: Joi.number().required(),
        answer1: Joi.string().min(3).required(),
        questionID2: Joi.number().required(),
        answer2: Joi.string().min(3).required(),
        category1: Joi.number().required(),
        category2: Joi.number().required(),
        category3: Joi.number().optional(),
        category4: Joi.number().optional(),
    };

    return Joi.validate(user, schema);
}

module.exports = router;