import { useState } from "react";
import "./home.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../component/nav";
const Home = () => {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [isDraging, setIsDraging] = useState(false);
  const [loading,setLoading]=useState(false)
  const navigate = useNavigate();

  const handleUploadResume = (e) => {
    const selectedFile = e.target.files[0];
    console.log(selectedFile);
    console.log(selectedFile.type);

    if (selectedFile.type === "application/pdf") {
      setFile(selectedFile);
    } else {
      alert("Please Select PDF files only");
    }
  };

  const handleDragAndDrop = (e) => {
    e.preventDefault();
    const DragAndDropFile = e.dataTransfer.files[0];
    setFile(DragAndDropFile);
    setIsDraging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDraging(true);
  };

  const handleJobDescription = (e) => {
    const jdText = e.target.value;
    setJobDescription(jdText);
  };

  const handleScanResume = async () => {
    if(!file){
      alert("Upload your resume")
      return
    }

    if(!jobDescription.trim()){
      alert("Please enter the Job Description")
      return
    }
    const formData = new FormData();
    formData.append("resume", file);
    formData.append("jobDescription",jobDescription)
    setLoading(true)
    try {
      const response = await axios.post(
        "http://localhost:8000/api/resume-analyse",
        formData,
      );

      setLoading(false)
      navigate("/result", {
        state: response.data
      });

      
    } catch (err) {
      alert("Something went wrong. Please try again.");
    }

  };

  return (
    <div>
      <Navbar />
      <section>
        <div id="home-container">
          <div className="header-container">
            <div className="header">
              <h1>Optimize Your Resume. Maximize Your Opportunities.</h1>
            </div>

            <div className="sub-header">
              Analyze your resume against job descriptions, discover missing
              skills, and improve your ATS score instantly using AI.
            </div>
          </div>

          {/* Resume Upload part */}
          <div
            id={isDraging ? "resume-change" : "resume-upload-container"}
            onDrop={handleDragAndDrop}
            onDragOver={handleDragOver}
          >
            <div className="drag-drop">
              <h2>Ready to Analyze Your Resume?</h2>
              <p>Upload your PDF resume and get instant ATS insights.</p>
            </div>

            <p className="or">or</p>

            <label className="upload-resume" >
              {file ? file.name : "Upload Resume"}
              <input
              onChange={handleUploadResume} type="file" className="upload-btn" hidden />
            </label>
          </div>

          <div className="jobDescription">
            <textarea
              name="jd-input"
              placeholder="Paste your Job Description (JD).."
              id="jd-input"
              required
              onChange={handleJobDescription}
            ></textarea>
          </div>

          <div className="scanResume" >
            <button disabled={loading}
            onClick={handleScanResume} className="scan-btn">{loading?"Analysing...":"Scan Resume"}</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
