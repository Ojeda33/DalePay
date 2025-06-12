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
    
    print("\n🚀 Starting DalePay FREE Money Loading Tests\n")
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
    
    # If no cards exist, add a test card
    if not success or len(cards) == 0:
        print("No cards found, adding a test card...")
        test_card = {
            "card_number": "4242424242424242",  # Visa
            "card_type": "Visa",
            "expiry_month": 12,
            "expiry_year": 2030,
            "cvv": "123",
            "cardholder_name": "Test User"
        }
        tester.add_card(test_card)
        success, cards = tester.get_cards()
    
    # Test FREE money loading with different amounts
    test_amounts = [20, 50, 100]
    
    print("\n🔍 TESTING FREE MONEY LOADING\n")
    
    if len(tester.card_ids) > 0 or (success and len(cards) > 0):
        card_id = tester.card_ids[0] if tester.card_ids else cards[0]['id']
        
        for amount in test_amounts:
            print(f"\n🔍 Testing money loading with ${amount}...")
            success, fund_response = tester.fund_account(card_id, amount)
            
            if success:
                # Verify fee is zero
                fee = fund_response.get('fee', None)
                if fee is not None:
                    if fee == 0:
                        print("✅ Fee is correctly set to $0.00 (FREE)")
                    else:
                        print(f"❌ Fee should be $0.00 but got ${fee}")
                
                # Verify net amount equals amount (no fee deduction)
                net_amount = fund_response.get('net_amount', None)
                if net_amount is not None:
                    if net_amount == amount:
                        print(f"✅ Net amount (${net_amount}) equals requested amount (no fee deduction)")
                    else:
                        print(f"❌ Net amount should equal requested amount but got ${net_amount}")
                
                # Verify success message includes FREE/GRATIS wording
                message = fund_response.get('message', '')
                if 'FREE' in message or 'GRATIS' in message or 'NO FEES' in message:
                    print("✅ Success message includes FREE/GRATIS wording")
                    print(f"   Message: {message}")
                else:
                    print("❌ Success message should mention FREE/GRATIS")
                    print(f"   Message: {message}")
                
                # Check if balance increased by the exact amount
                time.sleep(1)  # Wait for balance to update
                success, new_balance_data = tester.get_user_balance()
                if success:
                    new_balance = new_balance_data.get('balance', 0)
                    expected_balance = initial_balance + amount
                    
                    print(f"New balance: ${new_balance}, Expected: ${expected_balance}")
                    if abs(new_balance - expected_balance) < 0.01:
                        print("✅ Balance increased by the FULL amount (no fee deduction)")
                    else:
                        print(f"❌ Balance did not increase as expected. Expected ${expected_balance}, got ${new_balance}")
                    
                    # Update initial balance for next test
                    initial_balance = new_balance
            else:
                print(f"❌ Failed to fund account with ${amount}")
    else:
        print("❌ No cards available for testing")
    
    # Test error cases with special card numbers
    print("\n🔍 TESTING ERROR HANDLING\n")
    
    error_cards = [
        {
            "card_number": "4000000000000000",  # Card ending in 0000 - insufficient funds
            "card_type": "Visa",
            "expiry_month": 12,
            "expiry_year": 2030,
            "cvv": "123",
            "cardholder_name": "Test User"
        },
        {
            "card_number": "4000000000001111",  # Card ending in 1111 - declined by issuer
            "card_type": "Visa",
            "expiry_month": 12,
            "expiry_year": 2030,
            "cvv": "123",
            "cardholder_name": "Test User"
        },
        {
            "card_number": "4000000000002222",  # Card ending in 2222 - expired
            "card_type": "Visa",
            "expiry_month": 12,
            "expiry_year": 2030,
            "cvv": "123",
            "cardholder_name": "Test User"
        }
    ]
    
    # Add error cards
    for card_data in error_cards:
        tester.add_card(card_data)
    
    # Test funding with error cards
    for i, card_id in enumerate(tester.card_ids[-3:]):
        print(f"\nTesting error card {i+1} (ending in {error_cards[i]['card_number'][-4:]})...")
        success, response = tester.fund_account(card_id, 50)
        # These should fail, so success should be False
        if not success:
            print("✅ Error card correctly rejected")
            # Check if error message includes available balance for card ending in 0000
            if error_cards[i]['card_number'].endswith('0000'):
                error_message = response.get('detail', '')
                if 'Available:' in error_message:
                    print("✅ Error message includes available balance information")
                    print(f"   Message: {error_message}")
                else:
                    print("❌ Error message should include available balance information")
                    print(f"   Message: {error_message}")
        else:
            print("❌ Error card was not rejected as expected")
    
    # Print test summary
    print(f"\n📊 Tests passed: {tester.tests_passed}/{tester.tests_run}")
    return tester.tests_passed == tester.tests_run

if __name__ == "__main__":
    print("🚀 Starting DalePay API Tests...")
    success = run_tests()
    print("✅ All tests passed!" if success else "❌ Some tests failed.")
