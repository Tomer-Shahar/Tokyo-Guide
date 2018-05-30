const express = require('express');
const router = express.Router();
const DButilsAzure = require('../DButils');
const Joi = require('joi');

router.post('/popular', (req, res) => {
    let username = req.username;
    let getPopularQuery = `SELECT data.*
        FROM poi data
        INNER JOIN user_categories ON (data.CATEGORYID = user_categories.CATEGORYID)
        LEFT OUTER JOIN poi data2
        ON(data.CATEGORYID = data2.CATEGORYID AND data.Views < data2.Views)
        WHERE data2.CATEGORYID IS NULL AND user_categories.username = '${username}'
        ORDER BY CATEGORYID`

    DButilsAzure.execQuery(getPopularQuery).then((response) => {
        res.status(200).json({userOrder: response});
        
    }).catch((err) => {
            res.status(500).json({ message: 'Sorry, we cant help you to find your POI by ID.' });
        });
});

router.post('/userOrder', (req, res) => {
    let username = req.username;
    let getOrderQuery = `SELECT * from positions INNER JOIN poi ON positions.PID=poi.PID INNER JOIN categories ON poi.CategoryId=categories.CategoryId WHERE Username = '${username}' ORDER BY Position;`

    DButilsAzure.execQuery(getOrderQuery).then((response) => {
        res.status(200).json({userOrder: response});
        
    }).catch((err) => {
            res.status(500).json({ message: 'Sorry, we cant help you to find your POI by ID.' });
        });
});

router.post('/order', (req, res) => {
    let orders = req.body.orders;
    let username = req.username;

    let checkIfFavoriteExistQuery = `SELECT * FROM favorites WHERE `
    let insertOrdersQuery = `INSERT INTO positions ( Username, PID, Position ) VALUES`;
    let checkPIDQuery = `SELECT * FROM poi WHERE `;
    let checkPIDQueryWithUsernameQuery = `SELECT * FROM positions WHERE`;
    let numberOfPID = 0;
    let positionsArray = [];
    for (let i = 0; i < orders.length; i++) {
        let PID = parseInt(orders[i].PID);
        let position = parseInt(orders[i].position);
        if( PID === undefined || position === undefined)
            return res.status(400).json({message: 'Please send PID and position variables'}); 
        if( !positionsArray.includes(position)) 
            positionsArray.push(position); 
        checkPIDQuery += ` PID = '${PID}' OR`;
        checkPIDQueryWithUsernameQuery += ` (PID = '${PID}' AND Username = '${username}') OR`;
        checkIfFavoriteExistQuery += ` (PID = '${PID}' AND Username = '${username}') OR`;
        numberOfPID += 1;
        insertOrdersQuery += `('${username}', '${PID}', '${position}'), `;
    }
    if (positionsArray.length !== numberOfPID) 
        return res.status(400).json({message: 'You sent duplicate positions'});

    for(let i=1; i<=numberOfPID; i+=1){
        if(!positionsArray.includes(i))
            return res.status(400).json({message: 'Please order with consecutive numbers'});
    }

    checkIfFavoriteExistQuery = checkIfFavoriteExistQuery.slice(0, -2);
    checkPIDQueryWithUsernameQuery = checkPIDQueryWithUsernameQuery.slice(0, -2);
    checkPIDQuery = checkPIDQuery.slice(0, -2);
    insertOrdersQuery = insertOrdersQuery.slice(0, -2);
    insertOrdersQuery += ';';
    
    DButilsAzure.execQuery(checkIfFavoriteExistQuery).then((response) => {
        if (response.length !== numberOfPID)
            res.status(400).json({ message: 'At least one PID does not exist in user\'s favories!' });
        else{
            DButilsAzure.execQuery(checkPIDQuery).then((response) => {
                if (response.length !== numberOfPID)
                    res.status(400).json({ message: 'At least one PID is not exist' });
                else {
                    DButilsAzure.execQuery(checkPIDQueryWithUsernameQuery).then((response) => {
                        if (response.length != 0)
                            res.status(400).json({ message: 'At least one PID and User already exist!' });
                        else {
                            DButilsAzure.execQuery(insertOrdersQuery).then((response) => {
                               res.status(200).json({ message: 'Successful added to our system.' });
                            }).catch((err) => { res.status(500).json({ message: err });});
                        }
                    }).catch((err) => { res.status(500).json({ message: err });});
                }
            }).catch((err) => { res.status(500).json({ message: err });});
        }
    }).catch((err) => { res.status(500).json({ message: err });});

});

router.put('/order', (req, res) => {
    let orders = req.body.orders;
    let username = req.username;

    let checkIfFavoriteExistQuery = `SELECT * FROM favorites WHERE `
    let insertOrdersQuery = `INSERT INTO positions ( Username, PID, Position ) VALUES`;
    let checkPIDQuery = `SELECT * FROM poi WHERE `;
    let checkPIDQueryWithUsernameQuery = `SELECT * FROM positions WHERE `;
    let numberOfPID = 0;
    let positionsArray = [];
    for (let i = 0; i < orders.length; i++) {
        let PID = parseInt(orders[i].PID);
        let position = parseInt(orders[i].position);
        if( PID === undefined || position === undefined)
            return res.status(400).json({message: 'Please send PID and position variables'}); 
        if( !positionsArray.includes(position)) 
            positionsArray.push(position);    
        checkPIDQuery += ` PID = '${PID}' OR`;
        checkPIDQueryWithUsernameQuery += ` (PID = '${PID}' AND Username = '${username}') OR`;
        checkIfFavoriteExistQuery += ` (PID = '${PID}' AND Username = '${username}') OR`;
        numberOfPID += 1;
        insertOrdersQuery += `('${username}', '${PID}', '${position}'), `;
    }
    if (positionsArray.length != numberOfPID) 
        return res.status(400).json({message: 'You sent duplicate positions'});

    for(let i=1; i<=numberOfPID; i+=1){
        if(!positionsArray.includes(i))
            return res.status(400).json({message: 'Please order with consecutive numbers'});
    }
    checkIfFavoriteExistQuery = checkIfFavoriteExistQuery.slice(0, -2);
    checkPIDQueryWithUsernameQuery = checkPIDQueryWithUsernameQuery.slice(0, -2);
    checkPIDQuery = checkPIDQuery.slice(0, -2);
    insertOrdersQuery = insertOrdersQuery.slice(0, -2);
    insertOrdersQuery += ';';
    let deleteOrder = `DELETE FROM positions WHERE Username = '${username}';`
    
    DButilsAzure.execQuery(checkIfFavoriteExistQuery).then((response) => {
        if (response.length !== numberOfPID)
            res.status(400).json({ message: 'At least one PID does not exist in user\'s favories!' });
        else{
            DButilsAzure.execQuery(deleteOrder).then((response) => {        
                DButilsAzure.execQuery(checkPIDQuery).then((response, err) => {
                if (response.length !== numberOfPID)
                    res.status(400).json({ message: 'At least one PID is not exist' });
                else {
                    DButilsAzure.execQuery(checkPIDQueryWithUsernameQuery).then((response) => {
                        if (response.length !== 0)
                            res.status(400).json({ message: 'At least one PID and User already exist!' });
                        else {
                            DButilsAzure.execQuery(insertOrdersQuery).then((response) => {
                                res.status(200).json({ message: 'Successful added to our system.' });
                            }).catch((err) => {res.status(500).json({ message: err });});
                        }
                    }).catch((err) => {res.status(500).json({ message: err });});
                }
            })}).catch((err) => {res.status(500).json({ message: err });});
        }
    }).catch((err) => {res.status(500).json({ message: err });});


});



router.delete('/favorite', (req, res) => {
    const { error } = validPID(req.body);

    if(error){
        let message = "";
        error.details.forEach( (element) => {message += element.message;});
        return res.status(400).send(message);
    }

    let id = req.body.id;
    let username = req.username;
    let checkPIDQuery = `SELECT * FROM poi WHERE PID = '${id}'`;
    let checkPIDQueryWithUsernameQuery = `SELECT * FROM favorites WHERE PID = '${id}' AND Username = '${username}'`;
    let deleteFavoriteQuery = `DELETE FROM favorites WHERE Username = '${username}' AND PID = '${id}';`;
    let deleteOrderQuery = `DELETE FROM positions WHERE Username = '${username}' AND PID = '${id}';`;

    DButilsAzure.execQuery(checkPIDQuery).then((response) => {
        if (response.length == 0)
            res.status(400).json({ message: 'PID does not exist.' });
        else {
            DButilsAzure.execQuery(checkPIDQueryWithUsernameQuery).then((response) => {
               if (response.length == 0)
                    res.status(400).json({ message: 'POI ID does not exist for this username' });
                else {
                    DButilsAzure.execQuery(deleteFavoriteQuery).then((response) => {
                        DButilsAzure.execQuery(deleteOrderQuery).then((response) => {
                            res.status(200).json({ message: 'Successful deleted from our system.' });
                        }).catch((err) => {res.status(500).json({ message: err });});
                    }).catch((err) => {res.status(500).json({ message: err });});
                }
            }).catch((err) => {res.status(500).json({ message: err });});
        }
    }).catch((err) => {res.status(500).json({ message: err });});
});

router.post('/userFavorites', (req, res) => {
    let username = req.username;
    let selectPOIQuery = `SELECT * FROM favorites INNER JOIN poi ON favorites.PID=poi.PID 
    INNER JOIN categories ON poi.CategoryId=categories.CategoryId WHERE Username = '${username}';`;

    DButilsAzure.execQuery(selectPOIQuery).then((response) => {
        res.status(200).json({ userFavorites: response });
    })
        .catch((err) => {
            res.status(500).json({message: 'Sorry, An error has occurred on the server. Please, try your request again later.'});
        });
});

router.post('/countUserFavorites', (req, res) => {
    let username = req.username;
    let selectPOIQuery = `SELECT * FROM favorites WHERE Username = '${username}'`;

    DButilsAzure.execQuery(selectPOIQuery).then((response, err) => {
        res.status(200).json({ username: username, number: response.length });
        
    })
        .catch((err) => {
            res.status(500).json({ message: 'Sorry, we cant help you to find your POI by ID.' });
        });
});

router.post('/favorites/:number', (req, res) => {
    let username = req.username;
    let number = req.params.number;

    let selectPOIQuery = `SELECT TOP ${number} * FROM favorites INNER JOIN poi ON favorites.PID=poi.PID 
    INNER JOIN categories ON poi.CategoryId=categories.CategoryId WHERE Username = '${username}' ORDER BY Date DESC`;

    DButilsAzure.execQuery(selectPOIQuery).then((response, err) => {
        if (err)
            res.status(500).json({ message: 'Sorry, there was a problem connecting to the server.' });
        else res.status(200).json({ userFavorites: response });
        
    })
        .catch((err) => {
            res.status(500).json({ message: 'Sorry, we cant help you to find your POI by ID.' });
        });
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
    let checkPIDQuery = `SELECT * FROM poi WHERE PID = '${id}'`;
    let checkPIDQueryWithUsernameQuery = `SELECT * FROM favorites WHERE PID = '${id}' AND Username = '${username}'`;
    let insertFavoriteQuery = `INSERT INTO favorites (Username, PID, DATE) VALUES ('${username}', '${id}', '${date}');`;

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
    DButilsAzure.execQuery(checkPIDQuery).then((response) => {
        if (response.length == 0)
            res.status(400).json({ message: 'Wrong ID' });
        else {
            DButilsAzure.execQuery(checkPIDWithUsernameQuery).then((response) => {
                if (response.length != 0)
                    res.status(400).json({ message: 'POI ID already exist for this username' });
                else {
                    DButilsAzure.execQuery(insertRankingQuery).then((response) => {
                            DButilsAzure.execQuery(getRankingAndRankersQuery).then((response) => {
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
                            });
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
    DButilsAzure.execQuery(checkPIDQuery).then((response) => {
        if (response.length == 0)
            res.status(400).json({ message: 'Wrong ID' });
        else {
            DButilsAzure.execQuery(checkPIDQueryWithUsernameQuery).then((response) => {
                if (response.length != 0)
                    res.status(400).json({ message: 'POI ID already exist for this username' });
                else {
                    DButilsAzure.execQuery(insertFavoriteQuery).then((response) => {
                        res.status(200).json({ message: 'Successful added to our system.' });
                    }).catch((err) => {
                        res.status(500).json({ message: 'Sorry, we cant help you to find your POI by ID.' });
                    });
                }
            }).catch((err) => {
                res.status(500).json({ message: 'Sorry, we cant help you to find your POI by ID.' });
            });
        }
    })
        .catch((err) => {
            res.status(500).json({ message: 'Sorry, we cant help you to find your POI by ID.' });
        });
}

function execOrder(checkPIDQuery, res, numberOfPID, checkPIDQueryWithUsernameQuery, insertOrdersQuery) {
    DButilsAzure.execQuery(checkPIDQuery).then((response) => {
        if (response.length !== numberOfPID)
            res.status(400).json({ message: 'At least one PID is not exist' });
        else {
            DButilsAzure.execQuery(checkPIDQueryWithUsernameQuery).then((response) => {
                if (response.length != 0)
                    res.status(400).json({ message: 'At least one PID and User already exist!' });
                else {
                    DButilsAzure.execQuery(insertOrdersQuery).then((response) => {
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

function validReview(Ranking){
    const schema = {
       id: Joi.number().min(1).required(),
       description: Joi.string().min(50).required()
    };

    return Joi.validate(Ranking, schema);
}

function validRanking(Ranking){
    const schema = {
       id: Joi.number().min(1).required(),
       ranking: Joi.number().integer().required()
    };

    return Joi.validate(Ranking, schema);
}

function validPID(POI){
    const schema = {
       id: Joi.number().min(1).required()
    };

    return Joi.validate(POI, schema);
}

module.exports = router;