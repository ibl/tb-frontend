(function () {
    "use strict";

    var backend, app;

    backend = "http://hydrogen.path.uab.edu/tb/api/v1";

    app = angular.module("app", ["ngResource", "ui.router"]);

    app.config(function ($stateProvider, $urlRouterProvider) {
        var conferencesResolver, conferenceResolver, patientsResolver, patientResolver;
        conferencesResolver = function (Conference) {
            return Conference.query().$promise;
        };
        conferenceResolver = function ($stateParams, Conference) {
            return Conference.get({
                id: $stateParams.id
            }).$promise;
        };
        patientsResolver = function (Patient) {
            return Patient.query().$promise;
        };
        patientResolver = function ($stateParams, Patient) {
            return Patient.get({
                id: $stateParams.id
            }).$promise;
        };
        $urlRouterProvider.otherwise("/");
        $stateProvider.state("index", {
            url: "/",
            templateUrl: "templates/conferences/view.html",
            controller: "IndexController",
            resolve: {
                recentConferences: function (Conference) {
                    return Conference.query({
                        limit: 10,
                        sort: "-date"
                    }).$promise;
                },
                patients: patientsResolver
            }
        }).state("conferences", {
            url: "/conferences",
            templateUrl: "templates/conferences/list.html",
            controller: "ConferenceListController",
            resolve: {
                conferences: conferencesResolver
            }
        }).state("conferencesView", {
            url: "/conferences/view/:id",
            templateUrl: "templates/conferences/view.html",
            controller: "ConferenceViewController",
            resolve: {
                conference: conferenceResolver,
                patients: patientsResolver
            }
        }).state("conferencesNew", {
            url: "/conferences/new",
            templateUrl: "templates/conferences/edit.html",
            controller: "ConferenceNewController",
            resolve: {
                patients: patientsResolver
            }
        }).state("conferencesEdit", {
            url: "/conferences/edit/:id",
            templateUrl: "templates/conferences/edit.html",
            controller: "ConferenceEditController",
            resolve: {
                conference: conferenceResolver,
                patients: patientsResolver
            }
        }).state("patients", {
            url: "/patients",
            templateUrl: "templates/patients/list.html",
            controller: "PatientListController",
            resolve: {
                patients: patientsResolver
            }
        }).state("patientsView", {
            url: "/patients/view/:id",
            templateUrl: "templates/patients/view.html",
            controller: "PatientViewController",
            resolve: {
                patient: patientResolver,
                conferences: conferencesResolver
            }
        }).state("patientsNew", {
            url: "/patients/new",
            templateUrl: "templates/patients/edit.html",
            controller: "PatientNewController"
        }).state("patientsEdit", {
            url: "/patients/edit/:id",
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

    app.controller("IndexController", function ($scope, recentConferences, patients) {
        $scope.recentConferences = recentConferences;
        $scope.$watch("conference", function () {
            $scope.conferencePatients = $scope.conference.patients.map(function (conferencePatientId) {
             // Join patients.
                return patients.filter(function (patient) {
                    if (patient._id === conferencePatientId) {
                        return true;
                    } else {
                        return false;
                    }
                })[0];
            });
        });
        $scope.conference = recentConferences[0];
    });

    app.controller("ConferenceListController", function ($scope, conferences) {
        $scope.conferences = conferences;
    });

    app.controller("ConferenceViewController", function ($scope, conference, patients) {
        $scope.conference = conference;
        $scope.conferencePatients = $scope.conference.patients.map(function (conferencePatientId) {
         // Join patients.
            return patients.filter(function (patient) {
                if (patient._id === conferencePatientId) {
                    return true;
                } else {
                    return false;
                }
            })[0];
        });
    });

    app.controller("ConferenceNewController", function ($scope, $location, Conference, patients) {
        $scope.patients = patients;
        $scope.submit = function (newConference) {
         // Find checked patients.
            newConference.patients = patients.filter(function (patient) {
                if (patient.hasOwnProperty("checked") === true && patient.checked === true) {
                    return true;
                } else {
                    return false;
                }
            }).map(function (patient) {
             // Convert to array.
                return patient._id;
            });
            Conference.save(newConference, function () {
                $location.path("/conferences");
            });
        };
    });

    app.controller("ConferenceEditController", function ($scope, $location, Conference, conference, patients) {
        $scope.conference = conference;
     // Pre-check patients.
        $scope.patients = patients.map(function (patient) {
            if (conference.patients.indexOf(patient._id) > -1) {
                patient.checked = true;
            }
            return patient;
        });
        $scope.submit = function (newConference) {
         // Find checked patients.
            newConference.patients = patients.filter(function (patient) {
                if (patient.hasOwnProperty("checked") === true && patient.checked === true) {
                    return true;
                } else {
                    return false;
                }
            }).map(function (patient) {
             // Convert to array.
                return patient._id;
            });
            Conference.update(newConference, function () {
                $location.path("/conferences");
            });
        };
    });

    app.controller("PatientListController", function ($scope, patients) {
        $scope.patients = patients;
    });

    app.controller("PatientViewController", function ($scope, patient, conferences) {
        $scope.patient = patient;
        $scope.patientConferences = conferences.filter(function (conference) {
            if (conference.patients.indexOf($scope.patient._id) > -1) {
                return true;
            } else {
                return false;
            }
        });
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
