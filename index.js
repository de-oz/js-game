"use strict";

var FIELD_ROWS = 24;
var FIELD_COLUMNS = 40;

var field = document.querySelector(".field");

var tileClass = "tile";
var playerClass = "tile tileE";
var hpClass = "tile tileHP";
var enemyClass = "tile tileP";
var weaponClass = "tile tileSW";
var wallClass = "tile tileW";

var map = new Array(FIELD_ROWS);

for (var i = 0; i < FIELD_ROWS; i++) {
    map[i] = new Array(FIELD_COLUMNS);

    for (var j = 0; j < FIELD_COLUMNS; j++) {
        map[i][j] = wallClass;
    }
}

for (var i = 0; i < map.length; i++) {
    for (var j = 0; j < map[i].length; j++) {
        var tile = document.createElement("div");
        tile.className = map[i][j];

        var topOffset = i * 26 + "px";
        var leftOffset = j * 26 + "px";

        tile.style.top = topOffset;
        tile.style.left = leftOffset;

        field.appendChild(tile);
    }
}
