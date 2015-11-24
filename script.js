////////// game setup variables //////////
var range = [];
var discs = [];
var sizeOfRange = 10;
var numOfDiscs = 5;
var target = '';

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
	update();
	gameInterval = setInterval(update, 1000);
}
function stopGame () {clearInterval(gameInterval);}
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
	$('#s' + i).removeClass('filled');
	$('#s' + i).removeClass('hit');
	$('#s' + i).removeClass('miss');
}
function addVizClass (i) {
	if (range[i].hasDiscs) {
		$('#s' + i).addClass('filled');
	}
	if (range[i].fireResult === 'hit') {
		$('#s' + i).addClass('hit');
	} else if (range[i].fireResult === 'miss') {
		$('#s' + i).addClass('miss');
	}
}

function checkForWin () {
	if (discs.length === 0) {
		stopGame();
		console.log("YOU DESTROYED ALL TARGETS!")
	}
}

////////// run commands, test //////////
$(document).ready(function () {
	createSpotObjects();
	createDiscs();
});
// console.log('__________');

////////// in progress //////////

