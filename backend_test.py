import requests
import os
import uuid
from datetime import datetime

class DalePayAPITester:
    def __init__(self, base_url):
        self.base_url = base_url
        self.token = None
        self.user_id = None
        self.tests_run = 0
        self.tests_passed = 0
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

    def register_user(self):
        """Test user registration with full KYC"""
        user_data = {
            "email": self.test_email,
            "password": self.test_password,
            "full_name": "Test User",
            "phone": "787-123-4567",
            "date_of_birth": "1990-01-01",
            "ssn_last_4": "1234",
            "address_line_1": "123 Test St",
            "address_line_2": "Apt 4B",
            "city": "San Juan",
            "state": "PR",
            "zip_code": "00901",
            "country": "US",
            "terms_accepted": True,
            "privacy_accepted": True
        }
        
        success, response = self.run_test(
            "Register User",
            "POST",
            "api/auth/register",
            200,
            data=user_data
        )
        
        if success and 'access_token' in response:
            self.token = response['access_token']
            self.user_id = response.get('user_id')
            print(f"Registered user with email: {self.test_email}")
            return True
        return False

    def login(self, email=None, password=None):
        """Test login and get token"""
        if not email:
            email = self.test_email
        if not password:
            password = self.test_password
            
        # For login, the API expects query parameters, not JSON body
        url = f"{self.base_url}/api/auth/login?email={email}&password={password}"
        
        self.tests_run += 1
        print(f"\n🔍 Testing Login...")
        
        try:
            response = requests.post(url)
            
            success = response.status_code == 200
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    data = response.json()
                    self.token = data.get('access_token')
                    self.user_id = data.get('user_id')
                    print(f"Logged in as {email}")
                    return True, data
                except:
                    return True, {}
            else:
                print(f"❌ Failed - Expected 200, got {response.status_code}")
                try:
                    print(f"Response: {response.json()}")
                except:
                    print(f"Response: {response.text}")
                return False, {}
                
        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def get_user_profile(self):
        """Get user profile"""
        success, response = self.run_test(
            "Get User Profile",
            "GET",
            "api/user/profile",
            200
        )
        if success:
            print(f"User balance: ${response.get('wallet_balance', 0)}")
        return success, response

    def link_bank_account(self, bank_data):
        """Link bank account"""
        success, response = self.run_test(
            "Link Bank Account",
            "POST",
            "api/bank-accounts/link",
            200,
            data=bank_data
        )
        if success:
            print(f"Successfully linked bank account: {bank_data['bank_name']}")
        return success, response

    def get_bank_accounts(self):
        """Get linked bank accounts"""
        success, response = self.run_test(
            "Get Bank Accounts",
            "GET",
            "api/bank-accounts",
            200
        )
        if success:
            print(f"Found {len(response)} bank accounts")
        return success, response

    def send_money(self, transfer_data):
        """Send money to another user"""
        success, response = self.run_test(
            "Send Money",
            "POST",
            "api/transfer/send",
            200,
            data=transfer_data
        )
        if success:
            print(f"Successfully sent ${transfer_data['amount']} to {transfer_data.get('recipient_email', transfer_data.get('recipient_phone', 'recipient'))}")
        return success, response

    def get_transactions(self):
        """Get transaction history"""
        success, response = self.run_test(
            "Get Transactions",
            "GET",
            "api/transactions",
            200
        )
        if success:
            print(f"Found {len(response)} transactions")
        return success, response

    def test_admin_dashboard(self, admin_email="admin@dalepay.com", admin_password="admin123"):
        """Test admin dashboard access"""
        # First login as admin
        if not self.login(admin_email, admin_password):
            print("❌ Admin login failed")
            return False, {}
        
        success, response = self.run_test(
            "Admin Dashboard",
            "GET",
            "api/admin/dashboard",
            200
        )
        if success:
            print("✅ Admin dashboard accessible")
        return success, response

    def test_admin_users(self):
        """Test admin users list"""
        success, response = self.run_test(
            "Admin Users List",
            "GET",
            "api/admin/users",
            200
        )
        if success:
            print(f"✅ Admin can view {response.get('total', 0)} users")
        return success, response

    def test_admin_transactions(self):
        """Test admin transactions list"""
        success, response = self.run_test(
            "Admin Transactions List",
            "GET",
            "api/admin/transactions",
            200
        )
        if success:
            print(f"✅ Admin can view {response.get('total', 0)} transactions")
        return success, response

    def test_admin_ai_scan(self):
        """Test admin AI scan trigger"""
        success, response = self.run_test(
            "Admin AI Scan",
            "POST",
            "api/admin/ai-scan/trigger",
            200
        )
        if success:
            print("✅ Admin can trigger AI system scan")
        return success, response

def run_tests():
    # Get the backend URL from environment
    backend_url = os.environ.get('REACT_APP_BACKEND_URL', 'https://cbc34480-4478-4ec3-b260-5a640bb044d0.preview.emergentagent.com')
    
    # Create tester instance
    tester = DalePayAPITester(backend_url)
    
    print("\n🔥 Starting DalePay API Tests\n")
    
    # Test 1: Register a new user
    print("\n🔍 Test 1: Registering a new user...")
    if not tester.register_user():
        print("❌ User registration failed, trying to login with existing account")
        # Try to login with existing test account
        if not tester.login("test@dalepay.com", "TestPass123!"):
            print("❌ Login failed, stopping tests")
            return False
    
    # Test 2: Get user profile
    print("\n🔍 Test 2: Getting user profile...")
    success, profile = tester.get_user_profile()
    if not success:
        print("❌ Failed to get user profile")
    
    # Test 3: Link a bank account
    print("\n🔍 Test 3: Linking a bank account...")
    bank_data = {
        "bank_name": "Test Bank",
        "account_type": "checking",
        "routing_number": "123456789",
        "account_number": "987654321",
        "account_holder_name": "Test User"
    }
    success, bank_response = tester.link_bank_account(bank_data)
    if not success:
        print("❌ Failed to link bank account")
    
    # Test 4: Get bank accounts
    print("\n🔍 Test 4: Getting bank accounts...")
    success, bank_accounts = tester.get_bank_accounts()
    if not success:
        print("❌ Failed to get bank accounts")
    
    # Test 5: Send money
    print("\n🔍 Test 5: Sending money...")
    transfer_data = {
        "recipient_email": "recipient@example.com",
        "amount": 10.00,
        "description": "Test transfer",
        "transfer_type": "standard"
    }
    success, transfer_response = tester.send_money(transfer_data)
    if not success:
        print("❌ Failed to send money")
    
    # Test 6: Get transaction history
    print("\n🔍 Test 6: Getting transaction history...")
    success, transactions = tester.get_transactions()
    if not success:
        print("❌ Failed to get transactions")
    
    # Test 7: Admin dashboard access
    print("\n🔍 Test 7: Testing admin dashboard access...")
    success, admin_dashboard = tester.test_admin_dashboard()
    if not success:
        print("❌ Failed to access admin dashboard")
    
    # Test 8: Admin users list
    print("\n🔍 Test 8: Testing admin users list...")
    success, admin_users = tester.test_admin_users()
    if not success:
        print("❌ Failed to get admin users list")
    
    # Test 9: Admin transactions list
    print("\n🔍 Test 9: Testing admin transactions list...")
    success, admin_transactions = tester.test_admin_transactions()
    if not success:
        print("❌ Failed to get admin transactions list")
    
    # Test 10: Admin AI scan
    print("\n🔍 Test 10: Testing admin AI scan...")
    success, admin_ai_scan = tester.test_admin_ai_scan()
    if not success:
        print("❌ Failed to trigger admin AI scan")
    
    # Print test summary
    print(f"\n📊 Tests passed: {tester.tests_passed}/{tester.tests_run}")
    return tester.tests_passed == tester.tests_run

if __name__ == "__main__":
    print("🚀 Starting DalePay API Tests...")
    success = run_tests()
    print("✅ All tests passed!" if success else "❌ Some tests failed.")
