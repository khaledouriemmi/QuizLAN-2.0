import os
import time
import random
import string
from typing import Dict, Any
from flask import (
    Flask,
    request,
    jsonify,
    send_from_directory,
    redirect,
    url_for,
)
from werkzeug.utils import secure_filename
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
TEACHER_DIR = os.path.join(BASE_DIR, "teacher")
STUDENT_DIR = os.path.join(BASE_DIR, "student")
STYLE_DIR = os.path.join(BASE_DIR, "style")
UPLOAD_DIR = os.path.join(BASE_DIR, "uploads")   
os.makedirs(UPLOAD_DIR, exist_ok=True)
PIN_LENGTH = 6
QUESTION_DURATION = 20  
app = Flask(__name__)
games: Dict[str, Dict[str, Any]] = {}
def generate_pin() -> str:
    while True:
        pin = "".join(random.choices(string.digits, k=PIN_LENGTH))
        if pin not in games:
            return pin
def calc_points(elapsed: float, duration: int) -> int:
    if elapsed < 0:
        elapsed = 0
    if elapsed > duration:
        return 0
    factor = max(0.0, min(1.0, (duration - elapsed) / duration))
    return 200 + int(800 * factor)
@app.route("/")
def root_index():
    return send_from_directory(BASE_DIR, "index.html")
@app.route("/teacher")
def teacher_page():
    return send_from_directory(TEACHER_DIR, "teacher.html")
@app.route("/teacher/<path:filename>")
def teacher_static(filename):
    return send_from_directory(TEACHER_DIR, filename)
@app.route("/student")
def student_page():
    return send_from_directory(STUDENT_DIR, "student.html")
@app.route("/student/<path:filename>")
def student_static(filename):
    return send_from_directory(STUDENT_DIR, filename)
@app.route("/style/<path:filename>")
def style_static(filename):
    return send_from_directory(STYLE_DIR, filename)
@app.route("/uploads/<path:filename>")
def uploads_static(filename):
    return send_from_directory(UPLOAD_DIR, filename)
@app.route("/api/create_game", methods=["POST"])
def api_create_game():
    data = request.get_json(force=True, silent=True) or {}
    old_pin = str(data.get("old_pin") or "").strip()
    if old_pin and old_pin in games:
        del games[old_pin]
        print(f"[INFO] Deleted old game with PIN: {old_pin}")
    pin = generate_pin()
    games[pin] = {
        "pin": pin,
        "phase": "lobby",
        "created_at": time.time(),
        "allow_join": True,
        "current_question": None,
        "current_question_id": 0,
        "question_started_at": None,
        "players": {},
    }
    origin = request.host_url.rstrip("/")
    join_url = f"{origin}/student?pin={pin}"
    teacher_url = f"{origin}/teacher?pin={pin}"
    return jsonify(
        {
            "ok": True,
            "pin": pin,
            "join_url": join_url,
            "teacher_url": teacher_url,
        }
    )
@app.route("/api/teacher_state", methods=["GET"])
def api_teacher_state():
    pin = str(request.args.get("pin") or "").strip()
    if not pin:
        return jsonify({"ok": False, "error": "Missing pin"})
    game = games.get(pin)
    if not game:
        return jsonify({"ok": False, "error": "Game not found"})
    players = []
    for pid, pdata in game["players"].items():
        players.append(
            {
                "id": pid,
                "name": pdata["name"],
                "score": int(pdata.get("score", 0)),
                "avatar": pdata.get("avatar"),
            }
        )
    def joined_ts(p):
        pid = p["id"]
        return game["players"][pid].get("joined_at", 0.0)
    last_three = sorted(players, key=joined_ts)[-3:]
    resp = {
        "ok": True,
        "phase": game.get("phase", "lobby"),
        "players": players,
        "last_three": last_three,
    }
    if game.get("phase") == "question":
        q = game.get("current_question") or {}
        started_at = game.get("question_started_at") or time.time()
        elapsed = time.time() - started_at
        question_duration = game.get("current_question", {}).get("duration", QUESTION_DURATION)
        time_left = max(0, question_duration - int(elapsed))
        if time_left == 0 and elapsed >= question_duration:
            game["phase"] = "results"
            resp["phase"] = "results"
        else:
            current_question_id = game.get("current_question_id")
            answered_count = 0
            for player in players:
                last_answer = game["players"][player["id"]].get("last_answer")
                if (last_answer and 
                    last_answer.get("question_id") == current_question_id and
                    last_answer.get("answered_at") is not None):
                    answered_count += 1
            resp["question"] = {
                "text": q.get("text", ""),
                "answers": q.get("answers", []),
                "image": q.get("image", ""),
            }
            resp["time_left"] = time_left
            resp["duration"] = question_duration
            resp["answered_count"] = answered_count
    return jsonify(resp)
@app.route("/api/kick_player", methods=["POST"])
def api_kick_player():
    data = request.get_json(force=True, silent=True) or {}
    pin = str(data.get("pin") or "").strip()
    player_id = data.get("player_id")
    if not pin or not player_id:
        return jsonify({"ok": False, "error": "Missing pin or player_id"})
    game = games.get(pin)
    if not game:
        return jsonify({"ok": False, "error": "Game not found"})
    game["players"].pop(player_id, None)
    return jsonify({"ok": True})
@app.route("/api/quit_game", methods=["POST"])
def api_quit_game():
    try:
        if request.content_type and 'application/json' in request.content_type:
            data = request.get_json(force=True, silent=True) or {}
        else:
            import json
            data = json.loads(request.data.decode('utf-8')) if request.data else {}
    except:
        data = {}
    pin = str(data.get("pin") or "").strip()
    player_id = data.get("player_id")
    if not pin or not player_id:
        return jsonify({"ok": False, "error": "Missing pin or player_id"})
    game = games.get(pin)
    if not game:
        return jsonify({"ok": False, "error": "Game not found"})
    game["players"].pop(player_id, None)
    return jsonify({"ok": True})
@app.route("/api/student_join", methods=["POST"])
def api_student_join():
    data = request.get_json(force=True, silent=True) or {}
    pin = str(data.get("pin") or "").strip()
    name = (data.get("name") or "").strip()
    avatar = data.get("avatar") or None
    if not pin or not name:
        return jsonify({"ok": False, "error": "Missing pin or name"})
    game = games.get(pin)
    if not game:
        return jsonify({"ok": False, "error": "Game not found"})
    if not game.get("allow_join", True):
        return jsonify({"ok": False, "error": "Game already started"})
    player_id = "p_" + "".join(
        random.choices(string.ascii_lowercase + string.digits, k=8)
    )
    now = time.time()
    game["players"][player_id] = {
        "id": player_id,
        "name": name,
        "avatar": avatar,
        "score": 0,
        "joined_at": now,
        "last_answer": None,
    }
    return jsonify(
        {
            "ok": True,
            "player_id": player_id,
            "name": name,
            "score": 0,
            "avatar": avatar,
        }
    )
@app.route("/api/student_state", methods=["GET"])
def api_student_state():
    pin = str(request.args.get("pin") or "").strip()
    player_id = request.args.get("player_id")
    if not pin or not player_id:
        return jsonify({"ok": False, "error": "Missing pin or player_id"})
    game = games.get(pin)
    if not game:
        return jsonify({"ok": False, "error": "Game not found"})
    player = game["players"].get(player_id)
    if not player:
        return jsonify({"ok": False, "error": "Player not found"})
    phase = game.get("phase", "lobby")
    resp: Dict[str, Any] = {
        "ok": True,
        "phase": phase,
        "score": int(player.get("score", 0)),
    }
    if phase == "lobby":
        pass
    elif phase == "question":
        q = game.get("current_question") or {}
        started_at = game.get("question_started_at") or time.time()
        elapsed = time.time() - started_at
        question_duration = game.get("current_question", {}).get("duration", QUESTION_DURATION)
        time_left = max(0, question_duration - int(elapsed))
        if time_left == 0 and elapsed >= question_duration:
            game["phase"] = "results"
            phase = "results"
            resp["phase"] = "results"
        if phase == "question":  
            last = player.get("last_answer")
            already_answered = (
                last is not None
                and last.get("question_id") == game.get("current_question_id")
                and last.get("answered_at") is not None
            )
            answer_time = None
            if already_answered and last.get("answered_at"):
                answer_time = round(last.get("answered_at") - started_at, 2)
            resp.update(
                {
                    "question": {
                        "text": q.get("text", ""),
                        "answers": q.get("answers", []),
                        "image": q.get("image", ""),
                    },
                    "time_left": time_left,
                    "duration": question_duration,
                    "already_answered": already_answered,
                    "answer_time": answer_time,
                    "last_correct": last.get("is_correct") if last else False,
                    "last_points": int(last.get("points", 0)) if last else 0,
                }
            )
    elif phase == "results":
        last = player.get("last_answer")
        answer_time = None
        if last and last.get("answered_at"):
            started_at = game.get("question_started_at") or time.time()
            answer_time = round(last.get("answered_at") - started_at, 2)
        resp["result"] = {
            "has_answer": last is not None,
            "is_correct": bool(last.get("is_correct")) if last else False,
            "points": int(last.get("points", 0)) if last else 0,
            "answer_time": answer_time,
        }
    elif phase == "finished":
        resp["finished"] = True
    questions_answered = 0
    if "answer_history" in player:
        questions_answered = len(player["answer_history"])
    resp["questions_answered"] = questions_answered
    return jsonify(resp)
@app.route("/api/start_question", methods=["POST"])
def api_start_question():
    data = request.get_json(force=True, silent=True) or {}
    pin = str(data.get("pin") or "").strip()
    q = data.get("question") or {}
    if not pin:
        return jsonify({"ok": False, "error": "Missing pin"})
    game = games.get(pin)
    if not game:
        return jsonify({"ok": False, "error": "Game not found"})
    game["allow_join"] = False
    game["current_question_id"] = game.get("current_question_id", 0) + 1
    question_duration = int(q.get("duration", 20))
    game["current_question"] = {
        "text": q.get("text", ""),
        "answers": q.get("answers", []),
        "correct_index": int(q.get("correct_index", 0)),
        "image": q.get("image", ""),
        "duration": question_duration,
    }
    game["phase"] = "question"
    game["question_started_at"] = time.time()
    qid = game["current_question_id"]
    for pdata in game["players"].values():
        pdata["last_answer"] = {
            "question_id": qid,
            "choice_index": None,
            "is_correct": False,
            "points": 0,
            "answered_at": None,
        }
    return jsonify({"ok": True})
@app.route("/api/end_question", methods=["POST"])
def api_end_question():
    data = request.get_json(force=True, silent=True) or {}
    pin = str(data.get("pin") or "").strip()
    if not pin:
        return jsonify({"ok": False, "error": "Missing pin"})
    game = games.get(pin)
    if not game:
        return jsonify({"ok": False, "error": "Game not found"})
    game["phase"] = "results"
    return jsonify({"ok": True})
@app.route("/api/submit_answer", methods=["POST"])
def api_submit_answer():
    data = request.get_json(force=True, silent=True) or {}
    pin = str(data.get("pin") or "").strip()
    player_id = data.get("player_id")
    choice_index = data.get("choice_index")
    if pin is None or player_id is None or choice_index is None:
        return jsonify({"ok": False, "error": "Missing fields"})
    game = games.get(pin)
    if not game:
        return jsonify({"ok": False, "error": "Game not found"})
    if game.get("phase") != "question":
        return jsonify({"ok": False, "error": "No active question"})
    player = game["players"].get(player_id)
    if not player:
        return jsonify({"ok": False, "error": "Player not found"})
    q = game.get("current_question") or {}
    correct_index = int(q.get("correct_index", 0))
    qid = game.get("current_question_id")
    now = time.time()
    started_at = game.get("question_started_at") or now
    elapsed = now - started_at
    last = player.get("last_answer")
    if last and last.get("question_id") == qid and last.get("answered_at"):
        answer_time = last.get("answered_at", now) - started_at
        return jsonify(
            {
                "ok": True,
                "already_answered": True,
                "is_correct": bool(last.get("is_correct")),
                "points": int(last.get("points", 0)),
                "total_score": int(player.get("score", 0)),
                "answer_time": round(answer_time, 2),
            }
        )
    is_correct = int(choice_index) == correct_index
    if not is_correct:
        points = 0
    else:
        question_duration = game.get("current_question", {}).get("duration", QUESTION_DURATION)
        points = calc_points(elapsed, question_duration)
    player["score"] = int(player.get("score", 0)) + points
    player["last_answer"] = {
        "question_id": qid,
        "choice_index": int(choice_index),
        "is_correct": is_correct,
        "points": points,
        "answered_at": now,
    }
    return jsonify(
        {
            "ok": True,
            "already_answered": False,
            "is_correct": is_correct,
            "points": points,
            "total_score": int(player["score"]),
            "answer_time": round(elapsed, 2),
        }
    )
@app.route("/api/upload_quiz_image", methods=["POST"])
def api_upload_quiz_image():
    if "image" not in request.files:
        return jsonify({"ok": False, "error": "No image field"})
    file = request.files["image"]
    if file.filename == "":
        return jsonify({"ok": False, "error": "Empty filename"})
    fname = secure_filename(file.filename)
    name, ext = os.path.splitext(fname)
    ts = int(time.time() * 1000)
    fname = f"{name}_{ts}{ext}"
    save_path = os.path.join(UPLOAD_DIR, fname)
    file.save(save_path)
    url = f"/uploads/{fname}"
    return jsonify({"ok": True, "url": url})
@app.route("/api/get_scoreboard", methods=["GET"])
def api_get_scoreboard():
    pin = str(request.args.get("pin") or "").strip()
    if not pin:
        return jsonify({"ok": False, "error": "Missing pin"})
    game = games.get(pin)
    if not game:
        return jsonify({"ok": False, "error": "Game not found"})
    players = []
    for pid, pdata in game["players"].items():
        players.append({
            "id": pid,
            "name": pdata["name"],
            "score": int(pdata.get("score", 0)),
            "avatar": pdata.get("avatar"),
        })
    players.sort(key=lambda p: p["score"], reverse=True)
    return jsonify({"ok": True, "players": players})
@app.route("/health")
def health():
    return jsonify({"status": "ok"})
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=3000, threaded=True, use_reloader=False, debug=False)