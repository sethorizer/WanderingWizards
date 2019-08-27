function findTheWay( grid, gridWidth, gridHeight, x, y, gX, gY, paths = [], travelDist = 0, discoveredMinDist = 999999 ) {
  // console.log( x, y, travelDist );
  if( travelDist > discoveredMinDist ) {
    return null;
  }
  // console.log( x, y, grid );
  if( x === gX && y === gY ) {
    return paths.concat( { x, y } );
  }
  if( x < 0 || x >= gridWidth ||
      y < 0 || y >= gridHeight ) {
    return null;
  }
  if( grid[ y * gridWidth + x ] > 0 ) {
    return null;
  }
  var gridCopy = grid.slice();
  gridCopy[ y * gridWidth + x ] = 2;
  // // North, East, South, West
  // var north = findTheWay( gridCopy, gridWidth, gridHeight, x, y - 1, gX, gY, paths.concat( { x, y } ) );
  // var east = findTheWay( gridCopy, gridWidth, gridHeight, x + 1, y, gX, gY, paths.concat( { x, y } ) );
  // var south = findTheWay( gridCopy, gridWidth, gridHeight, x, y + 1, gX, gY, paths.concat( { x, y } ) );
  // var west = findTheWay( gridCopy, gridWidth, gridHeight, x - 1, y, gX, gY, paths.concat( { x, y } ) );
  //
  // // Figure out minimum valid path length
  // var minPath = north;
  // if( east ) {
  //   if( !minPath ) { minPath = east; }
  //   else if( east.length < minPath.length ) {
  //     minPath = east;
  //   }
  // }
  // if( south ) {
  //   if( !minPath ) { minPath = south; }
  //   else if( south.length < minPath.length ) {
  //     minPath = south;
  //   }
  // }
  // if( west ) {
  //   if( !minPath ) { minPath = west; }
  //   else if( west.length < minPath.length ) {
  //     minPath = west;
  //   }
  // }
  // return minPath;

  // OPTIMIZED VERSION!
  // North, East, South, West
  var north = findTheWay( gridCopy, gridWidth, gridHeight, x, y - 1, gX, gY, paths.concat( { x, y } ), travelDist + 1, discoveredMinDist );
  if( north && north.length < discoveredMinDist ) { discoveredMinDist = north.length; }
  var east = findTheWay( gridCopy, gridWidth, gridHeight, x + 1, y, gX, gY, paths.concat( { x, y } ), travelDist + 1, discoveredMinDist );
  if( east && east.length < discoveredMinDist ) { discoveredMinDist = east.length; }
  var south = findTheWay( gridCopy, gridWidth, gridHeight, x, y + 1, gX, gY, paths.concat( { x, y } ), travelDist + 1, discoveredMinDist );
  if( south && south.length < discoveredMinDist ) { discoveredMinDist = south.length; }
  var west = findTheWay( gridCopy, gridWidth, gridHeight, x - 1, y, gX, gY, paths.concat( { x, y } ), travelDist + 1, discoveredMinDist );

  // Figure out minimum valid path length
  var minPath = north;
  if( east ) {
    if( !minPath ) { minPath = east; }
    else if( east.length < minPath.length ) {
      minPath = east;
    }
  }
  if( south ) {
    if( !minPath ) { minPath = south; }
    else if( south.length < minPath.length ) {
      minPath = south;
    }
  }
  if( west ) {
    if( !minPath ) { minPath = west; }
    else if( west.length < minPath.length ) {
      minPath = west;
    }
  }
  return minPath;
}

var verticalWalls = [
  1,9,0,0,1,0,1,0,9,0,0,1,0,0,0,0,1,9,1,0,1,
  1,1,0,1,9,0,0,1,0,0,1,9,1,0,0,0,1,1,9,0,1,
  1,9,1,1,0,0,0,1,1,0,9,0,9,0,1,1,1,1,1,0,1,
  1,1,9,0,1,0,1,1,0,1,9,1,0,1,0,9,1,1,9,1,1,
  1,0,9,9,1,9,1,9,1,9,0,0,1,9,0,1,9,1,0,1,1,
  1,0,1,1,1,1,1,1,1,1,0,0,0,1,1,0,0,1,1,0,1,
  1,0,9,1,9,1,1,1,1,9,0,9,0,1,0,9,0,0,1,0,1,
  1,1,1,0,0,1,0,0,1,1,0,0,0,1,1,1,1,9,9,1,1,
  1,9,1,0,9,9,1,0,9,1,9,0,0,0,9,0,0,9,1,1,1,
  1,1,9,0,1,9,0,9,0,0,1,1,1,0,1,0,1,0,0,9,1,
  1,0,0,1,0,0,9,0,1,0,9,1,0,0,1,0,1,0,9,0,1,
];
var horizontalWalls = [
  1,0,1,9,0,1,9,9,1,1,9,9,0,1,9,1,1,0,0,1,0,1,
  1,0,9,0,9,1,1,9,0,1,1,0,1,1,1,9,0,0,1,1,9,1,
  1,0,1,9,1,1,9,0,0,9,1,9,1,1,0,0,1,9,0,0,9,1,
  1,0,1,0,1,1,0,9,1,0,0,1,9,1,1,1,0,0,1,0,0,1,
  1,9,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,1,
  1,0,1,9,0,0,9,0,0,9,0,1,0,0,9,1,1,1,9,9,1,1,
  1,0,9,0,1,0,0,1,9,1,1,1,1,9,0,0,0,1,0,1,0,1,
  1,1,0,1,1,0,0,1,1,0,9,1,1,1,9,1,0,1,1,0,9,1,
  1,0,0,0,0,0,1,0,1,1,0,9,9,1,1,1,9,1,1,9,9,1,
  1,9,1,9,0,9,1,1,9,1,1,0,0,1,9,9,1,9,1,1,9,1,
];
var verticalWallsZero = [];
for( var j = 0; j < 11; j++ ) {
  for( var i = 0; i < 21; i++ ) {
    verticalWallsZero.push( verticalWalls[ j * 21 + i ] );
    if( i < 20 ) {
      verticalWallsZero.push( 0 );
    }
  }
}
var horizontalWallsZero = [];
for( var j = 0; j < 10; j++ ) {
  for( var i = 0; i < 22; i++ ) {
    horizontalWallsZero.push( horizontalWalls[ j * 22 + i ] );
    if( i > 0 && i < 20 ) {
      horizontalWallsZero.push( 1 );
    }
  }
}
var maze = [];
// Top walls
for( var i = 0; i < 41; i++ ) {
  maze.push( 1 );
}
for( var j = 0; j < 21; j++ ) {
  for( var i = 0; i < 41; i++ ) {
    if( j % 2 === 0 ) {
      maze.push( verticalWallsZero[ Math.floor( j / 2 ) * 41 + i ] );
    }
    else {
      maze.push( horizontalWallsZero[ Math.floor( j / 2 ) * 41 + i ] );
    }
  }
}
// Bottom Walls
for( var i = 0; i < 41; i++ ) {
  maze.push( 1 );
}
function roomToGrid( val ) {
  return 1 + ( val * 2 );
}
function gridToMap( val ) {
  return ( Math.floor( val / 2 ) ) * 96 + 48;
}
function mapToGrid( val ) {
  return Math.floor( val / 96 ) * 2 + 1;
}
