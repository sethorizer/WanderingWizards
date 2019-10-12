class GameEntity {
	constructor(x,y) {
		this.x = x;
		this.y = y;
		this.type = "base";
	}

	update() {
	}
}


class MovingEntity extends GameEntity {
	constructor(x,y) {
		super(x,y);
		this.speed = 1;
		this.name = "";
		this.points = 0;
		this.path = [];
		this.progress = 0;
		this.type = "moving";
		this.direction = "front";
		this.sprite = null;  // TODO fix
	}

	update( timestamp, timeDiffInMs ) {
		// position update
		if (this.path.length < 2) return;
		let deltaProgress = timeDiffInMs / 1000 * this.speed;
		if (this.progress + deltaProgress > 1) {  // TODO catch > 2 cases?
			let deltaMs = timeDiffInMs * (1 - this.progress) / deltaProgress;
			this.visitRoom( timestamp, deltaMs, this.path[ 0 ].x, this.path[ 0 ].y);

			this.x = this.path[ 0 ].x;
			this.y = this.path[ 0 ].y;
			this.path.shift();
			this.updateWalkingDirection();

			if (this.path.length === 0) {
				this.progress = 0;
			} else {
				this.progress += deltaProgress - 1;
			}
		}

		let cx = this.x;
		let cy = this.y;

		if (this.path.length > 0 && this.progress > 0) {
			cx += this.progress * (this.path[ 0 ].x - this.x);
			cy += this.progress * (this.path[ 0 ].y - this.y);
		}

		// TODO update sprite position / direction?
		// TODO update label position
	}

	visitRoom( timestamp, timeDiffInMs, x, y) {
	}

	updateWalkingDirection() {
		this.direction = "front";
		if (this.path.length > 0) {
			let newDeltaX = this.path[ 1 ].x - this.path[ 0 ].x;
			let newDeltaY = this.path[ 1 ].y - this.path[ 0 ].y;
			if (newDeltaX > 0) {
				this.direction = "right";
			} else if (newDeltaX < 0) {
				this.direction = "left";
			} else if (newDeltaY < 0) {
				this.direction = "back";
			}
		}
	}
}


class PlayerEntity extends MovingEntity {
}

class GhostEntity extends MovingEntity {
}

class CollectableEntity extends GameEntity {
}

class PriceEntity extends CollectableEntity {
}

class TrapEntity extends CollectableEntity {
}


class FogEntity {
}


class Game {
	constructor() {
		this.map = new GameMap();
		var map = this.map;

		this.traps = [];
		this.prizes = [];
		this.entities = [];
		this.players = {};

		this.isEnded = false;

        Unicorn.Load( "root", "assets/web.png" ); // -5 pts
        Unicorn.Load( "potion_green", "assets/potion_green.png" ); // 5 pts
        Unicorn.Load( "potion_pink", "assets/potion_pink.png" ); // 10 pts
        Unicorn.Load( "frog", "assets/frog.png" ); // 20 pts
        Unicorn.Load( "egg", "assets/egg.png" ); // 30 pts
        Unicorn.Load( "goblet", "assets/goblet.png" ); // 100 pts
        Unicorn.Load( "candycorn", "assets/candycorn.png" );
        Unicorn.Load( "chocolate", "assets/chocolate.png" );
        Unicorn.Load( "lifesaver", "assets/lifesaver.png" );
        Unicorn.Load( "green_treat", "assets/green_treat.png" );
        Unicorn.Load( "pink_treat", "assets/pink_treat.png" );
        Unicorn.Load( "golden_pumpkin", "assets/golden_pumpkin.png" );
        for( var c in characters ) {
          if( c === "ghost" ) {
            var name = characters[ c ];
            for( var i = 1; i < 19; i++ ) {
              Unicorn.Load( name + ( i - 1 ), `assets/${c}/${name}${i}.png` );
            }
          }
          else {
            animations.forEach( a => {
              var name = characters[ c ] + "_" + a;
              for( var i = 1; i < 11; i++ ) {
                Unicorn.Load( name + ( i - 1 ), `assets/${c}/${name}/${name}${i}.png` );
              }
            });
          }
        };
        Unicorn.Load( "star_blue", "assets/star_blue.png" );
        tagStar = Unicorn.AddOverlay( "tagStar", "star_blue", -1000, -1000 );
        tagStar.scale.x = 3;
        tagStar.scale.y = 3;
        tagStar.anchor.set( 0.5 );
        Unicorn.Load( "start", "assets/instructions_g.png" );
        gameStartLogo = Unicorn.AddOverlay( "gameStart", "start", 50, 0 );
        gameStartLogo.scale.x = 3;
        gameStartLogo.scale.y = 3;
        // gameStartLogo.anchor.set( 0.5 );
        Unicorn.Load( "dobby", "assets/dobby.gif" );
        //
        // // Wall Debug
        // for( var y = 0; y < 23; y++ ) {
        //   for( var x = 0; x < 41; x++ ) {
        //     if( maze[ y * 41 + x ] === 1 ) {
        //       Unicorn.AddObject( "b", {
        //         type: "circle",
        //         x: x * 48, y: y * 48,
        //         radius: 6,
        //         isStatic: true
        //       } );
        //     }
        //   }
        // }

        Unicorn.Load( "end_bg", "assets/end_bcg_dark_g.png" );
        endGameBG = Unicorn.AddOverlay( "end_bg", "end_bg", 0, 0 );
        endGameBG.scale.x = 3;
        endGameBG.scale.y = 3;
        endGameBG.alpha = 0;

        Unicorn.Load( "scoreboard", "assets/scoreboard_g.png" );
        scoreboardBG = Unicorn.AddOverlay( "scoreboard", "scoreboard", 1300, 50 );
        scoreboardBG.scale.x = 3;
        scoreboardBG.scale.y = 3;
        scoreboardBG.alpha = 0;

        Unicorn.Load( "end_sign", "assets/game_end_sign_g.png" );
        endGameSign = Unicorn.AddOverlay( "end_sign", "end_sign", 250, 50 );
        endGameSign.scale.x = 3;
        endGameSign.scale.y = 3;
        endGameSign.alpha = 0;

        Unicorn.Load( "end_note", "assets/end_note_g.png" );
        endGameNote = Unicorn.AddOverlay( "end_note", "end_note", 200, 400 );
        endGameNote.scale.x = 3;
        endGameNote.scale.y = 3;
        endGameNote.alpha = 0;

        // TODO: Make the Ghost Score RED
        gameScores = Unicorn.AddText( "scores", "Scores:", 1400, 250, {
          fontFamily: 'VT323',
          fontSize: 50,
          fontWeight: 'bold',
          fill: "#ffffff"
        } );
        gameScores.alpha = 0;

        // movePlayer( "FANCY SHEEP", "A1" );
        for( var i = 0; i < prizeCount; i++ ) {
          addPrize();
        }
        for( var i = 0; i < trapCount; i++ ) {
          addTrap();
        }
        addGhost();
	}

	update( timestamp, timeDiffInMs ) {
		for (entity of this.entities) {
			entity.update( timestamp, timeDiffInMs );
		}
	}

	endGame() {
		this.isEnded = true;

		scoreboardBG.alpha = 1;
		endGameSign.alpha = 1;
		endGameNote.alpha = 1;
		endGameBG.alpha = 1;
		gameScores.alpha = 1;
		// Hide player names
		for( var player in players ) {
			var p = players[ player ];
			p.label.alpha = 0;
			p.scoreLabel.alpha = 0;
		}
	}

	addGhost() {
        if( !players[ ghostName ] ) {
          movePlayer( ghostName, Object.keys( coordMap )[ Math.floor( Math.random() * Object.keys( coordMap ).length ) ], "#ffffff", "ghost" );
        }
	}

	moveGhost() {
        movePlayer( ghostName, Object.keys( coordMap )[ Math.floor( Math.random() * Object.keys( coordMap ).length ) ], "#ffffff", "ghost" );
	}

	startTag() {
        // Select a random player as BABA
        tagPlayer = Object.keys( players )[ Math.floor( Math.random() * Object.keys( players ).length ) ];
        // console.log( "TAG!", tagPlayer );
	}

	newPlayer( name, character ) {
		if( !characters[ character ] ) {
			character = playableCharacters[ Math.floor( playableCharacters.length * Math.random() ) ];
		}
		var sprite = characters[ character ] + "_" + "front1";
		if( Object.keys( players ).length === 1 ) {
			setTimeout( () => {
				let smooth = setInterval( () => {
					gameStartLogo.alpha -= 0.01;
					if( gameStartLogo.alpha <= 0 ) {
						clearInterval( smooth );
					}
				}, 10 );
			}, 10000 );
		}
		nextX = roomToGrid( 10 ); nextY = roomToGrid( 5 );
		var pSprite = Unicorn.AddObject( "ball" + counter++, {
			type: "circle",
			sprite: sprite,
			x: -1000, y: -1000,
			radius: 24,
			isStatic: true
			} );
		pSprite.sprite.scale.x = 3;
		pSprite.sprite.scale.y = 3;
		players[ name ] = {
			name: name,
			isGhost,
			x: nextX, y: nextY,
			progress: 1,
			path: [],
			points: 0,
			label: Unicorn.AddText( name, name, -1000, -1000, {
				fontFamily: 'VT323',
				fontSize: 36,
				fontWeight: 'bold',
				fill: color
				} ),
			scoreLabel: Unicorn.AddText( name + "_points", "0", -1000, -1000, {
				fontFamily: 'VT323',
				fontSize: 36,
				fontWeight: 'bold',
				fill: "#ffffff"
				} ),
			sprite: pSprite,
			character: character,
			frame: 0,
			frameTime: 0,
		};
	}

	movePlayer( name, coord, color = "#ffffff", character = "" ) {
        updateLeaderboard();
        var isGhost = name === ghostName;
        var x = -1, y = -1;
        if( isCoord( coord ) ) {
			var c = coordToRoom( coord );
			x = c.x;
			y = c.y;
		}
		if( x < 0 || y < 0 || x >= 20 || y >= 11) return;
		// plotMap( x, y );
		pathBalls.forEach( x => {
			Unicorn.RemoveObject( x.label );
		});
		pathBalls = [];

		if ( !this.players[ name ] ) {
			this.newPlayer( name, character );
		}

		let nextX, nextY;

		if( this.players[ name ].path.length > 0 ) {
			nextX = this.players[ name ].path[ 0 ].x;
			nextY = this.players[ name ].path[ 0 ].y;
		}
		else {
			//this.players[ name ].progress = 1;
			nextX = this.players[ name ].x;
			nextY = this.players[ name ].y;
		}

		if( characters[ character ] ) {
			this.players[ name ].character = character;
		}
		this.players[ name ].color = color;

		this.players[ name ].path = findTheWay( maze, 41, 23,
			nextX, nextY, roomToGrid( x ), roomToGrid( y )
		);

          // path.forEach( (p, i) => {
          //   if( i % 2 === 0 ) {
          //     var ball = Unicorn.AddObject( "ball" + counter++, {
          //       type: "circle",
          //       x: gridToMap( p.x ), y: gridToMap( p.y ),
          //       radius: 24,
          //       isStatic: true
          //     } );
          //     pathBalls.push( ball );
          //   }
          // });
	}
}


class GameMap {
	constructor() {
		this.fog = [];

        PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
        Unicorn.Load( "map", "assets/floor_g.png" );
        this.object = Unicorn.AddObject( "map", {
          type: "rectangle",
          x: Math.floor( 1920 / 2 ), y: Math.floor( 1080 / 2 ) - 9,
          width: 1920, height: 1080,
          sprite: "map",
          isStatic: true
        } );
        this.object.sprite.scale.x = 3;
        this.object.sprite.scale.y = 3;
        Unicorn.Load( "glow", "assets/lantern_glow.png" );
        var glows = [
          { x: 6, y: 5 },
          { x: 192, y: 5 },
          { x: 634, y: 5 },
          { x: 512, y: 31 },
          { x: 383, y: 58 },
          { x: 319, y: 63 },
          { x: 576, y: 63 },
          { x: 97, y: 93 },
          { x: 225, y: 126 },
          { x: 478, y: 128 },
          { x: 62, y: 160 },
          { x: 607, y: 158 },
          { x: 543, y: 189 },
          { x: 97, y: 223 },
          { x: 255, y: 252 },
          { x: 576, y: 63 },
          { x: 414, y: 253 },
          { x: 575, y: 286 },
          { x: 576, y: 63 },
          { x: 33, y: 318 },
          { x: 576, y: 63 },
          { x: 256, y: 320 },
          { x: 386, y: 318 },
          { x: 4, y: 345 },
          { x: 635, y: 345 },
        ];
        glows.forEach( (g,i) => {
          // console.log( g );
          var lantern = Unicorn.AddOverlay( "lantern" + i, "glow", g.x * 3, g.y * 3 );
          lantern.anchor.set( 0.5 );
          lantern.scale.x = 3;
          lantern.scale.y = 3;
          setInterval( () => {
            lantern.alpha = Math.random() < 0.1 ? 0 : 1;
            setTimeout( () => {
              lantern.alpha = 1;
            }, 200 + Math.random() * 200 );
          }, 500 + Math.random() * 500 );
        });
        Unicorn.Load( "walls", "assets/walls_g.png" );
        var walls = Unicorn.AddOverlay( "walls", "walls", 0, 0 );
        walls.scale.x = 3;
        walls.scale.y = 3;
        Unicorn.Load( "fog0", "assets/fog_green.png" );
        Unicorn.Load( "fog1", "assets/fog2_green.png" );
        for( var y = 0; y < 11; y++ ) {
          for( var x = 0; x < 20; x++ ) {
            var px = gridToMap( roomToGrid( x ) );
            var py = gridToMap( roomToGrid( y ) );
            var fogImage = "fog" + Math.floor( Math.random() * 2 );
            let f = Unicorn.AddOverlay( "fog" + x + "_" + y, fogImage, px, py );
            f.scale.x = 3;
            f.scale.y = 3;
            f.anchor.set( 0.5 );
            if( 8 < x && x < 12 && 3 < y && y < 6 ) {
              f.alpha = 0;
            }
            if( Math.random() > 0.15 ) {
              f.alpha = 0;
            }
            this.fog.push( f );
          }
        }
        setInterval( updateFog, 1000 );
        Unicorn.Load( "guide", "assets/numbers_g.png" );
        var guide = Unicorn.AddOverlay( "guide", "guide", 0, 0 );
        guide.scale.x = 3;
        guide.scale.y = 3;
	}

	updateFog() {
        let f = this.fog[ Math.floor( Math.random() * this.fog.length ) ];
        // if( 8 < x && x < 12 && 3 < y && y < 6 ) {
        //   f.alpha = 0;
        // }
        if( Math.random() > 0.15 ) {
          let smooth = setInterval( () => {
            f.alpha -= 0.01;
            if( f.alpha <= 0 ) {
              clearInterval( smooth );
            }
          }, 10 );
        }
        else {
          let smooth = setInterval( () => {
            f.alpha += 0.01;
            if( f.alpha >= 1 ) {
              clearInterval( smooth );
            }
          }, 10 );
        }
	}
	
	addTrap() {
        // TODO: Select random empty spot
        var rX = Math.floor( Math.random() * 20 );
        var rY = Math.floor( Math.random() * 11 );
        var pX = gridToMap( roomToGrid( rX ) );
        var pY = gridToMap( roomToGrid( rY ) );
        var type = trapBucket[ Math.floor( Math.random() * trapBucket.length ) ];
        var trap = Unicorn.AddObject( "trap" + counter++, {
          type: "circle",
          sprite: type,
          x: pX, y: pY,
          radius: 24,
          isStatic: true
        });
        trap.sprite.scale.x = 3;
        trap.sprite.scale.y = 3;
        traps.push( {
          x: rX,
          y: rY,
          type: type,
          sprite: trap
        });
	}

	addPrize() {
        // TODO: Select random empty spot
        var rX = Math.floor( Math.random() * 20 );
        var rY = Math.floor( Math.random() * 11 );
        var pX = gridToMap( roomToGrid( rX ) );
        var pY = gridToMap( roomToGrid( rY ) );
        var type = prizeBucket[ Math.floor( Math.random() * prizeBucket.length ) ];
        var prize = Unicorn.AddObject( "prize" + counter++, {
          type: "circle",
          sprite: type,
          x: pX, y: pY,
          radius: 24,
          isStatic: true
        });
        prize.sprite.scale.x = 3;
        prize.sprite.scale.y = 3;
        prizes.push( {
          x: rX,
          y: rY,
          type: type,
          sprite: prize
        });
	}
}


var counter = 0;
var trapBucket = [];
var prizeBucket = [];
Object.keys( trapRarityBucket ).forEach( p => {
for( var i = 0; i < trapRarityBucket[ p ]; i++ ) {
	trapBucket.push( p );
}
});
Object.keys( prizeRarityBucket ).forEach( p => {
for( var i = 0; i < prizeRarityBucket[ p ]; i++ ) {
	prizeBucket.push( p );
}
});
var fog = [];

var animations = [ "front", "back", "left", "right" ];
const ghostName = "*BOO*";
var prevGhostX = -1, prevGhostY = -1;
var prevTagX = -1, prevTagY = -1;
var tagPlayer = null;
var tagStar;
var gameStartLogo;
var scoreboardBG;
var endGameBG;
var endGameNote;
var endGameSign;
var gameScores;
// var player = {
//   name,
//   x,
//   y,
//   path,
//   points
// }
// Removing doors
maze = maze.map( x => x === 9 ? 0 : x );
var pathBalls = [];
function plotMap( x, y ) {
	Unicorn.AddObject( "b", {
		type: "circle",
		x: gridToMap( roomToGrid( x ) ), y: gridToMap( roomToGrid( y ) ),
		radius: 24,
		isStatic: true
	} );
}

function truncateString( text, length ) {
	if( text.length > length ) {
		return text.substring( 0, length ) + "…";
	}
	return text;
}

function updateLeaderboard() {
	var scores = Object.keys( players ).map( p => ({ score: players[ p ].points, name: truncateString( players[ p ].name, 11 ) }) );
	scores.sort( (a,b) => b.score - a.score );
	gameScores.text = scores.map( s => s.name + ": " + s.score ).slice( 0, 14 ).join( "\n" );
}

function Init() {
	game = new Game();
}

function Update() {
	game.update();
}

function OnChatCommand( user, command, message, flags, extra ) {
	// Handle Chat Commands
	if( !game.isEnded && command === "play" ) {
		var spawnLocations = [ "E10", "E11", "E12", "F10", "F11", "F12" ];
		game.movePlayer( user, spawnLocations[ Math.floor( Math.random() * spawnLocations.length ) ], extra.userColor || "#ffffff", message.toLowerCase() );
	}
	if( flags.broadcaster || flags.mod || flags.vip ) {
		if( command === "starttag" || command === "tag" ) {
			game.startTag();
		}
		if( !game.isEnded && command === "prize" ) {
			game.addPrize();
		}
		if( command === "end" ) {
			game.endGame();
		}
		if( command === "reset" ||
			command === "restart" ) {
			location.reload();
		}
	}
}

function OnChatMessage( user, message, flags, self, extra ) {
	// Handle Chat Messages
	// console.log( message );
	// console.log( extra.userColor );
	if( !game.isEnded && isCoord( message ) ) {
		game.movePlayer( user, message, extra.userColor || "#ffffff" );
	}
}

function CreateGame() {
	Unicorn.Create( "unicorn-display", {
		width: 1920,
		height: 1080,
		// background: "#777777",// "transparent",
		background: "transparent",
		init: Init,
		update: Update,
		channel: params.get( "channel" ),
		onCommand: OnChatCommand,
		onChat: OnChatMessage,
		gravity: { x: 0, y: 0 }
	});
	ComfyJS.onConnected = ( address, port, isFirstConnect ) => {
		if( isFirstConnect ) {
			fetch( "https://api.instafluff.tv:8082/notify?game=Trick Or Treat&channel=" + params.get( "channel" ) )
			.then( r => r.json() )
			.then( r => {
				if( r.status === 0 ) {
				console.log( "Error:", r.message );
				}
			});
		}
	};
}
