////////// game settings //////////
var sizeOfRange = 10;
var numOfDiscs = 2;
var discSpeed = 1;
var timer = 15;
var gameSpeed = 1000;
////////// game setup variables //////////
var range = [];
var discs = [];
var gameOn = false;
var target = '';
var hitCountRound = 0;
var missCountRound = 0;
var accuCountRound = 0;
var hitCountMulti = 0;
var missCountMulti = 0;
var accuCountMulti = 0;
var message = 'Press START to begin.';
////////// user actions //////////
function startGame () {
	// setup
	gameOn = true;
	takeInput();
	createRange(sizeOfRange);
	createSpotObjects();
	createDiscs();
	createVizSpotAimListeners();
	createResetListener();
	$('.welcome').hide();
	$('.notWelcome').show();
	$('.multiStats').hide();
	// begin
	startUpdate();
	gameInterval = setInterval(update, gameSpeed);
	timerInterval = setInterval(timerTick, 1000);}
////////// game setup functions //////////
function takeInput () {
	sizeOfRange = $('#variSpaces').val();
	numOfDiscs = $('#variDiscs').val();
	discSpeed = $('#variVel').val();
	gameSpeed = $('#variGameSpeed').val() * 1000;
	timer = $('#variTimer').val();}
function createRange (num) {
	var newRange = '';
	for (i = 0; i < num; i++) {
		newRange += '<div id="' + i + '" class="vizSpot"></div>';
	}
	$('#vizRange').html(newRange);}
function createSpotObjects() {
	for (i = 0; i < sizeOfRange; i++) {
		range[i] = {'hasDiscs': false, 'fireResult': ''};
	}}
function createDiscs () {
	for (i = 0; i < numOfDiscs; i++) {
		discs.push({});
		discs[i].name = i;
		discs[i].position = Math.floor(Math.random() * range.length);
		discs[i].velocity = Math.ceil(Math.random() * discSpeed) * (Math.round(Math.random()) * 2 - 1);
	}}
function createVizSpotAimListeners() {
	$('.vizSpot').on('click', function () {
		if (locked === false) {
			$(this).addClass('aim');
		}
		setTarget(this.id);
	});}
function createResetListener() {
	$('button#restart').on('click', function () {
		console.log('reset button not configured');
			$('.notWelcome').hide();
			$('.welcome').show();
	});}
function newGameVariables () {
	hitCountRound = 0;
	missCountRound = 0;
	accuCountRound = 0;
	message = '--';}
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
	checkForEnd();}
function timerTick () {
	timer -= 1;
	updateTimerViz();}
function updateTimerViz () {
	if (timer <= 0) {
		$('#timerTime').text('--');
	} else {
		var sec = timer % 60;
		var newText = Math.floor(timer / 60) + ':' + (sec > 9 ? "" + sec : "0" + sec);
		$('#timerTime').text(newText);
	}}
function resetTarget () {
	target = '';
	locked = false;}
function setTarget (num) {
	if (!locked) {
		target = num;
	}
	locked = true;}
////////// update > updateObjects() //////////
function updateObjects () {
	message = '--';
	resetRange();
	updateDiscs();
	updateRange();}
function resetRange () {
	for (i = 0; i < range.length; i++) {
		range[i].hasDiscs = false;
		range[i].fireResult = '';
	}}
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
	});}
function updateRange () {
	// move resetRange in here?
	for (i = 0; i < discs.length; i++) {
		range[discs[i].position].hasDiscs = true;
	}}
////////// update > fire(target) //////////
function fire (target) {
	if (target !== '') {
		var spot = range[target];
		if (spot.hasDiscs) {
			hit (spot);
		} else {
			miss (spot);
		}
		accuCountRound = hitCountRound / (hitCountRound + missCountRound);
	}}
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
	hitCountRound += 1;}
function miss (spot) {
	spot.fireResult = 'miss';
	message = 'MISS!';
	missCountRound += 1;}
function destroyOne (discsHere) {
	var rand = Math.floor(Math.random() * discsHere.length);
	var nameToDie = discsHere[rand].name;
	var indexToDie = indexByName (discs, nameToDie);
	discs.splice(indexToDie, 1);}
function indexByName (array, name) {
	for (i = 0; i < array.length; i++) {
		if (array[i].name === name) {
			return i;
		}
	}}
////////// update > updateViz() //////////
function updateViz () {
	/*
	// range.forEach(function (i) {
	$(range).Each(function (i) {
		resetVizClass(i);
		addVizClass(i);
	});
	*/
	for (i = 0; i < range.length; i++) {
		resetVizClass(i);
		addVizClass(i);
	}
	updateVizReportRound();
	addEndStyle();
}
//combine resetVizClass and addVizClass into updateVizClass
function resetVizClass(i) {
	$('#' + i).removeClass('filled');
	$('#' + i).removeClass('hit');
	$('#' + i).removeClass('miss');
	$('#' + i).removeClass('aim');
	$('#' + i).removeClass('end');}
function addVizClass (i) {
	if (range[i].hasDiscs) {
		$('#' + i).addClass('filled');
	}
	if (range[i].fireResult === 'hit') {
		$('#' + i).addClass('hit');
	} else if (range[i].fireResult === 'miss') {
		$('#' + i).addClass('miss');
	}}
function updateVizReportRound () {
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
	}}
function endGame () {
	clearAllIntervals()
	gameOn = false;
	locked = true;
	updateStatsMulti();
	updateViz();
	addEndStyle();
	setVizDefaultSettings();
}
function clearAllIntervals () {
	clearInterval(gameInterval);
	clearInterval(timerInterval);}
function updateStatsMulti () {
	hitCountMulti += hitCountRound;
	missCountMulti += missCountRound;
	accuCountMulti = hitCountRound / (hitCountRound + accuCountMulti);
}
function addEndStyle () {
	$('.vizSpot').addClass('over');
	updateVizReportMulti();
	$('.multiStats').show();
}
function updateVizReportMulti () {
	$('#hitCountMulti').text(hitCountMulti);
	$('#missCountMulti').text(missCountMulti);
	$('#accuCountMulti').text(Math.round(accuCountMulti * 100) + '%');
}
////////// on page ready //////////
function createStartListener() {
	$('#start').on('click', function (e) {
		startGame();
	});}
function setVizSettings () {
	$('input#variSpaces').attr('value', sizeOfRange);
	$('input#variDiscs').attr({value: numOfDiscs});
	$('input#variVel').attr('value', discSpeed);
	$('input#variGameSpeed').attr('value', gameSpeed);
	$('input#variTimer').attr('value', timer);
}
$(document).ready(function () {
	setVizSettings();
	createStartListener();
});
////////// in progress //////////

/*
make sections/divs inside infoReport(?): .multiStats #missCountMulti, etc
*/
