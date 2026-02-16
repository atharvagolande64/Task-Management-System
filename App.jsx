import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import TeacherDashboard from "./TeacherDashboard";
import StudentDashboard from "./StudentDashboard";
import ClassPage from "./ClassPage";
import ManageTasks from "./ManageTasks";
import AssignmentPage from "./AssignmentPage";
import axios from "axios";
import "./taskUI.css";
import "./loginPage.css";   // ✅ LOGIN CSS IMPORTED


function App() {

  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    const res = await axios.post("http://127.0.0.1:5000/login", {
      email,
      password
    });

    setUser(res.data);
  };

  if (!user) return <Login login={login} />;

  return (
    <BrowserRouter>
      <Routes>

        {/* 👩‍🏫 TEACHER */}
        {user.role === "teacher" && (
          <>
            <Route path="/" element={<TeacherDashboard />} />
            <Route path="/class/:className" element={<ClassPage />} />
            <Route path="/manage-tasks" element={<ManageTasks />} />
            <Route path="/assignment" element={<AssignmentPage />} />
          </>
        )}

        {/* 👨‍🎓 STUDENT */}
        {user.role === "student" && (
          <>
            <Route path="/" element={<StudentDashboard user={user} />} />
            <Route path="/assignment" element={<AssignmentPage />} />
          </>
        )}

      </Routes>
    </BrowserRouter>
  );
}



function Login({ login }) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (

    <div className="login-page">

      <div className="login-card">

        <h1>Login</h1>

        <input
          type="text"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="login-btn"
          onClick={() => login(email, password)}
        >
          Login
        </button>

      </div>

    </div>

  );
}

export default App;
