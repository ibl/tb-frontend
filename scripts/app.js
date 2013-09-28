(function () {
    "use strict";

    var backend, app;

    backend = "http://hydrogen.path.uab.edu/tb/api/v1";

    app = angular.module("app", ["ngResource"]);

    app.config(function ($routeProvider) {
        $routeProvider.when("/", {
            templateUrl: "templates/index.html",
        }).when("/patients", {
            templateUrl: "templates/patients/list.html",
            controller: "PatientListController",
            resolve: {
                patients: function ($q, Patient) {
                    var deferred;
                    deferred = $q.defer();
                    Patient.query(function (patients) {
                        deferred.resolve(patients);
                    });
                    return deferred.promise;
                }
            }
        }).when("/patients/new", {
            templateUrl: "templates/patients/edit.html",
            controller: "PatientNewController"
        }).when("/patients/edit/:id", {
            templateUrl: "templates/patients/edit.html",
            controller: "PatientEditController",
            resolve: {
                patient: function ($q, $route, Patient) {
                    var deferred;
                    deferred = $q.defer();
                    Patient.get({
                        id: $route.current.params.id
                    }, function (patient) {
                        deferred.resolve(patient);
                    });
                    return deferred.promise;
                }
            }
        });
    });

    app.factory("Patient", function ($resource) {
        return $resource(backend + "/patients/:id", {
            id: "@_id"
        }, {
            update: {
                method: "PUT"
            }
        });
    });

    app.controller("PatientListController", function ($scope, patients) {
        $scope.patients = patients;
    });

    app.controller("PatientNewController", function ($scope, $location, Patient) {
        $scope.submit = function (newPatient) {
            Patient.save(newPatient, function () {
                $location.path("/patients");
            });
        };
    });

    app.controller("PatientEditController", function ($scope, $location, Patient, patient) {
        $scope.patient = patient;
        $scope.submit = function (newPatient) {
            Patient.update(newPatient, function () {
                $location.path("/patients");
            });
        };
    });

}());
