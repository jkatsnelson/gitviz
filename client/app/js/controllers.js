'use strict';

/* Controllers */
function SignInController($rootScope, $scope, $http) {
  $http.get('../data/users.json').success(function(data) {
    $rootScope.user = data;
  });

  $scope.goToUserAccount = function() {
    // eventually log the player in
  };
}

function UserShowController($rootScope, $scope) {
  $scope.user = $rootScope.user;
  $scope.stats = $scope.user.stats[0];
  $scope.teams = $scope.user.teams;
}

function TeamShowController($rootScope, $scope) {

}