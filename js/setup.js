////////// game setup functions //////////
function takeInput () {
  sizeOfRange = $('#variSpaces').val();
  numOfDiscs = $('#variDiscs').val();
  discSpeed = $('#variVel').val();
  gameSpeed = $('#variGameSpeed').val() * 1000;
  timer = $('#variTimer').val();
}
function createRange (num) {
  var newRange = '';
  for (i = 0; i < num; i++) {
    newRange += '<div id="' + i + '" class="vizSpot"></div>';
  }
  $('#vizRange').html(newRange);
}
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
  $('button#restart').on('click', function () {
    console.log('reset button not configured');
      $('.notWelcome').hide();
      $('.welcome').show();
  });
}
function newGameVariables () {
  hitCountRound = 0;
  missCountRound = 0;
  accuCountRound = 0;
  message = '--';
}
