/*
NOTE: This is for development purposes only, final submission should be done through the submission tab

Fill in the contents of main with your strategy
The contents of gameState and side can be found by viewing interfaces.ts IGameState and Side interfaces (also included in this comment)
gameState represents the current state of the game (all tiles, all teams)
side will tell you which team is yours
main should return an array of MoveDirection's (also found in interfaces.ts) with size = # of monsters on one team to start

Take a look at other example scripts to get some ideas on how to leverage this data
*/

// do not include "export const developmentScript = " with your submission
export const developmentScript = `
let board = [];
let turn = -1;
let prevOtherMoves = [];
let otherMoves = [];
let curMoves = [];
function main(gameState, side) {
	turn++;
	// console.log("Size", board.length)
	const [rowSize, colSize] = gameState.boardSize;
	const myTeam = gameState.teamStates[side];
	const otherSide = side === 'home' ? 'away' : 'home';
	const otherTeam = gameState.teamStates[otherSide];
	const possibleMoves = [];

	if (turn === 0) {
		for(let i = 0; i < rowSize; i++) {
			board.push([]);
			for(let j = 0; j < colSize; j++) {
				if(gameState.tileStates[i][j] == 0) {
					board[i].push(0);
				} else {
					board[i].push(3);
				}
			}
		}
		for(let i = 0; i < myTeam.length; i++) {
			curMoves.push(myTeam[i].coord);
			// console.log(curMoves[i])
		}
		// console.log(board)
	}

	console.log('turn', turn);
	// console.log(gameState.tileStates)
	return new Promise((resolve, reject) => {
		prevOtherMoves = otherMoves;
		otherMoves = otherTeam.map(member => {
			return member.coord;
		});
		
		if (turn === 0) {
			prevOtherMoves = otherMoves;
		}
		// console.log('prev', prevOtherMoves)
		// console.log('other', otherMoves)

		otherMoves.forEach((m, i) => {
			const [curRow, curCol] = m;
			const [prevRow, prevCol] =  prevOtherMoves[i];
			// board[prevRow][prevCol]--;
			if(curRow !== prevRow || curCol !== prevCol) {
				// console.log('other moved', curRow, curCol);
				board[curRow][curCol]--;
			}
		});

		const callback = () => resolve(
			myTeam.reduce((moveSet, member, i) => {
				if (member.isDead) {
					moveSet.push('none');
				} else {
					const [row, col] = curMoves[i];
					console.log('premove', row, col);

					const canNorth = row > 0;
					const canSouth = row < rowSize - 1;
					const canWest = col > 0;
					const canEast = col < colSize - 1;
					const northExist = board[row - 1 > 0 ? row - 1 : 0][col] > 1;
					const southExist = board[row + 1 < 6 ? row + 1 : 6][col] > 1;
					const westExist  = board[row][col - 1 > 0 ? col - 1 : 0] > 1;
					const eastExist  = board[row][col + 1 < 6 ? col + 1 : 6] > 1;
					const idleExist  = board[row][col] > 2;
					// console.log('N', canNorth, 'S', canSouth, 'W', canWest, 'E', canEast);
					// console.log('N', northExist, 'S', southExist, 'W', westExist, 'E', eastExist);
					// console.log(
					//   'N', board[row - 1 >= 0 ? row - 1 : 0][col],
					//   'S', board[row + 1 <= 6 ? row + 1 : 6][col],
					//   'W', board[row][col - 1 >= 0 ? col - 1 : 0],
					//   'E', board[row][col + 1 <= 6 ? col + 1 : 6],
					// );

					if (canNorth && northExist) possibleMoves.push('north');
					if (canSouth && southExist)  possibleMoves.push('south');
					if (canWest && westExist) possibleMoves.push('west');
					if (canEast && eastExist)  possibleMoves.push('east');
					if (idleExist) possibleMoves.push('none');
					
					if(possibleMoves.length == 0) possibleMoves.push('none');
					const move = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
					console.log(move, possibleMoves)

					let newRow = row, newCol = col;
					switch(move) {
						case 'north': {
							newRow = row - 1 > 0 ? row - 1 : 0;
							break;
						}
						case 'south': {
							newRow = row + 1 < 6 ? row + 1 : 6;
							break;
						}
						case 'west': {
							newCol = col - 1 > 0 ? col - 1 : 0;
							break;
						}
						case 'east': {
							newCol = col + 1 < 6 ? col + 1 : 6;
							break;
						}
						default: {
							break;
						}
					}
					console.log('moved', move, row + '->' + newRow, col + '->' + newCol, board[newRow][newCol]);
					board[newRow][newCol]--;
					curMoves[i] = [newRow, newCol];
					moveSet.push(move);
					possibleMoves.length = 0;
				}
				return moveSet;
			}, [])
		);
		return callback();
		})
}
`;
