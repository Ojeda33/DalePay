import requests
import unittest
import json
import os
import time
import uuid
from datetime import datetime

class DalePayAPITester:
    def __init__(self, base_url):
        self.base_url = base_url
        self.token = None
        self.user_id = None
        self.tests_run = 0
        self.tests_passed = 0
        self.card_ids = []
        self.business_ids = []
        self.test_email = f"test_{uuid.uuid4().hex[:8]}@dalepay.com"
        self.test_password = "TestPass123!"

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

    def create_account(self):
        """Test account creation"""
        user_data = {
            "email": self.test_email,
            "password": self.test_password,
            "full_name": "Test User",
            "phone": "787-123-4567"
        }
        
        success, response = self.run_test(
            "Create Account",
            "POST",
            "api/auth/create-account",
            200,
            data=user_data
        )
        
        if success and 'access_token' in response:
            self.token = response['access_token']
            self.user_id = response['user']['id']
            print(f"Created account for {self.test_email} with user ID: {self.user_id}")
            return True
        return False

    def login(self, email=None, password=None):
        """Test login and get token"""
        if not email:
            email = self.test_email
        if not password:
            password = self.test_password
            
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
        
    def register_business(self, business_data):
        """Register a business"""
        success, response = self.run_test(
            "Register Business",
            "POST",
            "api/register-business",
            200,
            data=business_data
        )
        if success and 'business_id' in response:
            self.business_ids.append(response['business_id'])
            print(f"Registered business with ID: {response['business_id']}")
            return success, response
        return False, {}
        
    def get_businesses(self):
        """Get user's businesses"""
        success, response = self.run_test(
            "Get User Businesses",
            "GET",
            "api/businesses",
            200
        )
        if success:
            print(f"Found {len(response)} businesses")
        return success, response
        
    def get_business_details(self, business_id):
        """Get business details"""
        success, response = self.run_test(
            "Get Business Details",
            "GET",
            f"api/businesses/{business_id}",
            200
        )
        if success:
            print(f"Got details for business: {response.get('name', 'Unknown')}")
        return success, response
        
    def setup_business_integration(self, business_id, integration_type, extra_data=None):
        """Setup business integration"""
        data = {"type": integration_type}
        if extra_data:
            data.update(extra_data)
            
        success, response = self.run_test(
            f"Setup {integration_type} Integration",
            "POST",
            f"api/businesses/{business_id}/integrations",
            200,
            data=data
        )
        if success:
            print(f"Successfully setup {integration_type} integration")
        return success, response
        
    def get_business_integrations(self, business_id):
        """Get business integrations"""
        success, response = self.run_test(
            "Get Business Integrations",
            "GET",
            f"api/businesses/{business_id}/integrations",
            200
        )
        if success:
            print(f"Found {len(response)} integrations")
        return success, response
        
    def get_business_qr_code(self, business_id):
        """Get business QR code"""
        success, response = self.run_test(
            "Get Business QR Code",
            "GET",
            f"api/businesses/{business_id}/qr-code",
            200
        )
        if success:
            print(f"Got QR code for business")
            if response.get('ath_movil'):
                print(f"ATH Móvil QR code: {response['ath_movil'].get('qr_code')}")
        return success, response
        
    def get_business_api_key(self, business_id):
        """Get business API key"""
        success, response = self.run_test(
            "Get Business API Key",
            "GET",
            f"api/businesses/{business_id}/api-key",
            200
        )
        if success:
            print(f"Got API key: {response.get('api_key')}")
        return success, response
        
    def regenerate_business_api_key(self, business_id):
        """Regenerate business API key"""
        success, response = self.run_test(
            "Regenerate Business API Key",
            "POST",
            f"api/businesses/{business_id}/regenerate-api-key",
            200
        )
        if success:
            print(f"Regenerated API key: {response.get('api_key')}")
        return success, response
        
    def business_cashout(self, business_id, amount):
        """Cash out business funds"""
        success, response = self.run_test(
            "Business Cashout",
            "POST",
            f"api/businesses/{business_id}/cashout",
            200,
            data={"amount": amount, "method": "bank"}
        )
        if success:
            print(f"Successfully cashed out ${amount}")
            if 'new_balance' in response:
                print(f"New business balance: ${response['new_balance']}")
        return success, response
        
    def create_plaid_link_token(self):
        """Create Plaid link token"""
        success, response = self.run_test(
            "Create Plaid Link Token",
            "POST",
            "api/plaid/create-link-token",
            200
        )
        if success:
            print(f"Got Plaid link token: {response.get('link_token')}")
        return success, response
        
    def link_bank_account(self, bank_data):
        """Link bank account"""
        success, response = self.run_test(
            "Link Bank Account",
            "POST",
            "api/link-bank-account",
            200,
            data={"bank_data": bank_data}
        )
        if success:
            print(f"Successfully linked bank account")
        return success, response
        
    def get_linked_accounts(self):
        """Get linked bank accounts"""
        success, response = self.run_test(
            "Get Linked Accounts",
            "GET",
            "api/linked-accounts",
            200
        )
        if success:
            print(f"Found {len(response)} linked accounts")
        return success, response
        
    def get_account_balance(self, account_id):
        """Get account balance"""
        success, response = self.run_test(
            "Get Account Balance",
            "GET",
            f"api/account-balance/{account_id}",
            200
        )
        if success:
            print(f"Account balance: ${response.get('balance')}")
        return success, response

def run_tests():
    # Get the backend URL from environment
    backend_url = os.environ.get('REACT_APP_BACKEND_URL', 'https://cbc34480-4478-4ec3-b260-5a640bb044d0.preview.emergentagent.com')
    
    # Create tester instance
    tester = DalePayAPITester(backend_url)
    
    print("\n🔥 Starting DalePay API Tests\n")
    
    # Test 1: Create a new account
    print("\n🔍 Test 1: Creating a new account...")
    if not tester.create_account():
        print("❌ Account creation failed, trying to login with existing account")
        # Try to login with existing test account
        if not tester.login("test@dalepay.com", "testpass123"):
            print("❌ Login failed, stopping tests")
            return False
    
    # Test 2: Get user profile
    print("\n🔍 Test 2: Getting user profile...")
    success, profile = tester.get_user_profile()
    if not success:
        print("❌ Failed to get user profile")
    
    # Test 3: Get user balance (should be zero as per requirements)
    print("\n🔍 Test 3: Getting user balance...")
    success, balance_data = tester.get_user_balance()
    if not success:
        print("❌ Failed to get user balance")
    else:
        balance = balance_data.get('balance', None)
        if balance == 0:
            print("✅ Balance is correctly set to zero as required")
        else:
            print(f"❌ Balance should be zero, got {balance}")
    
    # Test 4: Add a card
    print("\n🔍 Test 4: Adding a card...")
    test_card = {
        "card_number": "4242424242421234",  # Card ending in 1234 with $31 balance
        "card_type": "Visa",
        "expiry_month": 12,
        "expiry_year": 2030,
        "cvv": "123",
        "cardholder_name": "Test User"
    }
    success, card_response = tester.add_card(test_card)
    if not success:
        print("❌ Failed to add card")
    
    # Test 5: Get cards
    print("\n🔍 Test 5: Getting cards...")
    success, cards = tester.get_cards()
    if not success or len(cards) == 0:
        print("❌ Failed to get cards or no cards found")
    
    # Test 6: Fund account
    print("\n🔍 Test 6: Funding account...")
    if len(tester.card_ids) > 0:
        success, fund_response = tester.fund_account(tester.card_ids[0], 10)
        if not success:
            print("❌ Failed to fund account")
    else:
        print("❌ No cards available for funding test")
    
    # Test 7: Get transfers (should be empty as per requirements)
    print("\n🔍 Test 7: Getting transfers...")
    success, transfers = tester.get_transfers()
    if not success:
        print("❌ Failed to get transfers")
    else:
        if len(transfers) == 0:
            print("✅ Transfers list is correctly empty as required")
        else:
            print(f"❌ Transfers list should be empty, found {len(transfers)} transfers")
    
    # Test 8: Register a business
    print("\n🔍 Test 8: Registering a business...")
    business_data = {
        "name": "Test Business",
        "business_type": "restaurant",
        "description": "Test business description",
        "address": "123 Test St, San Juan, PR",
        "phone": "787-123-4567",
        "website": "https://testbusiness.com",
        "business_structure": "llc",
        "owner_name": "Test Owner"
    }
    success, business_response = tester.register_business(business_data)
    if not success:
        print("❌ Failed to register business")
    
    # Test 9: Get businesses
    print("\n🔍 Test 9: Getting businesses...")
    success, businesses = tester.get_businesses()
    if not success or len(businesses) == 0:
        print("❌ Failed to get businesses or no businesses found")
    
    # Test 10: Get business details
    print("\n🔍 Test 10: Getting business details...")
    if len(tester.business_ids) > 0:
        success, business_details = tester.get_business_details(tester.business_ids[0])
        if not success:
            print("❌ Failed to get business details")
    else:
        print("❌ No businesses available for details test")
    
    # Test 11: Setup ATH Móvil integration
    print("\n🔍 Test 11: Setting up ATH Móvil integration...")
    if len(tester.business_ids) > 0:
        success, integration_response = tester.setup_business_integration(
            tester.business_ids[0], 
            "ath_movil", 
            {"phone_number": "787-123-4567"}
        )
        if not success:
            print("❌ Failed to setup ATH Móvil integration")
    else:
        print("❌ No businesses available for integration test")
    
    # Test 12: Get business integrations
    print("\n🔍 Test 12: Getting business integrations...")
    if len(tester.business_ids) > 0:
        success, integrations = tester.get_business_integrations(tester.business_ids[0])
        if not success:
            print("❌ Failed to get business integrations")
        elif "ath_movil" not in integrations:
            print("❌ ATH Móvil integration not found")
        else:
            print("✅ ATH Móvil integration found")
    else:
        print("❌ No businesses available for integrations test")
    
    # Test 13: Get business QR code
    print("\n🔍 Test 13: Getting business QR code...")
    if len(tester.business_ids) > 0:
        success, qr_code = tester.get_business_qr_code(tester.business_ids[0])
        if not success:
            print("❌ Failed to get business QR code")
        elif not qr_code.get('qr_code'):
            print("❌ QR code not found in response")
        else:
            print("✅ QR code found in response")
    else:
        print("❌ No businesses available for QR code test")
    
    # Test 14: Get business API key
    print("\n🔍 Test 14: Getting business API key...")
    if len(tester.business_ids) > 0:
        success, api_key_response = tester.get_business_api_key(tester.business_ids[0])
        if not success:
            print("❌ Failed to get business API key")
        elif not api_key_response.get('api_key'):
            print("❌ API key not found in response")
        else:
            print("✅ API key found in response")
    else:
        print("❌ No businesses available for API key test")
    
    # Test 15: Create Plaid link token
    print("\n🔍 Test 15: Creating Plaid link token...")
    success, link_token_response = tester.create_plaid_link_token()
    if not success:
        print("❌ Failed to create Plaid link token")
    elif not link_token_response.get('link_token'):
        print("❌ Link token not found in response")
    else:
        print("✅ Link token found in response")
    
    # Test 16: Link bank account
    print("\n🔍 Test 16: Linking bank account...")
    bank_data = {
        "institution_name": "Test Bank",
        "account_type": "checking",
        "account_name": "Test Checking",
        "account_mask": "1234"
    }
    success, link_response = tester.link_bank_account(bank_data)
    if not success:
        print("❌ Failed to link bank account")
    
    # Test 17: Get linked accounts
    print("\n🔍 Test 17: Getting linked accounts...")
    success, linked_accounts = tester.get_linked_accounts()
    if not success:
        print("❌ Failed to get linked accounts")
    elif len(linked_accounts) == 0:
        print("❌ No linked accounts found")
    else:
        print(f"✅ Found {len(linked_accounts)} linked accounts")
        
        # Test 18: Get account balance
        print("\n🔍 Test 18: Getting account balance...")
        account_id = linked_accounts[0].get('id')
        if account_id:
            success, balance_response = tester.get_account_balance(account_id)
            if not success:
                print("❌ Failed to get account balance")
            elif 'balance' not in balance_response:
                print("❌ Balance not found in response")
            else:
                print(f"✅ Account balance: ${balance_response['balance']}")
        else:
            print("❌ No account ID available for balance test")
    
    # Print test summary
    print(f"\n📊 Tests passed: {tester.tests_passed}/{tester.tests_run}")
    return tester.tests_passed == tester.tests_run

if __name__ == "__main__":
    print("🚀 Starting DalePay API Tests...")
    success = run_tests()
    print("✅ All tests passed!" if success else "❌ Some tests failed.")
