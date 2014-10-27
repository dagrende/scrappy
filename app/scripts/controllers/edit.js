'use strict';

angular.module('scrappyApp')
  .controller('EditCtrl', function ($scope, $routeParams, fbURL, $firebase, fsl, $location) {
    function deleteNote() {
      if ($routeParams.scrapId) {
        fsl.$getCurrentUser().then(function(user) {
          console.log('delete note');
          var scraps = $firebase(new Firebase(fbURL + '/users/' + user.uid));
          $scope.scrap = undefined;
          scraps.$remove($routeParams.scrapId).then(function() {
            console.log('before location.path()');
            $location.path('/list');
          });
        });
      }
    }
    initEditor($scope, deleteNote);
    setFullHeight();
    $(window).bind("resize", setFullHeight);
    fsl.$getCurrentUser().then(function(user) {
      $scope.scrap = $firebase(new Firebase(fbURL + '/users/' + user.uid + '/' + $routeParams.scrapId));
    });
    saver($scope);
  })
  .controller('CreateCtrl', function($scope, fsl, $firebase, fbURL) {
    initEditor($scope);
    setFullHeight();
    $(window).bind("resize", setFullHeight);
    var dateString = new Date().toISOString();
    $scope.scrap = {text: "", created: dateString, changed: dateString, notebook: ''};
    fsl.$getCurrentUser().then(function(user) {
      var scraps = $firebase(new Firebase(fbURL + '/users/' + user.uid));
      scraps.$add($scope.scrap).then(function(newRef) {
        $scope.scrap = $firebase(new Firebase(fbURL + '/users/' + user.uid + '/' + newRef.name()));
      });
      saver($scope);
    });
  });

function initEditor($scope, deleteNote) {
  $scope.tinymceoptions = {
    menubar: false, 
    statusbar: false, 
    width: "100%", 
    toolbar1: "undo redo | styleselect | bullist numlist outdent indent | deleteButton",
    setup: function(editor) {
      if (deleteNote) {
        editor.addButton('deleteButton', {
          text: 'Delete',
          icon: false,
          onclick: function() {
            if (confirm('Delete this note?')) {
              deleteNote();
            }
          }
        });
      }
      editor.on('keydown', function(event) {
        // make tab indent, shift-tab outdent
        if (event.keyCode == 9) { // tab pressed
          if (event.shiftKey) {
            editor.execCommand('Outdent');
          }
          else {
            editor.execCommand('Indent');
          }
          event.preventDefault();
          return false;
        }
      });
      editor.on('BeforeRenderUI', function(e) {
        console.log('BeforeRenderUI event', e);
        console.log(editor.menuItems.formats);
        editor.menuItems.formats.menu.items.push({
          type: 'menuitem',
          text: 'My menu item',
          onclick: function() {
              editor.insertContent('Some content');
          }
        });
      });
      console.log(editor.buttons);
    }};
}

function setFullHeight() {
  var newHeight = (window.innerHeight - 36) + 'px';
  $('#tinymce').height(newHeight);
  $('#tinymce_ifr').height(newHeight);
}

// saves $scope.scrap to firebase regularily if changed
function saver($scope) {
  console.log('creating saver');
  var pendingSaves = 0, changeNo = 0, lastSaveNo = 0;
  $scope.$watch('scrap.text', function() {
    changeNo++
    console.log('change ',changeNo);
  });
  var intervalID = window.setInterval(function () {
    if ($scope.scrap) {
      if (lastSaveNo < changeNo) {
        if (pendingSaves == 0) {
          pendingSaves++;
          changeNo--;
          $scope.scrap.updated = new Date().toISOString();
          $scope.scrap.$save().then(function () {
            pendingSaves--;
            lastSaveNo = changeNo + 1;
          });
        } else {
          if (pendingSaves > 5) {
            console.log('saving problem - pendingSaves=' + pendingSaves);
          }
        }
      }
    }
  }, 3000);
  $scope.$on("$destroy", function () {
    window.clearInterval(intervalID);
    if ($scope.scrap && $scope.scrap.$save) {
      console.log('on destroy save');
      $scope.scrap.$save();
    }
  });
}
