////////// global variables //////////
var range = [];
var discs = [];
var numOfDiscs = 3;

////////// functions //////////
function createSpotObjects() {
	for (i = 0; i < 10; i++) {
		range[i] = {'hasDiscs': false};
	}
};
function createDiscs () {
	for (i = 0; i < numOfDiscs; i++) {
		discs.push({});
		discs[i].position = Math.floor(Math.random() * 10);
		discs[i].velocity = Math.ceil(Math.random() * 5);
	}
}
function setRangeHasDiscs () {
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

////////// run commands, test //////////
createSpotObjects();
createDiscs();

$(discs).each(function (i) {
	console.log('discs[' + i + '].position: ' + discs[i].position);
});

setRangeHasDiscs();
changeVizSpotClasses();

console.log('__________');

////////// in progress //////////
