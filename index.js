"use strict";
var ROWS = 24;
var COLUMNS = 40;

var field = document.querySelector(".field");

var tileClass = "tile";
var playerClass = "tile tileE";
var hpClass = "tile tileHP";
var enemyClass = "tile tileP";
var weaponClass = "tile tileSW";
var wallClass = "tile tileW";

var map = new Array(ROWS);

for (var i = 0; i < ROWS; i++) {
    map[i] = new Array(COLUMNS);

    for (var j = 0; j < COLUMNS; j++) {
        map[i][j] = wallClass;
    }
}

function fieldRender() {
    field.innerHTML = "";

    for (var i = 0; i < ROWS; i++) {
        for (var j = 0; j < COLUMNS; j++) {
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

function roomInaccessible(originY, originX, width, height) {
    for (var y = originY - 1; y < originY + height + 1; y++) {
        for (var x = originX - 1; x < originX + width + 1; x++) {
            if ((y === originY - 1 || y === originY + height) && (x === originX - 1 || x === originX + width)) {
                continue;
            }

            if (y >= 0 && y < ROWS && x >= 0 && x < COLUMNS && map[y][x] !== wallClass) {
                return false;
            }
        }
    }

    return true;
}

function noWalls(originY, originX, width, height) {
    for (var y = originY; y < originY + height; y++) {
        for (var x = originX; x < originX + width; x++) {
            if (map[y][x] === wallClass) {
                return false;
            }
        }
    }

    return true;
}

function generateRooms(minRooms, maxRooms, minRoomSize, maxRoomSize) {
    var roomsNum = Math.floor(Math.random() * (maxRooms - minRooms + 1)) + minRooms;
    var roomWidth, roomHeight, originX, originY;

    for (var k = 0; k < roomsNum; k++) {
        do {
            roomWidth = Math.floor(Math.random() * (maxRoomSize - minRoomSize + 1)) + minRoomSize;
            roomHeight = Math.floor(Math.random() * (maxRoomSize - minRoomSize + 1)) + minRoomSize;
            originX = Math.floor(Math.random() * (COLUMNS - roomWidth + 1));
            originY = Math.floor(Math.random() * (ROWS - roomHeight + 1));
        } while (roomInaccessible(originY, originX, roomWidth, roomHeight) ||
            noWalls(originY, originX, roomWidth, roomHeight));

        for (var y = originY; y < originY + roomHeight; y++) {
            for (var x = originX; x < originX + roomWidth; x++) {
                map[y][x] = tileClass;
            }
        }
    }

    fieldRender();
}

function generatePassages(minPassages, maxPassages) {
    var usedCoordinates = { x: [], y: [] };

    var passagesNumY = Math.floor(Math.random() * (maxPassages - minPassages + 1) + minPassages);
    var passagesNumX = Math.floor(Math.random() * (maxPassages - minPassages + 1) + minPassages);

    var isUsed = false;
    var coordinate;

    for (var j = 0; j < passagesNumY; j++) {
        do {
            coordinate = Math.floor(Math.random() * COLUMNS);
            isUsed = usedCoordinates.x.indexOf(coordinate) !== -1;
        } while (isUsed);

        for (var y = 0; y < ROWS; y++) {
            map[y][coordinate] = tileClass;
        }

        usedCoordinates.x.push(coordinate);
    }

    for (var i = 0; i < passagesNumX; i++) {
        do {
            coordinate = Math.floor(Math.random() * ROWS);
            isUsed = usedCoordinates.y.indexOf(coordinate) !== -1;
        } while (isUsed);

        for (var x = 0; x < COLUMNS; x++) {
            map[coordinate][x] = tileClass;
        }

        usedCoordinates.y.push(coordinate);
    }

    fieldRender();
}

generatePassages(3, 5);

generateRooms(5, 10, 3, 8);
