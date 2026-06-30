const express = require("express");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");

require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

console.log(pdfParse);
console.log(typeof pdfParse);
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// open API key Connect
const client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/api/resume-analyse", upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ error: "please upload a valid PDF resume file!" });
    }

    const pdfData = await pdfParse(req.file.buffer);
    console.log(pdfData, "PDF DATA");
    const extractText = pdfData.text;
    const jobDescription = req.body.jobDescription;
    console.log(jobDescription);

    const prompt = `You are an ATS Resume Analyzer.

Compare the following resume and job description.

Resume:
${extractText}

Job Description:
${jobDescription}

Return ONLY valid JSON in this format:

{
  "score": number,
  "matchingSkills": [],
  "missingSkills": [],
  "suggestions": []
}`;

    

    const model = client.getGenerativeModel({
      model: "gemini-2.5-flash", // Use  model name
      generationConfig: {
        responseMimeType: "application/json", // Forces Gemini to return pure JSON
        responseSchema: {
          type: "object",
          properties: {
            score: { type: "number" },
            matchingSkills: { type: "array", items: { type: "string" } },
            missingSkills: { type: "array", items: { type: "string" } },
            suggestions: { type: "array", items: { type: "string" } }
          },
          required: ["score", "matchingSkills", "missingSkills", "suggestions"]
        }
      }
    });

    //  Call the correct model method
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Convert AI string → JSON safely
    const aiData = JSON.parse(responseText);
    console.log(aiData)

    //Send response to client
    return res.json({
      success: true,
      ai: aiData,
      score: aiData.score,
    });

    const skillsDatabase = [
      "HTML",
      "CSS",
      "JavaScript",
      "React.js",
      "Node.js",
      "Express.js",
      "MongoDB",
      "MySQL",
      "Firebase",
      "Git",
      "AWS",
      "Docker",
    ];

    function normalize(text) {
      return text
        .toLowerCase()
        .replace(/[^a-z0-9]/g, " ")
        .split(/\s+/);
    }

    console.log(extractText, "Extracted Text");
    console.log(jobDescription, "Job Description");

    const resumeText = normalize(extractText);
    const JdText = normalize(jobDescription);

    const keywords = skillsDatabase.filter((skill) =>
      JdText.includes(skill.toLowerCase()),
    );

    const matchingKeywords = keywords.filter((keyword) =>
      resumeText.includes(keyword.toLowerCase()),
    );

    const missingKeywords = keywords.filter(
      (keyword) => !extractText.toLowerCase().includes(keyword.toLowerCase()),
    );

    let totalWeight = 0;
    let earnedWeight = 0;

    keywords.forEach((skill) => {
      const weight = skillsDatabase[skill] || 1;
      totalWeight += weight;

      if (
        extractText.toLowerCase().includes(skill.toLowerCase()) &&
        jobDescription.toLowerCase().includes(skill.toLowerCase())
      ) {
        earnedWeight += weight;
      }
    });

    const score = Math.round((earnedWeight / totalWeight) * 100);

    const suggestions = missingKeywords.map((skill) => {
      return `Add ${skill} in your resume if you have experience`;
    });

    return res.status(200).json({
      success: true,
      message: "PDF text extracted successfuly",
      charactercount: extractText.length,
      extractText: extractText,
      jobDescription: jobDescription,
      score,
      matchingKeywords,
      missingKeywords,
      suggestions,
    });
  } catch (error) {
    console.log(error, "Error");
    return res
      .status(500)
      .json({ error: "System logic failed during PDF extraction process." });
  }
});

app.get("/", (req, res) => {
  try{
    res.send("Server running....");
  }
  catch(err){
    console.log(err,"Error")
  }
});

app.listen(PORT, () => {
  console.log(`ATS Engineering Engine deployed smoothly on local port ${PORT}`);
});
console.log("END OF FILE");
