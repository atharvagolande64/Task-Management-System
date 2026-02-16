import React, { useState } from "react";
import axios from "axios";

const AssignmentPage = () => {

  const [link, setLink] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const submitAssignment = async () => {

    if (!link) {
      alert("Enter your submission link ⚠️");
      return;
    }

    try {
      await axios.post("http://127.0.0.1:5000/submit-assignment", {
        assignment_id: "B76-Final-Internship-Project",
        student_name: "Atharva",
        submission_link: link
      });

      alert("Assignment Submitted ✅");
      setShowPopup(false);
      setLink("");

    } catch (error) {
      console.log(error);
      alert("Submission failed ❌");
    }
  };

  return (
    <div style={{ padding: "40px" }}>

      <h2>B76 - Final Internship Project</h2>

      <button onClick={() => setShowPopup(true)}>
        Submit Assignment
      </button>

      {showPopup && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}>

          <div style={{
            background: "#fff",
            padding: "20px",
            borderRadius: "10px",
            width: "300px"
          }}>

            <h3>Submit Assignment</h3>

            <input
              type="text"
              placeholder="Enter your submission link"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
            />

            <button type="button" onClick={submitAssignment}>
              Submit
            </button>

            <button
              onClick={() => setShowPopup(false)}
              style={{ marginLeft: "10px" }}
            >
              Cancel
            </button>

          </div>
        </div>
      )}

    </div>
  );
};

export default AssignmentPage;
