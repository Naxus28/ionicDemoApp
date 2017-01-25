// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('layout', {
        abstract: true,
        templateUrl: 'templates/layout.html'
      })
      .state('layout.home', {
        url: '/home',
        templateUrl: 'templates/home.html'
      })
      .state('layout.list', {
        url: '/artists',
        templateUrl: 'templates/list.html',
        controller: 'ListController'
      })
      .state('layout.detail', {
        url: '/artists/:aId',
        templateUrl: 'templates/detail.html',
        controller: 'ListController'
      })
      .state('layout.calendar', {
        url: '/calendar',
        templateUrl: 'templates/calendar.html',
        controller: 'CalendarController'
      })

    $urlRouterProvider.otherwise('/home');
}])

.controller('CalendarController', ['$scope', '$http', '$state', function($scope, $http, $state) {
  $http.get('js/data.json')
    .success(function(data) {
      $scope.calendar = data.calendar;

      $scope.toggleStar = function(eventDetail) {
        eventDetail.star = !eventDetail.star;
      }

      $scope.deleteEvent = function(calendarIndex, eventIndex) {
        $scope.calendar[calendarIndex].schedule.splice(eventIndex, 1);
      }

      $scope.doRefresh = function() {
        $http.get('js/data.json')
          .success(function(data) {
            $scope.calendar = data.calendar;
            $scope.$broadcast('scroll.refreshComplete');
          });
      }

    })
    .error(function(err) {
      console.warn('error: ', err);
    })
}])

.controller('ListController', ['$scope', '$http', '$state', function($scope, $http, $state) {
  $http.get('js/data.json')
    .success(function(data) {
      $scope.artists = data.artists;
      $scope.whichartist = $state.params.aId;
      $scope.data = { showDelete: false, showReorder: false };

      $scope.isNameInList = function(nameSearch) {
        let nameMatch =  _.filter(data.artists, function(artist) {
          let artistName = artist.name.toLowerCase();
          return artistName.includes(nameSearch);
        });
       return nameMatch.length;
      }

      $scope.moveArtist = function(artist, fromIndex, toIndex) {
        $scope.artists.splice(fromIndex, 1);
        $scope.artists.splice(toIndex, 0, artist);
      }

      $scope.toggleStar = function(artist) {
        artist.star = !artist.star;
      }

      $scope.deleteArtist = function(artistIndexInArray) {
        $scope.artists.splice(artistIndexInArray, 1);
      }

      $scope.doRefresh = function() {
        $http.get('js/data.json')
          .success(function(data) {
            $scope.artists = data.artists;
            $scope.$broadcast('scroll.refreshComplete');
          });
      }

      $scope.getFullName = function() {
        let artist = _.find($scope.artists, function(artist) {
          return artist.shortname === $scope.whichartist;
        });
        return artist.name;
      }

    })
    .error(function(err) {
      console.warn('error: ', err);
    })

}])
