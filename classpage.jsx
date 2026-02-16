import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./classpage.css";

function ClassPage() {

  const { className } = useParams();

  const [name, setName] = useState("");
  const [roll, setRoll] = useState("");
  const [age, setAge] = useState("");
  const [address, setAddress] = useState("");
  const [students, setStudents] = useState([]);
  const [tasks, setTasks] = useState([]);

  const loadStudents = async () => {
    const res = await axios.get(
      `http://127.0.0.1:5000/class_students/${className}`
    );
    setStudents(res.data);
  };

  const loadTasks = async () => {
    const res = await axios.get(
      `http://127.0.0.1:5000/class_tasks/${className}`
    );
    setTasks(res.data);
  };

  useEffect(() => {
    loadStudents();
    loadTasks();
  }, [className]);

  const addStudent = async () => {
    if (!name) return;

    await axios.post("http://127.0.0.1:5000/add_student", {
      name,
      class: className,
      roll,
      age,
      address
    });

    setName("");
    setRoll("");
    setAge("");
    setAddress("");

    loadStudents();
  };

  return (
    <div className="class-page">

      <h1 className="page-title">Class {className}</h1>

      {/* ---------------- ADD STUDENT ---------------- */}

      <div className="form-card">
        <h2>Add Student</h2>

        <div className="form-grid">

          <input
            placeholder="Student Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            placeholder="Roll No"
            value={roll}
            onChange={(e) => setRoll(e.target.value)}
          />

          <input
            placeholder="Age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />

          <input
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

        </div>

        <button className="add-btn" onClick={addStudent}>
          Add Student
        </button>
      </div>

      {/* ---------------- STUDENT TABLE ---------------- */}

      <div className="table-card">

        <h2>Students</h2>

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Roll</th>
              <th>Age</th>
              <th>Address</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {students.map((s, i) => (
              <tr key={i}>

                <td>
                  <input
                    value={s.name}
                    onChange={(e) => {
                      const newStudents = [...students];
                      newStudents[i].name = e.target.value;
                      setStudents(newStudents);
                    }}
                  />
                </td>

                <td>
                  <input
                    value={s.roll || ""}
                    onChange={(e) => {
                      const newStudents = [...students];
                      newStudents[i].roll = e.target.value;
                      setStudents(newStudents);
                    }}
                  />
                </td>

                <td>
                  <input
                    value={s.age || ""}
                    onChange={(e) => {
                      const newStudents = [...students];
                      newStudents[i].age = e.target.value;
                      setStudents(newStudents);
                    }}
                  />
                </td>

                <td>
                  <input
                    value={s.address || ""}
                    onChange={(e) => {
                      const newStudents = [...students];
                      newStudents[i].address = e.target.value;
                      setStudents(newStudents);
                    }}
                  />
                </td>

                <td>

                  <button
                    onClick={async () => {
                      await axios.put(
                        `http://127.0.0.1:5000/update_student/${s.email}`,
                        s
                      );
                      loadStudents();
                    }}
                  >
                    Update
                  </button>

                  <button
                    onClick={async () => {
                      await axios.delete(
                        `http://127.0.0.1:5000/delete_student/${s.email}`
                      );
                      loadStudents();
                    }}
                  >
                    Delete
                  </button>

                </td>

              </tr>
            ))}

          </tbody>
        </table>
      </div>

      {/* ---------------- TASKS ---------------- */}

      <div className="table-card">

        <h2>Class Tasks</h2>

        {tasks.map((t) => (
          <div key={t.id} className={`task-card ${t.status}`}>

            <p><b>{t.title}</b> ({t.subject})</p>
            <p>Student: {t.assigned_to}</p>
            <p>Status: {t.status}</p>

            {t.submission_link && (
              <a href={t.submission_link} target="_blank" rel="noreferrer">
                View Submission
              </a>
            )}

          </div>
        ))}

      </div>

    </div>
  );
}

export default ClassPage;
