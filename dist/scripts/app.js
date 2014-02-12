(function () {
angular.module('templates-app', ['templates/conferences/edit.html', 'templates/conferences/list.html', 'templates/conferences/view.html', 'templates/credentials/edit.html', 'templates/modules/list.html', 'templates/observations/edit.html', 'templates/patients/edit.html', 'templates/patients/list.html', 'templates/patients/view.html']);

angular.module("templates/conferences/edit.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/conferences/edit.html",
    "<form role=\"form\">\n" +
    "    <div class=\"form-group\">\n" +
    "        <label for=\"date\">Date</label>\n" +
    "        <input type=\"date\" name=\"date\" class=\"form-control\" placeholder=\"Enter date\" ng-model=\"conference.date\" value=\"{{conference.date | date:'yyyy-MM-dd'}}\">\n" +
    "    </div>\n" +
    "    <div class=\"form-group\">\n" +
    "        <label for=\"name\">Name</label>\n" +
    "        <input type=\"text\" name=\"name\" class=\"form-control\" placeholder=\"Enter name\" ng-model=\"conference.name\">\n" +
    "    </div>\n" +
    "    <div class=\"form-group\">\n" +
    "        <strong>Patients<strong><br>\n" +
    "        <label class=\"checkbox-inline\" ng-repeat=\"patient in patients\">\n" +
    "            <input type=\"checkbox\" name=\"patients[]\" value=\"{{patient._id}}\" ng-checked=\"patient.checked\" ng-model=\"patient.checked\">\n" +
    "            {{patient.name}}\n" +
    "        </label>\n" +
    "    </div>\n" +
    "    <button type=\"submit\" class=\"btn btn-default\" ng-click=\"submit(conference)\">Submit</button>\n" +
    "</form>\n" +
    "");
}]);

angular.module("templates/conferences/list.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/conferences/list.html",
    "<a ui-sref=\"createConference\" class=\"btn btn-default spacer\">\n" +
    "    <span class=\"glyphicon glyphicon-plus-sign\"></span>\n" +
    "    Add conference\n" +
    "</a>\n" +
    "<table class=\"table table-striped\">\n" +
    "    <tr>\n" +
    "        <th>Date</th>\n" +
    "        <th>Name</th>\n" +
    "        <th>Options</th>\n" +
    "    </tr>\n" +
    "    <tr ng-repeat=\"conference in conferences\">\n" +
    "        <td>{{conference.date | date:'shortDate'}}</td>\n" +
    "        <td>{{conference.name}}</td>\n" +
    "        <td>\n" +
    "            <a ui-sref=\"viewConference({ conferenceId: conference._id })\" class=\"btn btn-default btn-xs\">\n" +
    "                <span class=\"glyphicon glyphicon-search\"></span>\n" +
    "                View\n" +
    "            </a>\n" +
    "            <a ui-sref=\"editConference({ conferenceId: conference._id })\" class=\"btn btn-default btn-xs\">\n" +
    "                <span class=\"glyphicon glyphicon-pencil\"></span>\n" +
    "                Edit\n" +
    "            </a>\n" +
    "        </td>\n" +
    "    </tr>\n" +
    "</table>\n" +
    "");
}]);

angular.module("templates/conferences/view.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/conferences/view.html",
    "<div class=\"row\">\n" +
    "    <div class=\"col-md-3\">\n" +
    "        <form ng-show=\"recentConferences\" class=\"spacer\">\n" +
    "            <div class=\"form-group\">\n" +
    "                <h4>Conference</h4>\n" +
    "                <select class=\"form-control\" ng-model=\"conference\" ng-options=\"conference.date | date:'shortDate' for conference in recentConferences\">\n" +
    "                </select>\n" +
    "            </div>\n" +
    "        </form>\n" +
    "        <div ng-hide=\"recentConferences\">\n" +
    "            <h4>Conference</h4>\n" +
    "            <p>{{conference.date | date:'shortDate'}}: {{conference.name}}</p>\n" +
    "        </div>\n" +
    "        <div>\n" +
    "            <h4>Patients</h4>\n" +
    "            <ul class=\"list-group\">\n" +
    "                <li ng-repeat=\"patient in conference.patients\" class=\"list-group-item\">\n" +
    "                    <a ui-sref=\"viewSelectedPatient({ conferenceId: conference._id, patientId: patient._id })\">\n" +
    "                        {{patient.name}}\n" +
    "                    </a>\n" +
    "                </li>\n" +
    "            </ul>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"col-md-9\">\n" +
    "        <div ui-view></div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("templates/credentials/edit.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/credentials/edit.html",
    "<form role=\"form\">\n" +
    "    <div class=\"form-group\">\n" +
    "        <label for=\"backend\">Backend</label>\n" +
    "        <input type=\"text\" name=\"backend\" class=\"form-control\" placeholder=\"Enter backend\" ng-model=\"credentials.backend\">\n" +
    "    </div>\n" +
    "    <div class=\"form-group\">\n" +
    "        <label for=\"username\">Username</label>\n" +
    "        <input type=\"text\" name=\"username\" class=\"form-control\" placeholder=\"Enter username\" ng-model=\"credentials.username\">\n" +
    "    </div>\n" +
    "    <div class=\"form-group\">\n" +
    "        <label for=\"password\">Password</label>\n" +
    "        <input type=\"password\" name=\"password\" class=\"form-control\" placeholder=\"Enter password\" ng-model=\"credentials.password\">\n" +
    "    </div>\n" +
    "    <button type=\"submit\" class=\"btn btn-default\" ng-click=\"submit(credentials)\">Submit</button>\n" +
    "</form>\n" +
    "");
}]);

angular.module("templates/modules/list.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/modules/list.html",
    "<form class=\"form-inline spacer\" role=\"form\">\n" +
    "    <div class=\"form-group\">\n" +
    "        <input type=\"text\" name=\"module\" class=\"form-control\" placeholder=\"Enter URL\" ng-model=\"module\" value=\"{{module}}\">\n" +
    "    </div>\n" +
    "    <button type=\"submit\" class=\"btn btn-default\" ng-click=\"loadModule(module)\">Submit</button>\n" +
    "</form>\n" +
    "<table class=\"table table-striped\">\n" +
    "    <tr ng-repeat=\"module in modules\">\n" +
    "        <td>{{module}}</td>\n" +
    "    </tr>\n" +
    "</table>\n" +
    "");
}]);

angular.module("templates/observations/edit.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/observations/edit.html",
    "<form role=\"form\">\n" +
    "    <div class=\"form-group\">\n" +
    "        <label for=\"type\">Type</label>\n" +
    "        <input type=\"text\" name=\"type\" class=\"form-control\" placeholder=\"Enter type\" ng-model=\"observation.type\">\n" +
    "    </div>\n" +
    "    <div class=\"form-group\">\n" +
    "        <label for=\"value\">Value</label>\n" +
    "        <input type=\"text\" name=\"value\" class=\"form-control\" placeholder=\"Enter value\" ng-model=\"observation.value\">\n" +
    "    </div>\n" +
    "    <div class=\"form-group\" ng-hide=\"observation.file\">\n" +
    "        <label for=\"file\">File</label>\n" +
    "        <file-capture ng-model=\"observation.file\" />\n" +
    "    </div>\n" +
    "    <div class=\"well\" ng-show=\"observation.file\">\n" +
    "        {{observation.file.name}}\n" +
    "        <span class=\"label label-info\">Size: {{observation.file.size}} Bytes</span>\n" +
    "        <span class=\"label label-info\">Type: {{observation.file.type}}</span>\n" +
    "        <span class=\"pull-right\"><button class=\"btn btn-danger btn-xs\" type=\"button\" ng-click=\"observation.file = null\"><span class=\"glyphicon glyphicon-remove-sign\"></span></button></span>\n" +
    "    </div>\n" +
    "    <button type=\"submit\" class=\"btn btn-default\" ng-click=\"submit(observation)\">Submit</button>\n" +
    "</form>\n" +
    "");
}]);

angular.module("templates/patients/edit.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/patients/edit.html",
    "<form role=\"form\">\n" +
    "    <div class=\"form-group\">\n" +
    "        <label for=\"mrn\">MRN</label>\n" +
    "        <input type=\"text\" name=\"mrn\" class=\"form-control\" placeholder=\"Enter MRN\" ng-model=\"patient.mrn\">\n" +
    "    </div>\n" +
    "    <div class=\"form-group\">\n" +
    "        <label for=\"name\">Name</label>\n" +
    "        <input type=\"text\" name=\"name\" class=\"form-control\" placeholder=\"Enter name\" ng-model=\"patient.name\">\n" +
    "    </div>\n" +
    "    <div class=\"form-group\">\n" +
    "        <label for=\"history\">History</label>\n" +
    "        <textarea name=\"history\" class=\"form-control\" rows=\"3\" ng-model=\"patient.history\"></textarea>\n" +
    "    </div>\n" +
    "    <button type=\"submit\" class=\"btn btn-default\" ng-click=\"submit(patient)\">Submit</button>\n" +
    "</form>\n" +
    "");
}]);

angular.module("templates/patients/list.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/patients/list.html",
    "<div class=\"pull-right\">\n" +
    "    <form action=\"\" role=\"search\">\n" +
    "        <div class=\"form-group\">\n" +
    "            <input class=\"form-control\" type=\"text\" placeholder=\"Search for Name or MRN\" ng-change=\"searchPatients(searchTerm)\" ng-model=\"searchTerm\">\n" +
    "        </div>\n" +
    "    </form>\n" +
    "</div>\n" +
    "<a ui-sref=\"createPatient\" class=\"btn btn-default spacer\">\n" +
    "    <span class=\"glyphicon glyphicon-plus-sign\"></span>\n" +
    "    Add patient\n" +
    "</a>\n" +
    "<table class=\"table table-striped\">\n" +
    "    <tr>\n" +
    "        <th>Name</th>\n" +
    "        <th>MRN</th>\n" +
    "        <th>Options</th>\n" +
    "    </tr>\n" +
    "    <tr ng-repeat=\"patient in patients\">\n" +
    "        <td>{{patient.name}}</td>\n" +
    "        <td>{{patient.mrn}}</td>\n" +
    "        <td>\n" +
    "            <a ui-sref=\"viewPatient({ patientId: patient._id })\" class=\"btn btn-default btn-xs\">\n" +
    "                <span class=\"glyphicon glyphicon-search\"></span>\n" +
    "                View\n" +
    "            </a>\n" +
    "            <a ui-sref=\"editPatient({ patientId: patient._id })\" class=\"btn btn-default btn-xs\">\n" +
    "                <span class=\"glyphicon glyphicon-pencil\"></span>\n" +
    "                Edit\n" +
    "            </a>\n" +
    "        </td>\n" +
    "    </tr>\n" +
    "</table>\n" +
    "<ul class=\"pagination patination-sm\">\n" +
    "    <li class=\"previous\" ng-class=\"{ disabled: prev < 0}\"><a ui-sref=\"listPatients({skip: previous})\">&larr; Prev</a></li>\n" +
    "    <li ng-repeat=\"page in pages\"><a ui-sref=\"listPatients({skip: page.skip})\">{{page.page}}</a></li>\n" +
    "    <li class=\"next\"><a ui-sref=\"listPatients({skip: next})\">Next &rarr;</a></li>\n" +
    "</ul>\n" +
    "");
}]);

angular.module("templates/patients/view.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/patients/view.html",
    "<h2>{{patient.name}} <small>{{patient.mrn}}</small></h2>\n" +
    "<p><strong>History:</strong> {{patient.history}}</p>\n" +
    "<p>\n" +
    "    <strong>Conferences:</strong>\n" +
    "    <ul ng-repeat=\"conference in conferences\">\n" +
    "        <li>\n" +
    "            <a ui-sref=\"viewSelectedPatient({ conferenceId: conference._id, patientId: patient._id })\">\n" +
    "                {{conference.date | date:'shortDate'}}: {{conference.name}}\n" +
    "            </a>\n" +
    "        </li>\n" +
    "    </ul>\n" +
    "</p>\n" +
    "<p>\n" +
    "    <strong>Observations:</strong><br>\n" +
    "    <a ui-sref=\"createObservation({ patientId: patient._id })\" class=\"btn btn-default\">\n" +
    "        <span class=\"glyphicon glyphicon-plus-sign\"></span>\n" +
    "        Add observation\n" +
    "    </a>\n" +
    "    <table class=\"table table-striped\">\n" +
    "        <tr>\n" +
    "            <th>Type</th>\n" +
    "            <th>Value</th>\n" +
    "            <th>Options</th>\n" +
    "        </tr>\n" +
    "        <tr ng-repeat=\"observation in observations\">\n" +
    "            <td>{{observation.type}}</td>\n" +
    "            <td>{{observation.value}}</td>\n" +
    "            <td>\n" +
    "                <span ng-show=\"observation.file\">\n" +
    "                    <button class=\"btn btn-default btn-xs\" type=\"button\" ng-hide=\"observation.file.contents\" ng-click=\"loadObservationFile(observation)\">\n" +
    "                        <span class=\"glyphicon glyphicon-download\"></span>\n" +
    "                        Load File\n" +
    "                    </button>\n" +
    "                    <button class=\"btn btn-info btn-xs\" type=\"button\" ng-show=\"observation.file.contents\" ng-click=\"loadObservationFile(observation)\">\n" +
    "                        Loaded\n" +
    "                    </button>\n" +
    "                    <a class=\"btn btn-default btn-xs\" type=\"button\" ng-href=\"{{observation.file.url}}\">\n" +
    "                        <span class=\"glyphicon glyphicon-file\"></span>\n" +
    "                        View File\n" +
    "                    </a>\n" +
    "                </span>\n" +
    "                <span class=\"pull-right\">\n" +
    "                    <a ui-sref=\"editObservation({ patientId: patient._id, observationId: observation._id })\" class=\"btn btn-default btn-xs\">\n" +
    "                        <span class=\"glyphicon glyphicon-pencil\"></span>\n" +
    "                        Edit\n" +
    "                    </a>\n" +
    "                    <button class=\"btn btn-danger btn-xs\" type=\"button\" ng-click=\"removeObservation(observation, $index)\">\n" +
    "                        <span class=\"glyphicon glyphicon-fire\"></span>\n" +
    "                        Delete\n" +
    "                    </button>\n" +
    "                </span>\n" +
    "            </td>\n" +
    "        </tr>\n" +
    "    </table>\n" +
    "</p>\n" +
    "");
}]);
})();

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
