import requests
import unittest
import json
import os
import time
from datetime import datetime

class DalePayAPITester:
    def __init__(self, base_url):
        self.base_url = base_url
        self.token = None
        self.user_id = None
        self.tests_run = 0
        self.tests_passed = 0
        self.card_ids = []

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        
        if not headers:
            headers = {'Content-Type': 'application/json'}
            if self.token:
                headers['Authorization'] = f'Bearer {self.token}'

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    return success, response.json()
                except:
                    return success, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    print(f"Response: {response.json()}")
                except:
                    print(f"Response: {response.text}")
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def login(self, email, password):
        """Test login and get token"""
        success, response = self.run_test(
            "Login",
            "POST",
            "api/auth/login",
            200,
            data={"email": email, "password": password}
        )
        if success and 'access_token' in response:
            self.token = response['access_token']
            self.user_id = response['user']['id']
            print(f"Logged in as {email} with user ID: {self.user_id}")
            return True
        return False

    def get_user_profile(self):
        """Get user profile"""
        success, response = self.run_test(
            "Get User Profile",
            "GET",
            "api/users/me",
            200
        )
        if success:
            print(f"User balance: ${response.get('balance', 0)}")
        return success, response

    def get_user_balance(self):
        """Get user balance"""
        if not self.user_id:
            print("❌ No user ID available")
            return False, {}
            
        success, response = self.run_test(
            "Get User Balance",
            "GET",
            f"api/users/{self.user_id}/balance",
            200
        )
        if success:
            print(f"Balance: ${response.get('balance', 0)}")
        return success, response

    def add_card(self, card_data):
        """Add a card to the user account"""
        success, response = self.run_test(
            f"Add Card (ending in {card_data['card_number'][-4:]})",
            "POST",
            "api/cards",
            200,
            data=card_data
        )
        if success and 'card_id' in response:
            self.card_ids.append(response['card_id'])
            print(f"Added card with ID: {response['card_id']}")
        return success, response

    def get_cards(self):
        """Get user's cards"""
        success, response = self.run_test(
            "Get User Cards",
            "GET",
            "api/cards",
            200
        )
        if success:
            print(f"Found {len(response)} cards")
        return success, response

    def remove_card(self, card_id):
        """Remove a card"""
        success, response = self.run_test(
            f"Remove Card {card_id}",
            "DELETE",
            f"api/cards/{card_id}",
            200
        )
        if success:
            print(f"Successfully removed card {card_id}")
            if card_id in self.card_ids:
                self.card_ids.remove(card_id)
        return success, response

    def fund_account(self, card_id, amount):
        """Fund account with a card"""
        success, response = self.run_test(
            f"Fund Account with ${amount}",
            "POST",
            "api/fund-account",
            200,
            data={"card_id": card_id, "amount": amount}
        )
        if success:
            print(f"Successfully funded account with ${amount}")
            if 'new_balance' in response:
                print(f"New balance: ${response['new_balance']}")
        return success, response

    def get_transfers(self):
        """Get user's transfers"""
        success, response = self.run_test(
            "Get User Transfers",
            "GET",
            "api/transfers",
            200
        )
        if success:
            print(f"Found {len(response)} transfers")
        return success, response

def run_tests():
    # Get the backend URL from environment
    backend_url = os.environ.get('REACT_APP_BACKEND_URL', 'https://cbc34480-4478-4ec3-b260-5a640bb044d0.preview.emergentagent.com')
    
    # Create tester instance
    tester = DalePayAPITester(backend_url)
    
    # Test credentials
    email = "test@dalepay.com"
    password = "testpass123"
    
    print("\n🔥 Starting DalePay REAL Money Integration Tests\n")
    print("🔑 Testing with credentials:")
    print(f"   Email: {email}")
    print(f"   Password: {password}")
    
    # Login
    if not tester.login(email, password):
        print("❌ Login failed, stopping tests")
        return False
    
    # Get user profile
    success, profile = tester.get_user_profile()
    if not success:
        print("❌ Failed to get user profile")
    
    # Get initial balance
    success, balance_data = tester.get_user_balance()
    if not success:
        print("❌ Failed to get user balance")
    
    initial_balance = balance_data.get('balance', 0)
    print(f"Initial balance: ${initial_balance}")
    
    # Get existing cards
    success, cards = tester.get_cards()
    
    # Print all cards to debug
    print("\n🔍 Existing cards:")
    for card in cards:
        print(f"Card ID: {card['id']}, Last4: {card['card_number_last4']}, Type: {card['card_type']}")
    
    # Find the card ending in 1234 or add it if it doesn't exist
    card_1234 = None
    for card in cards:
        if card.get('card_number_last4') == '1234':
            card_1234 = card
            break
    
    if not card_1234:
        print("\nAdding a test card ending in 1234 (should have $31 balance)...")
        test_card_1234 = {
            "card_number": "4242424242421234",  # Card ending in 1234 with $31 balance
            "card_type": "Visa",
            "expiry_month": 12,
            "expiry_year": 2030,
            "cvv": "123",
            "cardholder_name": "Test User"
        }
        tester.add_card(test_card_1234)
        
        # Get updated cards list
        success, cards = tester.get_cards()
        
        # Find the newly added card
        for card in cards:
            if card.get('card_number_last4') == '1234':
                card_1234 = card
                break
    
    if not card_1234:
        print("❌ Failed to find or add card ending in 1234")
        return False
    
    print(f"✅ Found card ending in 1234 with ID: {card_1234['id']}")
    
    print("\n🔍 TESTING REAL MONEY INTEGRATION\n")
    
    # Test 1: Try to fund $50 (should fail - insufficient funds)
    print("\n🔍 Test 1: Funding $50 (should fail - insufficient funds)...")
    success, fund_response = tester.fund_account(card_1234['id'], 50)
    
    # This should fail because the card only has $31
    if not success:
        print("✅ $50 funding correctly rejected due to insufficient funds")
        # Check if error message includes available balance
        error_message = fund_response.get('detail', '')
        if 'Available: $31.00' in error_message or 'insufficient funds' in error_message.lower():
            print("✅ Error message correctly indicates insufficient funds")
            print(f"   Message: {error_message}")
        else:
            print("❌ Error message should indicate insufficient funds")
            print(f"   Message: {error_message}")
    else:
        print("❌ $50 funding should have failed but succeeded")
    
    # Test 2: Try to fund $10 (should succeed)
    print("\n🔍 Test 2: Funding $10 (should succeed)...")
    success, fund_response = tester.fund_account(card_1234['id'], 10)
    
    if success:
        print("✅ $10 funding succeeded")
        
        # Verify real payment was processed
        real_payment = fund_response.get('real_payment_processed', False)
        if real_payment:
            print("✅ REAL PAYMENT PROCESSED flag is True")
        else:
            print("❌ REAL PAYMENT PROCESSED flag should be True")
        
        # Verify card available balance is updated correctly
        card_available_balance = fund_response.get('card_available_balance', 0)
        expected_card_balance = 31.00 - 10.00
        if abs(card_available_balance - expected_card_balance) < 0.01:
            print(f"✅ Card available balance correctly updated to ${card_available_balance:.2f}")
        else:
            print(f"❌ Card available balance should be ${expected_card_balance:.2f}, got ${card_available_balance:.2f}")
        
        # Verify user balance is updated correctly
        time.sleep(1)  # Wait for balance to update
        success, new_balance_data = tester.get_user_balance()
        if success:
            new_balance = new_balance_data.get('balance', 0)
            expected_balance = initial_balance + 10.00
            
            print(f"New balance: ${new_balance}, Expected: ${expected_balance}")
            if abs(new_balance - expected_balance) < 0.01:
                print("✅ User balance correctly increased by $10.00")
            else:
                print(f"❌ User balance did not increase as expected. Expected ${expected_balance}, got ${new_balance}")
    else:
        print("❌ $10 funding failed but should have succeeded")
        print(f"   Error: {fund_response.get('detail', 'Unknown error')}")
    
    # Test 3: Get transfers to verify transaction was recorded
    print("\n🔍 Test 3: Checking transfer history...")
    success, transfers = tester.get_transfers()
    
    if success:
        # Look for the most recent transfer
        if len(transfers) > 0:
            latest_transfer = transfers[0]
            print("✅ Found transfer in history")
            
            # Check if it has a Moov transfer ID
            if 'moov_transfer_id' in latest_transfer and latest_transfer['moov_transfer_id']:
                print("✅ Transfer has a real Moov transfer ID")
                print(f"   Moov Transfer ID: {latest_transfer['moov_transfer_id']}")
            else:
                print("❌ Transfer should have a real Moov transfer ID")
        else:
            print("❌ No transfers found in history")
    else:
        print("❌ Failed to get transfer history")
    
    # Print test summary
    print(f"\n📊 Tests passed: {tester.tests_passed}/{tester.tests_run}")
    return tester.tests_passed == tester.tests_run

if __name__ == "__main__":
    print("🚀 Starting DalePay API Tests...")
    success = run_tests()
    print("✅ All tests passed!" if success else "❌ Some tests failed.")
