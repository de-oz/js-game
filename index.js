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

function fieldRender() {
    field.innerHTML = "";

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
}

fieldRender();

var roomsNum = Math.floor(Math.random() * 6) + 5;

for (var r = 0; r < roomsNum; r++) {
    var roomWidth = Math.floor(Math.random() * 6) + 3;
    var roomHeight = Math.floor(Math.random() * 6) + 3;
    var originX = Math.floor(Math.random() * (map[0].length - roomWidth + 1));
    var originY = Math.floor(Math.random() * (map.length - roomHeight + 1));

    for (var y = originY; y < originY + roomHeight; y++) {
        for (var x = originX; x < originX + roomWidth; x++) {
            map[y][x] = tileClass;
        }
    }
}

fieldRender();
