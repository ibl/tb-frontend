(function () {
    "use strict";

    var backend, app, defaultLimit;

    defaultLimit = 25;

 // Declare the templates module, if it doesn't already exist, as in the dev environment
    try {
        angular.module("templates-app");
    } catch (e) {
        angular.module("templates-app", []);
    }

    app = angular.module("app", ["ngResource", "ui.router", "templates-app"]);

    app.config(function ($stateProvider, $urlRouterProvider) {
        var conferencesResolver, conferencesByPatientResolver, conferenceResolver, conferenceAndPatientsResolver, patientsResolver, patientResolver, observationsByPatientResolver, observationResolver;
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
        conferenceAndPatientsResolver = function ($stateParams, Conference) {
            return Conference.get({
                id: $stateParams.conferenceId,
                populate: "patients"
            }).$promise;
        };
        patientsResolver = function ($stateParams, Patient) {
            return Patient.query({
                limit: $stateParams.limit || defaultLimit,
                skip: $stateParams.skip || 0
            }).$promise;
        };
        patientResolver = function ($stateParams, Patient) {
            return Patient.get({
                id: $stateParams.patientId
            }).$promise;
        };
        observationsByPatientResolver = function ($stateParams, Observation, ObservationFile) {
            return Observation.query({
                conditions: {
                    patient: $stateParams.patientId
                }
            }).$promise;
        };
        observationResolver = function ($stateParams, Observation) {
            return Observation.get({
                id: $stateParams.observationId
            }).$promise;
        };
        $urlRouterProvider.otherwise("/");
        $stateProvider.state("home", {
            url: "/",
            templateUrl: "templates/credentials/edit.html",
            controller: "EditCredentialsController"
        }
        ).state("index", {
            url: "/index",
            templateUrl: "templates/conferences/view.html",
            controller: "IndexController",
            resolve: {
                recentConferences: function (Conference) {
                    return Conference.query({
                        limit: 10,
                        sort: "-date",
                        populate: "patients"
                    }).$promise;
                }
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
                conference: conferenceAndPatientsResolver
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
            url: "/patients?limit&skip",
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
                conferences: conferencesByPatientResolver,
                observations: observationsByPatientResolver
            }
        }).state("viewSelectedPatient", {
            parent: "viewConference",
            url: "/patient/:patientId",
            templateUrl: "templates/patients/view.html",
            controller: "ViewPatientController",
            resolve: {
                patient: patientResolver,
                conferences: conferencesByPatientResolver,
                observations: observationsByPatientResolver
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
        }).state("createObservation", {
            url: "/patient/:patientId/observations/new",
            templateUrl: "templates/observations/edit.html",
            controller: "CreateObservationController"
        }).state("editObservation", {
            url: "/patient/:patientId/observation/:observationId",
            templateUrl: "templates/observations/edit.html",
            controller: "EditObservationController",
            resolve: {
                observation: observationResolver
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

    app.factory("Credentials", function () {
        return {
            backend: "http://hydrogen.path.uab.edu/tb/api/v1",
            username: "test",
            password: "test"
        };
    });

    app.factory("Conference", function ($resource, Credentials) {
        return $resource(Credentials.backend + "/conferences/:id", {
            id: "@_id"
        }, {
            update: {
                method: "PUT"
            }
        });
    });

    app.factory("Patient", function ($resource, Credentials) {
        return $resource(Credentials.backend + "/patients/:id", {
            id: "@_id",
            limit: defaultLimit
        }, {
            update: {
                method: "PUT"
            }
        });
    });

    app.factory("Observation", function ($resource, $http, Credentials) {
        function fileType(file) {
            return file.type || "application/octet-stream";
        };
        return $resource(Credentials.backend + "/observations/:id", {
            id: "@_id"
        }, {
            'get':    {method:'GET', interceptor: {
                'response': function (response) {
                    var url = response.config.url,
                        file = response.resource.file;
                    if (file) {
                        file.url = url + "/file";
                    }
                    return response.resource;
                }
            }},
            'save':   {method:'POST', interceptor: {
                'response': function (response) {
                    var url = response.config.url + "/" + response.data._id + "/file",
                        file = response.config.data.file;
                    if (file) {
                        return $http.put(url, file, {
                            headers: {
                                "Content-Type": fileType(file)
                            }
                        }).then(function () {
                            return response;
                        });
                    } else {
                        return response;
                    }
                }
            }},
            'query':  {method:'GET', isArray:true, interceptor: {
                'response': function (response) {
                    var baseUrl = response.config.url.split("?")[0];
                    angular.forEach(response.resource, function (observation) {
                        if (observation.file) {
                            observation.file.url = baseUrl + "/" + observation._id + "/file";
                        }
                    });
                    return response.resource;
                }
            }},
            'remove': {method:'DELETE'},
            'delete': {method:'DELETE'},
            'update': {method:'PUT'}
        });
    });

    app.factory("ObservationFile", function ($resource, $http, Credentials) {
        return {
            create: function (params, file, success) {
                var url = Credentials.backend + "/observations/" + params.id + "/file";
                return $http.put(url, file, {
                    headers: {
                        "Content-Type": file.type || "application/octet-stream"
                    }
                }).then(success);
            },
            getUrl: function (observation) {
                return Credentials.backend + "/observations/" + observation._id + "/file";
            },
            getFile: function (observation) {
                return $http.get(Credentials.backend + "/observations/" + observation._id + "/file");
            },
            remove: function (observation) {
                return $http.delete(Credentials.backend + "/observations/" + observation._id + "/file");
            }
        }
    });

    app.controller("IndexController", function ($scope, recentConferences) {
        $scope.recentConferences = recentConferences;
        $scope.conference = recentConferences[0];
    });

    app.controller("ListConferencesController", function ($scope, conferences) {
        $scope.conferences = conferences;
    });

    app.controller("ViewConferenceController", function ($scope, conference) {
        $scope.conference = conference;
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

    app.controller("ListPatientsController", function ($scope, patients, $stateParams, Patient) {
        $scope.patients = patients;
        $scope.limit = parseInt($stateParams.limit, 10) || defaultLimit;
        $scope.skip = parseInt($stateParams.skip, 10) || 0;
        $scope.next = $scope.skip + $scope.limit;
        $scope.previous = $scope.skip - $scope.limit;
        $scope.pages = []
        for (var i = 1; i < 6; i++ ) {
            var offset = $scope.skip + $scope.limit * i
            $scope.pages.push({
                page: (offset)/$scope.limit + 1,
                skip: offset
            });
        }

        $scope.searchPatients = function (term) {
            $scope.patients = Patient.query({
                conditions: JSON.stringify({
                    "$or": [
                        {
                            "name": {
                                "$regex": term,
                                "$options": "i"
                            }
                        },
                        {
                            "mrn": {
                                "$regex": term,
                                "$options": "i"
                            }
                        }
                    ]
                })
            });
        }
    });

    app.controller("ViewPatientController", function ($scope, $state, patient, conferences, observations, Observation, ObservationFile) {
        $scope.patient = patient;
        $scope.conferences = conferences;
        $scope.observations = observations;
        $scope.loadObservationFile = function (observation) {
            ObservationFile.getFile(observation).then(function (file) {
                observation.file.contents = file;
            });
        };
        $scope.removeObservation = function removeObservation(observation, index) {
            observation.$remove(null, function () {
                $scope.observations.splice(index, 1);
            });
        };
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

    app.controller("CreateObservationController", function ($scope, $stateParams, $state, Observation, ObservationFile) {
        $scope.observation = {};
        $scope.submit = function (newObservation) {
         // Keep reference to patient.
            newObservation.patient = $stateParams.patientId;
            Observation.save(newObservation, function () {
                $state.go("viewPatient", {
                    patientId: $stateParams.patientId
                });
            });
        };
    });

    app.controller("EditObservationController", function ($scope, $state, Observation, observation) {
        $scope.observation = observation;
        $scope.submit = function (newObservation) {
            Observation.update(newObservation, function () {
                $state.go("viewPatient", {
                    patientId: observation.patient
                });
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

    app.controller("EditCredentialsController", function ($scope, $state, $http, Credentials) {
        $scope.credentials = Credentials;
        $scope.submit = function () {
            $http.defaults.headers.common.Authorization = "Basic " + btoa($scope.credentials.username + ":" + $scope.credentials.password);
            $state.go("index");
        };
    });

    app.directive("fileCapture", function () {
        return {
            restrict: "E",
            template: "<input type=\"file\" name=\"file\" onchange=\"angular.element(this).scope().captureFile(this)\">",
            scope: true,
            require: 'ng-model',
            link: function ($scope, element, attributes, ngModel) {
                $scope.captureFile = function (element) {
                    $scope.$apply(function () {
                        ngModel.$setViewValue(element.files[0]);
                    });
                }
            }
        };
    });

}());
