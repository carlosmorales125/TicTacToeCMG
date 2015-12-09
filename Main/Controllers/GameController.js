ticTacToe.controller('GameController', ['$scope', '$routeParams', '$location', '$timeout', GameControllerFunction]);

	function GameControllerFunction($scope, $routeParams, $location, $timeout){
	//Handles Title and Misuse of Route Params.
		switch($routeParams.who){
			case "human":
				$scope.title = "Human Vs. Human";
				$scope.directions = "When choosing who goes first, you can use age, a coin toss, or just about anything.";
				break;

			case "computer":
				$scope.title = "Human Vs. Computer";
				$scope.directions = "When playing against the computer, the human goes first. It's the only way to (mildly) entertain the computer.";
				break;
			default:
				alert('That is not a valid URL.');
				$location.path('/');
				break;
	}
	
	//Tic Tac Toe Cell Class
	function cell(selected, id, player) {

	  this.selected = selected;
	  this.player = player;
	  this.id = id;
	  this.cellIcon = '';

	  this.setSelected = function setSelected() {
	    this.selected = true;
	  };

	  this.deselected = function deselected() {
	    this.selected = false;
	  };

	  this.checkSelected = function checkSelected() {
	    return this.selected;
	  };

	  this.setPlayer = function setPlayer(currentPlayer) {
	    this.player = currentPlayer;
	  };

	  this.getPlayer = function getPlayer() {
	    return this.player;
	  };

	}

	//Called by checkWinner to make sure player matches in winning combonations.
	function playerMatches(functionCell1, functionCell2, functionCell3){
		//Checks if Players Match
		var player1 = functionCell1.getPlayer(),
			player2 = functionCell2.getPlayer(),
			player3 = functionCell3.getPlayer();

		if (player1 === player2 && player2 === player3 && player1 !== null && player2 !== null && player3 !== null){
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

		//- cell1, cell2, cell3
		if(cellsSelected(board[0], board[1], board[2]) && playerMatches(board[0], board[1], board[2])){
			$scope.setWinner = board[0].getPlayer();
			return true;
		} 

		//- cell4, cell5, cell6
		if(cellsSelected(board[3], board[4], board[5]) && playerMatches(board[3], board[4], board[5])){
			$scope.setWinner = board[3].getPlayer();
			return true;
		} 

		//- cell7, cell8, cell9
		if(cellsSelected(board[6], board[7], board[8]) && playerMatches(board[6], board[7], board[8])){
			$scope.setWinner = board[6].getPlayer();
			return true;
		} 

		//- cell1, cell4, cell7
		if(cellsSelected(board[0], board[3], board[6]) && playerMatches(board[0], board[3], board[6])){
			$scope.setWinner = board[0].getPlayer();
			return true;
		} 

		//- cell2, cell5, cell8
		if(cellsSelected(board[1], board[4], board[7]) && playerMatches(board[1], board[4], board[7])){
			$scope.setWinner = board[1].getPlayer();
			return true;
		} 

		//- cell3, cell6, cell9
		if(cellsSelected(board[2], board[5], board[8]) && playerMatches(board[2], board[5], board[8])){
			$scope.setWinner = board[2].getPlayer();
			return true;
		} 

		//- cell1, cell5, cell9
		if(cellsSelected(board[0], board[4], board[8]) && playerMatches(board[0], board[4], board[8])){
			$scope.setWinner = board[0].getPlayer();
			return true;
		} 

		//- cell3, cell5, cell7
		if(cellsSelected(board[2], board[4], board[6]) && playerMatches(board[2], board[4], board[6])){
			$scope.setWinner = board[2].getPlayer();
			return true;
		} 
	}

	$scope.changePlayer = function () {
		if($scope.gameOver === false){
			if($scope.currentPlayer == "X"){
				$scope.currentPlayer = "O";
				$scope.max = "X";
				$scope.min = "O";
				$scope.maxIcon = '<i class="fa fa-times  fa-4x cellIcon"></i>';
				$scope.minIcon = '<i class="fa fa-circle-o   fa-4x cellIcon"></i>';
			} else {
				$scope.currentPlayer = "X";
				$scope.max = "O";
				$scope.min = "X";
				$scope.maxIcon = '<i class="fa fa-circle-o   fa-4x cellIcon"></i>';
				$scope.minIcon = '<i class="fa fa-times  fa-4x cellIcon"></i>';
			}
		}
	};
	
	function makeMove(move, player, board){
		var newBoard = cloneBoard(board);
		if(newBoard[move].checkSelected() === false){
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
		
		//This Loop Calls MakeMove with Move starting at 0.
		//MakeMove calls checkSelected on the cell in that board.
		//if False, it returns the newBoard with that cell selected 
		//and set to player of 'O.' Then it passes newBoard to minValueForX
		//Where minValueForX trades it with maxValueforO until a good score 
		//is reached.
		for (var i = 0; i < board.length; i++) {
			var newBoard = makeMove(i, $scope.max, board); //max 
			if (newBoard) {
				var predictedMoveValue = minValueForX(newBoard);
				if(predictedMoveValue > bestMoveValue){
					bestMoveValue = predictedMoveValue;
					move = i;
				}
			}
		}
		return move;
	}

	function minValueForX(board){
		
		if (checkWinner(board)){
			
			if ($scope.setWinner == $scope.max){ //max
				return 1;
			} else {
				return -1;
			}
		
		} else if (checkDraw(board)) {
		
			return 0;
		
		} else {
			
			var bestMoveValue = 100;
			var move = 0;
			for (var i = 0; i < board.length; i++) {
				var newBoard = makeMove(i, $scope.min, board); //min
				if (newBoard) {
					var predictedMoveValue = maxValueForO(newBoard);
					if (predictedMoveValue < bestMoveValue) {
						bestMoveValue = predictedMoveValue;
						move = i;
					}
				}
			}

			return bestMoveValue;
		}
	}

	function maxValueForO(board){

		if (checkWinner(board)){
			
			if ($scope.setWinner == $scope.max){ //max
				return 1;
			} else {
				return -1;
			}
		
		} else if (checkDraw(board)) {
		
			return 0;
		
		} else {
		
			var bestMoveValue = -100;
			var move = 0;
			for (var i = 0; i < board.length; i++) {
				var newBoard = makeMove(i, $scope.max, board); //max
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
		$scope.currentPlayer = $scope.min; //min
		CurrentBoard[moveID].setSelected();
		CurrentBoard[moveID].setPlayer($scope.max); //max
		CurrentBoard[moveID].cellIcon = $scope.maxIcon; //maxIcon
		$scope.aiMessage = '';
		if(checkWinner(CurrentBoard)){
			$scope.gameOver = true;
			$scope.gameResult = "The computer has won.";
			$("#myModal").modal();
		} 
		if (checkDraw(CurrentBoard)){
			$scope.gameOver = true;
			$scope.gameResult = "The game ended in a draw.";
			$("#myModal").modal();
		}

	}

	//This function handles switching players for both human and computer modes.
	function switchPlayer(functionCell){
		if($scope.gameOver === false) {
			if($routeParams.who == 'computer' && $scope.currentPlayer == $scope.min && $scope.gameOver === false){ //min
				functionCell.cellIcon = $scope.minIcon; //minIcon
				$scope.currentPlayer = $scope.max; //max
				$scope.aiMessage = 'The computer is thinking: ' + '<i class="fa fa-circle-o-notch fa-spin"></i>';
				//placing AI logic here. 
				$timeout(function () {
					ticTacToeAi();
				}, 1000);
			} else {
				
				if($scope.currentPlayer == 'X' && $scope.gameOver === false){ 
					$scope.currentPlayer = 'O'; 
					functionCell.cellIcon = '<i class="fa fa-times  fa-4x cellIcon"></i>';
				} else {
					$scope.currentPlayer = 'X'; 
					functionCell.cellIcon = '<i class="fa fa-circle-o   fa-4x cellIcon"></i>';
				}
			}
		}

	}

	//current variable setup
	$scope.currentPlayer = 'X';
	$scope.max = "O";
	$scope.min = "X";
	$scope.maxIcon = '<i class="fa fa-circle-o   fa-4x cellIcon"></i>';
	$scope.minIcon = '<i class="fa fa-times  fa-4x cellIcon"></i>';
	$scope.gameOver = false;
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
		var cell = $scope['cell' + cellNumber];
		
		if(!cell.checkSelected()) {
			$scope.changePlayerButton = true;
			$scope.aiMessage = "";
			cell.setSelected();
			cell.setPlayer($scope.currentPlayer);
			if (checkWinner(CurrentBoard)){
				$scope.gameOver = true;
				$scope.gameResult = $scope.currentPlayer + " has won the game.";
				$("#myModal").modal();
			}
			if (checkDraw(CurrentBoard)){
				$scope.gameOver = true;
				$scope.gameResult = "The game ended in a draw.";
				$("#myModal").modal();
			}
			switchPlayer(cell);

		} else {
			$scope.aiMessage = "That cell is selected, please choose another.";
		}
	};

	$scope.resetGame = function (){
		cell1 = new cell(false, 1, null),
	    cell2 = new cell(false, 2, null),
	    cell3 = new cell(false, 3, null),
	    cell4 = new cell(false, 4, null),
	    cell5 = new cell(false, 5, null),
	    cell6 = new cell(false, 6, null),
	    cell7 = new cell(false, 7, null),
	    cell8 = new cell(false, 8, null),
	    cell9 = new cell(false, 9, null),
	    CurrentBoard = [cell1, cell2, cell3, cell4, cell5, cell6, cell7, cell8, cell9],
	    $scope.cell1 = cell1,
		$scope.cell2 = cell2,
		$scope.cell3 = cell3,
		$scope.cell4 = cell4,
		$scope.cell5 = cell5,
		$scope.cell6 = cell6,
		$scope.cell7 = cell7,
		$scope.cell8 = cell8,
		$scope.cell9 = cell9,
		$scope.currentPlayer = 'X', 
		$scope.max = "O",
		$scope.min = "X",
		$scope.maxIcon = '<i class="fa fa-circle-o   fa-4x cellIcon"></i>',
		$scope.minIcon = '<i class="fa fa-times  fa-4x cellIcon"></i>',
		$scope.gameOver = false,
		$scope.changePlayerButton = false;
	};

}