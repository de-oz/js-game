"use strict";
var ROWS = 24;
var COLUMNS = 40;

var field = document.querySelector(".field");

var ground = "tile";
var player = "tile tileP";
var healthPotion = "tile tileHP";
var enemy = "tile tileE";
var weapon = "tile tileSW";
var wall = "tile tileW";

var map = new Array(ROWS);

for (var i = 0; i < ROWS; i++) {
    map[i] = new Array(COLUMNS);

    for (var j = 0; j < COLUMNS; j++) {
        map[i][j] = { type: wall, health: null };
    }
}

function fieldRender() {
    field.innerHTML = "";

    for (var i = 0; i < ROWS; i++) {
        for (var j = 0; j < COLUMNS; j++) {
            var tile = document.createElement("div");

            if (map[i][j].health) {
                var healthBar = document.createElement("div");
                healthBar.className = "health";
                healthBar.style.width = map[i][j].health + "%";

                tile.appendChild(healthBar);
            }

            tile.className = map[i][j].type;

            var topOffset = i * 26 + "px";
            var leftOffset = j * 26 + "px";

            tile.style.top = topOffset;
            tile.style.left = leftOffset;

            field.appendChild(tile);
        }
    }
}

function validTile(yCoordinate, xCoordinate) {
    if (yCoordinate >= 0 && yCoordinate < ROWS && xCoordinate >= 0 && xCoordinate < COLUMNS) {
        return true;
    }

    return false;
}

function roomInaccessible(originY, originX, width, height) {
    for (var y = originY - 1; y < originY + height + 1; y++) {
        for (var x = originX - 1; x < originX + width + 1; x++) {
            if ((y === originY - 1 || y === originY + height) && (x === originX - 1 || x === originX + width)) {
                continue;
            }

            if (validTile(y, x) && map[y][x].type !== wall) {
                return false;
            }
        }
    }

    return true;
}

function noWalls(originY, originX, width, height) {
    for (var y = originY; y < originY + height; y++) {
        for (var x = originX; x < originX + width; x++) {
            if (map[y][x].type === wall) {
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
                map[y][x].type = ground;
            }
        }
    }
}

function generatePassages(minPassages, maxPassages) {
    var usedCoordinates = { y: [], x: [] };

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
            map[y][coordinate].type = ground;
        }

        usedCoordinates.x.push(coordinate);
    }

    for (var i = 0; i < passagesNumX; i++) {
        do {
            coordinate = Math.floor(Math.random() * ROWS);
            isUsed = usedCoordinates.y.indexOf(coordinate) !== -1;
        } while (isUsed);

        for (var x = 0; x < COLUMNS; x++) {
            map[coordinate][x].type = ground;
        }

        usedCoordinates.y.push(coordinate);
    }
}

function generateObjects(objectType, numberOfObjects) {
    var y, x;

    for (var k = 0; k < numberOfObjects; k++) {
        do {
            y = Math.floor(Math.random() * ROWS);
            x = Math.floor(Math.random() * COLUMNS);
        } while (map[y][x].type !== ground);

        map[y][x].type = objectType;

        if (objectType === player) {
            map[y][x].health = 100;
            playerData.y = y;
            playerData.x = x;
        }
        else if (objectType === enemy) {
            map[y][x].health = 100;
            enemyPositions.push({ y: y, x: x });
        }
    }
}

generatePassages(3, 5);
generateRooms(5, 10, 3, 8);

var playerData = { y: null, x: null, damage: 35 };
var enemyPositions = [];

generateObjects(weapon, 2);
generateObjects(healthPotion, 10);
generateObjects(player, 1);
generateObjects(enemy, 10);

fieldRender();

function playerMove(key) {
    var newY = playerData.y;
    var newX = playerData.x;

    if (key === "KeyW") {
        newY--;
    }
    else if (key === "KeyS") {
        newY++;
    }
    else if (key === "KeyA") {
        newX--;
    }
    else if (key === "KeyD") {
        newX++;
    }

    if (validTile(newY, newX) && map[newY][newX].type !== wall && map[newY][newX].type !== enemy) {
        map[newY][newX].type = map[playerData.y][playerData.x].type;
        map[newY][newX].health = map[playerData.y][playerData.x].health;
        map[playerData.y][playerData.x].type = ground;
        map[playerData.y][playerData.x].health = null;

        playerData.y = newY;
        playerData.x = newX;
    }
}

function enemyAttack(playerDidStrike) {
    var y = playerData.y;
    var x = playerData.x;
    var damage = playerData.damage;

    var neighbors = [
        [y + 1, x],
        [y + 1, x - 1],
        [y + 1, x + 1],
        [y - 1, x],
        [y - 1, x - 1],
        [y - 1, x + 1],
        [y, x + 1],
        [y, x - 1],
    ];

    function updateHealth(yCoordinate, xCoordinate, damage) {
        map[yCoordinate][xCoordinate].health -= damage;

        if (map[yCoordinate][xCoordinate].health <= 0) {
            map[yCoordinate][xCoordinate].type = ground;
            map[yCoordinate][xCoordinate].health = null;
        }
    }

    for (var i = 0; i < neighbors.length; i++) {
        var dy = neighbors[i][0];
        var dx = neighbors[i][1];

        if (!validTile(dy, dx))
            continue;

        if (playerDidStrike && map[dy][dx].type === enemy) {
            updateHealth(dy, dx, damage);
        }

        if (map[dy][dx].type === enemy) {
            updateHealth(y, x, 15);
        }
    }
}

document.addEventListener("keydown", function (e) {
    if (e.code === "KeyW" || e.code === "KeyS" || e.code === "KeyA" || e.code === "KeyD" || e.code === "Space") {
        if (e.code !== "Space") {
            playerMove(e.code);
        }
        enemyAttack(e.code === "Space");
        fieldRender();
    }
});
