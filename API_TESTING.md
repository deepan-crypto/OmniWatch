# 🧪 API Testing Guide - Paytm OmniMatch

This guide provides examples for testing all endpoints in your hackathon project.

## 📝 Prerequisites

- All three services running (Node.js, Python, React)
- API testing tool (Postman, Insomnia, or curl)
- Gemini API key configured

---

## 🏪 VYAPAR AI (MERCHANT) ENDPOINTS

### 1. Register a Merchant

**Endpoint**: `POST /api/vyapar/merchant/register`

```json
{
  "merchantId": "merchant_coimbatore_001",
  "name": "Coimbatore Spice House",
  "location": "Coimbatore",
  "category": "Indian Restaurant",
  "inventory": [
    {
      "id": "item_001",
      "name": "Gobi Manchurian",
      "quantity": 100,
      "basePrice": 250
    },
    {
      "id": "item_002",
      "name": "Biryani",
      "quantity": 60,
      "basePrice": 350
    }
  ]
}
```

**Expected Response**:
```json
{
  "success": true,
  "message": "Merchant Coimbatore Spice House registered successfully",
  "merchantId": "merchant_coimbatore_001"
}
```

---

### 2. Generate Flash Deal (Vyapar AI)

**Endpoint**: `POST /api/vyapar/merchant/generate-deal`

This is where Vyapar AI analyzes telemetry and generates a data-driven deal strategy.

```json
{
  "merchantId": "merchant_coimbatore_001",
  "telemetry": {
    "footTraffic": "low",
    "weather": "rainy",
    "salesVelocity": "declining",
    "hour": 18,
    "dayOfWeek": "Thursday"
  }
}
```

**Expected Response**:
```json
{
  "success": true,
  "message": "Flash deal generated and registered",
  "deal": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "timestamp": "2026-03-30T18:00:00.000Z",
    "expiresAt": "2026-03-30T19:00:00.000Z",
    "status": "active",
    "merchantId": "merchant_coimbatore_001",
    "merchantName": "Coimbatore Spice House",
    "location": "Coimbatore",
    "category": "Indian Restaurant",
    "itemName": "Gobi Manchurian",
    "originalPrice": 250,
    "discountPercentage": 45,
    "finalPrice": 137.50,
    "reasoning": "Rainy weather drives demand for hot, comforting food. Gobi Manchurian at 45% discount will capture price-sensitive customers during low foot traffic period.",
    "imageUrl": "https://images.unsplash.com/photo-...",
    "qrCode": "data:image/png;base64,...",
    "createdBy": "VyaparAI"
  }
}
```

---

### 3. Get All Active Deals

**Endpoint**: `GET /api/vyapar/deals/active`

```bash
curl http://localhost:5000/api/vyapar/deals/active
```

**Expected Response**:
```json
{
  "success": true,
  "dealCount": 2,
  "dealcs": [
    {
      "id": "550e8400-...",
      "itemName": "Gobi Manchurian",
      "merchantName": "Coimbatore Spice House",
      "finalPrice": 137.50,
      "discountPercentage": 45,
      "status": "active"
    }
  ]
}
```

---

### 4. Get Specific Deal

**Endpoint**: `GET /api/vyapar/deals/:dealId`

```bash
curl http://localhost:5000/api/vyapar/deals/550e8400-e29b-41d4-a716-446655440000
```

---

### 5. Complete a Deal (Checkout)

**Endpoint**: `POST /api/vyapar/deals/:dealId/complete`

```json
{
  "transactionId": "txn_12345_paytm"
}
```

**Expected Response**:
```json
{
  "success": true,
  "message": "Deal completed successfully",
  "deal": {
    "status": "completed",
    "transactionId": "txn_12345_paytm",
    "completedAt": "2026-03-30T18:05:00.000Z"
  }
}
```

---

### 6. Get Registry History

**Endpoint**: `GET /api/vyapar/registry/history`

```bash
curl http://localhost:5000/api/vyapar/registry/history
```

Returns last 50 transactions (created, completed, expired deals).

---

## 🔍 SCOUT AI (CONSUMER) ENDPOINTS

### 1. Create Consumer Session

**Endpoint**: `POST /api/scout/session/create`

```json
{
  "userId": "consumer_user_123"
}
```

**Expected Response**:
```json
{
  "success": true,
  "message": "Session created for user consumer_user_123",
  "userId": "consumer_user_123"
}
```

---

### 2. Query for Deal Recommendations (Scout AI)

**Endpoint**: `POST /api/scout/query`

This is where Scout AI analyzes the user's query and matches it to the best deal.

```json
{
  "userId": "consumer_user_123",
  "query": "It's raining, I want something spicy near me"
}
```

**Expected Response**:
```json
{
  "success": true,
  "result": {
    "success": true,
    "recommendation": {
      "dealId": "550e8400-...",
      "itemName": "Gobi Manchurian",
      "merchantName": "Coimbatore Spice House",
      "location": "Coimbatore",
      "originalPrice": 250,
      "finalPrice": 137.50,
      "discountPercentage": 45,
      "imageUrl": "https://images.unsplash.com/photo-...",
      "qrCode": "data:image/png;base64,...",
      "scoutRecommendation": "Perfect! Since it's raining, Coimbatore Spice House just launched Gobi Manchurian (spicy) at 45% off. Great timing!",
      "scoutReasoning": "Rainy weather + spicy food craving = hot comfort food demand. This deal matches perfectly.",
      "actionSuggestion": "Scan the QR code or click 'Pay with Paytm Wallet' to complete your order."
    },
    "allAvailableDeals": [
      {
        "id": "550e8400-...",
        "itemName": "Gobi Manchurian",
        "merchantName": "Coimbatore Spice House",
        "finalPrice": 137.50,
        "discountPercentage": 45
      }
    ]
  }
}
```

---

### 3. Conversational Chat

**Endpoint**: `POST /api/scout/chat`

```json
{
  "userId": "consumer_user_123",
  "message": "What's good for a coffee break?"
}
```

Same response format as `/query`.

---

### 4. Get User Session History

**Endpoint**: `GET /api/scout/session/:userId`

```bash
curl http://localhost:5000/api/scout/session/consumer_user_123
```

**Expected Response**:
```json
{
  "success": true,
  "session": {
    "userId": "consumer_user_123",
    "createdAt": "2026-03-30T17:00:00.000Z",
    "queries": [
      "It's raining, I want something spicy near me",
      "What's good for a coffee break?"
    ],
    "recommendations": [
      {
        "query": "It's raining, I want something spicy near me",
        "dealId": "550e8400-...",
        "timestamp": "2026-03-30T18:00:00.000Z"
      }
    ]
  }
}
```

---

### 5. Get All Consumer Sessions (Analytics)

**Endpoint**: `GET /api/scout/sessions/all`

```bash
curl http://localhost:5000/api/scout/sessions/all
```

---

## 🤖 PYTHON AI PIPELINE ENDPOINTS

### 1. Vyapar AI Strategy Generation

**Endpoint**: `POST http://localhost:8000/api/ai/vyapar/generate-strategy`

This endpoint calls Gemini AI for merchant reasoning.

```json
{
  "merchantId": "merchant_coimbatore_001",
  "merchantName": "Coimbatore Spice House",
  "telemetry": {
    "footTraffic": "low",
    "weather": "rainy",
    "salesVelocity": "declining",
    "surplusItems": [
      {
        "id": "item_001",
        "name": "Gobi Manchurian",
        "quantity": 100
      }
    ],
    "hour": 18,
    "dayOfWeek": "Thursday"
  },
  "location": "Coimbatore",
  "category": "Indian Restaurant"
}
```

**Expected Response**:
```json
{
  "success": true,
  "strategy": {
    "itemName": "Gobi Manchurian",
    "currentPrice": 250,
    "discountPercentage": 45,
    "finalPrice": 137.5,
    "reasoning": "Rainy weather increases demand for hot, spicy comfort food. Low foot traffic requires aggressive discount.",
    "imagePrompt": "cinematic photo of steaming Gobi Manchurian with restaurant ambiance, warm lighting, appetizing"
  },
  "merchant": "Coimbatore Spice House",
  "timestamp": "2026-03-30T18:00:00.000000"
}
```

---

### 2. Scout AI Deal Matching

**Endpoint**: `POST http://localhost:8000/api/ai/scout/match-deal`

```json
{
  "userId": "consumer_user_123",
  "userQuery": "It's raining, I want something spicy near me",
  "availableDealcs": [
    {
      "id": "550e8400-...",
      "itemName": "Gobi Manchurian",
      "merchantName": "Coimbatore Spice House",
      "finalPrice": 137.50,
      "discountPercentage": 45,
      "location": "Coimbatore",
      "category": "Indian Restaurant"
    }
  ]
}
```

**Expected Response**:
```json
{
  "success": true,
  "match": {
    "selectedDealIndex": 0,
    "confidence": 0.98,
    "recommendation": "Perfect match! Gobi Manchurian is exactly what you're looking for on a rainy day.",
    "reasoning": "Your rainy weather + spicy food craving perfectly matches this hot, comforting dish at 45% off.",
    "actionSuggestion": "Scan the QR code to pay immediately with your Paytm wallet."
  },
  "selectedDeal": {
    "itemName": "Gobi Manchurian",
    "merchantName": "Coimbatore Spice House",
    "finalPrice": 137.50
  },
  "timestamp": "2026-03-30T18:00:00.000000"
}
```

---

### 3. Image Prompt Validation

**Endpoint**: `POST http://localhost:8000/api/pipeline/validate-image-prompt`

```json
{
  "prompt": "Gobi Manchurian"
}
```

**Expected Response**:
```json
{
  "success": true,
  "original": "Gobi Manchurian",
  "refined": "Cinematic, high-quality photo of steaming Gobi Manchurian with glossy sauce, warm restaurant ambiance, golden lighting, appetizing presentation"
}
```

---

### 4. Health Check

**Endpoint**: `GET http://localhost:8000/health`

```bash
curl http://localhost:8000/health
```

**Expected Response**:
```json
{
  "status": "healthy",
  "service": "Paytm OmniMatch - AI Pipeline",
  "gemini_configured": true,
  "timestamp": "2026-03-30T18:00:00.000000"
}
```

---

### 5. Interactive API Documentation

**URL**: `http://localhost:8000/docs`

Opens Swagger UI with all endpoints, request/response schemas, and try-it-out functionality.

---

## 🧩 End-to-End Flow Test

### Complete Scenario: Rainy Day, Hungry Customer

```bash
# Step 1: Register merchant (if not already done)
curl -X POST http://localhost:5000/api/vyapar/merchant/register \
  -H "Content-Type: application/json" \
  -d '{
    "merchantId": "merchant_test_001",
    "name": "Test Restaurant",
    "location": "Downtown",
    "category": "Food",
    "inventory": [{
      "id": "item_1",
      "name": "Hot Biryani",
      "quantity": 50,
      "basePrice": 300
    }]
  }'

# Step 2: Generate flash deal based on rainy weather
curl -X POST http://localhost:5000/api/vyapar/merchant/generate-deal \
  -H "Content-Type: application/json" \
  -d '{
    "merchantId": "merchant_test_001",
    "telemetry": {
      "weather": "rainy",
      "footTraffic": "low",
      "salesVelocity": "declining"
    }
  }'

# Step 3: Create consumer session
curl -X POST http://localhost:5000/api/scout/session/create \
  -H "Content-Type: application/json" \
  -d '{"userId": "consumer_rainy"}'

# Step 4: Consumer searches for spicy food in rain
curl -X POST http://localhost:5000/api/scout/query \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "consumer_rainy",
    "query": "I'\''m hungry for hot spicy food in this rain"
  }'

# Step 5: Scout AI returns perfect match with QR code
# Consumer scans QR → Completes transaction
```

---

## 📊 Testing with Postman

1. **Import Collection**: Create a new Postman collection and add all endpoints
2. **Environment Variables**:
   ```json
   {
     "base_url": "http://localhost:5000",
     "python_url": "http://localhost:8000",
     "merchantId": "merchant_coimbatore_001",
     "userId": "consumer_test_123"
   }
   ```
3. **Run Tests**: Use Postman's test runner for integration testing

---

## 🔧 Troubleshooting API Calls

### Error: "Cannot find Python backend"
- Ensure Python FastAPI is running on port 8000
- Check: `curl http://localhost:8000/health`

### Error: "Gemini API unavailable"
- Verify API key in `.env`
- Check API quota in Google console
- Retry with exponential backoff

### Error: "No active deals"
- Generate a deal first using Vyapar endpoint
- Check ONDC Registry is not expired (1 hour validity)

### Error: CORS issues
- Check browser console for actual error
- Verify Node.js CORS middleware is enabled
- Clear browser cache

---

**Happy Testing! 🚀**
