import { Request, Response } from "express";
import Thumbnail from "../models/Thumbnail.js";
import fs from "fs";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import openai from "../configs/openai.js";

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
export const generateThumbnail = async (req: Request, res: Response) => {
  try {
    const { userId } = req.session;
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

    prompt += `The thumbnail should be ${aspect_ratio || "16:9"}, visually stunning, bold, professional, and impossible to ignore.`;

    // OpenAI DALL-E 3 Call
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      response_format: "b64_json",
    });

    if (!response.data?.[0]?.b64_json) {
      throw new Error("Failed to generate image from OpenAI");
    }

    const finalBuffer = Buffer.from(response.data[0].b64_json, "base64");

    const filename = `final-output-${Date.now()}.png`;
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

    res.json({ message: "Thumbnail Generated", thumbnail });
  } catch (error: any) {
    console.error("OpenAI Generation Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// =====================
// DELETE THUMBNAIL
// =====================
export const deleteThumbnail = async (req: Request, res: Response) => {
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
