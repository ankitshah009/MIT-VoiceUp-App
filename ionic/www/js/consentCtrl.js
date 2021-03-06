angular.module('consent', [])
  //=======Home screen controller======================
  .controller('consentCtrl', function($scope, $stateParams, $ionicHistory, $cordovaSQLite, $controller,
    $ionicModal, $http, $ionicLoading, userService, $rootScope, databaseManager, consentDataManager, irkResults, irkConsentDocument, $state, $location, $window) {

    consentDataManager.getAllConsentScreens().then(function(response) {
      $scope.enable_review = response.enable_review_questions;
      $scope.consent_array = response.sections;
      var taskListData = userService.parseConsent($scope.consent_array, $scope.enable_review);
      if (taskListData) {
        var taskList = '<ion-modal-view class="irk-modal">' +
          '<irk-ordered-tasks>' +
          taskListData +
          '</irk-ordered-tasks>' +
          '</ion-modal-view>';
        $scope.modal = $ionicModal.fromTemplate(taskList, {
          scope: $scope,
          animation: 'slide-in-left',
          hardwareBackButtonClose: false,
        });
        $scope.modal.show();
      } else {
        $ionicHistory.clearCache().then(function() {
          $state.transitionTo('home');
        });
      }
    });

    $scope.closeModal = function() {
      if (irkResults.getResults().canceled) {
        $scope.modal.remove();
        $ionicHistory.clearCache().then(function() {
          $state.transitionTo('home');
        });
      } else if (irkResults.getResults()) {
        $scope.modal.remove();
        var childresult = irkResults.getResults().childResults;
        var processFlag = false;
        for (var j = 0; j < childresult.length; j++) {
          if (childresult[j].type) {
            if (childresult[j].type.toLowerCase() == "IRK-CONSENT-REVIEW-STEP".toLowerCase()) {
              if (childresult[j].answer) {
                processFlag = true;
              }
            }
          }
        }

        if (processFlag) {
          var enable_review = $scope.enable_review;
          $rootScope.consentFullJson = irkResults.getResults().childResults;
          $rootScope.consentResult = irkConsentDocument.getDocument();
          if (enable_review.toLowerCase() == "true") {
            var consentArray = $scope.consent_array;
            var validateFalg = true;
            angular.forEach(consentArray, function(value, key) {
                var type = value.type;
                angular.forEach(value, function(value, key) {
                  var main_typeNext = value.main_type;
                  if (main_typeNext.toLowerCase() == "review-questions") {
                    var qtype = value.type
                    if (qtype.toLowerCase() == "boolean") {
                      var id = value.id;
                      var splitId = id.replace(/\./g, '_');
                      var expected_answer = value["expected_answer"];
                      for (var i = 0; i < childresult.length; i++) {
                        var localId = childresult[i].id;
                        if (localId == splitId) {
                          var customAnswer;
                          if (expected_answer.toLowerCase() == 'yes') {
                            customAnswer = "true";
                          } else {
                            customAnswer = "false";
                          }
                          if (childresult[i].answer != customAnswer) {
                            validateFalg = false;
                          }
                        }
                      }
                    }
                  }
                });
              })
              // check the user flag accoding to end user answer
            if (validateFalg) {
              $ionicHistory.clearCache().then(function() {
                console.log("eligible go to sign up ");
                $state.transitionTo('loadSignUp');
              });
            } else {
              console.log("go to ineligible screen ");
              $ionicHistory.clearCache().then(function() {
                $state.transitionTo('not-eligibleUser');
              });
            }
          } else {
            $ionicHistory.clearCache().then(function() {
              $state.transitionTo('loadSignUp');
            });
          }
        } else {
          $ionicHistory.clearCache().then(function() {
            $state.transitionTo('home');
          });
        }
      }
    }

  });
