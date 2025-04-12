import express from "express";
import cors from "cors";
import fs from "fs/promises";

const app = express();
app.use(cors());

// Read questions from JSON file
const getQuestions = async () => {
  try {
    const data = await fs.readFile("./db.json", "utf8");
    return JSON.parse(data).questions;
  } catch (error) {
    console.error("Error reading questions:", error);
    return [];
  }
};

app.get("/questions", async (req, res) => {
  const questions = await getQuestions();
  res.json(questions);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
