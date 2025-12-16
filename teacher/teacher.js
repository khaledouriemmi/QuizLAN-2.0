let currentPin = null;
let pollInterval = null;
let quizSets = {};
let activeQuizId = null;
let activeSlideIndex = 0;
let lastServerTime = null;
let lastServerTimestamp = null;
let currentDuration = 20;
let timerAnimationFrame = null;
let quizFinishing = false;
let quizHistory = [];
let selectedQuizzes = new Set();
const quizSelectionScreen = document.getElementById("quizSelectionScreen");
const gameLobbyScreen = document.getElementById("gameLobbyScreen");
const selectionQuizGrid = document.getElementById("selectionQuizGrid");
const selectionNewQuizBtn = document.getElementById("selectionNewQuizBtn");
const selectionImportBtn = document.getElementById("selectionImportBtn");
const viewHistoryBtn = document.getElementById("viewHistoryBtn");
const historyModal = document.getElementById("historyModal");
const historyList = document.getElementById("historyList");
const closeHistoryBtn = document.getElementById("closeHistoryBtn");
const bulkActionsBar = document.getElementById("bulkActionsBar");
const selectedCount = document.getElementById("selectedCount");
const selectedPlural = document.getElementById("selectedPlural");
const selectAllBtn = document.getElementById("selectAllBtn");
const exportSelectedBtn = document.getElementById("exportSelectedBtn");
const deleteSelectedBtn = document.getElementById("deleteSelectedBtn");
const clearSelectionBtn = document.getElementById("clearSelectionBtn");
const quizSearchInput = document.getElementById("quizSearchInput");
const clearSearchBtn = document.getElementById("clearSearchBtn");
const searchSuggestions = document.getElementById("searchSuggestions");
const selectionSearchContainer = document.getElementById("selectionSearchContainer");
const pinCodeEl = document.getElementById("pinCode");
const pinCodeWrapper = document.getElementById("pinCodeWrapper");
const pinTooltip = document.getElementById("pinTooltip");
const qrImage = document.getElementById("qrImage");
const playersCountEl = document.getElementById("playersCount");
const lastAvatarsEl = document.getElementById("lastAvatars");
const playersGrid = document.getElementById("playersGrid");
const generateBtn = document.getElementById("generateBtn");
const startQuestionBtn = document.getElementById("startQuestionBtn");
const sendQuestionBtn = document.getElementById("sendQuestionBtn");
const endQuestionBtn = document.getElementById("endQuestionBtn");
const openPlayersBtn = document.getElementById("openPlayersBtn");
const backToSelectionBtn = document.getElementById("backToSelectionBtn");
const importFileInput = document.getElementById("importFile");
const currentQuizTitleEl = document.getElementById("currentQuizTitle");
const currentSlideInfoEl = document.getElementById("currentSlideInfo");
const prevSlideBtn = document.getElementById("prevSlideBtn");
const nextSlideBtn = document.getElementById("nextSlideBtn");
const playersModal = document.getElementById("playersModal");
const playersModalGrid = document.getElementById("playersModalGrid");
const closePlayersBtn = document.getElementById("closePlayersBtn");
const teacherQuestionView = document.getElementById("teacherQuestionView");
const teacherQText = document.getElementById("teacherQText");
const teacherQuestionImage = document.getElementById("teacherQuestionImage");
const teacherAnswers = document.getElementById("teacherAnswers");
const answeredCount = document.getElementById("answeredCount");
const totalPlayers = document.getElementById("totalPlayers");
const teacherTimeLeft = document.getElementById("teacherTimeLeft");
const teacherScoreboard = document.getElementById("teacherScoreboard");
const teacherScoreboardList = document.getElementById("teacherScoreboardList");
const nextQuestionBtn = document.getElementById("nextQuestionBtn");
const currentQuestionNum = document.getElementById("currentQuestionNum");
const totalQuestions = document.getElementById("totalQuestions");
const skipToResultsBtn = document.getElementById("skipToResultsBtn");
const confirmGenerateModal = document.getElementById("confirmGenerateModal");
const confirmGenerateYes = document.getElementById("confirmGenerateYes");
const confirmGenerateNo = document.getElementById("confirmGenerateNo");
const confirmDeleteQuizModal = document.getElementById("confirmDeleteQuizModal");
const confirmDeleteYes = document.getElementById("confirmDeleteYes");
const confirmDeleteNo = document.getElementById("confirmDeleteNo");
const deleteQuizName = document.getElementById("deleteQuizName");
let quizToDelete = null;
const confirmCloseEditorModal = document.getElementById("confirmCloseEditorModal");
const confirmCloseSave = document.getElementById("confirmCloseSave");
const confirmCloseDiscard = document.getElementById("confirmCloseDiscard");
const confirmCloseCancel = document.getElementById("confirmCloseCancel");
const quizEditorModal = document.getElementById("quizEditorModal");
const quizEditorTitle = document.getElementById("quizEditorTitle");
const qeCloseSlides = document.getElementById("qeCloseSlides");
const tabQuizInfo = document.getElementById("tabQuizInfo");
const tabSlides = document.getElementById("tabSlides");
const quizInfoSection = document.getElementById("quizInfoSection");
const slidesSection = document.getElementById("slidesSection");
const qeTitle = document.getElementById("qeTitle");
const qeImageUploadBtn = document.getElementById("qeImageUploadBtn");
const qeImageFile = document.getElementById("qeImageFile");
const qeImageUrl = document.getElementById("qeImageUrl");
const qeImagePreview = document.getElementById("qeImagePreview");
const qeToSlidesBtn = document.getElementById("qeToSlidesBtn");
const qeCancelInfo = document.getElementById("qeCancelInfo");
const qePrevSlide = document.getElementById("qePrevSlide");
const qeNextSlide = document.getElementById("qeNextSlide");
const qeAddSlide = document.getElementById("qeAddSlide");
const qeSlideLabel = document.getElementById("qeSlideLabel");
const qeQuestion = document.getElementById("qeQuestion");
const qeTypeNormal = document.getElementById("qeTypeNormal");
const qeTypeTrueFalse = document.getElementById("qeTypeTrueFalse");
const trueFalseCorrectAnswer = document.getElementById("trueFalseCorrectAnswer");
const qeTrueCorrect = document.getElementById("qeTrueCorrect");
const qeFalseCorrect = document.getElementById("qeFalseCorrect");
const qeCorrect = document.getElementById("qeCorrect");
const qeWrong1 = document.getElementById("qeWrong1");
const qeWrong2 = document.getElementById("qeWrong2");
const qeWrong3 = document.getElementById("qeWrong3");
const qeSaveSlide = document.getElementById("qeSaveSlide");
const qeDeleteSlide = document.getElementById("qeDeleteSlide");
const qeSaveQuiz = document.getElementById("qeSaveQuiz");
const qeBackToInfo = document.getElementById("qeBackToInfo");
const qeSlideImageUploadBtn = document.getElementById("qeSlideImageUploadBtn");
const qeSlideImageFile = document.getElementById("qeSlideImageFile");
const qeSlideImageUrl = document.getElementById("qeSlideImageUrl");
const qeSlideImagePreview = document.getElementById("qeSlideImagePreview");
const qeSlideDuration = document.getElementById("qeSlideDuration");
const exportLink = document.getElementById("exportLink");
let editorQuizId = null;
let editorSlideIndex = 0;
let isEditingExistingQuiz = false;
function ajaxGet(url) {
  return fetch(url).then((r) => r.json());
}
const toastContainer = document.getElementById("toastContainer");
function showToast(message, type = "info", title = null) {
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  const icons = {
    success: "✅",
    error: "❌",
    warning: "⚠️",
    info: "ℹ️"
  };
  const titles = {
    success: title || "Success",
    error: title || "Error",
    warning: title || "Warning",
    info: title || "Info"
  };
  toast.innerHTML = `
    <div class="toast-icon">${icons[type]}</div>
    <div class="toast-content">
      <div class="toast-title">${titles[type]}</div>
      <div class="toast-message">${message}</div>
    </div>
    <button class="toast-close">×</button>
  `;
  toastContainer.appendChild(toast);
  const closeBtn = toast.querySelector(".toast-close");
  const remove = () => {
    toast.classList.add("removing");
    setTimeout(() => toast.remove(), 300);
  };
  closeBtn.addEventListener("click", remove);
  setTimeout(remove, 5000);
}
function ajaxPost(url, data) {
  return fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data || {}),
  }).then((r) => r.json());
}
function uid() {
  return "q_" + Math.random().toString(36).slice(2, 10);
}
function loadTeacherState() {
  const savedPin = localStorage.getItem("teacher_pin");
  if (savedPin) currentPin = savedPin;

  const savedQuizzes = localStorage.getItem("quiz_sets_v1");
  if (savedQuizzes) {
    try {
      quizSets = JSON.parse(savedQuizzes) || {};
    } catch {
      quizSets = {};
    }
  }

  const savedHistory = localStorage.getItem("quiz_history");
  if (savedHistory) {
    try {
      quizHistory = JSON.parse(savedHistory) || [];
    } catch {
      quizHistory = [];
    }
  }

  // Load active quiz state
  const savedActiveQuizId = localStorage.getItem("active_quiz_id");
  if (savedActiveQuizId && quizSets[savedActiveQuizId]) {
    activeQuizId = savedActiveQuizId;
  }

  const savedSlideIndex = localStorage.getItem("active_slide_index");
  if (savedSlideIndex) {
    activeSlideIndex = parseInt(savedSlideIndex) || 0;
  }
}

function saveTeacherState() {
  if (currentPin) {
    localStorage.setItem("teacher_pin", currentPin);
  } else {
    localStorage.removeItem("teacher_pin");
  }

  localStorage.setItem("quiz_sets_v1", JSON.stringify(quizSets));
  localStorage.setItem("quiz_history", JSON.stringify(quizHistory));

  // Save active quiz state
  if (activeQuizId) {
    localStorage.setItem("active_quiz_id", activeQuizId);
    localStorage.setItem("active_slide_index", activeSlideIndex.toString());
  } else {
    localStorage.removeItem("active_quiz_id");
    localStorage.removeItem("active_slide_index");
  }
}
function renderSelectionScreen(searchQuery = "") {
  selectionQuizGrid.innerHTML = "";
  const ids = Object.keys(quizSets);
  if (!ids.length) {
    selectionSearchContainer.style.display = "none";
    const empty = document.createElement("div");
    empty.className = "selection-empty";
    empty.innerHTML = `
      <div class="selection-empty-icon">📚</div>
      <h2 class="selection-empty-title">No Quizzes Yet</h2>
      <p class="selection-empty-text">Create your first quiz to get started!</p>
    `;
    selectionQuizGrid.appendChild(empty);
    return;
  }
  selectionSearchContainer.style.display = "block";
  const filteredIds = ids.filter(id => {
    const quiz = quizSets[id];
    const title = (quiz.title || "").toLowerCase();
    const slideCount = quiz.slides.length.toString();
    const query = searchQuery.toLowerCase();
    return title.includes(query) || slideCount.includes(query);
  });
  if (filteredIds.length === 0) {
    const empty = document.createElement("div");
    empty.className = "selection-empty";
    empty.innerHTML = `
      <div class="selection-empty-icon">🔍</div>
      <h2 class="selection-empty-title">No Results Found</h2>
      <p class="selection-empty-text">Try a different search term</p>
    `;
    selectionQuizGrid.appendChild(empty);
    return;
  }
  filteredIds.forEach((id) => {
    const quiz = quizSets[id];
    const card = document.createElement("div");
    card.className = "selection-quiz-card";
    if (selectedQuizzes.has(id)) {
      card.classList.add("selected");
    }
    const checkboxContainer = document.createElement("div");
    checkboxContainer.className = "quiz-checkbox-container";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "quiz-checkbox";
    checkbox.dataset.quizId = id;
    checkbox.checked = selectedQuizzes.has(id);
    checkbox.addEventListener("change", (e) => {
      e.stopPropagation();
      if (checkbox.checked) {
        selectedQuizzes.add(id);
        card.classList.add("selected");
      } else {
        selectedQuizzes.delete(id);
        card.classList.remove("selected");
      }
      updateBulkActionsBar();
    });
    checkboxContainer.appendChild(checkbox);
    card.appendChild(checkboxContainer);
    const image = document.createElement("div");
    image.className = "selection-quiz-image";
    if (quiz.image) {
      image.style.backgroundImage = `url(${quiz.image})`;
    } else {
      image.classList.add("selection-quiz-image-empty");
    }
    const info = document.createElement("div");
    info.className = "selection-quiz-info";
    const title = document.createElement("h3");
    title.className = "selection-quiz-title";
    title.textContent = quiz.title || "Untitled Quiz";
    const meta = document.createElement("p");
    meta.className = "selection-quiz-meta";
    meta.textContent = `${quiz.slides.length} question${quiz.slides.length !== 1 ? 's' : ''}`;
    const hostBtn = document.createElement("button");
    hostBtn.className = "selection-quiz-host-btn";
    hostBtn.textContent = "🎯 Host This Quiz";
    hostBtn.addEventListener("click", () => hostQuiz(id));
    const actions = document.createElement("div");
    actions.className = "selection-quiz-actions";
    const editBtn = document.createElement("button");
    editBtn.className = "selection-quiz-action-btn";
    editBtn.innerHTML = "✏️";
    editBtn.title = "Edit Quiz";
    editBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      openQuizEditor(id, true);
    });
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "selection-quiz-action-btn delete";
    deleteBtn.innerHTML = "🗑️";
    deleteBtn.title = "Delete Quiz";
    deleteBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      quizToDelete = id;
      deleteQuizName.textContent = quiz.title || "Untitled Quiz";
      confirmDeleteQuizModal.classList.remove("hidden");
    });
    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);
    info.appendChild(title);
    info.appendChild(meta);
    info.appendChild(hostBtn);
    card.appendChild(image);
    card.appendChild(actions);
    card.appendChild(info);
    selectionQuizGrid.appendChild(card);
  });
}
function hostQuiz(quizId) {
  activeQuizId = quizId;
  activeSlideIndex = 0;
  quizSelectionScreen.classList.add("hidden");
  gameLobbyScreen.classList.remove("hidden");
  createNewGame();
  setActiveQuiz(quizId, 0);
}
function updateBulkActionsBar() {
  const count = selectedQuizzes.size;
  if (count === 0) {
    bulkActionsBar.classList.add("hidden");
  } else {
    bulkActionsBar.classList.remove("hidden");
    selectedCount.textContent = count;
    selectedPlural.textContent = count === 1 ? "" : "zes";
    const totalQuizzes = Object.keys(quizSets).length;
    if (count === totalQuizzes) {
      selectAllBtn.textContent = "Deselect All";
    } else {
      selectAllBtn.textContent = "Select All";
    }
  }
}
function selectAllQuizzes() {
  const allIds = Object.keys(quizSets);
  const totalQuizzes = allIds.length;
  if (selectedQuizzes.size === totalQuizzes) {
    selectedQuizzes.clear();
  } else {
    allIds.forEach(id => selectedQuizzes.add(id));
  }
  renderSelectionScreen();
  updateBulkActionsBar();
}
function exportSelectedQuizzes() {
  if (selectedQuizzes.size === 0) {
    showToast("No quizzes selected", "warning");
    return;
  }
  const quizzesToExport = {};
  selectedQuizzes.forEach(id => {
    if (quizSets[id]) {
      quizzesToExport[id] = quizSets[id];
    }
  });
  const dataStr = JSON.stringify(quizzesToExport, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
  a.download = `quizzes_${timestamp}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast(`Exported ${selectedQuizzes.size} quiz${selectedQuizzes.size > 1 ? 'zes' : ''}`, "success");
}
function deleteSelectedQuizzes() {
  if (selectedQuizzes.size === 0) {
    showToast("No quizzes selected", "warning");
    return;
  }
  const count = selectedQuizzes.size;
  const quizNames = Array.from(selectedQuizzes).map(id => quizSets[id]?.title || "Untitled").slice(0, 3);
  let message = `Delete ${count} quiz${count > 1 ? 'zes' : ''}?\n\n`;
  message += quizNames.join('\n');
  if (count > 3) {
    message += `\n...and ${count - 3} more`;
  }
  if (!confirm(message)) return;
  selectedQuizzes.forEach(id => {
    delete quizSets[id];
    if (activeQuizId === id) {
      activeQuizId = null;
      activeSlideIndex = 0;
    }
  });
  selectedQuizzes.clear();
  saveTeacherState();
  renderSelectionScreen();
  updateBulkActionsBar();
  showToast(`Deleted ${count} quiz${count > 1 ? 'zes' : ''}`, "success");
}
function clearSelection() {
  selectedQuizzes.clear();
  renderSelectionScreen();
  updateBulkActionsBar();
}
function backToSelection() {
  if (pollInterval) {
    clearInterval(pollInterval);
    pollInterval = null;
  }
  currentPin = null;
  localStorage.removeItem("teacher_pin");

  // Show selection screen, hide lobby
  quizSelectionScreen.classList.remove("hidden");
  gameLobbyScreen.classList.add("hidden");

  // Reset UI elements
  pinCodeEl.textContent = "------";
  qrImage.style.visibility = "hidden";
  playersGrid.innerHTML = "";
  playersCountEl.textContent = "0";

  // IMPORTANT: Render the quiz selection screen to show quizzes
  renderSelectionScreen();
}
function updateQr() {
  if (!currentPin) {
    qrImage.src = "";
    qrImage.style.visibility = "hidden";
    return;
  }
  const origin = window.location.origin;
  const link = `${origin}/student?pin=${encodeURIComponent(currentPin)}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(link)}`;
  qrImage.src = qrUrl;
  qrImage.style.visibility = "visible";
}
function setPin(pin) {
  currentPin = pin;
  pinCodeEl.textContent = pin || "------";
  updateQr();
  saveTeacherState();
  if (pollInterval) clearInterval(pollInterval);
  if (pin) {
    pollInterval = setInterval(pollTeacherState, 1000);
  }
}
function generatePin() {
  if (currentPin) {
    confirmGenerateModal.classList.remove("hidden");
    return;
  }
  createNewGame();
}
function createNewGame() {
  const oldPin = currentPin;
  ajaxPost("/api/create_game", { old_pin: oldPin })
    .then((res) => {
      if (!res.ok) {
        showToast(res.error || "Failed to create game", "error");
        return;
      }
      setPin(res.pin);
    })
    .catch((err) => {
      console.error(err);
      showToast("Connection failed. Please check your network.", "error");
    });
}
function copyPinToClipboard() {
  // Check if PIN exists
  if (!currentPin) {
    console.warn("No PIN available to copy");
    return;
  }

  // Method 1: Try modern Clipboard API
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(currentPin)
      .then(() => {
        showCopySuccess();
      })
      .catch((err) => {
        console.warn("Clipboard API failed, trying fallback:", err);
        fallbackCopyToClipboard();
      });
  } else {
    // Clipboard API not available
    fallbackCopyToClipboard();
  }
}

function showCopySuccess() {
  // Show visual feedback
  pinCodeEl.textContent = "COPIED!";
  pinCodeEl.style.color = "#22c55e";

  if (pinTooltip) {
    pinTooltip.textContent = "Copied!";
    pinTooltip.classList.add("copied");
  }

  // Restore PIN display after 2 seconds
  setTimeout(() => {
    pinCodeEl.textContent = currentPin;
    pinCodeEl.style.color = "";

    if (pinTooltip) {
      pinTooltip.textContent = "Click to copy to clipboard";
      pinTooltip.classList.remove("copied");
    }
  }, 2000);
}

function fallbackCopyToClipboard() {
  // Create temporary textarea
  const textarea = document.createElement("textarea");
  textarea.value = currentPin;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);

  // Select and copy
  textarea.select();
  textarea.setSelectionRange(0, 99999); // For mobile devices

  try {
    const success = document.execCommand("copy");
    if (success) {
      showCopySuccess();
    } else {
      console.error("Copy command failed");
      alert("Failed to copy. Your PIN is: " + currentPin);
    }
  } catch (err) {
    console.error("Copy failed:", err);
    alert("Failed to copy. Your PIN is: " + currentPin);
  } finally {
    document.body.removeChild(textarea);
  }
}
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
function renderPlayers(players) {
  playersGrid.innerHTML = "";
  playersModalGrid.innerHTML = "";
  players.forEach((p) => {
    const card = document.createElement("div");
    card.className = "player-card";
    card.title = "Click to kick";
    const avatar = document.createElement("div");
    avatar.className = "player-avatar";
    if (p.avatar) {
      avatar.textContent = getAvatarEmoji(p.avatar);
      avatar.style.fontSize = "3rem";
    } else {
      avatar.textContent = p.name.slice(0, 1).toUpperCase();
    }
    const nameEl = document.createElement("div");
    nameEl.className = "player-name";
    nameEl.textContent = p.name;
    const scoreEl = document.createElement("div");
    scoreEl.className = "player-score";
    scoreEl.textContent = `${p.score} pts`;
    card.appendChild(avatar);
    card.appendChild(nameEl);
    card.appendChild(scoreEl);
    card.addEventListener("click", () => {
      const ok = confirm(`Kick ${p.name}?`);
      if (!ok) return;
      ajaxPost("/api/kick_player", { pin: currentPin, player_id: p.id }).then(
        () => { }
      );
    });
    playersGrid.appendChild(card);
    const modalCard = document.createElement("div");
    modalCard.className = "player-card";
    modalCard.title = "Click to kick";
    modalCard.style.cursor = "pointer";
    const modalAvatar = document.createElement("div");
    modalAvatar.className = "player-avatar";
    if (p.avatar) {
      modalAvatar.textContent = getAvatarEmoji(p.avatar);
      modalAvatar.style.fontSize = "2.5rem";
    } else {
      modalAvatar.textContent = p.name.slice(0, 1).toUpperCase();
    }
    const modalNameEl = document.createElement("div");
    modalNameEl.className = "player-name";
    modalNameEl.textContent = p.name;
    const modalScoreEl = document.createElement("div");
    modalScoreEl.className = "player-score";
    modalScoreEl.textContent = `${p.score} pts`;
    modalCard.appendChild(modalAvatar);
    modalCard.appendChild(modalNameEl);
    modalCard.appendChild(modalScoreEl);
    modalCard.addEventListener("click", () => {
      const ok = confirm(`Kick ${p.name}?`);
      if (!ok) return;
      ajaxPost("/api/kick_player", { pin: currentPin, player_id: p.id }).then(
        () => { }
      );
    });
    playersModalGrid.appendChild(modalCard);
  });
}
function renderLastAvatars(lastThree) {
  lastAvatarsEl.innerHTML = "";
  (lastThree || []).forEach((p) => {
    const div = document.createElement("div");
    div.className = "avatar-pill";
    if (p.avatar) {
      const span = document.createElement("span");
      span.textContent = getAvatarEmoji(p.avatar);
      span.style.fontSize = "1.5rem";
      div.appendChild(span);
    } else {
      const span = document.createElement("span");
      span.textContent = p.name.slice(0, 1).toUpperCase();
      div.appendChild(span);
    }
    lastAvatarsEl.appendChild(div);
  });
}
function showTeacherQuestion(question, players) {
  teacherQText.textContent = question.text;
  if (question.image) {
    teacherQuestionImage.src = question.image;
    teacherQuestionImage.style.display = "block";
  } else {
    teacherQuestionImage.style.display = "none";
  }
  if (activeQuizId && quizSets[activeQuizId]) {
    const quiz = quizSets[activeQuizId];
    currentQuestionNum.textContent = activeSlideIndex + 1;
    totalQuestions.textContent = quiz.slides.length;
  }
  teacherAnswers.innerHTML = "";
  const isTrueFalse = question.answers.length === 2;
  const symbols = ['▲', '◆', '●', '■'];
  question.answers.forEach((ans, idx) => {
    const btn = document.createElement("button");
    btn.className = "answer-option";
    btn.disabled = true;
    btn.style.opacity = "0.8";
    btn.style.cursor = "not-allowed";
    if (isTrueFalse) {
      btn.classList.add("truefalse-option");
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
    } else {
      const symbolSpan = document.createElement("span");
      symbolSpan.className = "answer-symbol";
      symbolSpan.textContent = symbols[idx];
      const textSpan = document.createElement("span");
      textSpan.className = "answer-text";
      textSpan.textContent = ans;
      btn.appendChild(symbolSpan);
      btn.appendChild(textSpan);
    }
    teacherAnswers.appendChild(btn);
  });
  totalPlayers.textContent = players.length;
  teacherQuestionView.classList.add("active");
}
function hideTeacherQuestion() {
  teacherQuestionView.classList.remove("active");
}
function showTeacherScoreboard(players) {
  teacherScoreboardList.innerHTML = "";
  players.forEach((player, index) => {
    const item = document.createElement("div");
    item.className = "scoreboard-item";
    if (index === 0) item.classList.add("top-1");
    else if (index === 1) item.classList.add("top-2");
    else if (index === 2) item.classList.add("top-3");
    item.style.animationDelay = `${index * 0.1} s`;
    item.innerHTML = `
      <div class="scoreboard-rank">${index + 1}</div>
      <div class="scoreboard-avatar">${getAvatarEmoji(player.avatar)}</div>
      <div class="scoreboard-info">
        <div class="scoreboard-name">${player.name}</div>
      </div>
      <div class="scoreboard-score">${player.score} pts</div>
  `;
    teacherScoreboardList.appendChild(item);
  });
  if (activeQuizId && quizSets[activeQuizId]) {
    const quiz = quizSets[activeQuizId];
    if (activeSlideIndex + 1 >= quiz.slides.length) {
      nextQuestionBtn.textContent = "Finish Quiz 🏁";
    } else {
      nextQuestionBtn.textContent = "Next Question →";
    }
  }
  teacherScoreboard.classList.add("active");
}
function hideTeacherScoreboard() {
  teacherScoreboard.classList.remove("active");
}
function renderHistoryList() {
  historyList.innerHTML = "";
  if (quizHistory.length === 0) {
    historyList.innerHTML = "<p class='muted' style='text-align: center; padding: 40px;'>No quiz history yet. Complete a quiz to see it here!</p>";
    return;
  }
  quizHistory.forEach(entry => {
    const date = new Date(entry.date);
    const dateStr = date.toLocaleDateString() + " at " + date.toLocaleTimeString();
    const item = document.createElement("div");
    item.className = "history-item";
    item.innerHTML = `
      <div class="history-info">
        <div class="history-title">${entry.quizTitle}</div>
        <div class="history-meta">
          <span>📅 ${dateStr}</span>
          <span>👥 ${entry.participants} participant${entry.participants !== 1 ? 's' : ''}</span>
        </div>
      </div>
      <button class="btn secondary view-results-btn" data-id="${entry.id}">
        View Results
      </button>
    `;
    historyList.appendChild(item);
  });
  document.querySelectorAll(".view-results-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      showHistoryScoreboard(id);
    });
  });
}
function showHistoryScoreboard(historyId) {
  const entry = quizHistory.find(h => h.id === historyId);
  if (!entry) return;
  showTeacherScoreboard(entry.scoreboard);
  if (nextQuestionBtn) {
    nextQuestionBtn.style.display = "none";
  }
  const existingCloseBtn = document.getElementById("historyScoreboardClose");
  if (!existingCloseBtn) {
    const closeBtn = document.createElement("button");
    closeBtn.id = "historyScoreboardClose";
    closeBtn.className = "btn primary";
    closeBtn.textContent = "Close";
    closeBtn.style.cssText = "font-size: 1.2rem; padding: 16px 32px; margin-top: 16px;";
    closeBtn.addEventListener("click", () => {
      hideTeacherScoreboard();
      closeBtn.remove();
      if (nextQuestionBtn) {
        nextQuestionBtn.style.display = "";
      }
    });
    teacherScoreboard.appendChild(closeBtn);
  }
  historyModal.classList.add("hidden");
}
function animateTeacherTimer() {
  if (!lastServerTime || !lastServerTimestamp || !teacherTimeLeft) {
    return;
  }
  const now = Date.now();
  const elapsedMs = now - lastServerTimestamp;
  const elapsedSeconds = elapsedMs / 1000;
  const currentTime = Math.max(0, lastServerTime - elapsedSeconds);
  teacherTimeLeft.textContent = Math.ceil(currentTime);
  if (currentTime > 0) {
    timerAnimationFrame = requestAnimationFrame(animateTeacherTimer);
  }
}
function startTeacherTimerAnimation(timeLeft, duration) {
  lastServerTime = timeLeft;
  lastServerTimestamp = Date.now();
  currentDuration = duration;
  if (timerAnimationFrame) {
    cancelAnimationFrame(timerAnimationFrame);
  }
  animateTeacherTimer();
}
let currentPhase = "lobby"; // Track phase efficiently
function pollTeacherState() {
  if (!currentPin) return;
  ajaxGet(`/api/teacher_state?pin=${encodeURIComponent(currentPin)}`)
    .then((res) => {
      if (!res.ok) {
        console.warn(res.error || "Game not found");
        if (res.error && res.error.includes("not found")) {
          console.log("Clearing invalid saved PIN");
          currentPin = null;
          localStorage.removeItem("teacher_pin");
          pinCodeEl.textContent = "------";
          qrImage.style.visibility = "hidden";
          if (pollInterval) {
            clearInterval(pollInterval);
            pollInterval = null;
          }
        }
        playersGrid.innerHTML = "";
        playersModalGrid.innerHTML = "";
        playersCountEl.textContent = "0";
        return;
      }
      playersCountEl.textContent = res.players.length.toString();
      renderPlayers(res.players);
      renderLastAvatars(res.last_three);
      currentPhase = res.phase; // Update local phase tracker
      if (res.phase === "lobby") {
        quizFinishing = false;
        startQuestionBtn.disabled = false;
        startQuestionBtn.textContent = "Start Question";
        endQuestionBtn.disabled = true;
        hideTeacherQuestion();
        hideTeacherScoreboard();
      } else if (res.phase === "question") {
        startQuestionBtn.disabled = true;
        endQuestionBtn.disabled = false;
        hideTeacherScoreboard();
        if (res.question) {
          showTeacherQuestion(res.question, res.players);
          answeredCount.textContent = res.answered_count || 0;
          if (res.time_left !== null && res.time_left !== undefined) {
            startTeacherTimerAnimation(res.time_left, res.duration || 20);
          }
        }
      } else if (res.phase === "results") {
        // Fix: Allow moving to next question
        const quiz = quizSets[activeQuizId];
        const isLastSlide = !quiz || activeSlideIndex >= quiz.slides.length - 1;

        startQuestionBtn.disabled = isLastSlide;
        startQuestionBtn.textContent = isLastSlide ? "Quiz Finished" : "Next Question";
        endQuestionBtn.disabled = true;

        hideTeacherQuestion();
        if (!teacherScoreboard.classList.contains('active') && !quizFinishing) {
          ajaxGet(`/api/get_scoreboard?pin=${encodeURIComponent(currentPin)}`)
            .then((scoreRes) => {
              if (scoreRes.ok) {
                showTeacherScoreboard(scoreRes.players);
              }
            })
            .catch(err => console.error("Failed to fetch scoreboard:", err));
        }
      }
    })
    .catch((err) => console.error(err));
}
function renderQuizList() {
}
function setActiveQuiz(id, slideIndex) {
  activeQuizId = id;
  activeSlideIndex = slideIndex || 0;
  const quiz = quizSets[activeQuizId];
  if (!quiz || !quiz.slides.length) {
    currentQuizTitleEl.textContent = "None";
    currentSlideInfoEl.textContent = "";
    prevSlideBtn.disabled = true;
    nextSlideBtn.disabled = true;
    sendQuestionBtn.disabled = true;
  } else {
    currentQuizTitleEl.textContent = quiz.title || "Untitled quiz";
    currentSlideInfoEl.textContent = `Slide ${activeSlideIndex + 1} of ${quiz.slides.length
      } `;
    prevSlideBtn.disabled = activeSlideIndex === 0;
    nextSlideBtn.disabled = activeSlideIndex >= quiz.slides.length - 1;
    sendQuestionBtn.disabled = false;
  }
  renderQuizList();
}
function showQuizMoreMenu(id) {
  const choice = prompt('Type an action:\n- export\n- delete', 'export');
  if (!choice) return;
  const v = choice.toLowerCase().trim();
  if (v === "delete") {
    const ok = confirm("Delete this quiz?");
    if (!ok) return;
    delete quizSets[id];
    if (activeQuizId === id) {
      activeQuizId = null;
      activeSlideIndex = 0;
      currentQuizTitleEl.textContent = "None";
      currentSlideInfoEl.textContent = "";
      sendQuestionBtn.disabled = true;
    }
    saveTeacherState();
    renderQuizList();
  } else if (v === "export") {
    exportQuiz(id);
  }
}
function exportQuiz(id) {
  const quiz = quizSets[id];
  if (!quiz) return;
  const dataStr =
    "data:application/json;charset=utf-8," +
    encodeURIComponent(JSON.stringify(quiz, null, 2));
  exportLink.setAttribute("href", dataStr);
  exportLink.setAttribute(
    "download",
    (quiz.title || "quiz") + ".json"
  );
  exportLink.click();
}
importFileInput.addEventListener("change", () => {
  const file = importFileInput.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      let importedCount = 0;
      if (data.slides && Array.isArray(data.slides)) {
        if (!data.id) data.id = uid();
        quizSets[data.id] = data;
        importedCount = 1;
      } else if (typeof data === 'object' && !Array.isArray(data)) {
        const keys = Object.keys(data);
        let validQuizzes = 0;
        keys.forEach(key => {
          const quiz = data[key];
          if (quiz && quiz.slides && Array.isArray(quiz.slides)) {
            if (!quiz.id) quiz.id = key;
            quizSets[quiz.id] = quiz;
            validQuizzes++;
          }
        });
        if (validQuizzes === 0) {
          throw new Error("No valid quizzes found in file");
        }
        importedCount = validQuizzes;
      } else {
        throw new Error("Invalid file format");
      }
      saveTeacherState();
      renderQuizList();
      renderSelectionScreen();
      if (importedCount === 1) {
        showToast("Quiz imported successfully!", "success");
      } else {
        showToast(`Imported ${importedCount} quizzes successfully!`, "success");
      }
    } catch (err) {
      console.error(err);
      showToast("Invalid JSON file. Please check the file format.", "error");
    }
  };
  reader.readAsText(file);
  importFileInput.value = "";
});
backToSelectionBtn.addEventListener("click", backToSelection);
tabQuizInfo.addEventListener("click", () => setEditorTab("info"));
tabSlides.addEventListener("click", () => setEditorTab("slides"));
function setEditorTab(which) {
  if (which === "info") {
    tabQuizInfo.classList.add("active");
    tabSlides.classList.remove("active");
    quizInfoSection.classList.remove("hidden");
    slidesSection.classList.add("hidden");
  } else {
    tabQuizInfo.classList.remove("active");
    tabSlides.classList.add("active");
    quizInfoSection.classList.add("hidden");
    slidesSection.classList.remove("hidden");
  }
}
tabQuizInfo.addEventListener("click", () => setEditorTab("info"));
tabSlides.addEventListener("click", () => setEditorTab("slides"));
function updateCoverPreview(url) {
  qeImagePreview.innerHTML = "";
  if (url) {
    qeImagePreview.style.backgroundImage = `url(${url})`;
    qeImagePreview.classList.add("has-image");
  } else {
    qeImagePreview.style.backgroundImage = "none";
    qeImagePreview.classList.remove("has-image");
    const span = document.createElement("span");
    span.className = "muted small";
    span.textContent = "No image";
    qeImagePreview.appendChild(span);
  }
}
qeImageUploadBtn.addEventListener("click", () => {
  qeImageFile.click();
});
qeImageFile.addEventListener("change", () => {
  const file = qeImageFile.files[0];
  if (!file) return;
  const form = new FormData();
  form.append("image", file);
  fetch("/api/upload_quiz_image", {
    method: "POST",
    body: form,
  })
    .then((res) => res.json())
    .then((data) => {
      if (!data.ok) {
        showToast(data.error || "Upload failed", "error");
        return;
      }
      qeImageUrl.value = data.url;
      updateCoverPreview(data.url);
      if (editorQuizId && quizSets[editorQuizId]) {
        quizSets[editorQuizId].image = data.url;
        saveTeacherState();
        renderQuizList();
      }
    })
    .catch((err) => {
      console.error(err);
      showToast("Upload failed. Please try again.", "error");
    })
    .finally(() => {
      qeImageFile.value = "";
    });
});
qeSlideImageUploadBtn.addEventListener("click", () => {
  qeSlideImageFile.click();
});
qeSlideImageFile.addEventListener("change", () => {
  const file = qeSlideImageFile.files[0];
  if (!file) return;
  const form = new FormData();
  form.append("image", file);
  fetch("/api/upload_quiz_image", {
    method: "POST",
    body: form,
  })
    .then((res) => res.json())
    .then((data) => {
      if (!data.ok) {
        showToast(data.error || "Upload failed", "error");
        return;
      }
      qeSlideImageUrl.value = data.url;
      qeSlideImagePreview.textContent = "Image uploaded ✓";
      qeSlideImagePreview.style.color = "#22c55e";
      const quiz = quizSets[editorQuizId];
      if (quiz && quiz.slides[editorSlideIndex]) {
        quiz.slides[editorSlideIndex].image = data.url;
        saveTeacherState();
      }
    })
    .catch((err) => {
      console.error(err);
      showToast("Upload failed. Please try again.", "error");
    })
    .finally(() => {
      qeSlideImageFile.value = "";
    });
});
function toggleAnswerInputs(questionType) {
  const answerInputs = [qeCorrect, qeWrong1, qeWrong2, qeWrong3];
  const answerLabels = answerInputs.map(input => input.closest('label'));
  if (questionType === "truefalse") {
    answerLabels.forEach(label => {
      if (label) label.style.display = "none";
    });
    if (trueFalseCorrectAnswer) trueFalseCorrectAnswer.style.display = "block";
  } else {
    answerLabels.forEach(label => {
      if (label) label.style.display = "";
    });
    if (trueFalseCorrectAnswer) trueFalseCorrectAnswer.style.display = "none";
  }
}
function getCurrentQuestionType() {
  if (qeTypeTrueFalse && qeTypeTrueFalse.checked) {
    return "truefalse";
  }
  return "normal";
}
function getTrueFalseCorrectAnswer() {
  if (qeFalseCorrect && qeFalseCorrect.checked) {
    return "False";
  }
  return "True";
}
if (qeTypeNormal) {
  qeTypeNormal.addEventListener("change", () => {
    if (qeTypeNormal.checked) {
      toggleAnswerInputs("normal");
    }
  });
}
if (qeTypeTrueFalse) {
  qeTypeTrueFalse.addEventListener("change", () => {
    if (qeTypeTrueFalse.checked) {
      toggleAnswerInputs("truefalse");
    }
  });
}
function openQuizEditor(id, jumpToSlides) {
  if (id && quizSets[id]) {
    editorQuizId = id;
    isEditingExistingQuiz = true;
  } else {
    editorQuizId = uid();
    isEditingExistingQuiz = false;
    quizSets[editorQuizId] = {
      id: editorQuizId,
      title: "New quiz",
      image: "",
      slides: [
        {
          question: "",
          correct: "",
          wrong: ["", "", ""],
          type: "normal",
          duration: 20,
        },
      ],
    };
  }
  const quiz = quizSets[editorQuizId];
  editorSlideIndex = 0;
  quizEditorTitle.textContent = "Edit quiz";
  qeTitle.value = quiz.title || "";
  qeImageUrl.value = quiz.image || "";
  updateCoverPreview(quiz.image || "");
  loadEditorSlide();
  if (jumpToSlides) {
    setEditorTab("slides");
  } else {
    setEditorTab("info");
  }
  quizEditorModal.classList.remove("hidden");
}
function closeQuizEditor(skipConfirmation = false) {
  const quiz = quizSets[editorQuizId];
  if (quiz) {
    saveEditorSlide();
    const hasContent = quiz.slides.some(slide => {
      return slide.question.trim() ||
        slide.correct.trim() ||
        (slide.wrong[0] && slide.wrong[0].trim()) ||
        (slide.wrong[1] && slide.wrong[1].trim()) ||
        (slide.wrong[2] && slide.wrong[2].trim());
    });
    if (hasContent && !skipConfirmation) {
      if (isEditingExistingQuiz) {
        confirmCloseDiscard.style.display = "none";
      } else {
        confirmCloseDiscard.style.display = "inline-block";
      }
      confirmCloseEditorModal.classList.remove("hidden");
      return;
    }
    if (quiz.slides.length === 1) {
      const slide = quiz.slides[0];
      const isEmpty = !slide.question.trim() &&
        !slide.correct.trim() &&
        (!slide.wrong[0] || !slide.wrong[0].trim()) &&
        (!slide.wrong[1] || !slide.wrong[1].trim()) &&
        (!slide.wrong[2] || !slide.wrong[2].trim());
      if (isEmpty) {
        delete quizSets[editorQuizId];
        saveTeacherState();
        renderSelectionScreen();
        quizEditorModal.classList.add("hidden");
        showToast("Empty quiz discarded.", "info");
        return;
      }
    }
    const newTitle = qeTitle.value.trim() || "Untitled quiz";
    const isDuplicate = Object.keys(quizSets).some(id => {
      if (id === editorQuizId) return false;
      const existingQuiz = quizSets[id];
      return (existingQuiz.title || "").toLowerCase() === newTitle.toLowerCase();
    });
    if (isDuplicate) {
      showToast(`A quiz named "${newTitle}" already exists.Please choose a different name.`, "warning", "Duplicate Name");
      return;
    }
    quiz.title = newTitle;
    quiz.image = qeImageUrl.value.trim();
    saveTeacherState();
    renderSelectionScreen();
  }
  quizEditorModal.classList.add("hidden");
}
qeToSlidesBtn.addEventListener("click", () => {
  const quiz = quizSets[editorQuizId];
  const newTitle = qeTitle.value.trim() || "Untitled quiz";
  const isDuplicate = Object.keys(quizSets).some(id => {
    if (id === editorQuizId) return false;
    const existingQuiz = quizSets[id];
    return (existingQuiz.title || "").toLowerCase() === newTitle.toLowerCase();
  });
  if (isDuplicate) {
    showToast(`A quiz named "${newTitle}" already exists.Please choose a different name.`, "warning", "Duplicate Name");
    return;
  }
  quiz.title = newTitle;
  quiz.image = qeImageUrl.value.trim();
  saveTeacherState();
  const hasFilledSlide = quiz.slides.some(slide => {
    return slide.question.trim() ||
      slide.correct.trim() ||
      (slide.wrong[0] && slide.wrong[0].trim()) ||
      (slide.wrong[1] && slide.wrong[1].trim()) ||
      (slide.wrong[2] && slide.wrong[2].trim());
  });
  if (hasFilledSlide) {
    renderSelectionScreen();
    quizEditorModal.classList.add("hidden");
    showToast("Quiz saved successfully!", "success");
  } else {
    setEditorTab("slides");
  }
});
qeCancelInfo.addEventListener("click", () => {
  if (isEditingExistingQuiz) {
    quizEditorModal.classList.add("hidden");
  } else {
    delete quizSets[editorQuizId];
    saveTeacherState();
    renderSelectionScreen();
    quizEditorModal.classList.add("hidden");
    showToast("Quiz discarded.", "info");
  }
});
let modalMouseDownTarget = null;
quizEditorModal.addEventListener("mousedown", (e) => {
  modalMouseDownTarget = e.target;
});
quizEditorModal.addEventListener("click", (e) => {
  if (e.target === quizEditorModal && modalMouseDownTarget === quizEditorModal) {
    closeQuizEditor();
  }
  modalMouseDownTarget = null;
});
function loadEditorSlide() {
  const quiz = quizSets[editorQuizId];
  if (!quiz.slides.length) {
    quiz.slides.push({
      question: "",
      correct: "",
      wrong: ["", "", ""],
      type: "normal",
      duration: 20,
    });
    editorSlideIndex = 0;
  }
  const slide = quiz.slides[editorSlideIndex];
  qeQuestion.value = slide.question || "";
  const questionType = slide.type || "normal";
  if (questionType === "truefalse") {
    if (qeTypeTrueFalse) qeTypeTrueFalse.checked = true;
  } else {
    if (qeTypeNormal) qeTypeNormal.checked = true;
  }
  toggleAnswerInputs(questionType);
  if (questionType === "truefalse") {
    const correctAnswer = slide.correct || "True";
    if (correctAnswer === "False" && qeFalseCorrect) {
      qeFalseCorrect.checked = true;
    } else if (qeTrueCorrect) {
      qeTrueCorrect.checked = true;
    }
    qeCorrect.value = "";
    qeWrong1.value = "";
    qeWrong2.value = "";
    qeWrong3.value = "";
  } else {
    qeCorrect.value = slide.correct || "";
    qeWrong1.value = slide.wrong[0] || "";
    qeWrong2.value = slide.wrong[1] || "";
    qeWrong3.value = slide.wrong[2] || "";
  }
  qeSlideDuration.value = slide.duration || 20;
  qeSlideImageUrl.value = slide.image || "";
  if (slide.image) {
    qeSlideImagePreview.textContent = "Image uploaded";
  } else {
    qeSlideImagePreview.textContent = "";
  }
  qeSlideLabel.textContent = `Slide ${editorSlideIndex + 1} of ${quiz.slides.length
    } `;
}
function saveEditorSlide() {
  const quiz = quizSets[editorQuizId];
  const slide = quiz.slides[editorSlideIndex];
  slide.question = qeQuestion.value.trim();
  slide.type = getCurrentQuestionType();
  if (slide.type === "truefalse") {
    const correctAnswer = getTrueFalseCorrectAnswer();
    slide.correct = correctAnswer;
    slide.wrong = [correctAnswer === "True" ? "False" : "True"];
  } else {
    slide.correct = qeCorrect.value.trim();
    slide.wrong = [
      qeWrong1.value.trim(),
      qeWrong2.value.trim(),
      qeWrong3.value.trim(),
    ];
  }
  slide.image = qeSlideImageUrl.value.trim();
  const durationValue = parseInt(qeSlideDuration.value);
  slide.duration = (!isNaN(durationValue) && durationValue >= 5) ? durationValue : 20;
}
qePrevSlide.addEventListener("click", () => {
  const quiz = quizSets[editorQuizId];
  if (editorSlideIndex > 0) {
    saveEditorSlide();
    editorSlideIndex -= 1;
    loadEditorSlide();
  }
});
qeNextSlide.addEventListener("click", () => {
  const quiz = quizSets[editorQuizId];
  if (editorSlideIndex < quiz.slides.length - 1) {
    saveEditorSlide();
    editorSlideIndex += 1;
    loadEditorSlide();
  }
});
qeAddSlide.addEventListener("click", () => {
  const quiz = quizSets[editorQuizId];
  saveEditorSlide();
  quiz.slides.push({
    question: "",
    correct: "",
    wrong: ["", "", ""],
    type: "normal",
    duration: 20,
  });
  editorSlideIndex = quiz.slides.length - 1;
  loadEditorSlide();
});
qeSaveSlide.addEventListener("click", () => {
  const question = qeQuestion.value.trim();
  const questionType = getCurrentQuestionType();
  let hasErrors = false;
  if (!question) {
    showToast("Please enter a question before saving.", "warning", "Question Required");
    hasErrors = true;
  }
  if (questionType === "normal") {
    const correct = qeCorrect.value.trim();
    const wrong1 = qeWrong1.value.trim();
    const wrong2 = qeWrong2.value.trim();
    const wrong3 = qeWrong3.value.trim();
    if (!correct) {
      showToast("Please enter the correct answer before saving.", "warning", "Correct Answer Required");
      hasErrors = true;
    }
    if (!wrong1) {
      showToast("Please enter wrong answer 1 before saving.", "warning", "Wrong Answer 1 Required");
      hasErrors = true;
    }
    if (!wrong2) {
      showToast("Please enter wrong answer 2 before saving.", "warning", "Wrong Answer 2 Required");
      hasErrors = true;
    }
    if (!wrong3) {
      showToast("Please enter wrong answer 3 before saving.", "warning", "Wrong Answer 3 Required");
      hasErrors = true;
    }
  }
  if (hasErrors) {
    return;
  }
  saveEditorSlide();
  saveTeacherState();
  showToast("Slide saved successfully!", "success");
});
qeCloseSlides.addEventListener("click", () => {
  closeQuizEditor();
});
qeDeleteSlide.addEventListener("click", () => {
  const quiz = quizSets[editorQuizId];
  if (quiz.slides.length <= 1) {
    showToast("Quiz must have at least one slide.", "warning");
    return;
  }
  const ok = confirm("Delete this slide?");
  if (!ok) return;
  quiz.slides.splice(editorSlideIndex, 1);
  if (editorSlideIndex >= quiz.slides.length) {
    editorSlideIndex = quiz.slides.length - 1;
  }
  loadEditorSlide();
});
function getActiveSlidePayload() {
  if (!activeQuizId) return null;
  const quiz = quizSets[activeQuizId];
  if (!quiz || !quiz.slides.length) return null;
  const slide = quiz.slides[activeSlideIndex];
  const answers = [slide.correct, ...slide.wrong];
  for (let i = answers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [answers[i], answers[j]] = [answers[j], answers[i]];
  }
  const correctIndex = answers.indexOf(slide.correct);
  return {
    text: slide.question,
    answers: answers,
    duration: slide.duration || 20,
    correct_index: correctIndex,
    image: slide.image || "",
  };
}
sendQuestionBtn.addEventListener("click", () => {
  if (!currentPin) {
    showToast("No game PIN yet. Please generate a PIN first.", "warning");
    return;
  }
  const playerCount = parseInt(playersCountEl.textContent) || 0;
  if (playerCount === 0) {
    showToast("No students have joined yet. Wait for at least one student to join.", "warning");
    return;
  }
  if (currentPhase === "results") {
    // Logic to move to next slide automatically
    const quiz = quizSets[activeQuizId];
    if (quiz && activeSlideIndex < quiz.slides.length - 1) {
      activeSlideIndex++;
      setActiveQuiz(activeQuizId, activeSlideIndex);
    }
  }

  const payload = getActiveSlidePayload();
  if (!payload || !payload.text) {
    showToast("Slide has no question or answers.", "warning");
    return;
  }
  ajaxPost("/api/start_question", {
    pin: currentPin,
    question: payload,
  })
    .then((res) => {
      if (!res.ok) {
        showToast(res.error || "Failed to start question", "error");
      } else {
        startQuestionBtn.textContent = "Question Running...";
        startQuestionBtn.disabled = true;
      }
    })
    .catch((err) => console.error(err));
});
startQuestionBtn.addEventListener("click", () => {
  sendQuestionBtn.click();
});
endQuestionBtn.addEventListener("click", () => {
  if (!currentPin) return;
  ajaxPost("/api/end_question", { pin: currentPin })
    .then((res) => {
      if (!res.ok) {
        showToast(res.error || "Failed to end question", "error");
      }
    })
    .catch((err) => console.error(err));
});
nextQuestionBtn.addEventListener("click", () => {
  if (!activeQuizId || !currentPin) return;
  const quiz = quizSets[activeQuizId];
  if (!quiz) return;
  console.log("=== NEXT QUESTION DEBUG ===");
  console.log("Current slide index:", activeSlideIndex);
  console.log("Total slides:", quiz.slides.length);
  console.log("Quiz slides:", quiz.slides);
  console.log("Has more questions?", activeSlideIndex < quiz.slides.length - 1);
  if (activeSlideIndex < quiz.slides.length - 1) {
    activeSlideIndex += 1;
    setActiveQuiz(activeQuizId, activeSlideIndex);
    console.log("Moving to slide:", activeSlideIndex + 1);
    const payload = getActiveSlidePayload();
    console.log("Payload:", payload);
    if (payload && payload.text) {
      ajaxPost("/api/start_question", {
        pin: currentPin,
        question: payload,
      })
        .then((res) => {
          if (!res.ok) {
            showToast(res.error || "Failed to start question", "error");
          }
        })
        .catch((err) => console.error(err));
    } else {
      console.error("No payload or empty question text!");
      showToast(`Slide ${activeSlideIndex + 1} has no question text.Please edit the quiz and add a question.`, "error");
      activeSlideIndex -= 1;
      setActiveQuiz(activeQuizId, activeSlideIndex);
    }
  } else {
    quizFinishing = true;
    hideTeacherScoreboard();
    showToast("Quiz Complete! 🎉", "success");
    ajaxGet(`/api/get_scoreboard?pin=${encodeURIComponent(currentPin)}`)
      .then((scoreRes) => {
        if (scoreRes.ok && scoreRes.players.length > 0) {
          const historyEntry = {
            id: uid(),
            quizId: activeQuizId,
            quizTitle: quizSets[activeQuizId]?.title || "Untitled Quiz",
            date: new Date().toISOString(),
            participants: scoreRes.players.length,
            scoreboard: scoreRes.players
          };
          quizHistory.unshift(historyEntry);
          saveTeacherState();
        }
      })
      .catch(err => console.error("Failed to save quiz history:", err));
    ajaxPost("/api/end_question", { pin: currentPin })
      .then(() => {
        activeSlideIndex = 0;
        setActiveQuiz(activeQuizId, 0);
      })
      .catch((err) => console.error(err));
  }
});
skipToResultsBtn.addEventListener("click", () => {
  if (!currentPin) return;
  ajaxPost("/api/end_question", { pin: currentPin })
    .then((res) => {
      if (!res.ok) {
        showToast(res.error || "Failed to end question", "error");
      }
    })
    .catch((err) => console.error(err));
});
prevSlideBtn.addEventListener("click", () => {
  if (!activeQuizId) return;
  const quiz = quizSets[activeQuizId];
  if (activeSlideIndex > 0) {
    activeSlideIndex -= 1;
    setActiveQuiz(activeQuizId, activeSlideIndex);
  }
});
nextSlideBtn.addEventListener("click", () => {
  if (!activeQuizId) return;
  const quiz = quizSets[activeQuizId];
  if (activeSlideIndex < quiz.slides.length - 1) {
    activeSlideIndex += 1;
    setActiveQuiz(activeQuizId, activeSlideIndex);
  }
});
if (openPlayersBtn) {
  openPlayersBtn.addEventListener("click", () => {
    playersModal.classList.remove("hidden");
  });
}
if (closePlayersBtn) {
  closePlayersBtn.addEventListener("click", () => {
    playersModal.classList.add("hidden");
  });
}
if (playersModal) {
  playersModal.addEventListener("click", (e) => {
    if (e.target === playersModal) playersModal.classList.add("hidden");
  });
}
confirmGenerateYes.addEventListener("click", () => {
  confirmGenerateModal.classList.add("hidden");
  createNewGame();
});
confirmGenerateNo.addEventListener("click", () => {
  confirmGenerateModal.classList.add("hidden");
});
confirmGenerateModal.addEventListener("click", (e) => {
  if (e.target === confirmGenerateModal) confirmGenerateModal.classList.add("hidden");
});
confirmDeleteYes.addEventListener("click", () => {
  if (quizToDelete) {
    delete quizSets[quizToDelete];
    if (activeQuizId === quizToDelete) {
      activeQuizId = null;
      activeSlideIndex = 0;
    }
    saveTeacherState();
    renderSelectionScreen();
    quizToDelete = null;
  }
  confirmDeleteQuizModal.classList.add("hidden");
});
confirmDeleteNo.addEventListener("click", () => {
  quizToDelete = null;
  confirmDeleteQuizModal.classList.add("hidden");
});
confirmDeleteQuizModal.addEventListener("click", (e) => {
  if (e.target === confirmDeleteQuizModal) {
    quizToDelete = null;
    confirmDeleteQuizModal.classList.add("hidden");
  }
});
confirmCloseSave.addEventListener("click", () => {
  confirmCloseEditorModal.classList.add("hidden");
  closeQuizEditor(true);
});
confirmCloseDiscard.addEventListener("click", () => {
  confirmCloseEditorModal.classList.add("hidden");
  delete quizSets[editorQuizId];
  saveTeacherState();
  renderSelectionScreen();
  quizEditorModal.classList.add("hidden");
  showToast("Quiz discarded.", "info");
});
confirmCloseCancel.addEventListener("click", () => {
  confirmCloseEditorModal.classList.add("hidden");
});
confirmCloseEditorModal.addEventListener("click", (e) => {
  if (e.target === confirmCloseEditorModal) {
    confirmCloseEditorModal.classList.add("hidden");
  }
});
generateBtn.addEventListener("click", generatePin);
pinCodeWrapper.addEventListener("click", copyPinToClipboard);
selectionNewQuizBtn.addEventListener("click", () => {
  openQuizEditor(null, false);
});
selectionImportBtn.addEventListener("click", () => {
  importFileInput.click();
});
viewHistoryBtn.addEventListener("click", () => {
  renderHistoryList();
  historyModal.classList.remove("hidden");
});
closeHistoryBtn.addEventListener("click", () => {
  historyModal.classList.add("hidden");
});
historyModal.addEventListener("click", (e) => {
  if (e.target === historyModal) {
    historyModal.classList.add("hidden");
  }
});
selectAllBtn.addEventListener("click", () => {
  selectAllQuizzes();
});
exportSelectedBtn.addEventListener("click", () => {
  exportSelectedQuizzes();
});
deleteSelectedBtn.addEventListener("click", () => {
  deleteSelectedQuizzes();
});
clearSelectionBtn.addEventListener("click", () => {
  clearSelection();
});
function showSuggestions(query) {
  if (!query) {
    searchSuggestions.classList.add("hidden");
    return;
  }
  const ids = Object.keys(quizSets);
  const matches = ids.filter(id => {
    const quiz = quizSets[id];
    const title = (quiz.title || "").toLowerCase();
    const slideCount = quiz.slides.length.toString();
    const q = query.toLowerCase();
    return title.includes(q) || slideCount.includes(q);
  }).slice(0, 5);
  if (matches.length === 0) {
    searchSuggestions.classList.add("hidden");
    return;
  }
  searchSuggestions.innerHTML = "";
  matches.forEach(id => {
    const quiz = quizSets[id];
    const item = document.createElement("div");
    item.className = "suggestion-item";
    const title = quiz.title || "Untitled Quiz";
    const highlightedTitle = title.replace(
      new RegExp(query, 'gi'),
      match => `<span class="suggestion-highlight">${match}</span>`
    );
    item.innerHTML = `
      <div class="suggestion-icon">📝</div>
      <div class="suggestion-content">
        <div class="suggestion-title">${highlightedTitle}</div>
        <div class="suggestion-meta">${quiz.slides.length} question${quiz.slides.length !== 1 ? 's' : ''}</div>
      </div>
    `;
    item.addEventListener("click", () => {
      quizSearchInput.value = quiz.title || "Untitled Quiz";
      searchSuggestions.classList.add("hidden");
      renderSelectionScreen(quiz.title || "Untitled Quiz");
    });
    searchSuggestions.appendChild(item);
  });
  searchSuggestions.classList.remove("hidden");
}
quizSearchInput.addEventListener("input", (e) => {
  const query = e.target.value;
  if (query) {
    clearSearchBtn.classList.remove("hidden");
  } else {
    clearSearchBtn.classList.add("hidden");
  }
  showSuggestions(query);
  renderSelectionScreen(query);
});
document.addEventListener("click", (e) => {
  if (!quizSearchInput.contains(e.target) && !searchSuggestions.contains(e.target)) {
    searchSuggestions.classList.add("hidden");
  }
});
quizSearchInput.addEventListener("focus", () => {
  if (quizSearchInput.value) {
    showSuggestions(quizSearchInput.value);
  }
});
clearSearchBtn.addEventListener("click", () => {
  quizSearchInput.value = "";
  clearSearchBtn.classList.add("hidden");
  searchSuggestions.classList.add("hidden");
  renderSelectionScreen();
});
// Initialize
loadTeacherState();
renderQuizList();

// Check if there's an active game
if (currentPin) {
  // Show game lobby
  quizSelectionScreen.classList.add("hidden");
  gameLobbyScreen.classList.remove("hidden");
  pinCodeEl.textContent = currentPin;
  updateQr();
  pollInterval = setInterval(pollTeacherState, 1000);

  // Restore active quiz display if available
  if (activeQuizId && quizSets[activeQuizId]) {
    setActiveQuiz(activeQuizId, activeSlideIndex);
  }
} else {
  // Show quiz selection screen
  quizSelectionScreen.classList.remove("hidden");
  gameLobbyScreen.classList.add("hidden");
  renderSelectionScreen();
}

// Set default states if no active quiz
if (!activeQuizId) {
  currentQuizTitleEl.textContent = "None";
  currentSlideInfoEl.textContent = "";
  prevSlideBtn.disabled = true;
  nextSlideBtn.disabled = true;
  sendQuestionBtn.disabled = true;
  endQuestionBtn.disabled = true;
}
let lobbyHidden = false;
function hideLobbyForQuiz() {
  if (!gameLobbyScreen) return;
  lobbyHidden = true;
  gameLobbyScreen.style.display = 'none';
  gameLobbyScreen.style.visibility = 'hidden';
  gameLobbyScreen.style.opacity = '0';
  gameLobbyScreen.style.zIndex = '-9999';
}
function showLobbyAfterQuiz() {
  if (!gameLobbyScreen) return;
  lobbyHidden = false;
  gameLobbyScreen.style.display = '';
  gameLobbyScreen.style.visibility = '';
  gameLobbyScreen.style.opacity = '';
  gameLobbyScreen.style.zIndex = '';
}
function updateLobbyVisibility() {
  if (!gameLobbyScreen) return;
  const questionActive = teacherQuestionView && teacherQuestionView.classList.contains('active');
  const scoreboardActive = teacherScoreboard && teacherScoreboard.classList.contains('active');
  if (lobbyHidden && !questionActive && !scoreboardActive) {
    lobbyHidden = false;
  }
  if (lobbyHidden || questionActive || scoreboardActive) {
    gameLobbyScreen.style.display = 'none';
    gameLobbyScreen.style.visibility = 'hidden';
    gameLobbyScreen.style.opacity = '0';
    gameLobbyScreen.style.zIndex = '-9999';
  } else {
    gameLobbyScreen.style.display = '';
    gameLobbyScreen.style.visibility = '';
    gameLobbyScreen.style.opacity = '';
    gameLobbyScreen.style.zIndex = '';
  }
}
let lobbyUpdateTimeout = null;
const lobbyObserver = new MutationObserver((mutations) => {
  if (lobbyUpdateTimeout) clearTimeout(lobbyUpdateTimeout);
  lobbyUpdateTimeout = setTimeout(() => {
    updateLobbyVisibility();
  }, 100);
});
if (teacherQuestionView) {
  lobbyObserver.observe(teacherQuestionView, {
    attributes: true,
    attributeFilter: ['class']
  });
}
if (teacherScoreboard) {
  lobbyObserver.observe(teacherScoreboard, {
    attributes: true,
    attributeFilter: ['class']
  });
}
if (startQuestionBtn) {
  startQuestionBtn.addEventListener('click', () => {
    console.log('Start question clicked - hiding lobby');
    if (gameLobbyScreen) {
      gameLobbyScreen.style.display = 'none';
    }
  });
}
if (backToSelectionBtn) {
  backToSelectionBtn.addEventListener('click', () => {
    console.log('Back to selection clicked - showing lobby');
    lobbyHidden = false;
    showLobbyAfterQuiz();
    if (gameLobbyScreen) {
      gameLobbyScreen.style.display = '';
      gameLobbyScreen.style.visibility = '';
      gameLobbyScreen.style.opacity = '';
      gameLobbyScreen.style.zIndex = '';
    }
  });
}