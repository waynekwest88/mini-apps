class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pins: initializePins(),
      pinsLeft: 10,
      scoreboard: keepScore(),
      total: 0,
      rolls: 0,
      frame: 0,
      strike: false,
      spare: false
    }
  }

  knockPins(numberOfPins) {
    var newScore = this.state.scoreboard;
    newScore[this.state.frame][this.state.rolls] = numberOfPins;
    newScore[this.state.frame][2] = newScore[this.state.frame][0] + newScore[this.state.frame][1];

    console.table(newScore);

    this.setState({
      scoreboard: newScore,
      total: calculateTotal(newScore),
      pinsLeft: pinsLeft(this.state.pinsLeft, numberOfPins, this.state.rolls),
      rolls: increaseRolls(this.state.rolls, this.state.frame),
      frame: increaseFrame(this.state.rolls, this.state.frame, newScore),
    })
  }

  render() {
    return (
      <div id="pins-container"><Pins pins={this.state.pins} knockPins={this.knockPins.bind(this)} /></div>
    );
  };
}

var pinsLeft = function(pinsLeft, numberOfPins, rolls) {
  var pins;
  var pinElements = document.getElementById('pins-container').childNodes;

  if (rolls === 1) {
    pins = 10;
    for (var i = 0; i < pinElements.length; i++) {
      $('#' + i).show();
    }
  } else {
    pins = pinsLeft - numberOfPins;
    for (var i = 0; i < pinElements.length; i++) {
      if (i > pins) {
        $('#' + i).hide();
      }
    } 
  }
  document.getElementById('pins-left').innerHTML = 'Pins left: ' + pins;
  return pins;
}

// var updateScoreboard = function(scoreboard, frame) {
//   var newScore = this.state.scoreboard;
//   newScore[this.state.frame][this.state.rolls] = numberOfPins;
//   newScore[this.state.frame][2] = newScore[this.state.frame][0] + newScore[this.state.frame][1];
//   if (newScore[frame][0] === 10) {
//     newScore[frame][3] = 'Strike';
//   } else if (newScore[frame][0] + scoreboard[frame][1] === 10) {
//     newScore[frame][3] = 'Spare';
//   } else {
//     newScore[frame][3] = 'Open'
//   }
//   console.table(newScore)
// }

var checkForStrikeOrSpare = function(scoreboard, frame) {
  if (scoreboard[frame][0] === 10) {
    scoreboard[frame][3] = 'Strike';
  } else if (scoreboard[frame][0] + scoreboard[frame][1] === 10) {
    scoreboard[frame][3] = 'Spare';
  } else {
    scoreboard[frame][3] = 'Open'
  }
}

var increaseFrame = function(rolls, frame, scoreboard) {
  if (frame > 0 && rolls === 1) {
    if (scoreboard[frame - 1][3] === 'Strike') {
      console.log('strike', frame)
      // if (scoreboard[frame][3] === 'Strike') {

      // } else if (scoreboard[frame][3] === 'Spare') {

      // }
      scoreboard[frame - 1][2] += scoreboard[frame][0] + scoreboard[frame][1];
    } else if (scoreboard[frame - 1][3] === 'Spare') {
      console.log('spare', frame)
      scoreboard[frame - 1][2] += scoreboard[frame][0];
    }
  }
  if (rolls === 1) {
    checkForStrikeOrSpare(scoreboard, frame);
    frame++;
  }
  
  document.getElementById('frame').innerHTML = 'Frame: ' + (frame + 1);
  return frame;
}

var increaseRolls = function(rolls, frame) {
  if (rolls === 0) {
    rolls++;
  } else {
    rolls = 0;
  }
  document.getElementById('rolls').innerHTML = 'Rolls: ' + (rolls + 1);
  return rolls;
}

var calculateTotal = function(score) {
  var total = 0;
  score.forEach(function(frame) {
    total += frame[2];
  })
  document.getElementById('total').innerHTML = 'Total Score: ' + total;
  return total;
}

var keepScore = function() {
  var score = [
    [null, null, null, null],
    [null, null, null, null],
    [null, null, null, null],
    [null, null, null, null],
    [null, null, null, null],
    [null, null, null, null],
    [null, null, null, null],
    [null, null, null, null],
    [null, null, null, null],
    [null, null, null, null],
  ]
  return score;
}

var initializePins = function() {
  var pins = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [9, 10]
  ]
  return pins;
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);