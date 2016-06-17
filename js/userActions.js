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
  timerInterval = setInterval(timerTick, 1000);
}
