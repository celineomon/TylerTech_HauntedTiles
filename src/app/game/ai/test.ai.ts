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
					
					console.log(possibleMoves)
					let move = 'none'
					let weight = 0
					let chance
					if(possibleMoves.length == 0) possibleMoves.push('none');
					else {
						for( let i = 0; i < possibleMoves.length; i++) {
							switch(possibleMoves[i]) {
								case 'north': {
									if( weight < n_weight ) {
										move =  'north'
										weight = n_weight
									} else if ( weight == n_weight ) {
										chance = Math.random() >= 0.5 ? 1 : 0
										move =  chance ? 'north' : move
										weight = chance ?  n_weight : weight
									}
									break;
								}
								case 'south': {
									if( weight < s_weight ) {
										move = 'south'
										weight = s_weight

									} else if ( weight == s_weight ) {
										chance = Math.random() >= 0.5 ? 1 : 0
										move =  chance ? 'south' : move
										weight = chance ?  s_weight : weight
									}
									break;
								}
								case 'west': {
									if( weight < w_weight ) {
										move = 'west'
										weight = w_weight
									} else if ( weight == w_weight ) {
										chance = Math.random() >= 0.5 ? 1 : 0
										move =  chance ? 'west' : move
										weight = chance ?  w_weight : weight
									}
									break;
								}
								case 'east': {
									if( weight < e_weight ) {
										move = 'east'
										weight = e_weight
									} else if ( weight == e_weight ) {
										chance = Math.random() >= 0.5 ? 1 : 0
										move =  chance ? 'east' : move
										weight = chance ?  e_weight : weight
									}
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
