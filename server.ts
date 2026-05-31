import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON parsing middleware
  app.use(express.json());

  // API endpoints
  app.get("/api/auth/google/config", (req, res) => {
    // Return client ID
    const clientId = process.env.GOOGLE_CLIENT_ID || process.env.OAUTH_CLIENT_ID || "";
    res.json({ clientId });
  });

  app.post("/api/auth/google/verify", async (req, res) => {
    try {
      const { idToken } = req.body;
      if (!idToken) {
        return res.status(400).json({ error: "Missing ID token" });
      }

      // Verify the ID token via Google Tokeninfo endpoint
      const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`);
      if (!response.ok) {
        return res.status(400).json({ error: "Invalid token from Google verification" });
      }

      const payload = await response.json();
      
      // Basic validation: must have email
      if (!payload.email) {
        return res.status(400).json({ error: "Invalid token payload, no email found" });
      }

      res.json({
        success: true,
        user: {
          email: payload.email,
          name: payload.name || payload.email.split("@")[0],
          picture: payload.picture || "",
          sub: payload.sub,
        }
      });
    } catch (error: any) {
      console.error("Error verifying Google ID Token:", error);
      res.status(500).json({ error: "Internal server error during verification" });
    }
  });

  // Serve static files / Vite dev middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
