"use strict";

var mouseList2 = new Array();
var popArray2 = new Array();

String.prototype.capitalise = function() {
    return this.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
};

function CSVToArray(strData, strDelimiter) {
	
    // Check to see if the delimiter is defined. If not,
    // then default to comma.
    strDelimiter = ",";

    // Create a regular expression to parse the CSV values.
    var objPattern = new RegExp(
    (
    // Delimiters.
    "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

    // Quoted fields.
    "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

    // Standard fields.
    "([^\"\\" + strDelimiter + "\\r\\n]*))"),
        "gi");


    // Create an array to hold our data. Give the array
    // a default empty first row.
    var arrData = [
        []
    ];

    // Create an array to hold our individual pattern
    // matching groups.
    var arrMatches = null;


    // Keep looping over the regular expression matches
    // until we can no longer find a match.
    while (arrMatches = objPattern.exec(strData)) {

        // Get the delimiter that was found.
        var strMatchedDelimiter = arrMatches[1];

        // Check to see if the given delimiter has a length
        // (is not the start of string) and if it matches
        // field delimiter. If id does not, then we know
        // that this delimiter is a row delimiter.
        if (
            strMatchedDelimiter.length &&
            (strMatchedDelimiter != strDelimiter)) {

            // Since we have reached a new row of data,
            // add an empty row to our data array.
            arrData.push([]);

        }


        // Now that we have our delimiter out of the way,
        // let's check to see which kind of value we
        // captured (quoted or unquoted).
        if (arrMatches[2]) {

            // We found a quoted value. When we capture
            // this value, unescape any double quotes.
            var strMatchedValue = arrMatches[2].replace(
                new RegExp("\"\"", "g"),
                "\"");

        } else {

            // We found a non-quoted value.
            var strMatchedValue = arrMatches[3];

        }


        // Now that we have our value string, let's add
        // it to the data array.
        arrData[arrData.length - 1].push(strMatchedValue);
    }

    // Return the parsed data.
    return (arrData);
	
}

Object.size = function(obj) {
    var size = 0;
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

var pop = new XMLHttpRequest();
pop.open("get", "https://dl.dropboxusercontent.com/u/14589881/populations2.csv", true);
pop.onreadystatechange = function() {
	if (pop.readyState == 4) {
		processPop();
	}
}
pop.send();

var popCSV = new Array();
var popArray = new Array();
function processPop() {
	
	var popText = pop.responseText;

	popCSV = CSVToArray(popText);
	var popCSVLength = Object.size(popCSV);
		
	for(var i=1; i<popCSVLength; i++) {
		
		var row = popCSV[i];
		var location = row[0];
		var phase = row[1];
		var cheese = row[2];
		var charm = row[3];
		var mouseName = row[4].capitalise();
		var population = row[5];

		if (popArray2[mouseName] == undefined) {
			
			popArray2[mouseName] = new Array();
			popArray2[mouseName][0] = location;
			popArray2[mouseName][1] = phase;
			popArray2[mouseName][2] = cheese;
			popArray2[mouseName][3] = charm;
			popArray2[mouseName][4] = population;
			
		} else {
			
			if (popArray2[mouseName][4] < population) {
				
				popArray2[mouseName][0] = location;
				popArray2[mouseName][1] = phase;
				popArray2[mouseName][2] = cheese;
				popArray2[mouseName][3] = charm;
				popArray2[mouseName][4] = population;
				
			}
			
		}
		
	}

	loadMouseDropdown();
	
}

function loadMouseDropdown() {
	
	var popArrayLength = Object.size(popArray);
	var suggests = [];

	for (var i=0; i<popArrayLength; i++) {
		suggests.push(Object.keys(popArray)[i]);
		suggests.push(Object.keys(popArray)[i].toLowerCase());
	}
	
	$("#map").asuggest(suggests);

}

window.onload = function () {
	document.getElementById("map").onkeyup = function () {
    	var mapText = document.getElementById("map").value;
	    processMap(mapText);
	};
}

function processMap(mapText) {
	
	var mouseArray = mapText.split("\n");
	var mouseArrayLength = Object.size(mouseArray);
	
	var interpretedAs = document.getElementById("interpretedAs");
	var mouseList = document.getElementById("mouseList");

	var interpretedAsText = "Unkown Mouse:</b><br>";
	var mouseListText = '';
	
	var bestLocationArray = new Array();
	
	mouseList.innerHTML = '';
	mouseList2 = new Array();
	
	for (var i=0; i<mouseArrayLength; i++) {
		
		var mouseName = mouseArray[i].capitalise().trim();
		
		if (mouseName.length==0)
			continue;
		
		var indexOfMouse = mouseName.indexOf(" Mouse");
		
		if (indexOfMouse >= 0) {
			mouseName = mouseName.slice(0,indexOfMouse);
		}
		
		if (popArray2[mouseName] == undefined) { // Mouse name not recognised
		
			interpretedAsText += "<div class='invalid'>" + mouseName+"</div>";
			
		} else {
		
			var mouse = popArray2[mouseName];
			var location = mouse[0];
			var phase = mouse[1];
			var cheese = mouse[2];
			var charm = mouse[3];
			
			if (!mouseList2[location]) {
				mouseList2[location] = new Array();
			}
			
			var a = mouseList2[location];
			
			if (!a[phase]) {
				a[phase] = new Array();
			}
			
			var b = a[phase];
			
			if (!b[cheese]) {
				b[cheese] = new Array();
			}
			
			var c = b[cheese];
			
			if (!c[charm]) {
				c[charm] = new Array();
			}
			
			var d = c[charm];
			
			if (!d[mouseName]) {
				d[mouseName] = 1;
			}
			
		}
		
	}
	
	for (var key in mouseList2) {
		
		if (mouseList2.hasOwnProperty(key)) {
			
			mouseListText += '<tr>';
			mouseListText += '<td style="text-align : left">';
			mouseListText += 'Location : ' + key;
			mouseListText += '<td>';
			
			var a = mouseList2[key];
			for (var key2 in a) {
				if (a.hasOwnProperty(key2)) {
					
					mouseListText += '<table border=1 style="border-collapse: collapse;">';
					mouseListText += '<tr><td>Phase : ' + key2 + '</td>';
					
					var b = a[key2];
					for (var key3 in b) {
						if (b.hasOwnProperty(key3)) {
							
							var c = b[key3];
							for (var key4 in c) {
								if (c.hasOwnProperty(key4)) {
									
									var d = c[key4];
									for (var key5 in d) {
										if (d.hasOwnProperty(key5)) {
											
											mouseListText += '<td style="text-align : left">';
											mouseListText += '<div> Mouse : ' + key5 + '</div>';
											mouseListText += '<div> Cheese : ' + key3 + '</div>';
											mouseListText += '<div> Charm : ' + key4 + '</div>';
											mouseListText += '</td>';
											
										}
									}
									
								}
							}
						}
					
					}
					
					mouseListText += '</tr>';
					
				}
				
				mouseListText += '</table>';
				
			}
			
			mouseListText += '</td>';
			mouseListText += '</tr>';
			
		}
	}
	
	console.debug(mouseListText);
	
	interpretedAs.innerHTML = interpretedAsText;
	mouseList.innerHTML = mouseListText;
	
}
