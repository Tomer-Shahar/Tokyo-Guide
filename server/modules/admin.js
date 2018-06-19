const express = require('express');
const router = express.Router();
const DButilsAzure = require('../DButils');
const Joi = require('joi');

router.post('/', (req, res) => {
    let username = req.username;
    let admin = req.admin;
    
    if(!admin){
        return res.status(403).send("You don\'t have premission to access /admin on this server");
    }

    let topFavoritePOIQuery = `SELECT TOP(5) f.PID,  p.Name, COUNT(f.PID) as Number FROM favorites as f INNER JOIN poi p on f.PID = p.PID GROUP BY f.PID, p.Name ORDER BY COUNT(f.PID) DESC`;
    let topViewsPOIQuery = `SELECT TOP(5) * FROM poi ORDER BY Views DESC`;
    let rankingDistributionPOIQuery = `SELECT Ranking, COUNT(Ranking) as Number FROM ranking GROUP BY Ranking ORDER BY Ranking`;
    let countryDistributionPOIQuery = `SELECT TOP(5) Country, COUNT(Country) as Number FROM users GROUP BY Country ORDER BY COUNT(Country) DESC`;
    let favoriteCategoriesQuery = `SELECT uc.CategoryID, c.CategoryName, COUNT(uc.CategoryID) as Number FROM user_categories as uc INNER JOIN categories c on uc.CategoryID = c.CategoryID GROUP BY uc.CategoryID, c.CategoryName ORDER BY uc.CategoryID`

    DButilsAzure.execQuery(topFavoritePOIQuery).then((response)=>{
        let topFavorite = response;
        DButilsAzure.execQuery(topViewsPOIQuery).then((response)=>{
            let topViews = response;
            DButilsAzure.execQuery(rankingDistributionPOIQuery).then((response)=>{
                let rankingDistribution = response;
                DButilsAzure.execQuery(countryDistributionPOIQuery).then((response)=>{
                    let countriesDistribution = response;
                    DButilsAzure.execQuery(favoriteCategoriesQuery).then((response)=>{
                        let favoriteCategories = response;
                        res.status(200).json({
                            topFavorite: topFavorite,
                            topViews: topViews,
                            rankingDistribution: rankingDistribution,
                            countriesDistribution: countriesDistribution,
                            favoriteCategories: favoriteCategories
                        });
                    }).catch((err) => {
                        res.status(500).json({message: 'Sorry, An error has occurred on the server.favoriteCategoriesQuery Please, try your request again later.'});
                    });
                }).catch((err) => {
                    res.status(500).json({message: 'Sorry, An error has occurred on the server. countryDistributionPOIQuery Please, try your request again later.'});
                });
            }).catch((err) => {
                res.status(500).json({message: 'Sorry, An error has occurred on the server. rankingDistributionPOIQuery Please, try your request again later.'});
            });
        }).catch((err) => {
            res.status(500).json({message: 'Sorry, An error has occurred on the server.topViewsPOIQuery  Please, try your request again later.'});
        });
    }).catch((err) => {
        res.status(500).json({message: 'Sorry, An error has occurred on the server.topFavoritePOIQuery Please, try your request again later.'});
    });
});

module.exports = router;