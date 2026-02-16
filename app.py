from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)

conn = sqlite3.connect("database.db")
cur = conn.cursor()

cur.execute("""
CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    description TEXT
)
""")

try:
    cur.execute("ALTER TABLE tasks ADD COLUMN submission_link TEXT")
except:
    pass

conn.commit()
conn.close()


# ---------------- DATABASE ----------------

def db():
    conn = sqlite3.connect("database.db")
    conn.row_factory = sqlite3.Row
    return conn


def create_tables():
    conn = db()

    conn.execute("""
    CREATE TABLE IF NOT EXISTS users(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT UNIQUE,
        password TEXT,
        role TEXT,
        class TEXT
    )
    """)

    # ✅ ADDED submission_link COLUMN
    conn.execute("""
    CREATE TABLE IF NOT EXISTS tasks(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        subject TEXT,
        class TEXT,
        assigned_to TEXT,
        status TEXT,
        submission_link TEXT
    )
    """)

    conn.commit()

# ---------------- LOGIN ----------------

@app.route("/login", methods=["POST"])
def login():
    data = request.json

    conn = db()
    user = conn.execute("""
    SELECT * FROM users
    WHERE email=? AND password=?
    """, (data["email"], data["password"])).fetchone()

    if user:
        return jsonify(dict(user))

    return jsonify({"msg": "Invalid credentials"}), 401


# ---------------- ADD STUDENT ----------------

@app.route("/add_student", methods=["POST"])
def add_student():
    data = request.json

    name = data.get("name")
    student_class = data.get("class", "A")
    roll = data.get("roll", "")
    age = data.get("age", "")
    address = data.get("address", "")

    if not name:
        return jsonify({"msg": "Name required"}), 400

    email = name.lower() + "@gmail.com"

    conn = db()

    try: conn.execute("ALTER TABLE users ADD COLUMN roll TEXT")
    except: pass

    try: conn.execute("ALTER TABLE users ADD COLUMN age TEXT")
    except: pass

    try: conn.execute("ALTER TABLE users ADD COLUMN address TEXT")
    except: pass

    conn.execute("""
        INSERT INTO users(name,email,password,role,class,roll,age,address)
        VALUES(?,?,?,?,?,?,?,?)
    """, (name, email, "123", "student", student_class, roll, age, address))

    conn.commit()

    return jsonify({
        "msg": "Student added",
        "email": email,
        "password": "123"
    })


# ---------------- GET STUDENTS OF CLASS ----------------

@app.route("/class_students/<class_name>")
def class_students(class_name):

    conn = db()

    students = conn.execute("""
        SELECT name, email, roll, age, address
        FROM users
        WHERE class=? AND role='student'
    """, (class_name,)).fetchall()

    return jsonify([dict(s) for s in students])


# 🔹 DELETE STUDENT
@app.route("/delete_student/<email>", methods=["DELETE"])
def delete_student(email):
    conn = db()
    conn.execute("DELETE FROM users WHERE email=?", (email,))
    conn.commit()
    return jsonify({"msg": "Student deleted"})


# 🔹 UPDATE STUDENT
@app.route("/update_student/<email>", methods=["PUT"])
def update_student(email):
    data = request.json

    conn = db()

    conn.execute("""
        UPDATE users
        SET name=?, roll=?, age=?, address=?
        WHERE email=?
    """, (
        data.get("name"),
        data.get("roll"),
        data.get("age"),
        data.get("address"),
        email
    ))

    conn.commit()

    return jsonify({"msg": "Student updated"})


# ---------------- ASSIGN TASK TO CLASS ----------------

@app.route("/assign", methods=["POST"])
def assign():
    data = request.json

    conn = db()

    students = conn.execute("""
    SELECT email FROM users
    WHERE class=? AND role='student'
    """, (data["class"],)).fetchall()

    for s in students:
        conn.execute("""
        INSERT INTO tasks(title,subject,class,assigned_to,status)
        VALUES(?,?,?,?,?)
        """, (
            data["title"],
            data["subject"],
            data["class"],
            s["email"],
            "pending"
        ))

    conn.commit()

    return jsonify({"msg": "Task assigned"})


# ---------------- TEACHER VIEW TASKS ----------------

@app.route("/class_tasks/<class_name>")
def class_tasks(class_name):
    conn = db()

    tasks = conn.execute("""
    SELECT id, title, subject, class, assigned_to, status, submission_link
    FROM tasks
    WHERE class=?
    """, (class_name,)).fetchall()

    return jsonify([dict(t) for t in tasks])


# ---------------- STUDENT VIEW TASKS ----------------

@app.route("/my_tasks/<email>")
def my_tasks(email):
    conn = db()

    tasks = conn.execute("""
    SELECT * FROM tasks WHERE assigned_to=?
    """, (email,)).fetchall()

    return jsonify([dict(t) for t in tasks])


# ---------------- SUBMIT TASK (UPDATED) ----------------

@app.route("/submit_task/<int:id>", methods=["PUT"])
def submit_task(id):

    data = request.json
    conn = db()

    conn.execute("""
    UPDATE tasks
    SET status='submitted',
        submission_link=?
    WHERE id=?
    """, (data.get("submission_link"), id))

    conn.commit()

    return jsonify({"msg": "Submitted"})


# ---------------- UPDATE TASK ----------------

@app.route("/update_task/<int:id>", methods=["PUT"])
def update_task(id):
    data = request.json

    conn = db()

    conn.execute("""
    UPDATE tasks
    SET title=?, subject=?
    WHERE id=?
    """, (data["title"], data["subject"], id))

    conn.commit()

    return jsonify({"msg": "Updated"})


# ---------------- DELETE TASK ----------------

@app.route("/delete_task/<int:id>", methods=["DELETE"])
def delete_task(id):
    conn = db()

    conn.execute("DELETE FROM tasks WHERE id=?", (id,))
    conn.commit()

    return jsonify({"msg": "Deleted"})


# ---------------- RUN APP ----------------

if __name__ == "__main__":
    create_tables()
    app.run(debug=True)
