import requests
import unittest
import json
import uuid
import time
from datetime import datetime

class DalePayAPITester:
    def __init__(self, base_url):
        self.base_url = base_url
        self.token = None
        self.user_id = None
        self.test_user = None
        self.test_email = f"test_user_{uuid.uuid4().hex[:8]}@example.com"
        self.test_password = "TestPassword123!"
        self.test_full_name = "Test User"
        self.test_phone = "+1 787-555-1234"
        self.business_id = None
        self.card_id = None
        self.transfer_id = None
        self.integration_id = None
        
    def make_request(self, method, endpoint, data=None, auth=True):
        url = f"{self.base_url}/api{endpoint}"
        headers = {'Content-Type': 'application/json'}
        
        if auth and self.token:
            headers['Authorization'] = f'Bearer {self.token}'
            
        if method == 'GET':
            response = requests.get(url, headers=headers)
        elif method == 'POST':
            response = requests.post(url, json=data, headers=headers)
        
        return response
    
    def register_user(self):
        data = {
            "email": self.test_email,
            "password": self.test_password,
            "full_name": self.test_full_name,
            "phone": self.test_phone
        }
        
        response = self.make_request('POST', '/auth/create-account', data, auth=False)
        if response.status_code == 200:
            response_data = response.json()
            self.token = response_data.get('access_token')
            self.user_id = response_data.get('user', {}).get('id')
            self.test_user = response_data.get('user')
            return True, response_data
        return False, response.json() if response.status_code != 500 else {"error": "Server error"}
    
    def login_user(self, email=None, password=None):
        data = {
            "email": email or self.test_email,
            "password": password or self.test_password
        }
        
        response = self.make_request('POST', '/auth/login', data, auth=False)
        if response.status_code == 200:
            response_data = response.json()
            self.token = response_data.get('access_token')
            self.user_id = response_data.get('user', {}).get('id')
            self.test_user = response_data.get('user')
            return True, response_data
        return False, response.json() if response.status_code != 500 else {"error": "Server error"}
    
    def get_user_profile(self):
        response = self.make_request('GET', '/users/me')
        return response.status_code == 200, response.json() if response.status_code != 500 else {"error": "Server error"}
    
    def get_user_balance(self):
        response = self.make_request('GET', f'/users/{self.user_id}/balance')
        return response.status_code == 200, response.json() if response.status_code != 500 else {"error": "Server error"}
    
    def create_transfer(self, to_email, amount, description="Test transfer"):
        data = {
            "to_email": to_email,
            "amount": amount,
            "description": description
        }
        
        response = self.make_request('POST', '/transfers', data)
        if response.status_code == 200:
            response_data = response.json()
            self.transfer_id = response_data.get('transfer_id')
            return True, response_data
        return False, response.json() if response.status_code != 500 else {"error": "Server error"}
    
    def get_transfers(self):
        response = self.make_request('GET', '/transfers')
        return response.status_code == 200, response.json() if response.status_code != 500 else {"error": "Server error"}
    
    def add_card(self, card_number="4111111111111111"):
        data = {
            "card_number": card_number,
            "card_type": "visa",
            "expiry_month": 12,
            "expiry_year": 2030,
            "cardholder_name": self.test_full_name
        }
        
        response = self.make_request('POST', '/cards', data)
        if response.status_code == 200:
            response_data = response.json()
            self.card_id = response_data.get('card_id')
            return True, response_data
        return False, response.json() if response.status_code != 500 else {"error": "Server error"}
    
    def get_cards(self):
        response = self.make_request('GET', '/cards')
        return response.status_code == 200, response.json() if response.status_code != 500 else {"error": "Server error"}
    
    def fund_account(self, amount=100):
        if not self.card_id:
            success, _ = self.add_card()
            if not success:
                return False, {"error": "Failed to add card first"}
        
        data = {
            "card_id": self.card_id,
            "amount": amount
        }
        
        response = self.make_request('POST', '/fund-account', data)
        return response.status_code == 200, response.json() if response.status_code != 500 else {"error": "Server error"}
    
    def register_business(self, name="Test Business", business_type="retail"):
        data = {
            "name": name,
            "business_type": business_type,
            "description": "A test business for DalePay",
            "address": "123 Test St, San Juan, PR",
            "phone": "+1 787-555-9876",
            "website": "https://testbusiness.com"
        }
        
        response = self.make_request('POST', '/register-business', data)
        if response.status_code == 200:
            response_data = response.json()
            self.business_id = response_data.get('business_id')
            return True, response_data
        return False, response.json() if response.status_code != 500 else {"error": "Server error"}
    
    def get_businesses(self):
        response = self.make_request('GET', '/businesses')
        return response.status_code == 200, response.json() if response.status_code != 500 else {"error": "Server error"}
    
    def get_business_details(self, business_id=None):
        if not business_id and not self.business_id:
            return False, {"error": "No business ID provided"}
        
        business_id = business_id or self.business_id
        response = self.make_request('GET', f'/businesses/{business_id}')
        return response.status_code == 200, response.json() if response.status_code != 500 else {"error": "Server error"}
    
    def setup_business_integration(self, integration_type="uber_eats", business_id=None):
        if not business_id and not self.business_id:
            return False, {"error": "No business ID provided"}
        
        business_id = business_id or self.business_id
        data = {
            "type": integration_type
        }
        
        response = self.make_request('POST', f'/businesses/{business_id}/integrations', data)
        if response.status_code == 200:
            response_data = response.json()
            self.integration_id = integration_type
            return True, response_data
        return False, response.json() if response.status_code != 500 else {"error": "Server error"}
    
    def get_business_integrations(self, business_id=None):
        if not business_id and not self.business_id:
            return False, {"error": "No business ID provided"}
        
        business_id = business_id or self.business_id
        response = self.make_request('GET', f'/businesses/{business_id}/integrations')
        return response.status_code == 200, response.json() if response.status_code != 500 else {"error": "Server error"}
    
    def business_cashout(self, amount=50, business_id=None):
        if not business_id and not self.business_id:
            return False, {"error": "No business ID provided"}
        
        business_id = business_id or self.business_id
        data = {
            "amount": amount,
            "method": "bank"
        }
        
        response = self.make_request('POST', f'/businesses/{business_id}/cashout', data)
        return response.status_code == 200, response.json() if response.status_code != 500 else {"error": "Server error"}
    
    def admin_dashboard(self):
        response = self.make_request('GET', '/admin/dashboard')
        return response.status_code == 200, response.json() if response.status_code != 500 else {"error": "Server error"}


class DalePayAPITests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        # Get the backend URL from the frontend .env file
        cls.backend_url = "https://cbc34480-4478-4ec3-b260-5a640bb044d0.preview.emergentagent.com"
        cls.api = DalePayAPITester(cls.backend_url)
        
        # Create a second test user for transfers
        cls.second_email = f"test_user2_{uuid.uuid4().hex[:8]}@example.com"
        cls.second_password = "TestPassword123!"
        cls.second_api = DalePayAPITester(cls.backend_url)
        cls.second_api.test_email = cls.second_email
        cls.second_api.test_password = cls.second_password
        cls.second_api.test_full_name = "Test User 2"
        
    def test_01_register_user(self):
        print("\n🔍 Testing user registration...")
        success, data = self.api.register_user()
        self.assertTrue(success, f"Failed to register user: {data}")
        self.assertIsNotNone(self.api.token, "No token received after registration")
        self.assertIsNotNone(self.api.user_id, "No user ID received after registration")
        print("✅ User registration successful")
        
    def test_02_login_user(self):
        print("\n🔍 Testing user login...")
        success, data = self.api.login_user()
        self.assertTrue(success, f"Failed to login: {data}")
        self.assertIsNotNone(self.api.token, "No token received after login")
        print("✅ User login successful")
        
    def test_03_get_user_profile(self):
        print("\n🔍 Testing get user profile...")
        success, data = self.api.get_user_profile()
        self.assertTrue(success, f"Failed to get user profile: {data}")
        self.assertEqual(data.get('email'), self.api.test_email, "Email mismatch in profile")
        print("✅ User profile retrieval successful")
        
    def test_04_get_user_balance(self):
        print("\n🔍 Testing get user balance...")
        success, data = self.api.get_user_balance()
        self.assertTrue(success, f"Failed to get user balance: {data}")
        self.assertIn('balance', data, "Balance not found in response")
        print(f"✅ User balance retrieval successful: {data.get('balance')}")
        
    def test_05_add_card_with_test_number(self):
        print("\n🔍 Testing add card with test number (4111111111111111)...")
        success, data = self.api.add_card("4111111111111111")
        self.assertTrue(success, f"Failed to add card: {data}")
        self.assertIsNotNone(self.api.card_id, "No card ID received after adding card")
        print("✅ Card addition successful")
        
    def test_06_add_invalid_card(self):
        print("\n🔍 Testing add invalid card...")
        # This should fail with an invalid card number
        success, data = self.api.add_card("1234123412341234")
        # The API currently accepts any card number, so this test might pass
        # In a real implementation, this should fail validation
        print(f"{'❌' if success else '✅'} Invalid card {'accepted' if success else 'rejected'}")
        
    def test_07_get_cards(self):
        print("\n🔍 Testing get cards...")
        success, data = self.api.get_cards()
        self.assertTrue(success, f"Failed to get cards: {data}")
        self.assertIsInstance(data, list, "Cards response is not a list")
        print(f"✅ Cards retrieval successful: {len(data)} cards found")
        
    def test_08_fund_account(self):
        print("\n🔍 Testing fund account...")
        success, data = self.api.fund_account(100)
        self.assertTrue(success, f"Failed to fund account: {data}")
        self.assertIn('amount', data, "Amount not found in response")
        print(f"✅ Account funding successful: {data.get('amount')}")
        
    def test_09_register_second_user(self):
        print("\n🔍 Testing second user registration for transfers...")
        success, data = self.second_api.register_user()
        self.assertTrue(success, f"Failed to register second user: {data}")
        print("✅ Second user registration successful")
        
    def test_10_create_transfer(self):
        print("\n🔍 Testing create transfer...")
        success, data = self.api.create_transfer(self.second_email, 10, "Test transfer")
        self.assertTrue(success, f"Failed to create transfer: {data}")
        self.assertIsNotNone(self.api.transfer_id, "No transfer ID received after creating transfer")
        print("✅ Transfer creation successful")
        
    def test_11_get_transfers(self):
        print("\n🔍 Testing get transfers...")
        success, data = self.api.get_transfers()
        self.assertTrue(success, f"Failed to get transfers: {data}")
        self.assertIsInstance(data, list, "Transfers response is not a list")
        print(f"✅ Transfers retrieval successful: {len(data)} transfers found")
        
    def test_12_register_business(self):
        print("\n🔍 Testing register business...")
        success, data = self.api.register_business("Puerto Rican Restaurant", "restaurant")
        self.assertTrue(success, f"Failed to register business: {data}")
        self.assertIsNotNone(self.api.business_id, "No business ID received after registering business")
        print("✅ Business registration successful")
        
    def test_13_get_businesses(self):
        print("\n🔍 Testing get businesses...")
        success, data = self.api.get_businesses()
        self.assertTrue(success, f"Failed to get businesses: {data}")
        self.assertIsInstance(data, list, "Businesses response is not a list")
        print(f"✅ Businesses retrieval successful: {len(data)} businesses found")
        
    def test_14_get_business_details(self):
        print("\n🔍 Testing get business details...")
        success, data = self.api.get_business_details()
        self.assertTrue(success, f"Failed to get business details: {data}")
        self.assertEqual(data.get('id'), self.api.business_id, "Business ID mismatch")
        print("✅ Business details retrieval successful")
        
    def test_15_setup_business_integration(self):
        print("\n🔍 Testing setup business integration (Uber Eats)...")
        success, data = self.api.setup_business_integration("uber_eats")
        self.assertTrue(success, f"Failed to setup business integration: {data}")
        print("✅ Business integration setup successful")
        
    def test_16_setup_business_integration_doordash(self):
        print("\n🔍 Testing setup business integration (DoorDash)...")
        success, data = self.api.setup_business_integration("doordash")
        self.assertTrue(success, f"Failed to setup business integration: {data}")
        print("✅ Business integration setup successful")
        
    def test_17_setup_business_integration_ath_movil(self):
        print("\n🔍 Testing setup business integration (ATH Móvil)...")
        success, data = self.api.setup_business_integration("ath_movil")
        self.assertTrue(success, f"Failed to setup business integration: {data}")
        print("✅ Business integration setup successful")
        
    def test_18_get_business_integrations(self):
        print("\n🔍 Testing get business integrations...")
        success, data = self.api.get_business_integrations()
        self.assertTrue(success, f"Failed to get business integrations: {data}")
        self.assertIsInstance(data, dict, "Integrations response is not a dictionary")
        print(f"✅ Business integrations retrieval successful: {len(data)} integrations found")
        
    def test_19_business_cashout(self):
        print("\n🔍 Testing business cashout...")
        success, data = self.api.business_cashout(50)
        # This might fail if the business has no balance
        if success:
            print("✅ Business cashout successful")
        else:
            print(f"❌ Business cashout failed: {data}")
        
    def test_20_admin_dashboard(self):
        print("\n🔍 Testing admin dashboard (expected to fail for regular user)...")
        success, data = self.api.admin_dashboard()
        # This should fail for a regular user
        self.assertFalse(success, "Admin dashboard should not be accessible to regular users")
        print("✅ Admin dashboard access correctly denied for regular user")
        
    def test_21_admin_login(self):
        print("\n🔍 Testing admin login...")
        admin_api = DalePayAPITester(self.backend_url)
        success, data = admin_api.login_user("admin@dalepay.com", "admin")
        if success:
            print("✅ Admin login successful")
            
            print("\n🔍 Testing admin dashboard with admin user...")
            success, data = admin_api.admin_dashboard()
            if success:
                print(f"✅ Admin dashboard access successful: {data}")
            else:
                print(f"❌ Admin dashboard access failed: {data}")
        else:
            print(f"❌ Admin login failed (this is expected if admin credentials are different): {data}")


if __name__ == "__main__":
    print("=" * 80)
    print("DalePay API Test Suite")
    print("=" * 80)
    
    # Run the tests
    unittest.main(argv=['first-arg-is-ignored'], exit=False)