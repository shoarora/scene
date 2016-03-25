angular.module('scene', ['ngMaterial', , 'checklist-model', 'ngMessages', 'material.svgAssetsCache'])
    .config(function($mdThemingProvider) {
        $mdThemingProvider.theme('default')
            .primaryPalette('indigo')
            .accentPalette('yellow');
    })

.controller('scenectrl', function($scope, $mdDialog, $mdToast) {

    $scope.windows = [];
    $scope.curScene = [];
    $scope.saveName = "";
    $scope.scenes = null;
    $scope.sceneKeys = null;
    $scope.tabIndex = 0;

    $scope.showSimpleToast = function(text) {
        $mdToast.show(
            $mdToast.simple()
            .textContent(text)
            .position('top right')
            .parent("md-toolbar")
            .hideDelay(3000)
        );
    };

    $scope.selectAll = function(index) {
        i = $scope.windows[index];
        keys = Object.keys(i);
        console.log(keys);
        if (keys[keys.length - 1] == '$$hashKey') {
            keys.pop();
        }
        $scope.curScene = keys;
    };

    $scope.getWindows = function() {
        var queryInfo = {
            populate: true
        };
        chrome.windows.getAll(queryInfo, function(windows) {
            $scope.windows = [];
            //turn each window into object where key is url and value is title
            for (var i = 0; i < windows.length; i++) {
                pairs = {};
                for (var j = 0; j < windows[i].tabs.length; j++) {
                    key = windows[i].tabs[j].url;
                    value = windows[i].tabs[j].title;
                    pairs[key] = value;
                }
                $scope.windows.push(pairs);
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
        chrome.storage.sync.remove(key, function() {
            $scope.showSimpleToast("Deleted " + key);
            $scope.getScenes();
        });
    };

    $scope.saveScene = function() {
        if ($scope.saveName === "" || $scope.curScene == []) {
            return;
        }
        var key = $scope.saveName;
        var value = $scope.curScene;
        var items = {};
        items[key] = value;
        chrome.storage.sync.set(items, function() {
            $scope.showSimpleToast("Saved " + key);
            $scope.getScenes();
            $scope.saveName = "";
        });
    };
});



/**
Copyright 2016 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that can be in foundin the LICENSE file at http://material.angularjs.org/license.
**/
