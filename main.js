let newDayBtn = document.getElementById('newDayBtn'),
  statBtn = document.getElementById('statBtn'),
  homeBtn = document.getElementById('homeBtn'),
  circle = document.getElementsByClassName('circle')[0],
  timeSpan = document.getElementById('timeSpan'),
  totalSpan = document.getElementById('totalSpan'),
  dateSpan = document.getElementById('dateSpan'),
  lastTimeSpan = document.getElementById('lastTimeSpan'),
  message = document.getElementById('message'),
  mainPage = document.querySelector('#mainPage'),
  statPage = document.querySelector('#statPage'),
  cover = document.getElementsByClassName('cover'),
  currentCigs,
  startTimeCig,
  totalCigs,
  noSmoke,
  allCigsStat,
  loop;

setVars();

newDayBtn.addEventListener('click', resetDay);
statBtn.addEventListener('click', displayStat);
homeBtn.addEventListener('click', displayHome);
circle.addEventListener('click', update);

//**** display Pages ***** //

function displayStat() {
  mainPage.style.display = "none";
  statPage.style.display = "block";
  homeBtn.classList.remove("active");
  statBtn.classList.add("active");
  statEffect()
};

function statEffect() {
  for (let i = 0; i < 7; i++) {
    cover[i].style.height = '160px';
  }
  setTimeout(function() {
    for (let i = 0; i < 7; i++) {
      cover[i].style.height = 160 - (allCigsStat[i] * 4) + 'px';
    }
  }, 100)
}

function displayHome() {
  mainPage.style.display = "block";
  statPage.style.display = "none";
  homeBtn.classList.add("active");
  statBtn.classList.remove("active");
};
//**** END display Pages ***** //

// *** Stat Page functions *** //
function dailyStat7() {
  let totalCigsDaily = localStorage.totalCigsDaily;
  allCigsStat.unshift(totalCigsDaily);
  localStorage.allCigsStatLS = allCigsStat;

  for (let i = 0; i < 7; i++) {
    cover[i].style.height = 160 - (allCigsStat[i] * 4) + 'px';
  }
  localStorage.totalCigsDaily = 0;
};

// *** END Stat Page functions *** //




// *** Main Page functions *** //
function update() {
  playSound();
  updateVars();

  if (currentCigs >= 1) {
    startCig();
  }

  if (totalCigs == 1) {
    setStartDate();
    currentTime();
  } else {
    clearInterval(loop);
    currentTime();
  }
  saveVars();
  updateView();
  fireEffect();
}

function resetDay() {
  localStorage.totalCigsDaily = currentCigs;
  dailyStat7()
  localStorage.currentCigs = 0;
  setVars()
};

function updateView() {
  //***update Circle***
  circle.innerHTML = currentCigs;
  //***update Total Cigarettes***
  totalSpan.innerHTML = totalCigs;
  //***update Start Date***
  if (localStorage.startingDate) {
    dateSpan.innerHTML = localStorage.startingDate;
  };
};

function setVars() {
  (localStorage.currentCigs) ? currentCigs = localStorage.currentCigs: currentCigs = 0;
  (localStorage.totalCigs) ? totalCigs = localStorage.totalCigs: totalCigs = 0;
  if (localStorage.allCigsStatLS) {
    allCigsStat = localStorage.allCigsStatLS.split(',');
    console.log(allCigsStat);
  } else {
    allCigsStat = [];
  }
  if (localStorage.startTimeCig) {
    currentTime();
  };
  updateView();
};

function saveVars() {
  localStorage.currentCigs = currentCigs;
  localStorage.totalCigs = totalCigs;
};

function updateVars() {
  currentCigs++;
  totalCigs++;
};

function startCig() {
  startTimeCig = new Date().getTime();
  localStorage.startTimeCig = startTimeCig;
};

function setStartDate() {
  localStorage.startingDate = new Date().toDateString();
  dateSpan.innerHTML = localStorage.startingDate;
};

function currentTime() {
  noSmokeTime();
  loop = setInterval(function() {
    noSmokeTime();
  }, 1000)
};

function noSmokeTime() {
  let startTime = localStorage.startTimeCig
  let counter = Math.round((new Date().getTime() - startTime) / 1000);
  let sec0;
  let min0;
  let h0;
  if (counter < 60) {
    (counter < 10) ? noSmoke = '0' + counter + ' sec': noSmoke = counter + ' sec';
  } else if (counter >= 60 && counter < 3600) {
    let min = Math.floor(counter / 60);
    let sec = counter % (min * 60);
    (min < 10) ? min0 = '0' + min: min0 = min;
    (sec < 10) ? sec0 = '0' + sec: sec0 = sec;
    noSmoke = min0 + ' min : ' + sec0 + ' sec';
  } else if (counter >= 3600) {
    let h = Math.floor(counter / 3600); // nije htelo sa let
    min = Math.floor((counter % (h * 3600)) / 60);
    sec = counter % ((min * 60) + (h * 3600));
    (h < 10) ? h0 = '0' + h: h0 = h;
    (min < 10) ? min0 = '0' + min: min0 = min;
    (sec < 10) ? sec0 = '0' + sec: sec0 = sec;
    noSmoke = h0 + ' h : ' + min0 + ' min : ' + sec0 + ' sec';
  };
  lastTimeSpan.innerHTML = noSmoke;
};

function playSound() {
  let smokeSound = document.createElement('audio');
  smokeSound.setAttribute('src', "sound/lighting-cigarette-sound.mp3");
  smokeSound.play();
}

function fireEffect() {
  circle.style.backgroundSize = "600px";
  setTimeout(function() {
    circle.style.backgroundSize = "1px";
  }, 500)
}

(function messageRnd() {
  let quitSmokingMsg = ["Keep Calm and Quit Smoking!", "Stop smoke, or die!", "Quit smoking today,save your family!", "Is the value of your life this cheep!", "Quit Smoking, Life is Beautiful!"];
  let i = Math.floor(Math.random() * quitSmokingMsg.length);
  message.innerHTML = quitSmokingMsg[i];
}());

// *** END Stat Page functions *** //