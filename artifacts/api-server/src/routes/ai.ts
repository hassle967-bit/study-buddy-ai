import { Router, type IRouter } from "express";
import OpenAI from "openai";
import { SummarizeNotesBody, GenerateQuizBody, GenerateStudyPlanBody } from "@workspace/api-zod";
import { logger } from "../lib/logger";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const router: IRouter = Router();

function setupSSE(res: import("express").Response): void {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
}

async function streamCompletion(
  res: import("express").Response,
  messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[],
): Promise<void> {
  const stream = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    max_tokens: 4096,
    messages,
    stream: true,
  });

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content;
    if (content) {
      res.write(`data: ${JSON.stringify({ content })}\n\n`);
    }
  }
  res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
  res.end();
}

router.post("/ai/summarize", async (req, res): Promise<void> => {
  const parsed = SummarizeNotesBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { notes, style = "concise" } = parsed.data;

  setupSSE(res);

  const styleInstructions: Record<string, string> = {
    concise: "Provide a concise summary in 3-5 sentences capturing the key points.",
    detailed: "Provide a detailed summary covering all major topics and subtopics with explanations.",
    "bullet-points": "Provide a structured summary using bullet points organized by topic.",
  };

  await streamCompletion(res, [
    {
      role: "system",
      content:
        "You are an expert academic assistant that helps students understand their notes. Produce clear, well-organized summaries that aid learning and retention.",
    },
    {
      role: "user",
      content: `Please summarize the following notes. ${styleInstructions[style] ?? styleInstructions.concise}\n\nNotes:\n${notes}`,
    },
  ]);
});

router.post("/ai/quiz", async (req, res): Promise<void> => {
  const parsed = GenerateQuizBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { notes, numQuestions = 5, difficulty = "medium" } = parsed.data;

  setupSSE(res);

  await streamCompletion(res, [
    {
      role: "system",
      content:
        "You are an expert educator that creates effective quiz questions to test student understanding. Generate questions that promote active recall and deeper understanding.",
    },
    {
      role: "user",
      content: `Create a ${difficulty} difficulty quiz with ${numQuestions} questions based on the following notes. Format each question as:\n\nQ[number]: [question]\nA) [option]\nB) [option]\nC) [option]\nD) [option]\nAnswer: [letter]\nExplanation: [brief explanation]\n\nNotes:\n${notes}`,
    },
  ]);
});

router.post("/ai/study-plan", async (req, res): Promise<void> => {
  const parsed = GenerateStudyPlanBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { subject, examDate, hoursPerDay = 2, topics } = parsed.data;

  setupSSE(res);

  const topicsSection = topics ? `\nTopics to cover: ${topics}` : "";

  await streamCompletion(res, [
    {
      role: "system",
      content:
        "You are an expert academic coach that creates personalized, realistic study plans. Your plans are practical, time-bound, and designed to maximize learning retention using proven techniques like spaced repetition and active recall.",
    },
    {
      role: "user",
      content: `Create a detailed study plan for the following:\n\nSubject: ${subject}\nExam Date: ${examDate}\nStudy hours available per day: ${hoursPerDay}${topicsSection}\n\nToday's date is ${new Date().toISOString().split("T")[0]}.\n\nProvide a day-by-day study schedule from today until the exam date, with specific topics, techniques, and goals for each session. Include review sessions and exam preparation strategies.`,
    },
  ]);
});

export default router;
