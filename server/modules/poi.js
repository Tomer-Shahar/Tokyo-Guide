const express = require('express');
const router = express.Router();
const DButilsAzure = require('../DButils');
const Joi = require('joi');

router.post('/order', (req, res) => {
    let orders = req.body.orders;
    let username = req.username;

    let { checkPIDQuery, numberOfPID, checkPIDQueryWithUsernameQuery, insertOrdersQuery } = createOrderQueries(orders, username);
    execOrder(checkPIDQuery, res, numberOfPID, checkPIDQueryWithUsernameQuery, insertOrdersQuery);
});

router.post('/question', (req, res) => {
    let username = req.username;
    let getUserQuestionsQuery = `SELECT QuestionId1, QuestionId2 FROM user_qa WHERE Username = '${username}'`;
    execQuestion(getUserQuestionsQuery, res);
});

router.post('/favorite', (req, res) => {
    const { error } = validPID(req.body);

    if(error){
        let message = "";
        error.details.forEach( (element) => {message += element.message;});
        return res.status(400).send(message);
    }

    let id = req.body.id;
    let username = req.username;
    let date = new Date().toISOString();
    let position = 0;
    let checkPIDQuery = `SELECT * FROM poi WHERE PID = '${id}'`;
    let checkPIDQueryWithUsernameQuery = `SELECT * FROM favorites WHERE PID = '${id}' AND Username = '${username}'`;
    let insertFavoriteQuery = `INSERT INTO favorites (Username, PID, POSITION, DATE) VALUES ('${username}', '${id}', '${position}', '${date}');`;

    execFavorite(checkPIDQuery, res, checkPIDQueryWithUsernameQuery, insertFavoriteQuery);
});

router.post('/review', (req, res) => {
    const { error } = validReview(req.body);

    if(error){
        let message = "";
        error.details.forEach( (element) => {message += element.message;});
        return res.status(400).send(message);
    }

    let id = req.body.id;
    let username = req.username;
    let description = req.body.description;
    let date = new Date().toISOString();
    let checkPIDQuery = `SELECT * FROM poi WHERE PID = '${id}'`;
    let checkPIDWithUsernameQuery = `SELECT * FROM reviews WHERE PID = '${id}' AND Username = '${username}'`;
    let insertReviewQuery = `INSERT INTO reviews (PID, Username, Description, Date) VALUES ('${id}', '${username}', '${description}', '${date}');`;

    execReview(checkPIDQuery, res, checkPIDWithUsernameQuery, insertReviewQuery);
});

router.post('/ranking', (req, res) => {
    const { error } = validRanking(req.body);

    if(error){
        let message = "";
        error.details.forEach( (element) => {message += element.message;});
        return res.status(400).send(message);
    }

    let id = req.body.id;
    let username = req.username;
    let ranking = parseInt(req.body.ranking);
    let date = new Date().toISOString();
    let checkPIDQuery = `SELECT * FROM poi WHERE PID = '${id}'`;
    let checkPIDWithUsernameQuery = `SELECT * FROM ranking WHERE PID = '${id}' AND Username = '${username}'`;
    let insertRankingQuery = `INSERT INTO ranking (PID, Username, Ranking, Date) VALUES ('${id}', '${username}', '${ranking}', '${date}');`;
    let getRankingAndRankersQuery = `SELECT Rating,Rankers FROM poi WHERE PID = '${id}'`;

    execRanking(checkPIDQuery, res, checkPIDWithUsernameQuery, insertRankingQuery, getRankingAndRankersQuery, ranking, id);
});

function execRanking(checkPIDQuery, res, checkPIDWithUsernameQuery, insertRankingQuery, getRankingAndRankersQuery, ranking, id) {
    DButilsAzure.execQuery(checkPIDQuery).then((response, err) => {
        if (err)
            res.status(500).json({ message: 'Sorry, there was a problem connecting to the server.' });
        else if (response.length == 0)
            res.status(400).json({ message: 'Wrong ID' });
        else {
            DButilsAzure.execQuery(checkPIDWithUsernameQuery).then((response, err) => {
                if (err)
                    res.status(500).json({ message: 'Sorry, there was a problem connecting to the server.' });
                else if (response.length != 0)
                    res.status(400).json({ message: 'POI ID already exist for this username' });
                else {
                    DButilsAzure.execQuery(insertRankingQuery).then((response, err) => {
                        if (err)
                            res.status(500).json({ message: 'Sorry, there was a problem connecting to the server.' });
                        else {
                            DButilsAzure.execQuery(getRankingAndRankersQuery).then((response, err) => {
                                if (err)
                                    res.status(500).json({ message: 'Sorry, there was a problem connecting to the server.' });
                                else {
                                    let rating = response[0].Rating;
                                    console.log(rating);
                                    let rankers = response[0].Rankers;
                                    console.log(rankers);
                                    let average = (rating * rankers + ranking);
                                    console.log(average);
                                    rankers += 1;
                                    average = (average / rankers);
                                    console.log(average);
                                    let insertRankingQuery = `UPDATE poi SET Rating = '${average}', Rankers = '${rankers}' WHERE PID = '${id}'`;
                                    DButilsAzure.execQuery(insertRankingQuery).then((response, err) => {
                                        if (err)
                                            res.status(500).json({ message: 'Sorry, there was a problem connecting to the server.' });
                                        else
                                            res.status(200).json({ message: 'Successful added to our system.' });
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    })
        .catch((err) => {
            res.status(500).json({ message: 'Sorry, we cant help you to find your POI by ID.' });
        });
}

function execReview(checkPIDQuery, res, checkPIDWithUsernameQuery, insertReviewQuery) {
    DButilsAzure.execQuery(checkPIDQuery).then((response, err) => {
        if (err)
            res.status(500).json({ message: 'Sorry, there was a problem connecting to the server.' });
        else if (response.length == 0)
            res.status(400).json({ message: 'Wrong ID' });
        else {
            DButilsAzure.execQuery(checkPIDWithUsernameQuery).then((response, err) => {
                if (err)
                    res.status(500).json({ message: 'Sorry, there was a problem connecting to the server.' });
                else if (response.length != 0)
                    res.status(400).json({ message: 'POI ID already exist for this username' });
                else {
                    DButilsAzure.execQuery(insertReviewQuery).then((response, err) => {
                        if (err)
                            res.status(500).json({ message: 'Sorry, there was a problem connecting to the server.' });
                        else
                            res.status(200).json({ message: 'Successful added to our system.' });
                    });
                }
            });
        }
    })
        .catch((err) => {
            res.status(500).json({ message: 'Sorry, we cant help you to find your POI by ID.' });
        });
}

function execFavorite(checkPIDQuery, res, checkPIDQueryWithUsernameQuery, insertFavoriteQuery) {
    DButilsAzure.execQuery(checkPIDQuery).then((response, err) => {
        if (err)
            res.status(500).json({ message: 'Sorry, there was a problem connecting to the server.' });
        else if (response.length == 0)
            res.status(400).json({ message: 'Wrong ID' });
        else {
            DButilsAzure.execQuery(checkPIDQueryWithUsernameQuery).then((response, err) => {
                if (err)
                    res.status(500).json({ message: 'Sorry, there was a problem connecting to the server.' });
                else if (response.length != 0)
                    res.status(400).json({ message: 'POI ID already exist for this username' });
                else {
                    DButilsAzure.execQuery(insertFavoriteQuery).then((response, err) => {
                        if (err)
                            res.status(500).json({ message: 'Sorry, there was a problem connecting to the server.' });
                        else
                            res.status(200).json({ message: 'Successful added to our system.' });
                    });
                }
            });
        }
    })
        .catch((err) => {
            res.status(500).json({ message: 'Sorry, we cant help you to find your POI by ID.' });
        });
}

function execQuestion(getUserQuestionsQuery, res) {
    DButilsAzure.execQuery(getUserQuestionsQuery).then((response, err) => {
        if (err)
            res.status(500).json({ message: 'Sorry, there was a problem connecting to the server.' });
        else if (response.length == 0)
            res.status(400).json({ message: 'Wrong ID' });
        else {
            let QuestionId1 = response[0].QuestionId1;
            let QuestionId2 = response[0].QuestionId2;
            let getQuestionsQuery = `SELECT QuestionID, QuestionText FROM questions WHERE QuestionID = '${QuestionId1}' OR QuestionID = '${QuestionId2}'`;
            DButilsAzure.execQuery(getQuestionsQuery).then((response, err) => {
                res.status(200).send(response);
            });
        }
    })
        .catch((err) => {
            res.status(500).json({ message: 'Sorry, we cant help you to find your POI by ID.' });
        });
}

function execOrder(checkPIDQuery, res, numberOfPID, checkPIDQueryWithUsernameQuery, insertOrdersQuery) {
    DButilsAzure.execQuery(checkPIDQuery).then((response, err) => {
        if (err)
            res.status(500).json({ message: 'Sorry, there was a problem connecting to the server.' });
        else if (response.length !== numberOfPID)
            res.status(400).json({ message: 'At least one PID is not exist' });
        else {
            DButilsAzure.execQuery(checkPIDQueryWithUsernameQuery).then((response, err) => {
                if (err)
                    res.status(500).json({ message: 'Sorry, there was a problem connecting to the server.' });
                else if (response.length != 0)
                    res.status(400).json({ message: 'At least one PID and User already exist!' });
                else {
                    DButilsAzure.execQuery(insertOrdersQuery).then((response, err) => {
                        if (err)
                            res.status(500).json({ message: 'Sorry, there was a problem connecting to the server.' });
                        else
                            res.status(200).json({ message: 'Successful added to our system.' });
                    });
                }
            });
        }
    })
        .catch((err) => {
            res.status(500).json({ message: 'Sorry, we cant help you to find your POI by ID.' });
        });
}

function createOrderQueries(orders, username) {
    let insertOrdersQuery = `INSERT INTO positions ( Username, PID, Position ) VALUES`;
    let checkPIDQuery = `SELECT * FROM poi WHERE `;
    let checkPIDQueryWithUsernameQuery = `SELECT * FROM positions WHERE `;
    let numberOfPID = 0;
    for (let i = 0; i < orders.length; i++) {
        let PID = orders[i].PID;
        let place = orders[i].place;
        checkPIDQuery += ` PID = '${PID}' OR`;
        checkPIDQueryWithUsernameQuery += ` (PID = '${PID}' AND Username = '${username}') OR`;
        numberOfPID += 1;
        insertOrdersQuery += `('${username}', '${PID}', '${place}'), `;
    }
    checkPIDQueryWithUsernameQuery = checkPIDQueryWithUsernameQuery.slice(0, -2);
    checkPIDQuery = checkPIDQuery.slice(0, -2);
    insertOrdersQuery = insertOrdersQuery.slice(0, -2);
    insertOrdersQuery += ';';
    return { checkPIDQuery, numberOfPID, checkPIDQueryWithUsernameQuery, insertOrdersQuery };
}

function validReview(Ranking){
    const schema = {
       id: Joi.number().required(),
       description: Joi.string().min(50).required()
    };

    return Joi.validate(Ranking, schema);
}

function validRanking(Ranking){
    const schema = {
       id: Joi.number().required(),
       ranking: Joi.number().integer().required()
    };

    return Joi.validate(Ranking, schema);
}

function validPID(POI){
    const schema = {
       id: Joi.number().required()
    };

    return Joi.validate(POI, schema);
}

module.exports = router;