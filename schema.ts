import { pgTable, text, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  sender: varchar("sender", { length: 100 }).notNull(),
  language: varchar("language", { length: 10 }).notNull().default('en'),
  timestamp: timestamp("timestamp").defaultNow().notNull()
});

export const insertMessageSchema = createInsertSchema(messages).pick({
  content: true,
  sender: true,
  language: true
});

export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;

// Update the about responses in both languages
export const predefinedResponses = {
  en: {
    greeting: "Hello! How can I help you with gaming support today?",
    connection: "Are you experiencing connection issues with the game?",
    performance: "Let's check your game performance. What are your system specs?",
    bugs: "Could you describe the bug you're encountering?",
    thanks: "Thanks for reaching out! Let me know if you need anything else.",
    about: "I am a gaming support chatbot created by Pankaj Das, who is the CEO and founder of this innovative gaming support platform. Our mission is to provide seamless gaming assistance and real-time sports updates to users worldwide. How may I assist you today?",
    sports: {
      cricket: "Would you like to know about live cricket matches, player stats, or recent scores?",
      football: "I can help you with football match scores, player statistics, or league standings.",
      general: "Which sport would you like information about? I can help with cricket, football, and more!"
    },
    categories: {
      connection: "Connection Issues",
      performance: "Performance Problems",
      bugs: "Bug Reports",
      account: "Account Issues",
      sports: "Sports Updates"
    },
    options: {
      connection: [
        "Slow internet connection",
        "Game disconnecting",
        "Can't connect to servers",
        "High ping/latency"
      ],
      performance: [
        "Low FPS",
        "Game freezing",
        "Graphics issues",
        "System requirements"
      ],
      bugs: [
        "Game crash",
        "Visual glitches",
        "Sound problems",
        "Gameplay bugs"
      ],
      account: [
        "Login issues",
        "Account recovery",
        "In-game purchases",
        "Profile problems"
      ],
      sports: [
        "Cricket live scores",
        "Football matches",
        "Player statistics",
        "League standings"
      ]
    }
  },
  hi: {
    greeting: "नमस्ते! आज मैं गेमिंग सपोर्ट में आपकी कैसे मदद कर सकता हूं?",
    connection: "क्या आपको गेम में कनेक्शन की समस्या हो रही है?",
    performance: "चलिए आपके गेम के प्रदर्शन की जांच करते हैं। आपके सिस्टम की विशेषताएं क्या हैं?",
    bugs: "कृपया बताएं कि आपको कौन सी समस्या आ रही है?",
    thanks: "संपर्क करने के लिए धन्यवाद! अगर कोई और सहायता चाहिए तो बताएं।",
    about: "मैं एक गेमिंग सपोर्ट चैटबॉट हूं जिसे पंकज दास ने बनाया है, जो इस इनोवेटिव गेमिंग सपोर्ट प्लेटफॉर्म के CEO और संस्थापक हैं। हमारा मिशन उपयोगकर्ताओं को सर्वश्रेष्ठ गेमिंग सहायता और रीयल-टाइम खेल अपडेट प्रदान करना है। मैं आपकी कैसे मदद कर सकता हूं?",
    sports: {
      cricket: "क्या आप लाइव क्रिकेट मैच, खिलाड़ी आंकड़े, या हाल के स्कोर के बारे में जानना चाहेंगे?",
      football: "मैं आपको फुटबॉल मैच स्कोर, खिलाड़ी आंकड़े, या लीग स्टैंडिंग के बारे में बता सकता हूं।",
      general: "किस खेल के बारे में जानकारी चाहिए? मैं क्रिकेट, फुटबॉल और बहुत कुछ में मदद कर सकता हूं!"
    },
    categories: {
      connection: "कनेक्शन समस्याएं",
      performance: "प्रदर्शन समस्याएं",
      bugs: "बग रिपोर्ट",
      account: "अकाउंट समस्याएं",
      sports: "खेल अपडेट"
    },
    options: {
      connection: [
        "धीमा इंटरनेट कनेक्शन",
        "गेम डिस्कनेक्ट हो रहा है",
        "सर्वर से कनेक्ट नहीं हो पा रहा",
        "हाई पिंग/लेटेंसी"
      ],
      performance: [
        "कम FPS",
        "गेम फ्रीज हो रहा है",
        "ग्राफिक्स समस्याएं",
        "सिस्टम आवश्यकताएं"
      ],
      bugs: [
        "गेम क्रैश",
        "विजुअल गड़बड़ी",
        "साउंड समस्याएं",
        "गेमप्ले बग्स"
      ],
      account: [
        "लॉगिन समस्याएं",
        "अकाउंट रिकवरी",
        "इन-गेम खरीदारी",
        "प्रोफाइल समस्याएं"
      ],
      sports: [
        "क्रिकेट लाइव स्कोर",
        "फुटबॉल मैच",
        "खिलाड़ी आंकड़े",
        "लीग स्टैंडिंग"
      ]
    }
  }
};
