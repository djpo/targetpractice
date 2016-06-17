function createStartListener () {
  $('#start').on('click', function (e) {
    startGame();
  });
}
function startGame () {
  ///// setup /////
  gameOn = true;
  takeInput();
  createRange(sizeOfRange);
  createSpotObjects();
  createDiscs();
  createVizSpotAimListeners();
  createResetListener();
  $('.welcome').hide();
  $('.notWelcome').show();
  // $('.multiStats').hide();
  ///// begin /////
  startUpdate();
  gameInterval = setInterval(update, gameSpeed);
  timerInterval = setInterval(timerTick, 1000);
}
function setVizSettings () {
  $('input#variSpaces').attr('value', sizeOfRange);
  $('input#variDiscs').attr('value', numOfDiscs);
  $('input#variVel').attr('value', discSpeed);
  $('input#variGameSpeed').attr('value', gameSpeed/1000);
  $('input#variTimer').attr('value', timer);
}

////////// on page ready //////////
$(document).ready(function () {
  setVizSettings();
  createStartListener();
});
