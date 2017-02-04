var tictactoe = {}

tictactoe.rootElement = ""
tictactoe.size = 9
tictactoe.combinations = []

tictactoe.state = {
	playerSymbols: ["X", "O"],
	currentTurn: 0,
	board: Array(tictactoe.size),
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
	if (typeof(symbol) === "undefined") return ""
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
		if (tictactoe.state.board[event.id.split("-")[1]] === "") {
			tictactoe.state.boardMessage = "Player "+ nextTurn + "'s turn!"
			if ((typeof(tictactoe.state.board.find((e) => {if (e === "") return true})) === "undefined"))
				tictactoe.state.boardMessage = "There is no winner!"
			tictactoe.state.board[event.id.split("-")[1]] = tictactoe.state.currentTurn
			let wins = tictactoe.checkForWinner()
			if (Array.isArray(wins)) {
				tictactoe.state.boardMessage = "Player "+ currentSymbol+ " wins!"
				tictactoe.state.winner = wins
			}
			tictactoe.state.currentTurn = tictactoe.state.currentTurn === 0 ? 1 : 0
		}
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

tictactoe.checkForWinner = () => {
	var board = tictactoe.state.board
	return tictactoe.combinations.find((combination) => {
		if(board[combination[0]] !== "" &&
			board[combination[1]] !== ""  &&
			board[combination[2]] !== ""  &&
			board[combination[0]] === board[combination[1]] &&
			board[combination[1]] === board[combination[2]]) {
        	return combination
		}
		return false
	})
}

(() => tictactoe.constructor("root"))("init")
