import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertMessageSchema, predefinedResponses } from "@shared/schema";
import { sportsService } from "./services/sports";

export function registerRoutes(app: Express): Server {
  app.get("/api/messages", async (_req, res) => {
    const messages = await storage.getMessages();
    res.json(messages);
  });

  app.post("/api/messages", async (req, res) => {
    const result = insertMessageSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: "Invalid message format" });
    }

    const message = await storage.addMessage(result.data);

    // Auto-respond if user message
    if (message.sender === "user") {
      const responses =
        predefinedResponses[
          message.language as keyof typeof predefinedResponses
        ];
      let botResponse;

      // Check if the message is asking about the creator
      const creatorKeywords = {
        en: [
          "who created",
          "who made",
          "creator",
          "owner",
          "ceo",
          "founder",
          "company",
          "about you",
          "tell me about",
          "who are you",
          "who developed",
          "tell about yourself",
          "what is this",
          "what company",
          "who owns",
        ],
        hi: [
          "किसने बनाया",
          "कौन बनाया",
          "किसका",
          "मालिक",
          "सीईओ",
          "कंपनी",
          "तुम्हारे बारे में",
          "अपने बारे में",
          "कौन हो",
          "किसने डेवलप किया",
          "क्या है ये",
          "कौन सी कंपनी",
          "किसकी कंपनी",
          "संस्थापक",
        ],
      };

      // Check if message is about sports
      const sportsKeywords = {
        cricket: {
          en: ["cricket", "match", "score", "runs", "wicket"],
          hi: ["क्रिकेट", "मैच", "स्कोर", "रन", "विकेट"],
        },
        football: {
          en: ["football", "soccer", "goal", "match"],
          hi: ["फुटबॉल", "सॉकर", "गोल", "मैच"],
        },
      };

      const isAskingAboutCreator =
        message.language === "en"
          ? creatorKeywords.en.some((keyword) =>
              message.content.toLowerCase().includes(keyword),
            )
          : creatorKeywords.hi.some((keyword) =>
              message.content.toLowerCase().includes(keyword),
            );

      const isAskingAboutCricket =
        message.language === "en"
          ? sportsKeywords.cricket.en.some((keyword) =>
              message.content.toLowerCase().includes(keyword),
            )
          : sportsKeywords.cricket.hi.some((keyword) =>
              message.content.toLowerCase().includes(keyword),
            );

      const isAskingAboutFootball =
        message.language === "en"
          ? sportsKeywords.football.en.some((keyword) =>
              message.content.toLowerCase().includes(keyword),
            )
          : sportsKeywords.football.hi.some((keyword) =>
              message.content.toLowerCase().includes(keyword),
            );

      try {
        if (isAskingAboutCreator) {
          botResponse = await storage.addMessage({
            content: responses.about,
            sender: "bot",
            language: message.language,
          });
        } else if (isAskingAboutCricket) {
          const cricketData = await sportsService.getCricketMatches();
          botResponse = await storage.addMessage({
            content: cricketData,
            sender: "bot",
            language: message.language,
          });
        } else if (isAskingAboutFootball) {
          const footballData = await sportsService.getFootballMatches();
          botResponse = await storage.addMessage({
            content: footballData,
            sender: "bot",
            language: message.language,
          });
        } else {
          botResponse = await storage.addMessage({
            content: responses.greeting,
            sender: "bot",
            language: message.language,
          });
        }

        return res.json([message, botResponse]);
      } catch (error) {
        console.error("Error processing sports request:", error);
        botResponse = await storage.addMessage({
          content:
            message.language === "en"
              ? "Sorry, I couldn't fetch the sports data at the moment. Please try again later."
              : "क्षमा करें, मैं अभी खेल डेटा नहीं ला पा रहा हूं। कृपया बाद में पुनः प्रयास करें।",
          sender: "bot",
          language: message.language,
        });
        return res.json([message, botResponse]);
      }
    }

    res.json(message);
  });

  return createServer(app);
}
