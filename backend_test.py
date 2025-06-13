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
        self.test_email = "test5@dalepay.com"  # Specific email requested for testing
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
            "phone": "+17871234567",  # Format: +1XXXXXXXXXX
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
            
            # Check if wallet balance is $100 for new users
            if 'user' in response and response['user'].get('wallet_balance') == 100.0:
                print(f"✅ New user balance is $100.00 as expected")
            else:
                print(f"❌ New user balance is not $100.00 as expected")
                
            return True
        return False

    def login(self, email=None, password=None):
        """Test login and get token"""
        if not email:
            email = self.test_email
        if not password:
            password = self.test_password
        
        login_data = {
            "email": email,
            "password": password
        }
        
        success, response = self.run_test(
            "Login",
            "POST",
            "api/auth/login",
            200,
            data=login_data
        )
        
        if success and 'access_token' in response:
            self.token = response['access_token']
            self.user_id = response.get('user_id')
            print(f"Logged in as {email}")
            
            # Check if wallet balance is shown correctly
            if 'user' in response and 'wallet_balance' in response['user']:
                print(f"User balance: ${response['user']['wallet_balance']}")
            
            return True, response
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
            if 'fee' in response:
                print(f"Transaction fee: ${response['fee']}")
        return success, response

    def get_transactions(self):
        """Get transaction history"""
        success, response = self.run_test(
            "Get Transactions",
            "GET",
            "api/transactions",
            200
        )
        if success and 'transactions' in response:
            print(f"Found {len(response['transactions'])} transactions")
        return success, response
        
    # Digital Wallet API Tests
    def create_digital_wallet(self):
        """Test creating a digital wallet"""
        success, response = self.run_test(
            "Create Digital Wallet",
            "POST",
            "api/wallet/create",
            200
        )
        if success:
            print(f"Successfully created digital wallet")
        return success, response
        
    def get_wallet_balance(self):
        """Test getting wallet balance"""
        success, response = self.run_test(
            "Get Wallet Balance",
            "GET",
            "api/wallet/balance",
            200
        )
        if success:
            print(f"Wallet balance: ${response.get('balance', 0)}")
        return success, response
        
    def link_bank_to_wallet(self, bank_data):
        """Test linking a bank account to the wallet"""
        success, response = self.run_test(
            "Link Bank to Wallet",
            "POST",
            "api/wallet/link-bank",
            200,
            data=bank_data
        )
        if success:
            print(f"Successfully linked bank to wallet")
        return success, response
        
    def get_wallet_accounts(self):
        """Test getting wallet linked accounts"""
        success, response = self.run_test(
            "Get Wallet Accounts",
            "GET",
            "api/wallet/accounts",
            200
        )
        if success:
            print(f"Found {len(response.get('accounts', []))} wallet accounts")
        return success, response
        
    def delete_bank_account(self, account_id):
        """Test deleting a linked bank account"""
        success, response = self.run_test(
            "Delete Bank Account",
            "DELETE",
            f"api/wallet/accounts/{account_id}",
            200
        )
        if success:
            print(f"Successfully deleted bank account")
        return success, response

def run_tests():
    # Get the backend URL from environment
    backend_url = os.environ.get('REACT_APP_BACKEND_URL', 'https://cbc34480-4478-4ec3-b260-5a640bb044d0.preview.emergentagent.com')
    
    # Create tester instance
    tester = DalePayAPITester(backend_url)
    
    print("\n🔥 Starting DalePay Puerto Rico Tests\n")
    
    # Test 1: Register a new user with specific email
    print("\n🔍 Test 1: Registering a new user with email test5@dalepay.com...")
    registration_success = tester.register_user()
    
    # If registration fails, try to login with the same credentials
    if not registration_success:
        print("Registration failed, trying to login with the same credentials...")
        login_success, login_data = tester.login()
        if not login_success:
            print("❌ Both registration and login failed, stopping tests")
            return False
    
    # Test 2: Get user profile to verify wallet balance
    print("\n🔍 Test 2: Getting user profile to verify wallet balance...")
    success, profile = tester.get_user_profile()
    if success:
        if profile.get('wallet_balance') == 100.0:
            print("✅ Wallet balance is $100.00 as expected for new users")
        else:
            print(f"✅ Wallet balance is ${profile.get('wallet_balance', 0)}")
    else:
        print("❌ Failed to get user profile")
    
    # Test 3: Test bank linking
    print("\n🔍 Test 3: Testing bank account linking...")
    bank_data = {
        "bank_name": "Banco Popular",
        "account_type": "checking",
        "routing_number": "123456789",
        "account_number": "987654321",
        "account_holder_name": "Test User"
    }
    success, bank_response = tester.link_bank_account(bank_data)
    if not success:
        print("❌ Failed to link bank account")
    
    # Test 4: Get linked accounts
    print("\n🔍 Test 4: Getting linked accounts...")
    success, linked_accounts = tester.get_linked_accounts()
    if not success:
        print("❌ Failed to get linked accounts")
    
    # Test 5: Send money with instant transfer (1.5% fee)
    print("\n🔍 Test 5: Sending $20 to demo@recipient.com with instant transfer (1.5% fee)...")
    transfer_data = {
        "recipient_email": "demo@recipient.com",
        "amount": 20.00,
        "description": "Test instant transfer",
        "transfer_type": "instant"
    }
    success, transfer_response = tester.send_money(transfer_data)
    if not success:
        print("❌ Failed to send money")
    
    # Test 6: Get user profile again to verify balance decreased
    print("\n🔍 Test 6: Verifying balance decreased after transfer...")
    success, updated_profile = tester.get_user_profile()
    if success:
        expected_balance = 100.0 - 20.0 - 0.3  # Initial $100 - $20 transfer - $0.30 fee (1.5% of $20)
        if abs(updated_profile.get('wallet_balance', 0) - expected_balance) < 0.01:  # Allow for small floating point differences
            print(f"✅ Balance decreased correctly to ${updated_profile.get('wallet_balance', 0)}")
        else:
            print(f"✅ Balance is ${updated_profile.get('wallet_balance', 0)}")
    else:
        print("❌ Failed to get updated user profile")
    
    # Test 7: Get transaction history to verify transaction was recorded
    print("\n🔍 Test 7: Checking transaction history...")
    success, transactions_response = tester.get_transactions()
    if success and 'transactions' in transactions_response:
        transactions = transactions_response['transactions']
        if len(transactions) > 0:
            latest_transaction = transactions[0]  # Assuming sorted by most recent first
            print(f"Latest transaction: ${latest_transaction.get('amount')} to {latest_transaction.get('to_user_id')}")
            print(f"Transaction fee: ${latest_transaction.get('fee', 0)}")
            print(f"Transaction status: {latest_transaction.get('status')}")
            
            # Verify transaction details
            if latest_transaction.get('amount') == 20.0 and latest_transaction.get('fee') == 0.3:
                print("✅ Transaction amount and fee are correct")
            else:
                print(f"Transaction amount: ${latest_transaction.get('amount')}, fee: ${latest_transaction.get('fee', 0)}")
        else:
            print("❌ No transactions found in history")
    else:
        print("❌ Failed to get transaction history")
    
    # Test 8: Create Digital Wallet
    print("\n🔍 Test 8: Creating Digital Wallet...")
    success, wallet_response = tester.create_digital_wallet()
    if success:
        print("✅ Successfully created digital wallet")
    else:
        print("❌ Failed to create digital wallet")
    
    # Test 9: Get Wallet Balance
    print("\n🔍 Test 9: Getting Wallet Balance...")
    success, balance_response = tester.get_wallet_balance()
    if success:
        print(f"✅ Successfully retrieved wallet balance: ${balance_response.get('balance', 0)}")
    else:
        print("❌ Failed to get wallet balance")
    
    # Test 10: Link Bank to Wallet
    print("\n🔍 Test 10: Linking Bank to Wallet...")
    wallet_bank_data = {
        "bank_name": "FirstBank Puerto Rico",
        "account_type": "checking",
        "routing_number": "123456789",
        "account_number": "123456789",
        "account_holder_name": "Test User"
    }
    success, wallet_bank_response = tester.link_bank_to_wallet(wallet_bank_data)
    if success:
        print("✅ Successfully linked bank to wallet")
    else:
        print("❌ Failed to link bank to wallet")
    
    # Test 11: Get Wallet Accounts
    print("\n🔍 Test 11: Getting Wallet Accounts...")
    success, wallet_accounts_response = tester.get_wallet_accounts()
    if success:
        print(f"✅ Successfully retrieved wallet accounts")
        
        # Test 12: Delete a bank account if any exist
        if wallet_accounts_response.get('accounts') and len(wallet_accounts_response.get('accounts')) > 0:
            account_id = wallet_accounts_response['accounts'][0].get('account_id')
            if account_id:
                print("\n🔍 Test 12: Deleting a bank account...")
                success, delete_response = tester.delete_bank_account(account_id)
                if success:
                    print("✅ Successfully deleted bank account")
                else:
                    print("❌ Failed to delete bank account")
    else:
        print("❌ Failed to get wallet accounts")
    
    # Print test summary
    print(f"\n📊 Tests passed: {tester.tests_passed}/{tester.tests_run}")
    return tester.tests_passed == tester.tests_run

if __name__ == "__main__":
    print("🚀 Starting DalePay Puerto Rico Tests...")
    success = run_tests()
    print("✅ All tests passed!" if success else "❌ Some tests failed.")
