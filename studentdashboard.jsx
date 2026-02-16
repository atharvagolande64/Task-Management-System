import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./studentDashboard.css";

function StudentDashboard({ user }) {

  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [activeTask, setActiveTask] = useState(null);
  const [link, setLink] = useState("");

  const loadTasks = async () => {
    const res = await axios.get(
      `http://127.0.0.1:5000/my_tasks/${user.email}`
    );
    setTasks(res.data);
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const submitTask = async (id) => {

    if (!link) {
      alert("Enter submission link ⚠️");
      return;
    }

    await axios.put(`http://127.0.0.1:5000/submit_task/${id}`, {
      submission_link: link
    });

    setActiveTask(null);
    setLink("");
    loadTasks();
  };

  const total = tasks.length;
  const submitted = tasks.filter(t => t.status === "submitted").length;
  const pending = total - submitted;
  const progress = total ? (submitted / total) * 100 : 0;

  const grouped = tasks.reduce((acc, task) => {
    acc[task.subject] = acc[task.subject] || [];
    acc[task.subject].push(task);
    return acc;
  }, {});

  return (
    <div className="student-dashboard">

      {/* HEADER */}
      <div className="dashboard-header">
        <div>
          <h2>Welcome {user.name}</h2>
          <h4>Class {user.class}</h4>
        </div>

        <button className="logout-btn" onClick={() => navigate("/")}>
          Logout
        </button>
      </div>

      {/* 📊 PRODUCTIVITY */}
      <h3>My Productivity</h3>

      <div className="stats-container">
        <div className="stat-card">
          <h4>Total Tasks</h4>
          <p>{total}</p>
        </div>

        <div className="stat-card">
          <h4>Submitted</h4>
          <p>{submitted}</p>
        </div>

        <div className="stat-card">
          <h4>Pending</h4>
          <p>{pending}</p>
        </div>
      </div>

      <div className="progress-bar">
        <div className="progress" style={{ width: `${progress}%` }}></div>
      </div>

      {total === 0 && <h3>No tasks assigned 🎉</h3>}

      {/* 📚 SUBJECT GROUP */}
      {Object.keys(grouped).map(subject => (
        <div key={subject}>

          <h3 className="subject-title">{subject}</h3>

          <div className="task-grid">

            {grouped[subject].map(task => (

              <div key={task.id} className="task-card">

                <h4>{task.title}</h4>
                <p>Due: 25 Feb</p>

                <div className="status-row">
                  <span className="status-dot"></span>
                  <span>
                    {task.status === "submitted"
                      ? "Submitted"
                      : "Pending"}
                  </span>
                </div>

                {task.status === "submitted" && (
                  <>
                    <p>Submitted ✅</p>

                    {task.submission_link && (
                      <a
                        href={task.submission_link}
                        target="_blank"
                        className="view-link"
                      >
                        View Submission 🔗
                      </a>
                    )}
                  </>
                )}

                {task.status === "pending" && (
                  <>
                    <button
                      className="submit-btn"
                      onClick={() => setActiveTask(task.id)}
                    >
                      Submit
                    </button>

                    {activeTask === task.id && (
                      <div className="submit-box">

                        <input
                          type="text"
                          placeholder="Enter submission link"
                          value={link}
                          onChange={(e) => setLink(e.target.value)}
                        />

                        <button
                          onClick={() => submitTask(task.id)}
                        >
                          Final Submit
                        </button>

                      </div>
                    )}
                  </>
                )}

              </div>

            ))}

          </div>

        </div>
      ))}

    </div>
  );
}

export default StudentDashboard;
