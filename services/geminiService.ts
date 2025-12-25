
import { GoogleGenAI, Type } from "@google/genai";
import { Flashcard } from "../types";

export async function parsePgnToFlashcards(pgn: string): Promise<Flashcard[]> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `
      Analyze the following PGN chess game data and transform it into structured flashcards.
      
      Process:
      1. Scan for Flashcard Triggers: A new flashcard is triggered ONLY when you encounter a comment in braces {}.
      2. Front: Extract the exact text inside {}.
      3. Back Content:
         - Identify the FEN immediately following the move associated with the comment.
         - Extract variations in parentheses () immediately after the commented move. 
         - Identify the current move number (e.g., if the comment is on White's 3rd move, move_number is 3).
         - Identify the player whose turn it is in the resulting FEN position ("White" or "Black").
      
      PGN Input:
      ${pgn}
    `,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            card_id: { type: Type.INTEGER },
            front_content: {
              type: Type.OBJECT,
              properties: {
                comment_text: { type: Type.STRING }
              },
              required: ["comment_text"]
            },
            back_content: {
              type: Type.OBJECT,
              properties: {
                position_fen: { type: Type.STRING },
                variations_text: { type: Type.STRING, nullable: true },
                move_number: { type: Type.INTEGER },
                player_to_move: { type: Type.STRING }
              },
              required: ["position_fen", "variations_text", "move_number", "player_to_move"]
            }
          },
          required: ["card_id", "front_content", "back_content"]
        }
      }
    }
  });

  try {
    const jsonStr = response.text.trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Failed to parse Gemini response as JSON", error);
    throw new Error("Invalid format received from parsing engine.");
  }
}
