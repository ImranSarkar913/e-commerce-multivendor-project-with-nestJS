#!/bin/bash

# Store API Test Script
# Base URL
BASE_URL="http://localhost:3000"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}       Store API Test Script${NC}"
echo -e "${BLUE}========================================${NC}"

# Get existing user ID (vendor)
echo -e "\n${BLUE}1. Getting existing users...${NC}"
USERS=$(curl -s $BASE_URL/users)
USER_ID=$(echo $USERS | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
echo "User ID: $USER_ID"

if [ -z "$USER_ID" ]; then
    echo -e "${RED}Error: No users found. Please create a user first.${NC}"
    exit 1
fi

# Test 1: Get all stores (should be empty or have existing)
echo -e "\n${BLUE}2. GET /stores - Get all stores${NC}"
curl -s $BASE_URL/stores | head -c 300
echo ""

# Test 2: Create a new store
echo -e "\n${BLUE}3. POST /stores - Create a new store${NC}"
RESPONSE=$(curl -s -X POST $BASE_URL/stores \
  -H "Content-Type: application/json" \
  -d "{
    \"userId\": \"$USER_ID\",
    \"name\": \"Tech Gadgets Store\",
    \"slug\": \"tech-gadgets-store-$(date +%s)\",
    \"description\": \"Your one-stop shop for the latest tech gadgets and accessories\",
    \"contactEmail\": \"contact@techgadgets.com\",
    \"contactPhone\": \"+1-555-123-4567\"
  }")
echo $RESPONSE | head -c 400
STORE_ID=$(echo $RESPONSE | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
echo -e "\n${GREEN}Created Store ID: $STORE_ID${NC}"

if [ -z "$STORE_ID" ]; then
    echo -e "${RED}Error: Failed to create store.${NC}"
    exit 1
fi

# Test 3: Get store by ID
echo -e "\n${BLUE}4. GET /stores/:id - Get store by ID${NC}"
curl -s $BASE_URL/stores/$STORE_ID | head -c 400
echo ""

# Test 4: Get store by user ID
echo -e "\n${BLUE}5. GET /stores/user/:userId - Get store by user ID${NC}"
curl -s $BASE_URL/stores/user/$USER_ID | head -c 400
echo ""

# Test 5: Search stores
echo -e "\n${BLUE}6. GET /stores/search - Search stores by name${NC}"
curl -s "$BASE_URL/stores/search?name=Tech" | head -c 400
echo ""

# Test 6: Search stores by status
echo -e "\n${BLUE}7. GET /stores/search - Search stores by status${NC}"
curl -s "$BASE_URL/stores/search?status=PENDING_APPROVAL" | head -c 400
echo ""

# Test 7: Update store
echo -e "\n${BLUE}8. PATCH /stores/:id - Update store${NC}"
curl -s -X PATCH $BASE_URL/stores/$STORE_ID \
  -H "Content-Type: application/json" \
  -d "{
    \"userId\": \"$USER_ID\",
    \"name\": \"Tech Gadgets Pro Store\",
    \"description\": \"Premium tech gadgets and accessories with expert support\",
    \"logo\": \"https://example.com/logos/tech-gadgets-pro.png\",
    \"contactEmail\": \"support@techgadgetspro.com\",
    \"contactPhone\": \"+1-555-987-6543\"
  }" | head -c 400
echo ""

# Test 8: Update store status to ACTIVE
echo -e "\n${BLUE}9. PATCH /stores/:id - Update store status to ACTIVE${NC}"
curl -s -X PATCH $BASE_URL/stores/$STORE_ID \
  -H "Content-Type: application/json" \
  -d "{
    \"userId\": \"$USER_ID\",
    \"status\": \"ACTIVE\"
  }" | head -c 400
echo ""

# Test 9: Search active stores
echo -e "\n${BLUE}10. GET /stores/search - Search active stores${NC}"
curl -s "$BASE_URL/stores/search?status=ACTIVE" | head -c 400
echo ""

# Test 10: Get store by slug (if endpoint exists)
echo -e "\n${BLUE}11. GET /stores/slug/:slug - Get store by slug${NC}"
SLUG=$(curl -s $BASE_URL/stores/$STORE_ID | grep -o '"slug":"[^"]*"' | cut -d'"' -f4)
curl -s $BASE_URL/stores/slug/$SLUG | head -c 400
echo ""

# Test 11: Update store status to SUSPENDED
echo -e "\n${BLUE}12. PATCH /stores/:id - Suspend store${NC}"
curl -s -X PATCH $BASE_URL/stores/$STORE_ID \
  -H "Content-Type: application/json" \
  -d "{
    \"userId\": \"$USER_ID\",
    \"status\": \"SUSPENDED\"
  }" | head -c 400
echo ""

# Test 12: Get all stores after updates
echo -e "\n${BLUE}13. GET /stores - Get all stores after updates${NC}"
curl -s $BASE_URL/stores | head -c 500
echo ""

# Test 13: Delete store
echo -e "\n${BLUE}14. DELETE /stores/:id - Delete store${NC}"
curl -s -X DELETE $BASE_URL/stores/$STORE_ID -w "HTTP Status: %{http_code}"
echo ""

# Test 14: Verify deletion
echo -e "\n${BLUE}15. GET /stores/:id - Verify deletion (should 404)${NC}"
curl -s $BASE_URL/stores/$STORE_ID
echo ""

echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}     All store tests completed!${NC}"
echo -e "${GREEN}========================================${NC}"