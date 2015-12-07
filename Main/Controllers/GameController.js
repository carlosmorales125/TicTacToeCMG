ticTacToe.controller('GameController', ['$scope', '$routeParams', '$location', '$timeout', GameControllerFunction]);

	function GameControllerFunction($scope, $routeParams, $location, $timeout){
	//Handles Title and Misuse of Route Params.
		switch($routeParams.who){
			case "human":
				$scope.title = "Human Vs. Human";
				$scope.directions = "When playing agaisnt another person you can use oldest person goes first, a coin toss, or just about anthing to determine who goes first. Either way, X goes first.";
				break

			case "computer":
				$scope.title = "Human Vs. Computer";
				$scope.directions = "When playing agaisnt the computer, the human goes first. It's the only way to (midly) entertain the computer. X goes first.'"
				break
			default:
				alert('That is not a valid URL.');
				$location.path('/');
				break
	}
	
	//Tic Tac Toe Cell Class
	function cell(selected, id, player) {

	  this.selected = selected;
	  this.player = player;
	  this.id = id;
	  this.cellIcon = '';

	  this.setSelected = function setSelected() {
	    this.selected = true;
	  }

	  this.deselected = function deselected() {
	    this.selected = false;
	  }

	  this.checkSelected = function checkSelected() {
	    return this.selected;
	  }

	  this.setPlayer = function setPlayer(currentPlayer) {
	    this.player = currentPlayer;
	  }

	  this.getPlayer = function getPlayer() {
	    return this.player;
	  }

	}

	//Called by checkWinner to make sure player matches in winning combonations.
	function playerMatches(functionCell1, functionCell2, functionCell3){
		//Checks if Players Match
		var player1 = functionCell1.getPlayer(),
			player2 = functionCell2.getPlayer(),
			player3 = functionCell3.getPlayer();

		if (player1 == player2 && player2 == player3 && player1 != null && player2 != null && player3 != null){
			return true;
		} else {
			return false;
		}
	}
	
	////Called by checkWinner to make sure cells are selected in winning combonations.
	function cellsSelected(functionCell1, functionCell2, functionCell3){
		//Checks if Cells are selected
		var selectedCell1 = functionCell1.checkSelected(),
		    selectedCell2 = functionCell2.checkSelected(),
		    selectedCell3 = functionCell3.checkSelected();

		if(selectedCell1 && selectedCell2 && selectedCell3){
			return true;
		} else {
			return false;
		}
	}

	//Called by CheckWinner and checks for draw.
	function checkDraw(board){
		if(board[0].checkSelected() && board[1].checkSelected() && board[2].checkSelected() && board[3].checkSelected() && board[4].checkSelected() && board[5].checkSelected() && board[6].checkSelected() && board[7].checkSelected() && board[8].checkSelected()){
			return true;
		} else {
			return false;
		}
	}

	//Checks for winner.
	function checkWinner(board){
		/* 
			Winning Combinations: 
				"Horizontal"
				- cell1, cell2, cell3
				- cell4, cell5, cell6
				- cell7, cell8, cell9
				
				"Vertical"
				- cell1, cell4, cell7
				- cell2, cell5, cell8
				- cell3, cell6, cell9

				"Diagonal"
				- cell1, cell5, cell9
				- cell3, cell5, cell7
		*/ 
	
		if(cellsSelected(board[0], board[1], board[2]) && playerMatches(board[0], board[1], board[2])){
			//Winner Logic
			//resetGame();
			$scope.setWinner = board[0].getPlayer();
			return true;
		} else {
			return false;
		}

		if(cellsSelected(board[3], board[4], board[5]) && playerMatches(board[3], board[4], board[5])){
			//Winner Logic
			//resetGame();
			$scope.setWinner = board[3].getPlayer();
			return true;
		} else {
			return false;
		}

		if(cellsSelected(board[6], board[7], board[8]) && playerMatches(board[6], board[7], board[8])){
			//Winner Logic
			//resetGame();
			$scope.setWinner = board[6].getPlayer();
			return true;
		} else {
			return false;
		}

		if(cellsSelected(board[0], board[3], board[6]) && playerMatches(board[0], board[3], board[6])){
			//Winner Logic
			//resetGame();
			$scope.setWinner = board[0].getPlayer();
			return true;
		} else {
			return false;
		}

		if(cellsSelected(board[1], board[4], board[7]) && playerMatches(board[1], board[4], board[7])){
			//Winner Logic
			//resetGame();
			$scope.setWinner = board[1].getPlayer();
			return true;
		} else {
			return false;
		}

		if(cellsSelected(board[2], board[5], board[8]) && playerMatches(board[2], board[5], board[8])){
			//Winner Logic
			//resetGame();
			$scope.setWinner = board[2].getPlayer();
			return true;
		} else {
			return false;
		}

		if(cellsSelected(board[0], board[4], board[8]) && playerMatches(board[0], board[4], board[8])){
			//Winner Logic
			//resetGame();
			$scope.setWinner = board[0].getPlayer();
			return true;
		} else {
			return false;
		}

		if(cellsSelected(board[2], board[4], board[6]) && playerMatches(board[2], board[4], board[6])){
			//Winner Logic
			//resetGame();
			$scope.setWinner = board[2].getPlayer();
			return true;
		} else {
			return false;
		}
	}
	
	function makeMove(move, player, board){
		var newBoard = cloneBoard(board);
		if(newBoard[move].checkSelected() == false){
			newBoard[move].setSelected();
			newBoard[move].setPlayer(player);
			return newBoard;
		} else {
			return false;
		}
	}

	//Clones board using angular merge and leaves current board in tack.
	function cloneBoard(board){
		var cloneBoard = angular.merge([], board);
		return cloneBoard;
	}

	function findMove(board){
		var bestMoveValue = -100;
		var move = 0;
		for (var i = 0; i < board.length; i++) {
			var newBoard = makeMove(i, 'O', board);
			if (newBoard) {
				var predictedMoveValue = minValueForX(newBoard);
				if(predictedMoveValue > bestMoveValue){
					bestMoveValue = predictedMoveValue;
					console.log('bestMoveValueForFindMove: ' + bestMoveValue);
					move = i;
				}
			}
		}
		return move;
	}

	function minValueForX(board){
		
		if (checkWinner(board)){
			
			if ($scope.setWinner == "O"){
				return 1;
			} else {
				return -1
			}
		
		} else if (checkDraw(board)) {
		
			return 0;
		
		} else {
			
			var bestMoveValue = 100;
			var move = 0;
			for (var i = 0; i < board.length; i++) {
				var newBoard = makeMove(i, 'X', board);
				if (newBoard) {
					var predictedMoveValue = maxValueForO(newBoard);
					console.log('inMinValueForX');
					console.log(newBoard);
					if (predictedMoveValue < bestMoveValue) {
						bestMoveValue = predictedMoveValue;
						console.log('bestMoveValueForX: ' + bestMoveValue);
						move = i;
					}
				}
			}

			return bestMoveValue;
		}
	}

	function maxValueForO(board){

		if (checkWinner(board)){
			
			if ($scope.setWinner == "O"){
				return 1;
			} else {
				return -1
			}
		
		} else if (checkDraw(board)) {
		
			return 0;
		
		} else {
		
			var bestMoveValue = -100;
			var move = 0;
			for (var i = 0; i < board.length; i++) {
				var newBoard = makeMove(i, 'O', board);
				console.log('inMinValueForX');
					console.log(newBoard);
				if (newBoard) {
					var predictedMoveValue = minValueForX(newBoard);
					if (predictedMoveValue > bestMoveValue) {
						bestMoveValue = predictedMoveValue;
						move = i;
					}
				}
			}

			return bestMoveValue;
		}
	}

	function ticTacToeAi(){	
	
		var moveID = findMove(CurrentBoard);
		CurrentBoard[moveID].setSelected();
		CurrentBoard[moveID].setPlayer('O');
		CurrentBoard[moveID].cellIcon = '<i class="fa fa-circle-o   fa-4x cellIcon"></i>';
		$scope.currentPlayer = 'X';
		
	}

	//This function handles switching players for both human and computer modes.
	function switchPlayer(functionCell){
		
		if($routeParams.who == 'computer' && $scope.currentPlayer == 'X'){
			functionCell.cellIcon = '<i class="fa fa-times  fa-4x cellIcon"></i>';
			//placing AI logic here. 
			$timeout(function () {
				ticTacToeAi();
			}, 500);
		} else {
			
			if($scope.currentPlayer == 'X'){
				$scope.currentPlayer = 'O';
				functionCell.cellIcon = '<i class="fa fa-times  fa-4x cellIcon"></i>';
			} else {
				$scope.currentPlayer = 'X';
				functionCell.cellIcon = '<i class="fa fa-circle-o   fa-4x cellIcon"></i>';
			}
		}

	}

	//current variable setup
	$scope.currentPlayer = 'X';
	var cell1 = new cell(false, 1, null),
	    cell2 = new cell(false, 2, null),
	    cell3 = new cell(false, 3, null),
	    cell4 = new cell(false, 4, null),
	    cell5 = new cell(false, 5, null),
	    cell6 = new cell(false, 6, null),
	    cell7 = new cell(false, 7, null),
	    cell8 = new cell(false, 8, null),
	    cell9 = new cell(false, 9, null);
	
	var CurrentBoard = [cell1, cell2, cell3, cell4, cell5, cell6, cell7, cell8, cell9];
	$scope.cell1 = cell1;
	$scope.cell2 = cell2;
	$scope.cell3 = cell3;
	$scope.cell4 = cell4;
	$scope.cell5 = cell5;
	$scope.cell6 = cell6;
	$scope.cell7 = cell7;
	$scope.cell8 = cell8;
	$scope.cell9 = cell9;

	//handles whether a cell has been clicked
	$scope.cellClick = function (cellNumber) {
		switch(cellNumber){
			case 1:
				cell1.setSelected();
				cell1.setPlayer($scope.currentPlayer);
				switchPlayer(cell1);
				if (checkWinner(CurrentBoard)){
					resetGame();
					//rest of win logic.
				};
				if (checkDraw(CurrentBoard)){
					resetGame();
					//rest of draw logic.
				}
				break
			case 2:
				cell2.setSelected();
				cell2.setPlayer($scope.currentPlayer);
				switchPlayer(cell2);
				if (checkWinner(CurrentBoard)){
					resetGame();
					//rest of win logic.
				};
				if (checkDraw(CurrentBoard)){
					resetGame();
					//rest of draw logic.
				}
				break
			case 3:
				cell3.setSelected();
				cell3.setPlayer($scope.currentPlayer);
				switchPlayer(cell3);
				if (checkWinner(CurrentBoard)){
					resetGame();
					//rest of win logic.
				};
				if (checkDraw(CurrentBoard)){
					resetGame();
					//rest of draw logic.
				}
				break
			case 4:
				cell4.setSelected();
				cell4.setPlayer($scope.currentPlayer);
				switchPlayer(cell4);
				if (checkWinner(CurrentBoard)){
					resetGame();
					//rest of win logic.
				};
				if (checkDraw(CurrentBoard)){
					resetGame();
					//rest of draw logic.
				}
				break
			case 5:
				cell5.setSelected();
				cell5.setPlayer($scope.currentPlayer);
				switchPlayer(cell5);
				if (checkWinner(CurrentBoard)){
					resetGame();
					//rest of win logic.
				};
				if (checkDraw(CurrentBoard)){
					resetGame();
					//rest of draw logic.
				}
				break
			case 6:
				cell6.setSelected();
				cell6.setPlayer($scope.currentPlayer);
				switchPlayer(cell6);
				if (checkWinner(CurrentBoard)){
					resetGame();
					//rest of win logic.
				};
				if (checkDraw(CurrentBoard)){
					resetGame();
					//rest of draw logic.
				}
				break
			case 7:
				cell7.setSelected();
				cell7.setPlayer($scope.currentPlayer);
				switchPlayer(cell7);
				if (checkWinner(CurrentBoard)){
					resetGame();
					//rest of win logic.
				};
				if (checkDraw(CurrentBoard)){
					resetGame();
					//rest of draw logic.
				}
				break
			case 8:
				cell8.setSelected();
				cell8.setPlayer($scope.currentPlayer);
				switchPlayer(cell8);
				if (checkWinner(CurrentBoard)){
					resetGame();
					//rest of win logic.
				};
				if (checkDraw(CurrentBoard)){
					resetGame();
					//rest of draw logic.
				}
				break
			case 9:
				cell9.setSelected();
				cell9.setPlayer($scope.currentPlayer);
				switchPlayer(cell9);
				if (checkWinner(CurrentBoard)){
					resetGame();
					//rest of win logic.
				};
				if (checkDraw(CurrentBoard)){
					resetGame();
					//rest of draw logic.
				}
				break
		}
	}

	function resetGame() {
		cell1 = new cell(false, 1, null),
	    cell2 = new cell(false, 2, null),
	    cell3 = new cell(false, 3, null),
	    cell4 = new cell(false, 4, null),
	    cell5 = new cell(false, 5, null),
	    cell6 = new cell(false, 6, null),
	    cell7 = new cell(false, 7, null),
	    cell8 = new cell(false, 8, null),
	    cell9 = new cell(false, 9, null);
	    CurrentBoard = [cell1, cell2, cell3, cell4, cell5, cell6, cell7, cell8, cell9];
	    $scope.cell1 = cell1;
		$scope.cell2 = cell2;
		$scope.cell3 = cell3;
		$scope.cell4 = cell4;
		$scope.cell5 = cell5;
		$scope.cell6 = cell6;
		$scope.cell7 = cell7;
		$scope.cell8 = cell8;
		$scope.cell9 = cell9;
		$scope.currentPlayer = 'X'; 
	}


	
}