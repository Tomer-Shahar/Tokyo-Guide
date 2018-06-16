angular.module('tokyoApp').controller('adminCtrl', ["$scope", 'data' , function($scope, data) {

$scope.status = true;
$scope.data = data;
console.log($scope.data);
$scope.counteries = document.getElementById("counteries");
$scope.favoritePOI = document.getElementById("favoritePOI");
$scope.ranking = document.getElementById("ranking");
$scope.viewsPOI = document.getElementById("viewsPOI");
$scope.categories = document.getElementById("categories");

new Chart($scope.counteries, {
    type: 'bar',
    data: {
      labels: ["Isreal", "USA", "Europe", "Latin America", "North America"],
      datasets: [
        {
          label: "Population",
          backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850"],
          data: [2478,5267,734,784,433]
        }
      ]
    },
    options: {
      legend: { display: false },
      title: {
        display: true,
        text: 'Population - Countries'
      }
    }
});


new Chart($scope.ranking, {
    type: 'bar',
    data: {
      labels: ["1", "2", "3", "4", "5"],
      datasets: [
        {
          label: "Ranking",
          backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850"],
          data: [2478,5267,734,784,433]
        }
      ]
    },
    options: {
      legend: { display: false },
      title: {
        display: true,
        text: 'Ranking'
      }
    }
});

new Chart($scope.favoritePOI, {
    type: 'pie',
    data: {
      labels: ["POI1", "POI2", "POI3", "POI4", "POI5"],
      datasets: [{
        label: "Favorite POI",
        backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850"],
        data: [2478,5267,734,784,433]
      }]
    },
    options: {
      title: {
        display: true,
        text: 'Favorite POI'
      }
    }
});

new Chart($scope.viewsPOI, {
    type: 'doughnut',
    data: {
      labels: ["POI1", "POI2", "POI3", "POI4", "POI5"],
      datasets: [
        {
          label: "Views POI",
          backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850"],
          data: [2478,5267,734,784,433]
        }
      ]
    },
    options: {
      title: {
        display: true,
        text: 'Views POI'
      }
    }
});

new Chart($scope.categories, {
    type: 'horizontalBar',
    data: {
      labels: ["Cat1", "Cat2", "Cat3", "Cat4"],
      datasets: [
        {
          label: "Categories",
          backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9"],
          data: [1478,367,734,784]
        }
      ]
    },
    options: {
      legend: { display: false },
      title: {
        display: true,
        text: 'Categories'
      }
    }
});

}]);