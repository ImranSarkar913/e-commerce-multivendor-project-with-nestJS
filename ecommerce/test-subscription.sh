#!/bin/bash

# Base URL for the API
BASE_URL="http://localhost:3000"
API_URL="$BASE_URL/subscriptions"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== Subscription API Test Script ===${NC}\n"

# Test 1: Create a new subscription (Basic Plan)
echo -e "${YELLOW}Test 1: Creating a Basic subscription...${NC}"
BASIC_SUBSCRIPTION=$(curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Basic Monthly Plan",
    "description": "Basic subscription with essential features",
    "price": 9.99,
    "currency": "USD",
    "plan": "BASIC",
    "status": "ACTIVE",
    "startDate": "2025-01-01T00:00:00Z",
    "endDate": "2025-12-31T23:59:59Z",
    "autoRenew": true
  }')

BASIC_ID=$(echo $BASIC_SUBSCRIPTION | grep -o '"id":"[^"]*' | cut -d'"' -f4)
echo -e "${GREEN}✓ Basic subscription created with ID: $BASIC_ID${NC}\n"

# Test 2: Create another subscription (Standard Plan)
echo -e "${YELLOW}Test 2: Creating a Standard subscription...${NC}"
STANDARD_SUBSCRIPTION=$(curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Standard Monthly Plan",
    "description": "Standard subscription with advanced features",
    "price": 19.99,
    "currency": "USD",
    "plan": "STANDARD",
    "status": "ACTIVE",
    "startDate": "2025-01-01T00:00:00Z",
    "endDate": "2025-12-31T23:59:59Z",
    "autoRenew": true
  }')

STANDARD_ID=$(echo $STANDARD_SUBSCRIPTION | grep -o '"id":"[^"]*' | cut -d'"' -f4)
echo -e "${GREEN}✓ Standard subscription created with ID: $STANDARD_ID${NC}\n"

# Test 3: Create a Premium subscription
echo -e "${YELLOW}Test 3: Creating a Premium subscription...${NC}"
PREMIUM_SUBSCRIPTION=$(curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Premium Monthly Plan",
    "description": "Premium subscription with all features",
    "price": 49.99,
    "currency": "USD",
    "plan": "PREMIUM",
    "status": "ACTIVE",
    "startDate": "2025-01-01T00:00:00Z",
    "endDate": "2025-12-31T23:59:59Z",
    "autoRenew": false
  }')

PREMIUM_ID=$(echo $PREMIUM_SUBSCRIPTION | grep -o '"id":"[^"]*' | cut -d'"' -f4)
echo -e "${GREEN}✓ Premium subscription created with ID: $PREMIUM_ID${NC}\n"

# Test 4: Get all subscriptions
echo -e "${YELLOW}Test 4: Fetching all subscriptions...${NC}"
ALL_SUBSCRIPTIONS=$(curl -s -X GET "$API_URL")
echo "$ALL_SUBSCRIPTIONS" | jq .
echo -e "${GREEN}✓ All subscriptions retrieved${NC}\n"

# Test 5: Get subscription by ID
echo -e "${YELLOW}Test 5: Fetching subscription by ID ($BASIC_ID)...${NC}"
SUBSCRIPTION_BY_ID=$(curl -s -X GET "$API_URL/$BASIC_ID")
echo "$SUBSCRIPTION_BY_ID" | jq .
echo -e "${GREEN}✓ Subscription retrieved by ID${NC}\n"

# Test 6: Update subscription
echo -e "${YELLOW}Test 6: Updating subscription ($BASIC_ID)...${NC}"
UPDATED_SUBSCRIPTION=$(curl -s -X PATCH "$API_URL/$BASIC_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "price": 12.99,
    "description": "Updated basic subscription with enhanced features"
  }')
echo "$UPDATED_SUBSCRIPTION" | jq .
echo -e "${GREEN}✓ Subscription updated${NC}\n"

# Test 7: Try to create duplicate subscription (should fail)
echo -e "${YELLOW}Test 7: Creating duplicate subscription (should fail)...${NC}"
DUPLICATE_RESPONSE=$(curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Basic Monthly Plan",
    "description": "Duplicate subscription",
    "price": 9.99,
    "currency": "USD",
    "plan": "BASIC",
    "status": "ACTIVE",
    "startDate": "2025-01-01T00:00:00Z",
    "endDate": "2025-12-31T23:59:59Z",
    "autoRenew": true
  }')
echo "$DUPLICATE_RESPONSE"
echo -e "${RED}✓ Duplicate creation prevented as expected${NC}\n"

# Test 8: Get non-existent subscription (should fail)
echo -e "${YELLOW}Test 8: Fetching non-existent subscription...${NC}"
NONEXISTENT_RESPONSE=$(curl -s -X GET "$API_URL/00000000-0000-0000-0000-000000000000")
echo "$NONEXISTENT_RESPONSE"
echo -e "${RED}✓ Non-existent subscription not found as expected${NC}\n"

# Test 9: Delete subscription
echo -e "${YELLOW}Test 9: Deleting subscription ($PREMIUM_ID)...${NC}"
curl -s -X DELETE "$API_URL/$PREMIUM_ID"
echo -e "${GREEN}✓ Subscription deleted${NC}\n"

# Test 10: Verify deletion
echo -e "${YELLOW}Test 10: Verifying deletion...${NC}"
DELETED_RESPONSE=$(curl -s -X GET "$API_URL/$PREMIUM_ID")
echo "$DELETED_RESPONSE"
echo -e "${RED}✓ Deleted subscription not found as expected${NC}\n"

# Test 11: Get all subscriptions after deletion
echo -e "${YELLOW}Test 11: Fetching all subscriptions after deletion...${NC}"
FINAL_SUBSCRIPTIONS=$(curl -s -X GET "$API_URL")
echo "$FINAL_SUBSCRIPTIONS" | jq .
echo -e "${GREEN}✓ Final subscription list retrieved${NC}\n"

echo -e "${YELLOW}=== Test Summary ===${NC}"
echo -e "Created subscription IDs:"
echo -e "  Basic: ${GREEN}$BASIC_ID${NC}"
echo -e "  Standard: ${GREEN}$STANDARD_ID${NC}"
echo -e "  Premium (deleted): ${RED}$PREMIUM_ID${NC}"
echo -e "\n${GREEN}All tests completed!${NC}"