////////// input variables //////////
var sizeOfRange = 11;
var numOfDiscs = 4;
var discSpeed = 3;
var timer = 60;
var gameSpeed = 1000;
////////// game setup variables //////////
var range = [];
var discs = [];
var gameOn = false;
var target = '';
var fireCountRound = 0;
var hitCountRound = 0;
var missCountRound = 0;
var accuCountRound = 0;
var hitCount = 0;
var missCount = 0;
var accuCount = 0;
var message = 'Press START to begin.';
////////// user actions //////////
function startGame () {
	// setup
	gameOn = true;
	createRange(sizeOfRange);
	createSpotObjects();
	createDiscs();
	createVizSpotAimListeners();
	createResetListener();
	// begin
	startUpdate();
	gameInterval = setInterval(update, gameSpeed);
	timerInterval = setInterval(timerTick, 1000);
}
function createRange (num) {
	var newRange = '';
	for (i = 0; i < num; i++) {
		newRange += '<div id="' + i + '" class="vizSpot"></div>';
	}
	$('#vizRange').html(newRange);
}
function setTarget (num) {
	if (!locked) {
		target = num;
	}
	locked = true;
}
////////// game setup functions //////////
function createSpotObjects() {
	for (i = 0; i < sizeOfRange; i++) {
		range[i] = {'hasDiscs': false, 'fireResult': ''};
	}
}
function createDiscs () {
	for (i = 0; i < numOfDiscs; i++) {
		discs.push({});
		discs[i].name = i;
		discs[i].position = Math.floor(Math.random() * range.length);
		discs[i].velocity = Math.ceil(Math.random() * discSpeed) * (Math.round(Math.random()) * 2 - 1);
	}
}
function createVizSpotAimListeners() {
	$('.vizSpot').on('click', function () {
		if (locked === false) {
			$(this).addClass('aim');
		}
		setTarget(this.id);
	});
}
function createResetListener() {
	$('button#reset').on('click', function () {
		console.log('reset button not configured');
	});
}
function newGameVariables () {
	hitCountRound = 0;
	missCountRound = 0;
	accuCountRound = 0;
	message = '--';
}
////////// update functions //////////
function startUpdate () {
	resetTarget();
	newGameVariables();
	resetRange();
	updateRange();
	updateViz();
	updateTimerViz();
}
function update () {
	updateObjects();
	fire(target);
	updateViz();
	resetTarget();
	checkForEnd();
}
function timerTick () {
	timer -= 1;
	updateTimerViz();
}
function updateTimerViz () {
	if (timer <= 0) {
		$('#timerTime').text('--');
	} else {
		var sec = timer % 60;
		var newText = Math.floor(timer / 60) + ':' + (sec > 9 ? "" + sec : "0" + sec);
		$('#timerTime').text(newText);
	}
}
function resetTarget () {
	target = '';
	locked = false;
}
////////// update > updateObjects() //////////
function updateObjects () {
	message = '--';
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
////////// update > fire(target) //////////
function fire (target) {
	if (target !== '') {
		var spot = range[target];
		if (spot.hasDiscs) {
			hit (spot);
		} else {
			miss (spot);
		}
		fireCountRound += 1;
		accuCountRound = hitCountRound / fireCountRound;
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
	message = 'HIT!';
	destroyOne(discsHere);
	hitCountRound += 1;
}
function miss (spot) {
	spot.fireResult = 'miss';
	message = 'MISS!';
	missCountRound += 1;
}
function destroyOne (discsHere) {
	var rand = Math.floor(Math.random() * discsHere.length);
	var nameToDie = discsHere[rand].name;
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
////////// update > updateViz() //////////
function updateViz () {
	for (i = 0; i < range.length; i++) {
		resetVizClass(i);
		addVizClass(i);
	}
	updateVizReport();
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
function updateVizReport () {
	$('#message').text(message);
	$('#hitCountRound').text(hitCountRound);
	$('#missCountRound').text(missCountRound);
	$('#accuCountRound').text(Math.round(accuCountRound * 100) + '%');
}
////////// update > checkForEnd //////////
function checkForEnd () {
	if (discs.length === 0) {
		message = 'GAME OVER - All targets destroyed!';
		endGame();
	} else if (timer <= 0) {
		message = 'GAME OVER - You ran out of time!';
		endGame();
	}
}
function endGame () {
	clearAllIntervals()
	gameOn = false;
	locked = true;
	updateViz();
}
function clearAllIntervals () {
	clearInterval(gameInterval);
	clearInterval(timerInterval);
}
////////// on page ready //////////
function createStartListener() {
	$('#start').on('click', function (e) {
		startGame();
	});
}
$(document).ready(function () {
	createStartListener();
});
////////// in progress //////////
