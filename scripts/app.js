(function () {
    "use strict";

    var backend, app;

    backend = "http://hydrogen.path.uab.edu/tb/api/v1";

    app = angular.module("app", ["ngResource"]);

    app.config(function ($routeProvider) {
        var patientResolver;
        patientResolver = function ($q, $route, Patient) {
            var deferred;
            deferred = $q.defer();
            Patient.get({
                id: $route.current.params.id
            }, function (patient) {
                deferred.resolve(patient);
            });
            return deferred.promise;
        };
        $routeProvider.when("/", {
            templateUrl: "templates/index.html",
        }).when("/conferences", {
            templateUrl: "templates/conferences/list.html",
            controller: "ConferenceListController",
            resolve: {
                conferences: function ($q, Conference) {
                    var deferred;
                    deferred = $q.defer();
                    Conference.query(function (conferences) {
                        deferred.resolve(conferences);
                    });
                    return deferred.promise;
                }
            }
        }).when("/conferences/new", {
            templateUrl: "templates/conferences/edit.html",
            controller: "ConferenceNewController"
        }).when("/conferences/edit/:id", {
            templateUrl: "templates/conferences/edit.html",
            controller: "ConferenceEditController",
            resolve: {
                conference: function ($q, $route, Conference) {
                    var deferred;
                    deferred = $q.defer();
                    Conference.get({
                        id: $route.current.params.id
                    }, function (conference) {
                        deferred.resolve(conference);
                    });
                    return deferred.promise;
                }
            }
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
        }).when("/patients/view/:id", {
            templateUrl: "templates/patients/view.html",
            controller: "PatientViewController",
            resolve: {
                patient: patientResolver
            }
        }).when("/patients/new", {
            templateUrl: "templates/patients/edit.html",
            controller: "PatientNewController"
        }).when("/patients/edit/:id", {
            templateUrl: "templates/patients/edit.html",
            controller: "PatientEditController",
            resolve: {
                patient: patientResolver
            }
        });
    });

    app.factory("Conference", function ($resource) {
        return $resource(backend + "/conferences/:id", {
            id: "@_id"
        }, {
            update: {
                method: "PUT"
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

    app.controller("ConferenceListController", function ($scope, conferences) {
        $scope.conferences = conferences;
    });

    app.controller("ConferenceNewController", function ($scope, $location, Conference) {
        $scope.submit = function (newConference) {
            Conference.save(newConference, function () {
                $location.path("/conferences");
            });
        };
    });

    app.controller("ConferenceEditController", function ($scope, $location, Conference, conference) {
        $scope.conference = conference;
        $scope.submit = function (newConference) {
            Conference.update(newConference, function () {
                $location.path("/conferences");
            });
        };
    });

    app.controller("PatientListController", function ($scope, patients) {
        $scope.patients = patients;
    });

    app.controller("PatientViewController", function ($scope, patient) {
        $scope.patient = patient;
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
