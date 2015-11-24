////////// game setup variables //////////
var range = [];
var discs = [];
var sizeOfRange = 10;
var numOfDiscs = 20;
var discSpeed = 5;
var timer = 120;
var gameOn = false;
var target = '';

////////// user actions //////////
function startGame () {
	// setup
	gameOn = true;
	createSpotObjects();
	createDiscs();
	createVizSpotListeners();
	createResetListener();
	// begin
	startUpdate();
	gameInterval = setInterval(update, 1000);
	timerInterval = setInterval(timerTick, 1000);
}
function stopGame () {
	gameOn = false;
	// updateViz();
	if (gameInterval) {
		clearInterval(gameInterval);
	}
}
function setTarget(num) {
	target = num;
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
	///// test below
	$(discs).each(function (i) {
		console.log('n:' + this.name + ', p:' + this.position + ', v:' + this.velocity);
	});
}
function createVizSpotListeners() {
	$('.vizSpot').on('click', function () {
		console.log('hihihi');
		setTarget(this.id);
		$(this).addClass('aim');
	});
}
function createResetListener() {
	$('button#reset').on('click', function () {
		console.log('reset button not configured');
	});
}

////////// update functions //////////
function startUpdate () {
	target = '';
	resetRange();
	updateRange();
	updateViz();
	updateTimerViz();
}
function update () {
	updateObjects();
	fire(target);
	updateViz();
	target = '';
	checkForWin();
}
function timerTick () {
	timer -= 1;
	updateTimerViz();
}
function updateTimerViz () {
	//$('#timerTime').text(Math.floor(timer / 60) + ':' + timer % 60);
	$('#timerTime').text(timer);
}

////////// update > updateObjects() //////////
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

////////// update > fire(target) //////////
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
////////// update > updateViz() //////////
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
////////// update > checkForWin //////////
function checkForWin () {
	if (discs.length === 0) {
		stopGame();
		console.log("YOU DESTROYED ALL TARGETS!")
	}
}
////////// on page ready //////////
function createStartListener() {
	$('#start').on('click', function () {
		startGame();
	});
}

$(document).ready(function () {
	createStartListener();
});

////////// in progress //////////


////////// examples //////////

