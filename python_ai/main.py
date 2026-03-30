import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional
import google.generativeai as genai
from dotenv import load_dotenv
import json
import logging

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Gemini API
GEMINI_API_KEY = os.getenv("GOOGLE_GEMINI_API_KEY")
if not GEMINI_API_KEY:
    logger.warning("GOOGLE_GEMINI_API_KEY not set. AI features will not work.")
else:
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel("gemini-1.5-pro")

app = FastAPI(
    title="Paytm OmniMatch - AI Pipeline",
    description="Python FastAPI backend for AI reasoning and data pipelines",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==================== DATA MODELS ====================

class TelemetryData(BaseModel):
    footTraffic: Optional[str] = "normal"
    weather: Optional[str] = "clear"
    salesVelocity: Optional[str] = "normal"
    surplusItems: Optional[List[Dict]] = []
    hour: Optional[int] = 14
    dayOfWeek: Optional[str] = "Monday"

class VyaparRequest(BaseModel):
    merchantId: str
    merchantName: str
    telemetry: TelemetryData
    location: str
    category: str

class ScoutRequest(BaseModel):
    userId: str
    userQuery: str
    availableDealcs: List[Dict]

class ImagePromptRequest(BaseModel):
    prompt: str

# ==================== VYAPAR AI - MERCHANT REASONING ====================

@app.post("/api/ai/vyapar/generate-strategy")
async def vyapar_generate_strategy(request: VyaparRequest):
    """
    Vyapar AI Agent: Analyzes merchant telemetry and generates flash deal strategy
    Using real Gemini API calls for dynamic AI reasoning (NOT hardcoded)
    """
    try:
        if not GEMINI_API_KEY:
            raise HTTPException(status_code=503, detail="AI service unavailable")

        telemetry_summary = f"""
Merchant: {request.merchantName}
Location: {request.location}
Category: {request.category}

Real-Time Telemetry:
- Current Foot Traffic: {request.telemetry.footTraffic}
- Weather Condition: {request.telemetry.weather}
- Sales Velocity: {request.telemetry.salesVelocity}
- Current Hour: {request.telemetry.hour}:00
- Day of Week: {request.telemetry.dayOfWeek}
- Surplus Inventory Items: {json.dumps(request.telemetry.surplusItems)}
"""

        prompt = f"""You are Vyapar AI, a merchant strategy engine for the Paytm OmniMatch marketplace.

{telemetry_summary}

Based on this REAL telemetry data, generate an optimal flash deal strategy:

1. Select the BEST inventory item to promote (consider current weather, time, foot traffic, surplus)
2. Calculate a discount percentage that maximizes conversions (10-70% range)
3. Provide business reasoning for this decision
4. Generate a vivid, marketing-focused image prompt for the ad (cinematic description)

CRITICAL: Your response MUST be valid JSON only, no other text:
{{
  "itemName": "exact inventory item name",
  "currentPrice": 350.50,
  "discountPercentage": 45,
  "finalPrice": 192.75,
  "reasoning": "specific business reasoning based on the telemetry provided",
  "imagePrompt": "cinematic, high-quality photo of [item] with [weather/mood], restaurant ambiance, appetizing"
}}"""

        response = model.generate_content(prompt)
        response_text = response.text.strip()
        
        # Extract JSON from markdown blocks if present
        if "```" in response_text:
            response_text = response_text.split("```json")[1].split("```")[0].strip()
        
        strategy = json.loads(response_text)
        
        logger.info(f"[Vyapar AI] Strategy generated for {request.merchantName}: {strategy['itemName']}")
        
        return {
            "success": True,
            "strategy": strategy,
            "merchant": request.merchantName,
            "timestamp": __import__('datetime').datetime.now().isoformat()
        }
    except json.JSONDecodeError as e:
        logger.error(f"JSON parsing error: {e}")
        raise HTTPException(status_code=400, detail="AI response was not valid JSON")
    except Exception as e:
        logger.error(f"Vyapar AI error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"AI reasoning failed: {str(e)}")

# ==================== SCOUT AI - CONSUMER MATCHING ====================

@app.post("/api/ai/scout/match-deal")
async def scout_match_deal(request: ScoutRequest):
    """
    Scout AI Agent: Analyzes consumer query and matches with best available deal
    Uses real Gemini API for NLP understanding and recommendation (NOT hardcoded)
    """
    try:
        if not GEMINI_API_KEY:
            raise HTTPException(status_code=503, detail="AI service unavailable")

        if not request.availableDealcs:
            return {
                "success": False,
                "message": "No deals available to match"
            }

        dealcs_context = "\n".join([
            f"[{idx}] {deal.get('itemName', 'Unknown')} at ₹{deal.get('finalPrice', 0)} "
            f"({deal.get('discountPercentage', 0)}% off) from {deal.get('merchantName', 'Unknown')} "
            f"@ {deal.get('location', 'Location Unknown')} - Category: {deal.get('category', 'N/A')}"
            for idx, deal in enumerate(request.availableDealcs)
        ])

        prompt = f"""You are Scout AI, a consumer deal matching concierge for the Paytm OmniMatch marketplace.

CONSUMER REQUEST: "{request.userQuery}"

AVAILABLE LIVE DEALS TODAY:
{dealcs_context}

Your task:
1. Choose the BEST deal that matches the user's intent from the list above
2. Explain WHY this deal is perfect for them (be specific about their request)
3. Suggest next action (scan QR code, enter deal ID, etc.)

CRITICAL: You MUST respond with ONLY valid JSON:
{{
  "selectedDealIndex": 0,
  "confidence": 0.95,
  "recommendation": "conversational recommendation explaining the deal",
  "reasoning": "why this deal matches their request specifically",
  "actionSuggestion": "next step for the user"
}}"""

        response = model.generate_content(prompt)
        response_text = response.text.strip()
        
        # Extract JSON from markdown blocks if present
        if "```" in response_text:
            response_text = response_text.split("```json")[1].split("```")[0].strip()
        
        match_result = json.loads(response_text)
        
        # Validate deal index
        if match_result["selectedDealIndex"] < 0 or match_result["selectedDealIndex"] >= len(request.availableDealcs):
            match_result["selectedDealIndex"] = 0
        
        selected_deal = request.availableDealcs[match_result["selectedDealIndex"]]
        
        logger.info(f"[Scout AI] Matched user '{request.userId}' with deal: {selected_deal.get('itemName')}")
        
        return {
            "success": True,
            "match": match_result,
            "selectedDeal": selected_deal,
            "userId": request.userId,
            "timestamp": __import__('datetime').datetime.now().isoformat()
        }
    except json.JSONDecodeError as e:
        logger.error(f"JSON parsing error in Scout AI: {e}")
        raise HTTPException(status_code=400, detail="Scout AI response was not valid JSON")
    except Exception as e:
        logger.error(f"Scout AI error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Scout matching failed: {str(e)}")

# ==================== IMAGE PROMPT VALIDATION ====================

@app.post("/api/pipeline/validate-image-prompt")
async def validate_image_prompt(request: ImagePromptRequest):
    """
    Validates and refines image prompt for quality
    Data pipeline: Ensures image generation has optimal prompts
    """
    try:
        if not GEMINI_API_KEY:
            raise HTTPException(status_code=503, detail="AI service unavailable")

        prompt = f"""Refine this image generation prompt for maximum visual quality and marketing appeal:

Original Prompt: "{request.prompt}"

Return a refined version that:
1. Is specific and vivid
2. Includes lighting and mood
3. Is 50-100 words
4. Suitable for food/retail advertising

Return ONLY the refined prompt text, nothing else."""

        response = model.generate_content(prompt)
        refined_prompt = response.text.strip()
        
        return {
            "success": True,
            "original": request.prompt,
            "refined": refined_prompt
        }
    except Exception as e:
        logger.error(f"Prompt validation error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Prompt validation failed: {str(e)}")

# ==================== HEALTH CHECK ====================

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "Paytm OmniMatch - AI Pipeline",
        "gemini_configured": bool(GEMINI_API_KEY),
        "timestamp": __import__('datetime').datetime.now().isoformat()
    }

@app.get("/")
async def root():
    """API documentation"""
    return {
        "name": "Paytm OmniMatch - AI Pipeline",
        "version": "1.0.0",
        "description": "Python FastAPI backend for Vyapar AI and Scout AI reasoning engines",
        "endpoints": {
            "vyapar": {
                "POST /api/ai/vyapar/generate-strategy": "Merchant AI strategy generation"
            },
            "scout": {
                "POST /api/ai/scout/match-deal": "Consumer deal matching"
            },
            "pipeline": {
                "POST /api/pipeline/validate-image-prompt": "Image prompt refinement"
            }
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
