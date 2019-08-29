function findTheWay( grid, gridWidth, gridHeight, x, y, gX, gY ) {
  if( x === gX && y === gY ) {
    return [ { x, y } ];
  }
  if( x < 0 || x >= gridWidth ||
      y < 0 || y >= gridHeight ) {
    return null;
  }
  if( grid[ y * gridWidth + x ] > 0 ) {
    return null;
  }

  var next = [ { x, y, score: calcScore( x, y, gX, gY ), path: [] } ];
  var gridCopy = grid.slice();
  while( next.length > 0 ) {
    // Check the top item and evaluate
    var p = next.shift();
    if( p.x === gX && p.y === gY ) {
      return p.path.concat( { x: p.x, y: p.y } );
    }
    if( p.x < 0 || p.x >= gridWidth ||
        p.y < 0 || p.y >= gridHeight ) {
      // Skip!
    }
    else if( gridCopy[ p.y * gridWidth + p.x ] > 0 ) {
      // Wall!
    }
    else {
      gridCopy[ p.y * gridWidth + p.x ] = 2;
      var path = p.path.concat( { x: p.x, y: p.y } );
      next.push( { x: p.x, y: p.y - 1, score: calcScore( p.x, p.y - 1, gX, gY ), path: path } );
      next.push( { x: p.x + 1, y: p.y, score: calcScore( p.x + 1, p.y, gX, gY ), path: path } );
      next.push( { x: p.x, y: p.y + 1, score: calcScore( p.x, p.y + 1, gX, gY ), path: path } );
      next.push( { x: p.x - 1, y: p.y, score: calcScore( p.x - 1, p.y, gX, gY ), path: path } );
      // Sort next paths
      next.sort( (a, b) => calcScore( a.x, a.y, gX, gY ) - calcScore( b.x, b.y, gX, gY ) );
    }
  }
  return null;
}

function calcScore( x, y, gX, gY ) {
  return Math.abs( gX - x ) + Math.abs( gY - y );
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
const coordMap = {};
const coordRows = [ "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K" ];
const numCoordCols = 20;
coordRows.forEach( ( r, i ) => {
  for( var c = 0; c < numCoordCols; c++ ) {
    coordMap[ r + ( c + 1 ) ] = { x: c, y: i };
  }
} );
// console.log( coordMap );
function isCoord( val ) {
  return coordMap[ val.toUpperCase() ] ? true : false;
}
function coordToRoom( val ) {
  return coordMap[ val.toUpperCase() ];
}
