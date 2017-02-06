var tictactoe = {}

tictactoe.rootElement = ""
tictactoe.size = 9
tictactoe.combinations = []

tictactoe.state = {
	playerSymbols: ["X", "O"],
	currentTurn: 0,
	board: Array(tictactoe.size).fill(-1),
	winner: false,
	boardMessage: "Enjoy Playing"
}

tictactoe.constructor = (element) => {
	tictactoe.rootElement = element
	tictactoe.combinations = tictactoe.getCombinations()
	tictactoe.render()
}

tictactoe.getSymbol = (index) => {
	let symbol = tictactoe.state.board[index]
	if (symbol === -1) return ""
	return tictactoe.state.playerSymbols[symbol]
}

tictactoe.render = () => {
	let flexString = "<div class='board'>"
	for (let i = 0; i < tictactoe.size; i++) {
		let winnerClass = ""
		if (Array.isArray(tictactoe.state.winner) && tictactoe.state.winner.indexOf(i) > -1) {
			winnerClass = "sq-won"
		}
		let properties = {
			onclick: "tictactoe.clickHandler(this)"
		}
		flexString += "<div class='square "+winnerClass+"' id='cell-"+i+"' onclick='"+properties.onclick+"'>"
		flexString += tictactoe.getSymbol(i)
		flexString += "</div>"
	}
	flexString += "</div><div class='message' id='winner'>"
	flexString += tictactoe.state.boardMessage+"</div>"
	document.getElementById(tictactoe.rootElement).innerHTML = flexString
}

tictactoe.clickHandler = (event) => {
	let currentSymbol = tictactoe.state.playerSymbols[tictactoe.state.currentTurn]
	let nextTurn = tictactoe.state.playerSymbols[tictactoe.state.currentTurn === 0 ? 1 : 0]
	if (!tictactoe.state.winner) {
		if (tictactoe.state.board[event.id.split("-")[1]] === -1) {
			tictactoe.state.boardMessage = "Player "+ nextTurn + "'s turn!"
			tictactoe.state.board[event.id.split("-")[1]] = tictactoe.state.currentTurn
			let wins = tictactoe.checkForWinner(tictactoe.state.board)
			if (Array.isArray(wins)) {
				tictactoe.state.boardMessage = "Player "+ currentSymbol+ " wins!"
				tictactoe.state.winner = wins
			}
			tictactoe.state.currentTurn = tictactoe.state.currentTurn === 0 ? 1 : 0
		}
		if (!tictactoe.state.board.some((e)=>e===-1))
			tictactoe.state.boardMessage = "There is no winner!"
	}
	tictactoe.render()
}

tictactoe.getCombinations = () => {
	let size = tictactoe.size
	let width = size / Math.sqrt(size)
	let numOfCombinations = 2 * size + 2
	var combos = []
	let hi = 0
	while (hi < size) {
		let hiArray = []
		let hitmp = hi
		hi += width
		for (let hiItem = hitmp; hiItem < hi; hiItem++) {
			hiArray.push(hiItem)
		}
		combos.push(hiArray)
	}
	let vi = 0
	while (vi < width) {
		let viArray = []
		let viItem = vi
		while (viItem < size) {
			viArray.push(viItem)
			viItem += width
		}
		vi++
		combos.push(viArray)
	}
	[0,width-1].forEach((num) => {
		let diArray = []
		let diItem = num
		while (diItem < (num > 0 ? size - 1: size)) {
			diArray.push(diItem)
			diItem += num > 0 ? width - 1: width + 1
		}
		combos.push(diArray)
	})
	return combos
}

tictactoe.checkForWinner = (board) => {
	return tictactoe.combinations.find((combination) => {
		if(board[combination[0]] !== -1 &&
 			board[combination[1]] !== -1  &&
 			board[combination[2]] !== -1  &&
 			board[combination[0]] === board[combination[1]] &&
 			board[combination[1]] === board[combination[2]]) {
        	return combination
		}
		return false
	})
}

tictactoe.ai = {}

tictactoe.ai.player = true
tictactoe.ai.currentTurn = 0
tictactoe.ai.choice = []

tictactoe.ai.minimax = (board, depth, player) => {
	tictactoe.state.board = board
	tictactoe.render()
	let wins = tictactoe.checkForWinner(board)
	if (Array.isArray(wins)) {
		return tictactoe.ai.getScore(board, player)-depth
	}
	var score = []
	var moves = []
	board.filter((e, index, array) => {
		if (e === -1) {
			moves.push(index)
		}
	})
	moves.forEach((e) => {
		let tmpBoard = board
		tmpBoard[e] = +player
		setTimeout(()=>{score.push(tictactoe.ai.minimax(tmpBoard, depth+1, !player))},10)
	})
	console.log("mv", moves, score)
	if (player === tictactoe.ai.player) {
		let bestIndex = score.reduce((best, e, index, arr) => e > arr[best] ? index : best, 0)
		tictactoe.ai.choice = moves[bestIndex]
		return score[bestIndex]-depth
	}
	let worstIndex = score.reduce((worst, e, index, arr) => e < arr[worst] ? index : worst, 0)
	tictactoe.ai.choice = moves[worstIndex]
	return score[worstIndex]-depth
}

tictactoe.ai.getScore = (board, player) => {
	if (Array.isArray(tictactoe.checkForWinner(board))){
		let sc = player === tictactoe.ai.player ? 10:-10;
		console.log("gs", sc, board, player)
	}
	return 0
}


(() => tictactoe.constructor("root"))("init")
