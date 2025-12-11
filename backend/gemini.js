import axios from "axios";

const geminiResponse = async (command, assistantName, userName) => {
  const apiUrl = process.env.GEMINI_API_URL;

  // ✅ FIXED: Added all missing YouTube types
  const prompt = `
You are a virtual assistant named ${assistantName}, created by ${userName}.

Respond ONLY in RAW JSON.
Do NOT use code blocks.

VALID JSON FORMAT:
{
  "type": 
        "text" |
        "google_search" |
        "youtube" |
        "youtube_open" |
        "youtube_search" |
        "youtube_play" |
        "youtube_search_video" |
        "youtube_play_video" |
        "get_time" |
        "get_date" |
        "get_day" |
        "get_month" |
        "calculator_open" |
        "instagram_open" |
        "facebook_open" |
        "weather_show",

  "userInput": "<original user input>",
  "response": "<what assistant should speak>"
}

RULES:
- ALWAYS choose correct type based on the user's command.
- If nothing matches → type = "text".
- NO markdown. NO extra explanation.

User Command: ${command}
`;

  let attempts = 3;

  while (attempts > 0) {
    try {
      const result = await axios.post(apiUrl, {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      });

      // Return final text content
      return result.data.candidates[0].content.parts[0].text;

    } catch (error) {

      if (error.response?.status === 429) {
        console.log("⚠ Gemini Rate Limited — Retrying in 2 seconds...");
        await new Promise((res) => setTimeout(res, 2000));
        attempts--;
        continue;
      }

      console.log("Gemini API Error:", error.message);
      return '{"error": "Gemini API request failed"}';
    }
  }

  return '{"error": "Gemini API rate limit exceeded"}';
};

export default geminiResponse;
