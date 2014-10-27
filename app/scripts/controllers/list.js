'use strict';

/**
 * @ngdoc function
 * @name scrappyApp.controller:ListCtrl
 * @description
 * # ListCtrl
 * Controller of the scrappyApp
 */
angular.module('scrappyApp')
  .controller('ListCtrl', function ($scope, $rootScope, $timeout, $firebase, fbref, fsl, fbURL, state) {
  	$scope.state = state;
	fsl.$getCurrentUser().then(function(user) {
		console.log("User " + user + " successfully logged in!");
		$scope.auth = fsl;
		$scope.scraps = $firebase(new Firebase(fbURL + '/users/' + user.uid));
	});

	var decodeEntities = (function() {
	  // this prevents any overhead from creating the object each time
	  var element = document.createElement('div');

	  function decodeHTMLEntities (str) {
	    if(str && typeof str === 'string') {
	      // strip script/html tags
	      str = str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, '');
	      str = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi, '');
	      element.innerHTML = str;
	      str = element.textContent;
	      element.textContent = '';
	    }

	    return str;
	  }

	  return decodeHTMLEntities;
	})();

    $scope.getLabel = function (s) {
      // returns content with all html tags (including attributes) replaced by spaces
      var i = s.indexOf('\n');
      if (i == -1) {
      	i = 40;
      }
      return decodeEntities(s.substring(0, i).replace(/<[^>]+>/g, ' ').substring(0, 40));

    };
    $scope.remove = function (scrapId) {
    	if (scrapId && scrapId.length > 5) {	// prevent removing all by accident with undefined or empty id
			$scope.scraps.$remove(scrapId);
    	}
    };

    function xmlToString(xmlData) { 
	    return (window.ActiveXObject) ? xmlData.xml : (new XMLSerializer()).serializeToString(xmlData);
	}

	function compactIsoDate2Iso(compactIsoDate) {
		return compactIsoDate.replace(/(\d\d\d\d)(\d\d)(\d\d)T(\d\d)(\d\d)(\d\d)Z/, '$1-$2-$3T$4:$5:$6.000Z');
	}

    $scope.getFiles = function(files) {
		fsl.$getCurrentUser().then(function(user) {
			for (var fileI = 0; fileI < files.length; fileI++) {
				var file = files[fileI];
				var reader = new FileReader();
				reader.onload = function(e) {
					var xmlDoc = $.parseXML(e.target.result);
					var xml = $(xmlDoc);
					var notes = xml.find('en-export').find('note');
					notes.each(function(notei, noteRaw) {
						var note = $(noteRaw);
						var title = note.find('title').text();
						var content = note.find('content').text();
						var created = compactIsoDate2Iso(note.find('created').text());
						var updated = compactIsoDate2Iso(note.find('updated').text());
						var contentXml = $($.parseXML(content));
						var noteBody = '<div>' + title + '</div>' + new XMLSerializer().serializeToString(contentXml.context);
						var note = {text: noteBody, created: created, updated: updated, notebook: $scope.notebook};
						var scraps = $firebase(new Firebase(fbURL + '/users/' + user.uid));
						scraps.$add(note).then(function(newRef) {
						});
					});
	        	};
	        	reader.readAsText(file);
	        }
		});
	}
  });
