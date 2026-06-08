#!/bin/bash

# Test POST /users endpoint
echo "Testing POST /users endpoint..."
echo ""

curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@example.com\",\"password\":\"password123\",\"role\":\"CUSTOMER\",\"firstName\":\"John\",\"lastName\":\"Doe\"}" \
  -w "\n\nHTTP Status: %{http_code}\n" \
  -s | jq '.' 2>/dev/null || cat

echo ""
echo "---"
echo ""

# Test with different role
echo "Testing with VENDOR role..."
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"vendor@example.com\",\"password\":\"password123\",\"role\":\"VENDOR\",\"firstName\":\"Jane\",\"lastName\":\"Smith\"}" \
  -w "\n\nHTTP Status: %{http_code}\n" \
  -s | jq '.' 2>/dev/null || cat

echo ""
echo "---"
echo ""

# Test duplicate email (should fail)
echo "Testing duplicate email (should return 409 Conflict)..."
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@example.com\",\"password\":\"password123\",\"role\":\"CUSTOMER\"}" \
  -w "\n\nHTTP Status: %{http_code}\n" \
  -s | jq '.' 2>/dev/null || cat

echo ""
echo "---"
echo ""

# Test validation error (short password)
echo "Testing validation error (password too short)..."
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"invalid@example.com\",\"password\":\"123\",\"role\":\"CUSTOMER\"}" \
  -w "\n\nHTTP Status: %{http_code}\n" \
  -s | jq '.' 2>/dev/null || cat