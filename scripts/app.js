(function () {
    "use strict";

    var backend, app;

    backend = "http://hydrogen.path.uab.edu/tb/api/v1";

    app = angular.module("app", ["ngResource", "ui.router"]);

    app.config(function ($stateProvider, $urlRouterProvider) {
        var conferencesResolver, conferencesByPatientResolver, conferenceResolver, patientsResolver, patientResolver;
        conferencesResolver = function (Conference) {
            return Conference.query().$promise;
        };
        conferencesByPatientResolver = function ($stateParams, Conference) {
            return Conference.query({
                conditions: {
                    patients: $stateParams.patientId
                }
            }).$promise;
        };
        conferenceResolver = function ($stateParams, Conference) {
            return Conference.get({
                id: $stateParams.conferenceId
            }).$promise;
        };
        patientsResolver = function (Patient) {
            return Patient.query().$promise;
        };
        patientResolver = function ($stateParams, Patient) {
            return Patient.get({
                id: $stateParams.patientId
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
        }).state("listConferences", {
            url: "/conferences",
            templateUrl: "templates/conferences/list.html",
            controller: "ListConferencesController",
            resolve: {
                conferences: conferencesResolver
            }
        }).state("viewConference", {
            url: "/conferences/view/:conferenceId",
            templateUrl: "templates/conferences/view.html",
            controller: "ViewConferenceController",
            resolve: {
                conference: conferenceResolver,
                patients: patientsResolver
            }
        }).state("createConference", {
            url: "/conferences/new",
            templateUrl: "templates/conferences/edit.html",
            controller: "CreateConferenceController",
            resolve: {
                patients: patientsResolver
            }
        }).state("editConference", {
            url: "/conferences/edit/:conferenceId",
            templateUrl: "templates/conferences/edit.html",
            controller: "EditConferenceController",
            resolve: {
                conference: conferenceResolver,
                patients: patientsResolver
            }
        }).state("listPatients", {
            url: "/patients",
            templateUrl: "templates/patients/list.html",
            controller: "ListPatientsController",
            resolve: {
                patients: patientsResolver
            }
        }).state("viewPatient", {
            url: "/patients/view/:patientId",
            templateUrl: "templates/patients/view.html",
            controller: "ViewPatientController",
            resolve: {
                patient: patientResolver,
                conferences: conferencesByPatientResolver
            }
        }).state("viewSelectedPatient", {
            parent: "viewConference",
            url: "/patient/:patientId",
            templateUrl: "templates/patients/view.html",
            controller: "ViewPatientController",
            resolve: {
                patient: patientResolver,
                conferences: conferencesByPatientResolver
            }
        }).state("createPatient", {
            url: "/patients/new",
            templateUrl: "templates/patients/edit.html",
            controller: "CreatePatientController"
        }).state("editPatient", {
            url: "/patients/edit/:patientId",
            templateUrl: "templates/patients/edit.html",
            controller: "EditPatientController",
            resolve: {
                patient: patientResolver
            }
        }).state("listModules", {
            url: "/modules",
            templateUrl: "templates/modules/list.html",
            controller: "ListModulesController",
            resolve: {
                modules: function ($q) {
                    var deferred;
                    deferred = $q.defer();
                    ganglion.registry.list(function (err, modules) {
                        if (err !== null) {
                            deferred.reject(err);
                        } else {
                            deferred.resolve(modules);
                        }
                    });
                    return deferred.promise;
                }
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

    app.controller("ListConferencesController", function ($scope, conferences) {
        $scope.conferences = conferences;
    });

    app.controller("ViewConferenceController", function ($scope, conference, patients) {
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

    app.controller("CreateConferenceController", function ($scope, $state, Conference, patients) {
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
                $state.go("listConferences");
            });
        };
    });

    app.controller("EditConferenceController", function ($scope, $state, Conference, conference, patients) {
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
                $state.go("listConferences");
            });
        };
    });

    app.controller("ListPatientsController", function ($scope, patients) {
        $scope.patients = patients;
    });

    app.controller("ViewPatientController", function ($scope, patient, conferences) {
        $scope.patient = patient;
        $scope.conferences = conferences;
    });

    app.controller("CreatePatientController", function ($scope, $state, Patient) {
        $scope.submit = function (newPatient) {
            Patient.save(newPatient, function () {
                $state.go("listPatients");
            });
        };
    });

    app.controller("EditPatientController", function ($scope, $state, Patient, patient) {
        $scope.patient = patient;
        $scope.submit = function (newPatient) {
            Patient.update(newPatient, function () {
                $state.go("listPatients");
            });
        };
    });

    app.controller("ListModulesController", function ($scope, modules) {
        $scope.modules = modules;
        $scope.loadModule = function (module) {
            ganglion.loadModule(module, function () {
                ganglion.registry.list(function (err, modules) {
                    location.reload();
                });
            });
        };
    });

}());
