angular.module('MyApp',['ngMaterial', ,'checklist-model', 'ngMessages', 'material.svgAssetsCache'])
.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('indigo')
    .accentPalette('blue-grey');
})
.controller('ListCtrl', function($scope, $mdDialog) {
  $scope.toppings = [
    { name: 'Pepperoni', wanted: false },
    { name: 'Sausage', wanted: false },
    { name: 'Black Olives', wanted: false },
    { name: 'Green Peppers', wanted: false }
  ];

  $scope.windows = [];
  $scope.curScene = [];
  $scope.saveName = null;
  $scope.scenes = null;
  $scope.sceneKeys = null;

  $scope.printCurScene = function() {
      for (var i = 0; i < $scope.curScene.length; i++) {
          console.log($scope.curScene[i]);
      }
  };

  $scope.getWindows = function() {
    var queryInfo = {
      populate: true
    };
    chrome.windows.getAll(queryInfo, function(windows) {
      $scope.windows = windows;
      for (var i = 0; i < $scope.windows.length; i++) {
          console.log($scope.windows[0].tabs[0].url);
      }
    });
  };

  $scope.getScenes = function() {
    chrome.storage.sync.get(null, function(items) {
      $scope.scenes = items;
      $scope.sceneKeys = Object.keys($scope.scenes);

    });
  };

  $scope.openScene = function(key) {
    var scene = $scope.scenes[key];
    var createData = {
      url: scene
    };
    chrome.windows.create(createData);
  };

  $scope.deleteScene = function(key) {
      chrome.storage.sync.remove(key, function () {
          $scope.getScenes();
      });
  };

  $scope.saveScene = function() {
    var key = $scope.saveName;
    console.log($scope.saveName);
    var value = $scope.curScene;
    var items = {};
    items[key] = value;
    chrome.storage.sync.set(items, function() {
        $scope.getScenes();
    });
  };
});



/**
Copyright 2016 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that can be in foundin the LICENSE file at http://material.angularjs.org/license.
**/
