#!/bin/bash

# User Subscription API Test Script
# Base URL
BASE_URL="http://localhost:3000"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  User Subscription API Test Script${NC}"
echo -e "${BLUE}========================================${NC}"

# Get existing user and subscription IDs
echo -e "\n${BLUE}1. Getting existing users...${NC}"
USERS=$(curl -s $BASE_URL/users)
USER_ID=$(echo $USERS | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
echo "User ID: $USER_ID"

echo -e "\n${BLUE}2. Getting existing subscription plans...${NC}"
PLANS=$(curl -s $BASE_URL/subscriptions)
PLAN_ID=$(echo $PLANS | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
echo "Plan ID: $PLAN_ID"

if [ -z "$USER_ID" ] || [ -z "$PLAN_ID" ]; then
    echo -e "${RED}Error: No users or plans found. Please create them first.${NC}"
    exit 1
fi

# Test 1: Get all user subscriptions (should be empty or have existing)
echo -e "\n${BLUE}3. GET /user-subscriptions - Get all user subscriptions${NC}"
curl -s $BASE_URL/user-subscriptions | head -c 200
echo ""

# Test 2: Create a new user subscription
echo -e "\n${BLUE}4. POST /user-subscriptions - Subscribe user to a plan${NC}"
RESPONSE=$(curl -s -X POST $BASE_URL/user-subscriptions \
  -H "Content-Type: application/json" \
  -d "{\"userId\": \"$USER_ID\", \"subscriptionId\": \"$PLAN_ID\", \"autoRenew\": true}")
echo $RESPONSE | head -c 300
SUB_ID=$(echo $RESPONSE | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
echo -e "\n${GREEN}Created Subscription ID: $SUB_ID${NC}"

# Test 3: Get subscription by ID
echo -e "\n${BLUE}5. GET /user-subscriptions/:id - Get subscription by ID${NC}"
curl -s $BASE_URL/user-subscriptions/$SUB_ID | head -c 300
echo ""

# Test 4: Get subscriptions by user ID
echo -e "\n${BLUE}6. GET /user-subscriptions/user/:userId - Get user's subscriptions${NC}"
curl -s $BASE_URL/user-subscriptions/user/$USER_ID | head -c 300
echo ""

# Test 5: Get user's active subscription
echo -e "\n${BLUE}7. GET /user-subscriptions/user/:userId/active - Get active subscription${NC}"
curl -s $BASE_URL/user-subscriptions/user/$USER_ID/active | head -c 300
echo ""

# Test 6: Check subscription status
echo -e "\n${BLUE}8. GET /user-subscriptions/user/:userId/status - Check if active${NC}"
curl -s $BASE_URL/user-subscriptions/user/$USER_ID/status
echo ""

# Test 7: Update subscription
echo -e "\n${BLUE}9. PATCH /user-subscriptions/:id - Update subscription${NC}"
curl -s -X PATCH $BASE_URL/user-subscriptions/$SUB_ID \
  -H "Content-Type: application/json" \
  -d '{"autoRenew": false}' | head -c 300
echo ""

# Test 8: Renew subscription
echo -e "\n${BLUE}10. PATCH /user-subscriptions/:id/renew - Renew subscription${NC}"
curl -s -X PATCH $BASE_URL/user-subscriptions/$SUB_ID/renew | head -c 300
echo ""

# Test 9: Cancel subscription
echo -e "\n${BLUE}11. PATCH /user-subscriptions/:id/cancel - Cancel subscription${NC}"
curl -s -X PATCH $BASE_URL/user-subscriptions/$SUB_ID/cancel | head -c 300
echo ""

# Test 10: Check status after cancel
echo -e "\n${BLUE}12. GET /user-subscriptions/user/:userId/status - Status after cancel${NC}"
curl -s $BASE_URL/user-subscriptions/user/$USER_ID/status
echo ""

# Test 11: Delete subscription
echo -e "\n${BLUE}13. DELETE /user-subscriptions/:id - Delete subscription${NC}"
curl -s -X DELETE $BASE_URL/user-subscriptions/$SUB_ID -w "HTTP Status: %{http_code}"
echo ""

# Test 12: Verify deletion
echo -e "\n${BLUE}14. GET /user-subscriptions/:id - Verify deletion (should 404)${NC}"
curl -s $BASE_URL/user-subscriptions/$SUB_ID
echo ""

echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}  All tests completed!${NC}"
echo -e "${GREEN}========================================${NC}"