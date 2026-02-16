import { useNavigate } from "react-router-dom";
import "./teacherdashboard.css";   

function TeacherDashboard() {

  const navigate = useNavigate();
  const classes = ["A", "B", "C"];

  return (
    <div className="teacher-dashboard">

      <div className="teacher-header">

        <h1>Teacher Dashboard</h1>

        <button
          className="manage-btn"
          onClick={() => navigate("/manage-tasks")}
        >
          Manage Tasks
        </button>

      </div>

      <h2 className="class-title">Classes</h2>

      <div className="class-container">
        {classes.map((c) => (
          <button
            key={c}
            className="class-btn"
            onClick={() => navigate(`/class/${c}`)}
          >
            Class {c}
          </button>
        ))}
      </div>

    </div>
  );
}

export default TeacherDashboard;
