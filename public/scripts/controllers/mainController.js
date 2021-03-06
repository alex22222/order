'use strict';

var mainControllerControllers = angular.module('mainControllerControllers', []);

mainControllerControllers.controller('mainController', ['$scope', '$location', '$q', '$route', '$timeout',
    function($scope, $location, $q, $route, $timeout) {
        $scope.$on('$routeChangeStart', function(scope, next, current) {
            if (!localStorage["username"]) {
                if ($location.url() == "/vehicle") {
                    $location.path('/vehicle');
                } else if ($location.url() == "/logon") {
					$location.path('/logon');
                } else if ($location.url() == "/recoverPass") {
					$location.path('/recoverPass');
				}
				else {
                    sessionStorage["message"] = '没有权限访问！请先登入！';
                    $location.path('/public/error');
                }
            }
        });

        $scope.displayMessage = function(message, nextUrl) {
            var deferred = $q.defer();
            var promise = deferred.promise;
            promise.then(function() {
                $scope.message = message.message + '__' + new Date().getTime();
                $scope.success = message.success;
                var anotherDeferred = $q.defer();
                $timeout(function() {
                    anotherDeferred.resolve();
                }, 500);
                return anotherDeferred.promise;
            }).then(function() {
                if (nextUrl) {
                    $location.path(nextUrl);
                } else {
                    $route.reload();
                }
                $scope.message = '';
            });
            deferred.resolve();
        };

        $scope.renderError = function(message) {
            sessionStorage["message"] = message;
            $location.path('/public/error');
        };

        $scope.cleanUserData = function(user) {
            if (user) {
                user.isIn = false;
                user.isAdmin = false;
                user.username = '';
                user.password = '';
            }
            localStorage.clear();
        };

        var defaultItemsPerPage = 5;
        $scope.currentPagination = function(currentPage, searchValue) {
            if (!currentPage) {
                currentPage = 1;
            }
            if (!searchValue) {
                searchValue = '';
            }
            return {
                pageNumber: currentPage,
                itemsPerPage: defaultItemsPerPage,
                search: searchValue,
                user: localStorage["userId"]
            };
        };

        $scope.loadListPage = function(result) {
            $scope.items = result.objectList;
            $scope.totalItems = result.page.size;
            $scope.currentPage = result.page.currentPage;
            $scope.itemsPerPage = result.page.itemsPerPage;
        };

        $scope.clear = function(search) {
            search.search_name = '';
        };

        $scope.back = function(url) {
            $location.path(url);
        };

        $scope.open = function(url) {
            $location.path(url);
        };
    }
]);
