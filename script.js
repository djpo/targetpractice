////////// game setup variables //////////
var range = [];
var discs = [];
var sizeOfRange = 10;
var numOfDiscs = 5;
var target = '';
var gameOn = false;
var gameInterval = '';
// var timer = 120;

////////// game setup functions //////////
function createSpotObjects() {
	for (i = 0; i < sizeOfRange; i++) {
		range[i] = {'hasDiscs': false, 'fireResult': ''};
	}
};
function createDiscs () {
	for (i = 0; i < numOfDiscs; i++) {
		discs.push({});
		discs[i].name = i;
		discs[i].position = Math.floor(Math.random() * range.length);
		discs[i].velocity = Math.ceil(Math.random() * 3);
	}
}

////////// in-game user actions //////////
function startGame () {
	gameOn = true;
	createSpotObjects();
	createDiscs();
	createVizSpotListeners();
	createResetListener();

	update();
	gameInterval = setInterval(update, 1000);
	timerInterval = setInterval(timerUpdate, 1000);
}
function stopGame () {
	gameOn = false;
	updateViz();
	if (gameInterval) {
		clearInterval(gameInterval);
	}
}
function setTarget(num) {
	target = num;
}

////////// in-game functions //////////
function update () {
	updateObjects();
	fire(target);
	updateViz();
	target = '';
	checkForWin();
};

function updateObjects () {
	resetRange();
	updateDiscs();
	updateRange();
}
function resetRange () {
	for (i = 0; i < range.length; i++) {
		range[i].hasDiscs = false;
		range[i].fireResult = '';
	}
}
function updateDiscs() {
	$(discs).each(function (i) {
		var last = range.length - 1;
		this.position += this.velocity;
		if (this.position < 0) {
			this.position = -this.position;
			this.velocity = -this.velocity;
		} else if (this.position > last) {
			var diff = this.position - (last);
			this.position = last - diff;
			this.velocity = -this.velocity;
		}
	});
}
function updateRange () {
	for (i = 0; i < discs.length; i++) {
		range[discs[i].position].hasDiscs = true;
	}
}

function fire (target) {
	if (target !== '') {
		var spot = range[target];
		console.log('fired at ' + target);
		if (spot.hasDiscs) {
			hit (spot);
		} else {
			miss (spot);
		}
	}
}
function hit (spot) {
	spot.fireResult = 'hit';
	var discsHere = [];
	$(discs).each(function (i) {
		if (discs[i].position === range.indexOf(spot)) {
			discsHere.push(discs[i]);
		}
	});
	console.log('hit! there are ' + discsHere.length + ' discs here');
	destroyOne(discsHere);
}
function miss (spot) {
	spot.fireResult = 'miss';
	console.log('miss!');
}
function destroyOne (discsHere) {
	var rand = Math.floor(Math.random() * discsHere.length);
	var nameToDie = discsHere[rand].name;
	console.log('destroying disc #' + nameToDie);
	var indexToDie = indexByName (discs, nameToDie);
	discs.splice(indexToDie, 1);
}
function indexByName (array, name) {
	for (i = 0; i < array.length; i++) {
		if (array[i].name === name) {
			return i;
		}
	}
}

function updateViz () {
	for (i = 0; i < range.length; i++) {
		resetVizClass(i);
		addVizClass(i);
	}
}
function resetVizClass(i) {
	$('#' + i).removeClass('filled');
	$('#' + i).removeClass('hit');
	$('#' + i).removeClass('miss');
	$('#' + i).removeClass('aim');
}
function addVizClass (i) {
	if (range[i].hasDiscs) {
		$('#' + i).addClass('filled');
	}
	if (range[i].fireResult === 'hit') {
		$('#' + i).addClass('hit');
	} else if (range[i].fireResult === 'miss') {
		$('#' + i).addClass('miss');
	}
}

function checkForWin () {
	if (discs.length === 0) {
		stopGame();
		console.log("YOU DESTROYED ALL TARGETS!")
	}
}

function createVizSpotListeners() {
	$('.vizSpot').on('click', function () {
		console.log('hihihi');
		setTarget(this.id);
		$(this).addClass('aim');
	});
}
function createStartListener() {
	$('#start').on('click', function () {
		startGame();
	});
}
function createResetListener() {
	$('button#reset').on('click', function () {
		console.log('reset button not configured');
	});
}

////////// run commands, test //////////
$(document).ready(function () {
	createVizSpotListeners();
	createStartListener();
});

////////// in progress //////////
/*
function timerUpdate () {
	timer --;
	// $('#timerTime').((timer / 60) + ':' + (timer % 60));
	$('#timerTime').text('hi');
}
*/

////////// examples //////////
/*
document.querySelector('#resetButton').addEventListener('click', function() {
	resetCells()
});
for (var i = 0; i < allCells.length; i++) {
	allCells[i].addEventListener('click', function() {
		if (this.alreadyClicked !== 'yes') {
			this.innerText = turn.innerText;
			addColor(this);
			this.alreadyClicked = 'yes';
			checkForWin();
		}
	});
}

$('$todo-list').on('click', '.delete-button', deleteTodo);
	will constantly look for .delete-button elements
	final argument of .on() is a function
		function doesn't have final ()
		it will be called with argument of event
...
var deleteTodo = function(e) {
	e.preventDefault();
	e. ......
*/
