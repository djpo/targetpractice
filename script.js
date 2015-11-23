////////// global variables //////////
var range = [];
var discs = [];
var sizeOfRange = 10;
var numOfDiscs = 3;

////////// functions //////////
function createSpotObjects() {
	for (i = 0; i < sizeOfRange; i++) {
		range[i] = {'hasDiscs': false};
	}
};
function createDiscs () {
	for (i = 0; i < numOfDiscs; i++) {
		discs.push({});
		discs[i].position = Math.floor(Math.random() * range.length);
		// discs[i].velocity = Math.ceil(Math.random() * 3);
		// below just to test
		discs[i].velocity = 1;
	}
}
function setRangeHasDiscs () {
	for (i = 0; i < range.length; i++) {
		range[i].hasDiscs = false;
	}
	for (i = 0; i < discs.length; i++) {
		range[discs[i].position].hasDiscs = true;
	}
}
function changeVizSpotClasses () {
	for (i = 0; i < range.length; i++) {
		if (range[i].hasDiscs) {
			$('#s' + i).addClass('hasDiscs');
		} else {
			$('#s' + i).removeClass('hasDiscs');
		}
	}
}
function updatePositions() {
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
function updateViz () {
	setRangeHasDiscs();
	changeVizSpotClasses();
}

function update () {
	updatePositions();
	updateViz();
};
function startGame () {
	update();
	gameInterval = setInterval(update, 800);
}
function stopGame () {
	clearInterval(gameInterval);
}

////////// run commands, test //////////
$(document).ready(function () {
	createSpotObjects();
	createDiscs();
});

// console.log('__________');

////////// in progress //////////

