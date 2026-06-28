import { useLocation } from "react-router-dom";
import "./results.css"
const Results = () => {
  const {state} = useLocation()
  console.log(state)
  const { score, matchingSkills, missingSkills, suggestions } = state.ai;
  return (
    <div className="result-container">
      <div className="result-header">
       <div className="score">
         <h2>{state.score}</h2>
        <p>Score</p>
       </div>
       <div className="head">
        <h1>ATS Match Score</h1>
        <p>Strong match. A few targeted additions could push this higher.</p>
       </div>
      </div>

      <div className="skill-results">
        <div className="matching-skill">
            <h2>✔ Matching Skills</h2>
            <ul>
              {matchingSkills?.map((resumeText,index)=>(
                <li key={index}>{resumeText}</li>
              ))}                
            </ul>
        </div>

        <div className="missing-skill">
            <h2>❌ Missing Skills</h2>
            <ul>
               {missingSkills?.map((item,index) =>(
                <li key={index}>{item}</li>
               ))}
            </ul>
        </div>
      </div>

      {/* Suggestions */}
      <div className="result-suggestion">
        <h2>💡 Suggestions</h2>
        <ul>
          {suggestions?.map((item, index)=>(
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Results
