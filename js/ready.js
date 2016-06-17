////////// on page ready //////////
function createStartListener() {
  $('#start').on('click', function (e) {
    startGame();
  });
}
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
