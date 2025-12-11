import uploadOnCloudinary from "../config/cloudinary.js";
import geminiResponse from "../gemini.js";
import User from "../models/user.model.js";
import moment from "moment";
// import grokResponse from "../grok.js";


// GET CURRENT USER
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    return res.json(user);
  } catch (error) {
    return res.status(500).json({ message: "Get current user error" });
  }
};

// UPDATE ASSISTANT
export const updateAssistant = async (req, res) => {
  try {
    const { assistantName, imageUrl } = req.body;

    let assistantImage;

    if (req.files?.assistantImage) {
      const file = req.files.assistantImage[0];
      assistantImage = await uploadOnCloudinary(file.path);
    } else if (imageUrl) {
      assistantImage = imageUrl;
    } else {
      return res.status(400).json({ message: "No image provided" });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { assistantName, assistantImage },
      { new: true }
    ).select("-password");

    return res.json(user);
  } catch (error) {
    return res.status(500).json({ message: "Update assistant error" });
  }
};




// ASK ASSISTANT
export const askToAssistant = async (req, res) => {
  try {
    const { command } = req.body;

    if (!command) return res.status(400).json({ message: "Command is required" });

    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    user.history.push(command);
    user.save();

    const { assistantName, name: userName } = user;

    const result = await geminiResponse(command, assistantName, userName);

    if (!result)
      return res.status(500).json({ message: "Assistant returned empty response" });

    // Extract JSON safely
    const jsonMatch = result.match(/{[\s\S]*}/);

    if (!jsonMatch)
      return res.status(400).json({ message: "Sorry, I can't understand" });

    let gemResult;
    try {
      gemResult = JSON.parse(jsonMatch[0]);
    } catch (err) {
      console.error("JSON parse error:", err);
      return res.status(500).json({ message: "Failed to parse assistant response" });
    }

    // Ensure type exists
    const type = (gemResult.type || "text").replace(/-/g, "_");
    const userInput = gemResult.userInput || command;
    const responseText = gemResult.response || "Sorry, I couldn't process that.";

    // Handle date/time/day/month commands
    switch (type) {
      case "get_date":
        return res.json({
          type,
          userInput,
          response: `Today's date is ${moment().format("Do MMMM YYYY")}`,
        });

      case "get_time":
        return res.json({
          type,
          userInput,
          response: `Current time is ${moment().format("hh:mm A")}`,
        });

      case "get_day":
        return res.json({
          type,
          userInput,
          response: `Today is ${moment().format("dddd")}`,
        });

      case "get_month":
        return res.json({
          type,
          userInput,
          response: `This month is ${moment().format("MMMM YYYY")}`,
        });

      default:
        return res.json({ type, userInput, response: responseText });
    }
  } catch (error) {
    console.error("Ask assistant error:", error);
    return res.status(500).json({ message: "Ask assistant error", data: null });
  }
};
