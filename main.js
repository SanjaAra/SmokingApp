let newDayBtn = document.getElementById('newDayBtn'),
  statBtn = document.getElementById('statBtn'),
  homeBtn = document.getElementById('homeBtn'),
  quitInfoBtn = document.getElementById('quitInfoBtn'),
  circle = document.getElementsByClassName('circle')[0],
  timeSpan = document.getElementById('timeSpan'),
  totalSpan = document.getElementById('totalSpan'),
  dateSpan = document.getElementById('dateSpan'),
  lastTimeSpan = document.getElementById('lastTimeSpan'),
  message = document.getElementById('message'),
  mainPage = document.querySelector('#mainPage'),
  statPage = document.querySelector('#statPage'),
  quitInfoPage = document.querySelector('#quitInfoPage'),
  cover = document.getElementsByClassName('cover'),
  navBtn = document.querySelector('[data-target="#MyNavBar"]'),
  mainNav = document.querySelector('#MyNavBar'),
  msgMainPage = document.querySelector('#msgMainPage'),
  numberOfDay,
  currentCigs,
  startTimeCig,
  totalCigs,
  noSmoke,
  allCigsStat,
  loop;

setVars();
displayHome();

statBtn.addEventListener('click', displayStat);
homeBtn.addEventListener('click', displayHome);
circle.addEventListener('click', update);
quitInfoBtn.addEventListener('click', displayQuitBenefitInfo);

//**** display Pages ***** //

function displayStat() {
  mainPage.style.display = "none";
  quitInfoPage.style.display = "none";
  statPage.style.display = "block";
  homeBtn.classList.remove("active");
  statBtn.classList.add("active");
  quitInfoBtn.classList.remove("active");
  statEffect();
  menuCollapsing();
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
  quitInfoPage.style.display = "none";
  homeBtn.classList.add("active");
  statBtn.classList.remove("active");
  quitInfoBtn.classList.remove("active");
  menuCollapsing();
};

function displayQuitBenefitInfo() {
  mainPage.style.display = "none";
  statPage.style.display = "none";
  quitInfoPage.style.display = "block";
  homeBtn.classList.remove("active");
  statBtn.classList.remove("active");
  quitInfoBtn.classList.add("active");
  menuCollapsing();
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

function updateView() {
  //***update Circle***
  circle.innerHTML = currentCigs;
  //***update Total Cigarettes***
  totalSpan.innerHTML = totalCigs;
  //***update Start Date***
  if (localStorage.startingDate) {
    dateSpan.innerHTML = localStorage.startingDate;
  };
  //***update Msg for over 40 cigs per day
  if (currentCigs >= 40) {
    circle.removeEventListener('click', update);
    msgMainPage.innerHTML = "You've already smoked 40 cigarettes. It's time to stop smoking.";
  } else {
    circle.addEventListener('click', update);
    msgMainPage.innerHTML = "Cigarettes smoked today";
  }

};

function setVars() {
  localStorage.numberOfDay = new Date().getDay();
  (localStorage.currentCigs) ? currentCigs = localStorage.currentCigs: currentCigs = 0;
  (localStorage.totalCigs) ? totalCigs = localStorage.totalCigs: totalCigs = 0;
  if (localStorage.allCigsStatLS) {
    allCigsStat = localStorage.allCigsStatLS.split(',');
    console.log(allCigsStat.length);
    if (allCigsStat.length > 30) {
      allCigsStat.pop();
    }
  } else {
    allCigsStat = [];
  }
  if (localStorage.startTimeCig) {
    currentTime();
  };
  updateView();
  setInterval(function() { //*** day reset
    let today = new Date().getDay();
    if (today != localStorage.numberOfDay) {
      localStorage.totalCigsDaily = currentCigs;
      dailyStat7()
      localStorage.currentCigs = 0;
      setVars()
    }
  }, 1000);
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
  let counter = new Date().getTime() - startTime;
  let day = Math.floor(counter / (24 * 60 * 60 * 1000)),
    dayMsRest = counter % (24 * 60 * 60 * 1000),
    our = Math.floor(dayMsRest / (60 * 60 * 1000)),
    ourMsRest = dayMsRest % (60 * 60 * 1000),
    min = Math.floor(ourMsRest / (60 * 1000)),
    minMsRest = ourMsRest % (60 * 1000),
    sec = Math.floor(minMsRest / 1000);

  (day < 10) ? day = '0' + day: day;
  (our < 10) ? our = '0' + our: our;
  (min < 10) ? min = '0' + min: min;
  (sec < 10) ? sec = '0' + sec: sec;

  noSmoke = day + ' d : ' + our + ' h : ' + min + ' min : ' + sec + ' sec';

  lastTimeSpan.innerHTML = noSmoke;
};

function playSound() {
  let smokeSound = document.createElement('audio');
  smokeSound.setAttribute('src', "sound/lighting-cigarette-sound.wav");
  smokeSound.play();
}

function fireEffect() {

  circle.style.backgroundSize = "600px";
  setTimeout(function() {
    circle.style.backgroundSize = "1px";
  }, 500)

}
(function messageRnd() {
  let quitSmokingMsg = ["Keep Calm and Quit Smoking!", "Stop smoke, respect your life!", "Quit smoking today, save your family!", "Is the value of your life this cheep!", "Quit Smoking, Life is Beautiful!"];
  let i = Math.floor(Math.random() * quitSmokingMsg.length);
  message.innerHTML = quitSmokingMsg[i];
}());

// *** END Stat Page functions *** //

function menuCollapsing() {
  navBtn.classList.add('collapsed');
  mainNav.classList.add('collapsing');
  mainNav.classList.remove('in');
  mainNav.classList.remove('collapse');
  setTimeout(function() {
    mainNav.classList.add('collapse');
    mainNav.classList.remove('collapsing');
  }, 100);
  let ae = navBtn.getAttribute('aria-expanded');
  let mainNavView = mainNav.getAttribute('aria-expanded');
  if (ae == "true" && mainNavView == "true") {
    navBtn.setAttribute('aria-expanded', "false");
    mainNav.setAttribute('aria-expanded', "false");
    // mainNav.setAttribute('style', "height:1px;");
  };
};