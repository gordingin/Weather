(function () {
    'use strict';

    angular
        .module('angular-weather', []);


})();
(function () {
    'use strict';
    angular
        .module('angular-weather')
        .directive('weather', function ($compile,consts) {
            var index = 0;
            return {
            scope: {
            },
            restrict: 'AE',
            transclue: true,
            template: '<div class="weathercontainer {{prefix}}_weather_outter_container"><div class="{{prefix}}_weather_inner_container"><div class="{{prefix}}_box" ng-repeat="day in weather"><div class="{{prefix}}_dateHeader">{{day.date_month}}-{{day.date_day}}-{{day.date_year}}</div><div class="{{prefix}}_upperTempHeader"><img src="Images/arrow-up-blue.png">{{day.max | formatdegree}}<sup>o</sup></div><div class="{{prefix}}_currentTempHeader"><div class="{{prefix}}_currentTemp">{{day.current| formatdegree}}<sup>o</sup></div></div><div class="{{prefix}}_lowerTempHeader"><img src="Images/arrow-down-blue.png">{{day.min| formatdegree}}<sup>o</sup></div><div>{{day.main}}</div><div>{{day.description}}</div><div class="{{prefix}}_dayIconContainer"><div class="{{prefix}}_dayIcon"><img src="Images/{{day.icon}}.png"></div></div></div></div></div>',
            link: function(scope, element, attrs) {
                scope.prefix = attrs["clsPrefix"];
                if(consts.apiID == "Add your appID here")
                {
                    var el = document.getElementsByClassName('weathercontainer');
                    angular.element(el[index]).prepend("<div class='panel panel-default'><div class='panel-heading'><h3 class='panel-title' style='font-weight: bold'>Hey you first need an AppID from OpenWeatherMap!</h3></div><div class='panel-body'><ul><li>You need to register with OpenWeatherMap first and get an AppID first. It's free!.</li><li><a href='https://home.openweathermap.org/users/sign_up'>https://home.openweathermap.org/users/sign_up</a></li><li>Then add that to the Constant AppProvider appID.</li><li>Just search for this phrase 'Add your appID here' in main.js.</li><li>Save and rerun to see weather (You may have to wait a few minutes for it all to process).</li></ul></div></div>");
                }
                index++;

            },
            controller: function ($scope, $element, $attrs, $http, $q, $timeout, $compile, consts) {
                $scope.weather = null;
                if(consts.apiID != "Add your appID here")
                {
                    $timeout(function () {
                    $attrs.$observe('coords', function (value) {
                        if (value) {
                            var coords = $scope.$eval(value);
                            var apiID = consts.apiID;
                            
                            var url = "http://api.openweathermap.org/data/2.5/forecast/daily?lat=" + coords.pos[0] + "&lon=" + coords.pos[1] + "&cnt=16&appid="+apiID+"&units=imperial";
                            $http.get(url)
                            .success(function (objReturn, status) {
                                $scope.weather = Enumerable.From(objReturn.list).Select(function (i) {
                                    return {
                                        dt: i.dt,
                                        current: i.temp.day,
                                        min: i.temp.min,
                                        max: i.temp.max,
                                        date_day: new Date(i.dt * 1000).getDate(),
                                        date_month: new Date(i.dt * 1000).getMonth() + 1,
                                        date_year: new Date(i.dt * 1000).getFullYear(),
                                        description: i.weather[0].description,
                                        main: i.weather[0].main,
                                        icon: i.weather[0].icon
                                    }
                                }).OrderBy(function (x) { return x.dt }).ToArray();
                            }).error(function () {
                                alert("Error getting weather information");
                            });
                        }
                    });
                }, Math.floor((Math.random() * 1500) + 10));
                }
            }
        };
    });

    angular.module('angular-weather')
        .filter('formatdegree', function () {
        return function (input, input2) {
            var n = input.toString().indexOf(".");
            if (n > 0)
                return input.toString().substring(0, n);
            return input;
        };
    });
})();

