angular.module('tokyoApp').controller('adminCtrl', ["$scope", 'data' , function($scope, data) {

$scope.status = data.status
$scope.data = data.data;
console.log($scope.data);
$scope.countriesArray = [];
$scope.numberOfCitizenArray = [];
$scope.rankingArray = [];
$scope.numberOfRankersArray = [];
$scope.viewsPIDArray = [];
$scope.viewsPIDNumberArray = [];
$scope.favoritePIDArray = [];
$scope.favoritePIDNumberArray = [];
$scope.favoriteCategoriesArray = [];
$scope.favoriteCategoriesNumberArray = [];

$scope.createCategories = function(){
  $scope.favoriteCategories = $scope.data.favoriteCategories;
  for (item of $scope.favoriteCategories){
    $scope.favoriteCategoriesArray.push(item.CategoryName);
    $scope.favoriteCategoriesNumberArray.push(item.Number);
  }
}

$scope.createFavoirte = function(){
  $scope.topFavorite = $scope.data.topFavorite;
  for (item of $scope.topFavorite){
    $scope.favoritePIDArray.push(item.Name);
    $scope.favoritePIDNumberArray.push(item.Number);
  }
}

$scope.createViews = function(){
  $scope.topViews = $scope.data.topViews;
  for (item of $scope.topViews){
    $scope.viewsPIDArray.push(item.Name);
    $scope.viewsPIDNumberArray.push(item.Views);
  }
}

$scope.createRanking = function(){
  $scope.rankingDistribution = $scope.data.rankingDistribution;
  for (item of $scope.rankingDistribution){
    $scope.rankingArray.push(item.Ranking);
    $scope.numberOfRankersArray.push(item.Number);
  }
}

$scope.createCountries = function(){
  $scope.countriesDistribution = $scope.data.countriesDistribution;
  for (item of $scope.countriesDistribution){
    $scope.countriesArray.push(item.Country);
    $scope.numberOfCitizenArray.push(item.Number);
  }
}

$scope.createCategories();
$scope.createFavoirte();
$scope.createCountries();
$scope.createRanking();
$scope.createViews();
$scope.counteries = document.getElementById("counteries");
$scope.favoritePOI = document.getElementById("favoritePOI");
$scope.ranking = document.getElementById("ranking");
$scope.viewsPOI = document.getElementById("viewsPOI");
$scope.categories = document.getElementById("categories");
$scope.countriesColor = ["#001464", "#59709A","#8CA0B9","#B2C7D0","#CCDDE0"];
$scope.rankingColor = ["#001464", "#59709A","#8CA0B9","#B2C7D0","#CCDDE0"];
$scope.favoriteColor = ["#001464", "#59709A","#8CA0B9","#B2C7D0","#CCDDE0"];
$scope.viewsColor = ["#001464", "#59709A","#8CA0B9","#B2C7D0","#CCDDE0"];
$scope.categoriesColor = ["#F37320", "#BEB5AB","#8A0059","#001464"];

new Chart($scope.counteries, {
    type: 'bar',
    data: {
      labels: $scope.countriesArray,
      datasets: [
        {
          label: "Population",
          backgroundColor: $scope.countriesColor,
          data: $scope.numberOfCitizenArray
        }
      ]
    },
    options: {
      legend: { display: false },
      title: {
        display: true,
        text: 'Countries with most NT Tokyo Travel Guide users'
      }
    }
});


new Chart($scope.ranking, {
    type: 'bar',
    data: {
      labels: $scope.rankingArray,
      datasets: [
        {
          label: "Ranking",
          backgroundColor: $scope.rankingColor,
          data: $scope.numberOfRankersArray
        }
      ]
    },
    options: {
      legend: { display: false },
      title: {
        display: true,
        text: 'Ranking distribution'
      },
      scales: {
        xAxes: [{
            stacked: true
        }],
        yAxes: [{
            stacked: true
        }]
    }
    }
});

new Chart($scope.favoritePOI, {
    type: 'pie',
    data: {
      labels:  $scope.favoritePIDArray,
      datasets: [{
        label: "Favorite POI",
        backgroundColor: $scope.favoriteColor,
        data: $scope.favoritePIDNumberArray
      }]
    },
    options: {
      title: {
        display: true,
        text: 'Top 5 favorited POIs'
      }
    }
});

new Chart($scope.viewsPOI, {
    type: 'doughnut',
    data: {
      labels: $scope.viewsPIDArray,
      datasets: [
        {
          label: "Views POI",
          backgroundColor: $scope.viewsColor,
          data: $scope.viewsPIDNumberArray
        }
      ]
    },
    options: {
      title: {
        display: true,
        text: 'Top 5 viewed POIs'
      }
    }
});

new Chart($scope.categories, {
    type: 'horizontalBar',
    data: {
      labels: $scope.favoriteCategoriesArray,
      datasets: [
        {
          label: "Categories",
          backgroundColor: $scope.categoriesColor,
          data: $scope.favoriteCategoriesNumberArray
        }
      ]
    },
    options: {
      legend: { display: false },
      title: {
        display: true,
        text: 'Categories ordered by the number of users that marked they are interested in them'
      },
      scales: {
        xAxes: [{
            stacked: true
        }],
        yAxes: [{
            stacked: true
        }]
    }
    }
});

}]);