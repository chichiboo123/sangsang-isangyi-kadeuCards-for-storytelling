import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "Cards for Storytelling API is running" });
  });

  // Get random image proxy endpoint (to handle CORS issues)
  app.get("/api/images/picsum/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const imageUrl = `https://picsum.photos/200/300?random=${id}&t=${Date.now()}`;
      
      // Proxy the image request
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch image');
      }
      
      const imageBuffer = await response.arrayBuffer();
      const contentType = response.headers.get('content-type') || 'image/jpeg';
      
      res.set({
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600'
      });
      
      res.send(Buffer.from(imageBuffer));
    } catch (error) {
      console.error('Error proxying image:', error);
      res.status(500).json({ error: 'Failed to fetch image' });
    }
  });

  // Save story endpoint (for future use)
  app.post("/api/stories", async (req, res) => {
    try {
      const { title, content, cardImages } = req.body;
      
      if (!title || !content) {
        return res.status(400).json({ error: "Title and content are required" });
      }

      const story = await storage.createStory({
        title,
        content,
        cardImages: cardImages || []
      });

      res.json(story);
    } catch (error) {
      console.error('Error saving story:', error);
      res.status(500).json({ error: "Failed to save story" });
    }
  });

  // Get stories endpoint (for future use)
  app.get("/api/stories", async (req, res) => {
    try {
      const stories = await storage.getAllStories();
      res.json(stories);
    } catch (error) {
      console.error('Error fetching stories:', error);
      res.status(500).json({ error: "Failed to fetch stories" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
