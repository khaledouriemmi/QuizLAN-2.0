let currentPin = null;
let playerId = null;
let pollInterval = null;
let selectedAvatar = null;
let pendingName = null;
let pendingPin = null;
let localTimeLeft = 20;
let lastServerTime = null;
let lastServerTimestamp = null;
let currentDuration = 20;
let timerAnimationFrame = null;
const nameInput = document.getElementById("nameInput");
const pinInput = document.getElementById("pinInput");
const joinBtn = document.getElementById("joinBtn");
const quitBtn = document.getElementById("quitBtn");
const confirmQuitModal = document.getElementById("confirmQuitModal");
const confirmQuitYes = document.getElementById("confirmQuitYes");
const confirmQuitNo = document.getElementById("confirmQuitNo");
const statusEl = document.getElementById("status");
const joinSection = document.getElementById("joinSection");
const questionZone = document.getElementById("questionZone");
const qText = document.getElementById("qText");
const answersDiv = document.getElementById("answers");
const scoreDisplay = document.getElementById("scoreDisplay");
const timeIndicator = document.getElementById("timeIndicator");
const timeValue = document.getElementById("timeValue");
const answersIndicator = document.getElementById("answersIndicator");
const answersCount = document.getElementById("answersCount");
const resultMessage = document.getElementById("resultMessage");
const waitingOverlay = document.getElementById("waitingOverlay");
const avatarOverlay = document.getElementById("avatarOverlay");
const avatarOptions = document.querySelectorAll(".avatar-option");
const avatarBackBtn = document.getElementById("avatarBackBtn");
const answerFeedback = document.getElementById("answerFeedback");
const feedbackIcon = document.getElementById("feedbackIcon");
const feedbackMessage = document.getElementById("feedbackMessage");
const feedbackSubmessage = document.getElementById("feedbackSubmessage");
const feedbackPoints = document.getElementById("feedbackPoints");
const feedbackTimeLeft = document.getElementById("feedbackTimeLeft");
const scoreboardOverlay = document.getElementById("scoreboardOverlay");
const scoreboardList = document.getElementById("scoreboardList");
const podiumOverlay = document.getElementById("podiumOverlay");
const podiumContainer = document.getElementById("podiumContainer");
const yourPosition = document.getElementById("yourPosition");
const quitGameBtn = document.getElementById("quitGameBtn");
const urlParams = new URLSearchParams(window.location.search);
const pinFromUrl = urlParams.get("pin");
if (pinFromUrl) {
  pinInput.value = pinFromUrl;
}
const MESSAGES = {
  fast: [
    "That was fast… I can't tell if you're a genius or just guessing at light-speed.",
    "Wow, you answered so fast the server got scared. Smart or lucky? We may never know.",
    "Speed level: instant reaction. Brain level: …to be determined.",
    "Okay speedster! Smart move or random tap? Either way, respect.",
    "You answered before I even finished reading. Brilliant? Chaotic? Both?",
    "That speed… I'm impressed. The logic behind it? Unsure. Good luck though.",
    "Fast fingers detected! Smart brain? Hmm… let's hope so.",
    "You didn't even blink. Are you a prodigy or just living dangerously?",
    "Speed 10/10. Accuracy? We'll see. I'm rooting for you.",
    "Rapid answer achieved! Whether it's genius or madness… best of luck."
  ],
  slow: [
    "Took your time there, huh? Hope it was worth the wait.",
    "The suspense was killing me. Did you fall asleep?",
    "Wow, that was… thorough. Or were you just staring into space?",
    "I've seen glaciers move faster. But hey, no pressure.",
    "Did you consult a magic 8-ball? Because that took forever.",
    "Slow and steady… loses the race. Just saying.",
    "Were you writing a thesis? It's multiple choice, friend.",
    "I aged 10 years waiting for that answer.",
    "Did you need to phone a friend? Call your mom? Both?",
    "That was so slow I forgot the question. But okay."
  ],
  correct: [
    "Nailed it! You're on fire! 🔥",
    "Correct! Your brain is working overtime today!",
    "Yes! That's the one! Brilliant!",
    "Absolutely right! Keep this energy going!",
    "Correct answer! You're crushing it!",
    "Bingo! That's exactly right!",
    "Perfect! Your knowledge is showing!",
    "Spot on! You're a quiz master!",
    "Correct! That was impressive!",
    "Yes! You got it! Excellent work!"
  ],
  wrong: [
    "Bold choice. Very bold. Very wrong.",
    "Interesting answer… unfortunately, the correct one was elsewhere.",
    "Ah yes, the confidence was there. The accuracy? Not so much.",
    "If guessing was a sport… you'd still lose.",
    "So close! …not really, but I'm trying to be supportive.",
    "Good try! Actually no, that was terrible.",
    "Well, someone clearly studied… the wrong chapter.",
    "Plot twist: that answer was completely incorrect.",
    "I admire the enthusiasm. Accuracy is optional, right?",
    "At least you clicked something. That's… something."
  ],
  timeout: [
    "Time's up! Silence is NOT golden in quizzes.",
    "Did you forget to answer? Because… you didn't answer.",
    "The clock ran out. So did your chances.",
    "No answer? Bold strategy. Didn't work though.",
    "You had ONE job: click a button. And yet…",
    "Timeout! Were you waiting for divine intervention?",
    "The question expired. So did your opportunity.",
    "No response detected. Are you still there?",
    "Time ran out faster than your decision-making skills.",
    "Missed it! The answer was right there. You just had to click."
  ]
};
const WRONG_MESSAGES = MESSAGES.wrong;
const SPEED_MESSAGES = {
  ultraFast: [
    "I think you're related to Barry Allen, also known as 'The Flash'! ⚡",
    "Whoa! Did you even read the question? Lightning fast! ⚡",
    "That was INSANELY fast! Are you from the future? ⚡"
  ],
  fast: [
    "Speed demon! You're quick on the draw! 🏃‍♂️",
    "Impressive speed! Your reflexes are on point! 🎯",
    "Fast and furious! Nice timing! 🚀"
  ],
  medium: [
    "Good timing! Thoughtful but quick! 🤔",
    "Nice pace! You took your time wisely! ⏱️",
    "Calculated answer! Well-timed! 📊"
  ],
  slow: [
    "You took your sweet time... hope it paid off! 🐢",
    "Slow and steady... let's see if it wins the race! 🐌",
    "That was thorough! Very thorough! 📚"
  ]
};
function getAvatarEmoji(avatarName) {
  const avatarMap = {
    'funny': '🐸', 'cute': '🐱', 'mysterious': '🔥', 'smart': '🧠',
    'cool': '😎', 'ninja': '🥷', 'robot': '🤖', 'alien': '👽',
    'wizard': '🧙', 'unicorn': '🦄', 'lion': '🦁', 'ghost': '👻',
    'panda': '🐼', 'rocket': '🚀', 'star': '⭐', 'crown': '👑',
    'dragon': '🐲', 'fox': '🦊', 'bear': '🐻', 'koala': '🐨'
  };
  return avatarMap[avatarName] || '👤';
}
function showAnswerFeedback(isCorrect, points, answerTime) {
  let speedCategory;
  if (answerTime < 3) speedCategory = 'ultraFast';
  else if (answerTime < 7) speedCategory = 'fast';
  else if (answerTime < 15) speedCategory = 'medium';
  else speedCategory = 'slow';
  const speedMsg = SPEED_MESSAGES[speedCategory][Math.floor(Math.random() * SPEED_MESSAGES[speedCategory].length)];
  feedbackIcon.textContent = '⏳';
  feedbackMessage.textContent = 'Answer Submitted!';
  feedbackSubmessage.textContent = speedMsg;
  feedbackPoints.textContent = '';
  answerFeedback.classList.add('active');
  answerFeedback.dataset.isCorrect = isCorrect;
  answerFeedback.dataset.points = points;
}
function hideAnswerFeedback() {
  answerFeedback.classList.remove('active');
}
function revealAnswerResult() {
  const isCorrect = answerFeedback.dataset.isCorrect === 'true';
  const points = parseInt(answerFeedback.dataset.points) || 0;
  feedbackIcon.textContent = isCorrect ? '✅' : '❌';
  feedbackMessage.textContent = isCorrect ? 'Correct!' : 'Wrong!';
  feedbackPoints.textContent = `+${points} points`;
}
function showScoreboard(players, myPlayerId) {
  scoreboardList.innerHTML = '';
  players.forEach((player, index) => {
    const item = document.createElement('div');
    item.className = 'scoreboard-item';
    if (index === 0) item.classList.add('top-1');
    else if (index === 1) item.classList.add('top-2');
    else if (index === 2) item.classList.add('top-3');
    if (player.id === myPlayerId) {
      item.style.border = '3px solid #fbbf24';
    }
    item.style.animationDelay = `${index * 0.1}s`;
    item.innerHTML = `
      <div class="scoreboard-rank">${index + 1}</div>
      <div class="scoreboard-avatar">${getAvatarEmoji(player.avatar)}</div>
      <div class="scoreboard-info">
        <div class="scoreboard-name">${player.name}${player.id === myPlayerId ? ' (You)' : ''}</div>
      </div>
      <div class="scoreboard-score">${player.score} pts</div>
    `;
    scoreboardList.appendChild(item);
  });
  if (quitGameBtn) {
    quitGameBtn.style.display = 'none';
  }
  scoreboardOverlay.classList.add('active');
}
function hideScoreboard() {
  scoreboardOverlay.classList.remove('active');
}
function showPodium(players, myPlayerId, myRank) {
  podiumContainer.innerHTML = '';
  const top3 = players.slice(0, 3);
  const podiumOrder = [
    top3[1],
    top3[0],
    top3[2]
  ].filter(p => p);
  podiumOrder.forEach((player, index) => {
    if (!player) return;
    const place = document.createElement('div');
    place.className = 'podium-place';
    const actualRank = players.indexOf(player) + 1;
    place.innerHTML = `
      <div class="podium-avatar">${getAvatarEmoji(player.avatar)}</div>
      <div class="podium-name">${player.name}</div>
      <div class="podium-score">${player.score} pts</div>
      <div class="podium-stand">${actualRank}</div>
    `;
    podiumContainer.appendChild(place);
    setTimeout(() => {
      place.classList.add('revealed');
    }, index * 600);
  });
  if (myRank > 3) {
    yourPosition.textContent = `You finished in ${myRank}${getOrdinalSuffix(myRank)} place!`;
  } else {
    yourPosition.textContent = '';
  }
  podiumOverlay.classList.add('active');
}
function getOrdinalSuffix(num) {
  const j = num % 10;
  const k = num % 100;
  if (j === 1 && k !== 11) return 'st';
  if (j === 2 && k !== 12) return 'nd';
  if (j === 3 && k !== 13) return 'rd';
  return 'th';
}
function animateTimer() {
  if (!lastServerTime || !lastServerTimestamp || !timeValue) {
    return;
  }
  const now = Date.now();
  const elapsedMs = now - lastServerTimestamp;
  const elapsedSeconds = elapsedMs / 1000;
  const currentTime = Math.max(0, lastServerTime - elapsedSeconds);
  timeValue.textContent = Math.ceil(currentTime);
  if (answerFeedback.classList.contains('active') && feedbackTimeLeft) {
    feedbackTimeLeft.textContent = `${Math.ceil(currentTime)}s remaining`;
  }
  const pct = currentTime / currentDuration;
  timeValue.classList.remove('warning', 'danger');
  if (pct > 0.5) {
  } else if (pct > 0.25) {
    timeValue.classList.add('warning');
  } else {
    timeValue.classList.add('danger');
  }
  if (currentTime > 0) {
    timerAnimationFrame = requestAnimationFrame(animateTimer);
  }
}
function startTimerAnimation(serverTime, duration) {
  const timeDiff = lastServerTime ? Math.abs(lastServerTime - serverTime) : Infinity;
  if (timeDiff < 0.5 && timerAnimationFrame) {
    return;
  }
  if (timerAnimationFrame) {
    cancelAnimationFrame(timerAnimationFrame);
  }
  lastServerTime = serverTime;
  lastServerTimestamp = Date.now();
  currentDuration = duration;
  timerAnimationFrame = requestAnimationFrame(animateTimer);
}
function stopTimerAnimation() {
  if (timerAnimationFrame) {
    cancelAnimationFrame(timerAnimationFrame);
    timerAnimationFrame = null;
  }
}
const savedPlayerId = localStorage.getItem("quiz_player_id");
const savedPin = localStorage.getItem("quiz_pin");
const savedAvatar = localStorage.getItem("quiz_avatar");
if (savedPlayerId && savedPin) {
  playerId = savedPlayerId;
  currentPin = savedPin;
  selectedAvatar = savedAvatar;
  pinInput.value = savedPin;
  statusEl.textContent = "Reconnected to game " + savedPin;
  if (joinSection) joinSection.classList.add("hidden");
  if (waitingOverlay) waitingOverlay.classList.remove("hidden");
  if (pollInterval) clearInterval(pollInterval);
  pollInterval = setInterval(pollStudentState, 1000);
  if (quitBtn) quitBtn.disabled = false;
} else {
  if (quitBtn) quitBtn.disabled = true;
}
function ajaxPost(url, data) {
  return fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then((res) => res.json());
}
function ajaxGet(url) {
  return fetch(url).then((res) => res.json());
}
joinBtn.addEventListener("click", () => {
  const name = nameInput.value.trim();
  const pin = pinInput.value.trim();
  if (!name || !pin) {
    alert("Please enter your name and PIN");
    return;
  }
  if (playerId && currentPin === pin) {
    statusEl.textContent = "You are already in this game.";
    if (joinSection) joinSection.classList.add("hidden");
    if (waitingOverlay) waitingOverlay.classList.remove("hidden");
    if (!pollInterval) {
      pollInterval = setInterval(pollStudentState, 1000);
    }
    return;
  }
  pendingName = name;
  pendingPin = pin;
  avatarOverlay.classList.add("active");
});
avatarOptions.forEach(option => {
  option.addEventListener("click", () => {
    const avatar = option.getAttribute("data-avatar");
    selectedAvatar = avatar;
    joinGameWithAvatar();
  });
});
avatarBackBtn.addEventListener("click", () => {
  avatarOverlay.classList.remove("active");
  selectedAvatar = null;
});
function joinGameWithAvatar() {
  if (!pendingName || !pendingPin || !selectedAvatar) {
    return;
  }
  joinBtn.disabled = true;
  ajaxPost("/api/student_join", {
    pin: pendingPin,
    name: pendingName,
    avatar: selectedAvatar
  })
    .then((res) => {
      if (!res.ok) {
        statusEl.textContent = res.error || "Join failed";
        joinBtn.disabled = false;
        avatarOverlay.classList.remove("active");
        return;
      }
      currentPin = pendingPin;
      playerId = res.player_id;
      localStorage.setItem("quiz_player_id", playerId);
      localStorage.setItem("quiz_pin", pendingPin);
      localStorage.setItem("quiz_avatar", selectedAvatar);
      statusEl.textContent = "Joined game " + currentPin;
      avatarOverlay.classList.remove("active");
      if (joinSection) joinSection.classList.add("hidden");
      nameInput.disabled = true;
      pinInput.disabled = true;
      if (waitingOverlay) waitingOverlay.classList.remove("hidden");
      if (quitBtn) quitBtn.disabled = false;
      if (pollInterval) clearInterval(pollInterval);
      pollInterval = setInterval(pollStudentState, 1000);
    })
    .catch((err) => {
      console.error(err);
      statusEl.textContent = "Request failed";
      joinBtn.disabled = false;
      avatarOverlay.classList.remove("active");
    });
}
if (quitBtn) {
  quitBtn.addEventListener("click", () => {
    console.log("Quit button clicked!");
    console.log("currentPin:", currentPin, "playerId:", playerId);
    if (!currentPin || !playerId) {
      alert("You are not in a game.");
      return;
    }
    confirmQuitModal.classList.remove("hidden");
  });
}
function quitGameCleanup() {
  localStorage.removeItem("quiz_player_id");
  localStorage.removeItem("quiz_pin");
  localStorage.removeItem("quiz_avatar");
  if (pollInterval) {
    clearInterval(pollInterval);
    pollInterval = null;
  }
  playerId = null;
  currentPin = null;
  nameInput.disabled = false;
  pinInput.disabled = false;
  joinBtn.disabled = false;
  nameInput.value = "";
  pinInput.value = "";
  if (quitBtn) quitBtn.disabled = true;
  questionZone.style.display = "none";
  answersDiv.innerHTML = "";
  scoreDisplay.style.display = "none";
  if (resultMessage) {
    resultMessage.textContent = "";
    resultMessage.style.display = "none";
  }
  if (timeValue) timeValue.textContent = "20";
  if (timeIndicator) timeIndicator.style.display = "none";
  if (answersIndicator) answersIndicator.style.display = "none";
  if (waitingOverlay) waitingOverlay.classList.add("hidden");
  if (joinSection) joinSection.classList.remove("hidden");
  statusEl.style.color = "";
  statusEl.style.fontWeight = "";
  statusEl.textContent = "You left the game.";
}
confirmQuitYes.addEventListener("click", () => {
  confirmQuitModal.classList.add("hidden");
  ajaxPost("/api/quit_game", { pin: currentPin, player_id: playerId })
    .then(() => {
      quitGameCleanup();
    })
    .catch((err) => {
      console.log("Server unreachable, quitting locally");
      quitGameCleanup();
    });
});
confirmQuitNo.addEventListener("click", () => {
  confirmQuitModal.classList.add("hidden");
});
confirmQuitModal.addEventListener("click", (e) => {
  if (e.target === confirmQuitModal) confirmQuitModal.classList.add("hidden");
});
if (quitGameBtn) {
  quitGameBtn.addEventListener("click", () => {
    ajaxPost("/api/quit_game", { pin: currentPin, player_id: playerId })
      .then(() => {
        quitGameCleanup();
        hideScoreboard();
      })
      .catch((err) => {
        console.log("Server unreachable, quitting locally");
        quitGameCleanup();
        hideScoreboard();
      });
  });
}
function renderAnswers(answers, alreadyAnswered) {
  answersDiv.innerHTML = "";
  const isTrueFalse = answers.length === 2;
  if (isTrueFalse) {
    answers.forEach((ans, idx) => {
      const btn = document.createElement("button");
      btn.className = "answer-option truefalse-option";
      if (ans.toLowerCase() === "true") {
        btn.classList.add("true-option");
      } else if (ans.toLowerCase() === "false") {
        btn.classList.add("false-option");
      }
      const textSpan = document.createElement("span");
      textSpan.className = "answer-text";
      textSpan.textContent = ans;
      textSpan.style.fontSize = "1.5rem";
      textSpan.style.fontWeight = "bold";
      btn.appendChild(textSpan);
      if (alreadyAnswered) {
        btn.disabled = true;
      }
      btn.addEventListener("click", () => {
        sendAnswer(idx);
      });
      answersDiv.appendChild(btn);
    });
  } else {
    const symbols = ['▲', '◆', '●', '■'];
    answers.forEach((ans, idx) => {
      const btn = document.createElement("button");
      btn.className = "answer-option";
      const symbolSpan = document.createElement("span");
      symbolSpan.className = "answer-symbol";
      symbolSpan.textContent = symbols[idx];
      const textSpan = document.createElement("span");
      textSpan.className = "answer-text";
      textSpan.textContent = ans;
      btn.appendChild(symbolSpan);
      btn.appendChild(textSpan);
      if (alreadyAnswered) {
        btn.disabled = true;
      }
      btn.addEventListener("click", () => {
        sendAnswer(idx);
      });
      answersDiv.appendChild(btn);
    });
  }
}
function sendAnswer(answerIndex) {
  if (!currentPin || !playerId) return;

  // Immediate visual feedback: disable buttons right away
  const buttons = Array.from(answersDiv.children);
  buttons.forEach((b) => {
    b.disabled = true;
    if (buttons.indexOf(b) === answerIndex) {
      b.style.opacity = "1"; // Keep selected one fully visible
      b.style.transform = "scale(0.98)";
    } else {
      b.style.opacity = "0.5"; // Dim others
    }
  });

  ajaxPost("/api/submit_answer", {
    pin: currentPin,
    player_id: playerId,
    choice_index: answerIndex,
  }).then((res) => {
    if (!res.ok) {
      alert(res.error || "Error sending answer");
      // Re-enable if error
      buttons.forEach((b) => {
        b.disabled = false;
        b.style.opacity = "";
        b.style.transform = "";
      });
      return;
    }
    // Success happens, feedback will be shown
    questionZone.style.display = "none";
    if (timeIndicator) timeIndicator.style.display = "none";
    if (answersIndicator) answersIndicator.style.display = "none";
    showAnswerFeedback(res.is_correct, res.points, res.answer_time);
  }).catch(() => {
    // Re-enable if network fail
    buttons.forEach((b) => {
      b.disabled = false;
      b.style.opacity = "";
      b.style.transform = "";
    });
  });
}
function pollStudentState() {
  if (!currentPin || !playerId) return;
  ajaxGet(
    `/api/student_state?pin=${encodeURIComponent(
      currentPin
    )}&player_id=${encodeURIComponent(playerId)}`
  )
    .then((res) => {
      if (!res.ok) {
        statusEl.textContent = res.error || "Error";
        if (res.error && (res.error.includes("not found") || res.error.includes("Player not found"))) {
          console.log("Disconnected from game, clearing saved data");
          localStorage.removeItem("quiz_player_id");
          localStorage.removeItem("quiz_pin");
          localStorage.removeItem("quiz_avatar");
          if (pollInterval) {
            clearInterval(pollInterval);
            pollInterval = null;
          }
          playerId = null;
          currentPin = null;
          if (joinSection) joinSection.classList.remove("hidden");
          if (waitingOverlay) waitingOverlay.classList.add("hidden");
          questionZone.style.display = "none";
          if (timeIndicator) timeIndicator.style.display = "none";
          if (answersIndicator) answersIndicator.style.display = "none";
          scoreDisplay.style.display = "none";
          nameInput.disabled = false;
          pinInput.disabled = false;
          joinBtn.disabled = false;
          nameInput.value = "";
          pinInput.value = "";
          statusEl.style.color = "#f87171";
          statusEl.style.fontWeight = "600";
          if (res.error.includes("Player not found")) {
            statusEl.textContent = "❌ You were removed from the game. Please join again if you'd like to play.";
          } else {
            statusEl.textContent = "❌ The game has ended or a new game was started. Please join the new game.";
          }
        }
        return;
      }
      if (waitingOverlay) {
        if (res.phase === "lobby") {
          waitingOverlay.classList.remove("hidden");
          questionZone.style.display = "none";
          if (timeIndicator) timeIndicator.style.display = "none";
          if (answersIndicator) answersIndicator.style.display = "none";
          scoreDisplay.style.display = "none";
          if (quitGameBtn && scoreboardOverlay.classList.contains('active')) {
            quitGameBtn.style.display = 'inline-flex';
          }
        } else {
          waitingOverlay.classList.add("hidden");
        }
      }
      if (res.phase === "question" || res.phase === "results") {
        scoreDisplay.textContent = "Score: " + res.score + " pts";
        scoreDisplay.style.display = "block";
      }
      if (answersCount && res.questions_answered !== undefined) {
        answersCount.textContent = res.questions_answered;
      }
      if (res.phase === "question" && !res.already_answered && resultMessage) {
        resultMessage.textContent = "";
        resultMessage.style.display = "none";
        hideAnswerFeedback();
        hideScoreboard();
      }
      if (res.question && res.phase === "question") {
        if (!res.already_answered) {
          questionZone.style.display = "block";

          // Only re-render if question text changed or specific scenarios
          const questionChanged = qText.textContent !== res.question.text;
          const answersEmpty = answersDiv.children.length === 0;

          if (questionChanged || answersEmpty) {
            qText.textContent = res.question.text;
            const questionImage = document.getElementById("questionImage");
            if (res.question.image) {
              questionImage.src = res.question.image;
              questionImage.style.display = "block";
            } else {
              questionImage.style.display = "none";
            }
            renderAnswers(res.question.answers, res.already_answered);
          }

          if (timeIndicator) timeIndicator.style.display = "flex";
          if (answersIndicator) answersIndicator.style.display = "flex";
        }
      } else if (!res.question) {
        questionZone.style.display = "none";
      }
      if (res.phase === "results") {
        if (!answerFeedback.dataset.resultsShown) {
          answerFeedback.dataset.resultsShown = "true";
          revealAnswerResult();
          setTimeout(() => {
            hideAnswerFeedback();
            ajaxGet(`/api/get_scoreboard?pin=${encodeURIComponent(currentPin)}`)
              .then((scoreRes) => {
                if (scoreRes.ok) {
                  showScoreboard(scoreRes.players, playerId);
                  setTimeout(() => {
                    if (quitGameBtn && scoreboardOverlay.classList.contains('active')) {
                      quitGameBtn.style.display = 'inline-flex';
                    }
                  }, 3000);
                }
              })
              .catch(err => console.error("Failed to fetch scoreboard:", err));
          }, 2000);
        }
      } else {
        answerFeedback.dataset.resultsShown = "";
      }
      if (
        res.time_left !== null &&
        res.time_left !== undefined &&
        timeValue
      ) {
        const t = res.time_left;
        const duration = res.duration || 20;
        startTimerAnimation(t, duration);
      }
    })
    .catch((err) => {
      console.log("Connection error, will retry on next poll");
    });
}
window.addEventListener("beforeunload", (e) => {
  if (currentPin && playerId) {
    const message = "You will lose your progress and be removed from the game. Are you sure?";
    e.preventDefault();
    e.returnValue = message;
    const data = JSON.stringify({
      pin: currentPin,
      player_id: playerId
    });
    navigator.sendBeacon("/api/quit_game", data);
    localStorage.removeItem("quiz_player_id");
    localStorage.removeItem("quiz_pin");
    localStorage.removeItem("quiz_avatar");
    return message;
  }
});