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
let aggBoard = [];
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
			aggBoard.push([])
			for(let j = 0; j < colSize; j++) {
				if(gameState.tileStates[i][j] == 0) {
					board[i].push(0);
				} else {
					board[i].push(3);
				}
				const n = i - 1 >= 0 ? gameState.tileStates[i - 1][j]: 0
				const s = i + 1 <= 6 ? gameState.tileStates[i + 1][j]: 0
				const w = j - 1 >= 0 ? gameState.tileStates[i][j - 1]: 0
				const e = j + 1 <= 6 ? gameState.tileStates[i][j + 1]: 0
				aggBoard[i].push(n + s + w + e)
			}
		}
		for(let i = 0; i < myTeam.length; i++) {
			curMoves.push(myTeam[i].coord);
			// console.log(curMoves[i])
		}
		console.log(aggBoard)
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
					
					if (canNorth && northExist) possibleMoves.push('north');
					if (canSouth && southExist)  possibleMoves.push('south');
					if (canWest && westExist) possibleMoves.push('west');
					if (canEast && eastExist)  possibleMoves.push('east');
					if (idleExist) possibleMoves.push('none');
					
					const n_weight = row - 1 >= 0 ? aggBoard[row - 1][col] : 0
					const s_weight = row + 1 <= 6 ? aggBoard[row + 1][col] : 0
					const w_weight = col - 1 >= 0 ? aggBoard[row][col - 1] : 0
					const e_weight = col + 1 <= 6 ? aggBoard[row][col + 1] : 0
					const i_weight = aggBoard[row][col]
					let move
					let weight
					if(possibleMoves.length == 0) possibleMoves.push('none');
					else {
						move = possibleMoves[0]
						weight = 0
						for( let i = 0; i < possibleMoves.length; i++) {
							switch(possibleMoves[i]) {
								case 'north': {
									move = weight < n_weight ? 'north' : move
									weight = weight < n_weight ? n_weight : weight
									break;
								}
								case 'south': {
									move = weight < s_weight ? 'south' : move
									weight = weight < s_weight ? s_weight : weight
									break;
								}
								case 'west': {
									move = weight < w_weight ? 'west' : move
									weight = weight < w_weight ? w_weight : weight
									break;
								}
								case 'east': {
									move = weight < e_weight ? 'east' : move
									weight = weight < e_weight ? e_weight : weight
									break;
								}
								default: {
									break;
								}
							}
						}
					}
					// const move = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
					// console.log(move, possibleMoves)

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

					newRow - 1 >= 0 ? aggBoard[newRow - 1][newCol]-- : 0
					newRow + 1 <= 6 ? aggBoard[newRow + 1][newCol]-- : 0
					newCol - 1 >= 0 ? aggBoard[newRow][newCol - 1]-- : 0
					newCol + 1 <= 6 ? aggBoard[newRow][newCol + 1]-- : 0
					aggBoard[newRow][newCol]--

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
