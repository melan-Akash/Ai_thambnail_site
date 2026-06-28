import { Request, Response } from "express";
import Thumbnail from "../models/Thumbnail.js";
import User from "../models/User.js";
import fs from "fs";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import "dotenv/config";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// --------------------
// PROMPTS
// --------------------
const stylePrompts: Record<string, string> = {
  "Bold & Graphic":
    "eye-catching thumbnail, bold typography, vibrant colors, expressive facial reaction, dramatic lighting, high contrast, click-worthy composition, professional style",

  "Tech/Futuristic":
    "futuristic thumbnail, sleek modern design, digital UI elements, glowing accents, holographic effects, cyber-tech aesthetic, sharp lighting, high-tech atmosphere",

  Minimalist:
    "minimalist thumbnail, clean layout, simple shapes, limited color palette, plenty of negative space, modern flat design, clear focal point",

  Photorealistic:
    "photorealistic thumbnail, ultra-realistic lighting, natural skin tones, candid moment, DSLR-style photography, lifestyle realism, shallow depth of field",

  Illustrated:
    "illustrated thumbnail, custom digital illustration, stylized characters, bold outlines, vibrant colors, creative cartoon or vector art style",
};

const colorSchemeDescriptions: Record<string, string> = {
  vibrant:
    "vibrant and energetic colors, high saturation, bold contrasts, eye-catching palette",
  sunset:
    "warm sunset tones, orange pink and purple hues, soft gradients, cinematic glow",
  forest:
    "natural green tones, earthy colors, calm and organic palette, fresh atmosphere",
  neon:
    "neon glow effects, electric blues and pinks, cyberpunk lighting, high contrast glow",
  purple:
    "purple-dominant color palette, magenta and violet tones, modern and stylish mood",
  monochrome:
    "black and white color scheme, high contrast, dramatic lighting, timeless aesthetic",
  ocean:
    "cool blue and teal tones, aquatic color palette, fresh and clean atmosphere",
  pastel:
    "soft pastel colors, low saturation, gentle tones, calm and friendly aesthetic",
};

// =====================
// GENERATE THUMBNAIL
// =====================
export const generateThumbnail = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.session;
    
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    // Check credits
    const user = await User.findById(userId);
    if (!user || user.credits <= 0) {
      res.status(403).json({ message: "Insufficient credits. Please upgrade your plan." });
      return;
    }

    const {
      title,
      prompt: user_prompt,
      style,
      aspect_ratio,
      color_scheme,
      text_overlay,
    } = req.body;

    const thumbnail = await Thumbnail.create({
      userId,
      title,
      prompt_used: user_prompt,
      user_prompt,
      style,
      aspect_ratio,
      color_scheme,
      text_overlay,
      isGenerating: true,
    });

    let prompt = `Create a ${stylePrompts[style] || "professional thumbnail"} for: "${title}". `;

    if (color_scheme) {
      prompt += `Use a ${colorSchemeDescriptions[color_scheme] || color_scheme} color scheme. `;
    }

    if (user_prompt) {
      prompt += `Additional details: ${user_prompt}. `;
    }

    if (text_overlay) {
      prompt += `Include the text "${text_overlay}" clearly visible in the thumbnail. `;
    }

    prompt += `The thumbnail should be visually stunning, bold, professional, and impossible to ignore.`;

    // We will use Hugging Face or Pollinations AI for free and reliable image generation
    let imgResponse;
    const hfToken = process.env.HUGGING_FACE_API_KEY;

    if (hfToken && hfToken !== "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") {
      try {
        const hfUrl = "https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-schnell";
        imgResponse = await fetch(hfUrl, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${hfToken}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ inputs: prompt })
        });
      } catch (e) {
        console.error("Hugging Face Generation failed, falling back to Pollinations:", e);
      }
    }

    if (!imgResponse || !imgResponse.ok) {
      // Fallback to Pollinations AI (completely free, no token required)
      const model = "flux";
      const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1024&height=576&nologo=true&model=${model}`;
      imgResponse = await fetch(pollinationsUrl);
    }

    if (!imgResponse.ok) {
        const errText = await imgResponse.text();
        console.error("AI Generation Error Response:", errText);
        throw new Error("Failed to generate image from AI. Status: " + imgResponse.status);
    }
    
    const arrayBuffer = await imgResponse.arrayBuffer();
    const finalBuffer = Buffer.from(arrayBuffer);

    const filename = `final-output-${Date.now()}.jpg`;
    const filepath = path.join("images", filename);

    fs.mkdirSync("images", { recursive: true });
    fs.writeFileSync(filepath, finalBuffer);

    const uploadResult = await cloudinary.uploader.upload(filepath, {
      resource_type: "image",
    });

    thumbnail.image_url = uploadResult.secure_url;
    thumbnail.isGenerating = false;
    await thumbnail.save();

    fs.unlinkSync(filepath);

    // Deduct credit
    user.credits -= 1;
    await user.save();

    res.json({ message: "Thumbnail Generated", thumbnail, credits: user.credits });
  } catch (error: any) {
    console.error("Pollinations Generation Error:", error);
    res.status(500).json({ message: error.message || "Something went wrong" });
  }
};

// =====================
// GET MY THUMBNAILS
// =====================
export const getMyThumbnails = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.session;
    
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const thumbnails = await Thumbnail.find({ userId }).sort({ createdAt: -1 });

    res.json({ thumbnails });
  } catch (error: any) {
    console.error("Fetch Thumbnails Error:", error);
    res.status(500).json({ message: error.message || "Something went wrong" });
  }
};

// =====================
// DELETE THUMBNAIL
// =====================
export const deleteThumbnail = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { userId } = req.session;

    await Thumbnail.findOneAndDelete({ _id: id, userId });

    res.json({ message: "Thumbnail deleted successfully" });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
