import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./managetask.css";

function ManageTasks() {

  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("DBMS");
  const [className, setClassName] = useState("A");
  const [editId, setEditId] = useState(null);

  // LOAD TASKS
  const loadTasks = async () => {
    const res = await axios.get(
      `http://127.0.0.1:5000/class_tasks/${className}`
    );

    const unique = [
      ...new Map(
        res.data.map((t) => [
          `${t.title}-${t.subject}-${t.class}`,
          t,
        ])
      ).values(),
    ];

    setTasks(unique);
  };

  useEffect(() => {
    loadTasks();
  }, [className]);

  // CREATE / UPDATE
  const saveTask = async () => {

    if (editId) {
      await axios.put(
        `http://127.0.0.1:5000/update_task/${editId}`,
        { title, subject }
      );
      setEditId(null);
    } else {
      await axios.post(
        "http://127.0.0.1:5000/assign",
        {
          title,
          subject,
          class: className
        }
      );
    }

    setTitle("");
    loadTasks();
  };

  // DELETE
  const deleteTask = async (id) => {
    await axios.delete(
      `http://127.0.0.1:5000/delete_task/${id}`
    );
    loadTasks();
  };

  return (

    <div className="task-page">

      <div className="task-container">

        {/* HEADER */}
        <div className="task-header">
          <h1>Task Manager</h1>
          <button className="back-btn" onClick={() => navigate("/")}>
            Back
          </button>
        </div>

        {/* FORM */}
        <div className="task-form">

          <select
            value={className}
            onChange={(e) => setClassName(e.target.value)}
          >
            <option>A</option>
            <option>B</option>
            <option>C</option>
          </select>

          <input
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          >
            <option>DBMS</option>
            <option>OS</option>
            <option>Java</option>
            <option>Python</option>
            <option>AI</option>
          </select>

          <button className="create-btn" onClick={saveTask}>
            {editId ? "Update Task" : "Create Task"}
          </button>

        </div>

        {/* TASK LIST */}
        <div className="task-list">

          {tasks.map((t) => (
            <div className="task-card" key={t.id}>

              <h3>{t.title}</h3>

              <p><b>Subject:</b> {t.subject}</p>
              <p><b>Class:</b> {t.class}</p>

              <button
                className="edit-btn"
                onClick={() => {
                  setEditId(t.id);
                  setTitle(t.title);
                  setSubject(t.subject);
                }}
              >
                Edit
              </button>

              <button
                className="delete-btn"
                onClick={() => deleteTask(t.id)}
              >
                Delete
              </button>

            </div>
          ))}

        </div>

      </div>

    </div>
  );
}

export default ManageTasks;
