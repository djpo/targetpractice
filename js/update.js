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
