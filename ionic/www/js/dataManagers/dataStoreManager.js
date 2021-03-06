angular.module('dataStoreManager', [])
  .factory('dataStoreManager', function($http, appConstants, $q, $ionicPopup, $ionicLoading, databaseManager, $cordovaSQLite) {
    var base_url = appConstants.base_url;
    //open connection
    return {

      createGlobalUser: function(postData) {
        var deferred = $q.defer();
        var stringToken = '';
        angular.forEach(postData, function(value, key) {
          if (value.firstName) {
            stringToken += 'firstName=' + value.firstName;
          } else if (value.lastName) {
            stringToken += '&lastName=' + value.lastName;
          } else if (value.email) {
            stringToken += '&email=' + value.email;
          } else if (value.password) {
            stringToken += '&password=' + value.password;
          } else if (value.login) {
            stringToken += '&login=' + value.login;
          }
        });

        var signUp = $http({
            method: 'POST',
            url: base_url + 'user?' + stringToken,
          })
          .success(function(data) {
            return data;
          })
          .error(function(error) {
            $ionicLoading.hide();
            if (error) {
              $ionicPopup.alert({
                title: 'Error',
                template: error.message
              });
            }
          });

        deferred.resolve(signUp);
        return deferred.promise;
      },

      signInGlobalUser: function(headerData) {
        var deferred = $q.defer();
        var URL = base_url + 'user/authentication';
        var createUser = $http({
            method: 'GET',
            url: URL,
            headers: {
              'Authorization': headerData
            }
          })
          .success(function(res) {
            return res;
          })
          .error(function(error) {
            return error;
          });
        deferred.resolve(createUser);
        return deferred.promise;
      },

      userForgotPassword: function(emailId) {
        var deferred = $q.defer();
        var URL = base_url + 'user/password?email=' + emailId.trim();
        var forgotPassword = $http({
          method: 'DELETE',
          url: URL
        }).then(function successCallback(data) {
          return data;
        }, function errorCallback(error) {
          return error;
        });
        deferred.resolve(forgotPassword);
        return deferred.promise;
      },
      createUserFolderInServer: function(girderToken, parentId, folderName) {
        var deferred = $q.defer();
        var URL = base_url + 'folder?parentType=user&parentId=' + parentId + '&name=' + folderName + '&public=false';
        var createFolder = $http({
            method: 'POST',
            url: URL,
            headers: {
              'girder-token': girderToken
            }
          })
          .success(function(res) {
            return res;
          })
          .error(function(error) {
            $ionicLoading.hide();
            if (error) {
              $ionicPopup.alert({
                title: 'Error',
                template: error.message
              });
            }
          });
        deferred.resolve(createFolder);
        return deferred.promise;
      },
      // createUserFileInserver(girderToken,folderId,fileName,fileSize)
      createUserFileInServer: function(girderToken, folderId, fileName, fileSize) {
        var deferred = $q.defer();
        var URL = base_url + 'file?parentType=folder&parentId=' + folderId + '&name=' + fileName + '&size=' + fileSize + '&mimeType=application/text';
        var createFolder = $http({
            method: 'POST',
            url: URL,
            headers: {
              'girder-token': girderToken
            }
          })
          .success(function(res) {
            return res;
          })
          .error(function(error) {
            $ionicLoading.hide();
            if (error) {
              $ionicPopup.alert({
                title: 'Error',
                template: error.message
              });
            }
          });
        deferred.resolve(createFolder);
        return deferred.promise;
      },
      getRemoteFolderId: function(parentId, girderToken) {
        var deferred = $q.defer();
        var URL = base_url + 'folder/?parentType=user&text=user&parentId=' + parentId;
        var getFolderId = $http({
            method: 'GET',
            url: URL,
            headers: {
              'girder-token': girderToken
            }
          })
          .success(function(res) {
            return res;
          })
          .error(function(error) {
            return error;
          });
        deferred.resolve(getFolderId);
        return deferred.promise;
      },
      getItemListByFolderId: function(folderId, girderToken) {
        var deferred = $q.defer();
        var URL = base_url + '/item?folderId=' + folderId;
        var itemList = $http({
            method: 'GET',
            url: URL,
            headers: {
              'girder-token': girderToken
            }
          })
          .success(function(res) {
            return res;
          })
          .error(function(error) {
            return error;
          });
        deferred.resolve(itemList);
        return deferred.promise;
      },

      getListOfFilesForItem: function(girderToken, itemId) {
        var deferred = $q.defer();
        var URL = base_url + '/item/' + itemId + '/files';
        var itemList = $http({
            method: 'GET',
            url: URL,
            headers: {
              'girder-token': girderToken
            }
          })
          .success(function(res) {
            deferred.resolve(res);
          })
          .error(function(error) {
            deferred.resolve(error);
          });
        return deferred.promise;
      },

      createUpdateRequest: function(girderToken, fileId, fileSize) {
        var deferred = $q.defer();
        var URL = base_url + '/file/' + fileId + '/contents?size=' + fileSize;
        var itemList = $http({
            method: 'PUT',
            url: URL,
            headers: {
              'girder-token': girderToken
            }
          })
          .success(function(data, status, headers, config) {
            var dataArray = new Array();
            dataArray.push({
              'data': data,
              'config': config
            });
            deferred.resolve(dataArray);
          })
          .error(function(error, status, headers, config) {
            deferred.resolve(error);
          });
        return deferred.promise;
      },

      downloadFilesListForItem: function(itemId, girderToken) {
        var deferred = $q.defer();
        var URL = base_url + '/item/' + itemId + '/files';
        var getItemList = $http({
            method: 'GET',
            url: URL,
            headers: {
              'girder-token': girderToken
            }
          })
          .success(function(res) {
            return res;
          })
          .error(function(error) {
            return error;
          });
        deferred.resolve(getItemList);
        return deferred.promise;
      },

      downloadFileById: function(file_id, girderToken) {
        var deferred = $q.defer();
        var URL = base_url + '/file/' + file_id + '/download';
        var getItem = $http({
            method: 'GET',
            url: URL,
            headers: {
              'girder-token': girderToken
            }
          })
          .success(function(res) {
            return res;
          })
          .error(function(error) {
            return error;
          });
        deferred.resolve(getItem);
        return deferred.promise;
      },
      createItemForFolder: function(girderToken, folderId, itemName) {
        var deferred = $q.defer();
        var URL = base_url + 'item?folderId=' + folderId + '&name=' + itemName;
        var getItem = $http({
            method: 'POST',
            url: URL,
            headers: {
              'girder-token': girderToken
            }
          })
          .success(function(res) {
            return res;
          })
          .error(function(error) {
            if (error) {
              $ionicPopup.alert({
                title: 'Error',
                template: error.message
              });
            }
          });
        deferred.resolve(getItem);
        return deferred.promise;
      },
      createFileForItem: function(girderToken, itemCreateId, itemName, fileSize) {
        var deferred = $q.defer();
        var URL = base_url + 'file?parentType=item&parentId=' + itemCreateId + '&name=' + itemName + '&size=' + fileSize + '&mimeType=application/text';
        var getItem = $http({
            method: 'POST',
            url: URL,
            headers: {
              'girder-token': girderToken
            }
          })
          .success(function(res) {
            return res;
          })
          .error(function(error) {
            if (error) {
              $ionicPopup.alert({
                title: 'Error',
                template: error.message
              });
            }
          });
        deferred.resolve(getItem);
        return deferred.promise;
      },
      uploadChunkForFile: function(girderToken, fileId, chunk) {
        var deferred = $q.defer();
        var URL = base_url + '/file/chunk';
        var createFolder = $http({
            method: 'POST',
            url: URL,
            headers: {
              'girder-token': girderToken,
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: 'offset=0&uploadId=' + fileId + '&chunk=' + chunk
          })
          .success(function(res) {
            return res;
          })
          .error(function(error) {
            $ionicLoading.hide();
            return error;
          });
        deferred.resolve(createFolder);
        return deferred.promise;
      },
      uploadAudioFileChunk: function(girderToken, fileId, chunk) {
        var deferred = $q.defer();
        var URL = base_url + '/file/chunk';
        var createFolder = $http({
            method: 'POST',
            url: URL,
            headers: {
              'girder-token': girderToken,
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: 'offset=0&uploadId=' + fileId + '&chunk=' + chunk
          })
          .success(function(res) {
            return res;
          })
          .error(function(error) {
            $ionicLoading.hide();
            return error;
          });
        deferred.resolve(createFolder);
        return deferred.promise;
      },
      updateFileChunks: function(girderToken, updateId, chunk) {
        var deferred = $q.defer();
        var URL = base_url + '/file/chunk';
        $http({
            method: 'POST',
            url: URL,
            headers: {
              'girder-token': girderToken,
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: 'offset=0&uploadId=' + updateId + '&chunk=' + chunk
          })
          .success(function(res) {
            deferred.resolve(res);
          })
          .error(function(error) {
            deferred.resolve(error);
          });
        return deferred.promise;
      },
      userLogout: function(girderToken) {
        var deferred = $q.defer();
        var URL = base_url + '/user/authentication/';
        var createFolder = $http({
            method: 'DELETE',
            url: URL,
            headers: {
              'girder-token': girderToken
            }
          })
          .success(function(res) {
            return res;
          })
          .error(function(error) {
            $ionicLoading.hide();
            if (error) {
              $ionicPopup.alert({
                title: 'Error',
                template: error.message
              });
            }
          });
        deferred.resolve(createFolder);
        return deferred.promise;
      },
      removeSyncQueueFromLocalDb: function(syncItem, itemId) {
        var deferred = $q.defer();
        var db = databaseManager.getConnectionObject();
        var query = "DELETE FROM SyncData WHERE itemId = ? AND syncItem = ? ";
        var deleteData = $cordovaSQLite.execute(db, query, [itemId, syncItem])
          .then(function(res) {
            return res;
          }, function(err) {});
        deferred.resolve(deleteData);
        return deferred.promise;
      },

      addResultsLocally: function(data, token) {
        var deferred = $q.defer();
        var localDate = new Date();
        var db = databaseManager.getConnectionObject();
        var query = "INSERT INTO resultsToDisplay (authToken, resultData,creationDateTime) VALUES (?,?,?)";
        var insert = $cordovaSQLite.execute(db, query, [token, data, localDate])
          .then(function(res) {
            return res;
          }, function(err) {
            return err;
          });
        deferred.resolve(insert);
        return deferred.promise;
      },
      deleteResultsLocally: function(token) {
        var deferred = $q.defer();
        var db = databaseManager.getConnectionObject();
        var query = "DELETE FROM resultsToDisplay WHERE authToken = ?";
        var deleteData = $cordovaSQLite.execute(db, query, [token])
          .then(function(res) {
            return res;
          }, function(err) {
            return err;
          });
        deferred.resolve(deleteData);
        return deferred.promise;
      },
      updateUserProfileData: function(girderToken, data) {
        var deferred = $q.defer();
        var db = databaseManager.getConnectionObject();
        var query = "UPDATE User SET profileJson = '" + data + "' WHERE userId IN (SELECT userId FROM Session WHERE token='" + girderToken + "') ";
        var updateData = $cordovaSQLite.execute(db, query)
          .then(function(res) {
            return res;
          }, function(err) {
            return err;
          });
        deferred.resolve(updateData);
        return deferred.promise;
      }

    }
  })

.service('uploadDataService', function($http, $cordovaSQLite, $q, dataStoreManager) {

  this.createItemForFolder = function(girderToken, folderId, itemName) {
      var deferred = $q.defer();
      var itemCreateInfo = dataStoreManager.createItemForFolder(girderToken, folderId, itemName).then(function(itemCreateInfo) {
        return itemCreateInfo;
      });
      deferred.resolve(itemCreateInfo);
      return deferred.promise;
    },

    this.createFileForItem = function(girderToken, itemCreateId, fileName, fileSize) {
      var deferred = $q.defer();
      var fileCreateInfo = dataStoreManager.createFileForItem(girderToken, itemCreateId, fileName, fileSize).then(function(fileCreateInfo) {
        return fileCreateInfo;
      });
      deferred.resolve(fileCreateInfo);
      return deferred.promise;
    },

    this.uploadChunkForFile = function(girderToken, fileCreateId, chunk) {
      var deferred = $q.defer();
      var uploadChunkInfo = dataStoreManager.uploadChunkForFile(girderToken, fileCreateId, chunk).then(function(uploadChunkInfo) {
        return uploadChunkInfo;
      });
      deferred.resolve(uploadChunkInfo);
      return deferred.promise;
    }

});
