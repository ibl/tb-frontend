(function () {
    "use strict";

    var app;

    app = angular.module("app", []);

    app.config(function ($routeProvider) {
        $routeProvider.when("/", {
            templateUrl: "templates/index.html",
        });
    });

}());
