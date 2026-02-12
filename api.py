"""
Mobile Finance Platform - REST API Interface
Provides mobile-friendly API endpoints for the finance platform
"""

from typing import Dict, Optional
from app import MobileFinancePlatform, User, Account, Transaction


class MobileFinanceAPI:
    """REST API wrapper for Mobile Finance Platform"""
    
    def __init__(self):
        self.platform = MobileFinancePlatform()
        self.session_tokens = {}
    
    def register_user(self, user_id: str, name: str, email: str, phone: str) -> Dict:
        """
        API endpoint to register a new user
        POST /api/users/register
        """
        user = self.platform.create_user(user_id, name, email, phone)
        if user:
            return {
                'success': True,
                'message': 'User registered successfully',
                'data': user.to_dict()
            }
        return {
            'success': False,
            'message': 'User already exists or invalid data',
            'data': None
        }
    
    def create_account(self, user_id: str, account_id: str, account_type: str = 'savings') -> Dict:
        """
        API endpoint to create a new account
        POST /api/accounts/create
        """
        account = self.platform.create_account(account_id, user_id, account_type)
        if account:
            return {
                'success': True,
                'message': 'Account created successfully',
                'data': account.to_dict()
            }
        return {
            'success': False,
            'message': 'Account creation failed - user not found or account exists',
            'data': None
        }
    
    def deposit(self, transaction_id: str, account_id: str, amount: float, description: str = '') -> Dict:
        """
        API endpoint to deposit money
        POST /api/transactions/deposit
        """
        success = self.platform.process_deposit(transaction_id, account_id, amount, description)
        if success:
            balance = self.platform.get_account_balance(account_id)
            return {
                'success': True,
                'message': 'Deposit processed successfully',
                'data': {
                    'transaction_id': transaction_id,
                    'new_balance': balance
                }
            }
        return {
            'success': False,
            'message': 'Deposit failed - invalid account or amount',
            'data': None
        }
    
    def withdraw(self, transaction_id: str, account_id: str, amount: float, description: str = '') -> Dict:
        """
        API endpoint to withdraw money
        POST /api/transactions/withdraw
        """
        success = self.platform.process_withdrawal(transaction_id, account_id, amount, description)
        if success:
            balance = self.platform.get_account_balance(account_id)
            return {
                'success': True,
                'message': 'Withdrawal processed successfully',
                'data': {
                    'transaction_id': transaction_id,
                    'new_balance': balance
                }
            }
        return {
            'success': False,
            'message': 'Withdrawal failed - insufficient funds or invalid account',
            'data': None
        }
    
    def transfer(self, transaction_id: str, from_account: str, to_account: str, 
                 amount: float, description: str = '') -> Dict:
        """
        API endpoint to transfer money between accounts
        POST /api/transactions/transfer
        """
        success = self.platform.transfer(transaction_id, from_account, to_account, amount, description)
        if success:
            return {
                'success': True,
                'message': 'Transfer completed successfully',
                'data': {
                    'transaction_id': transaction_id,
                    'from_balance': self.platform.get_account_balance(from_account),
                    'to_balance': self.platform.get_account_balance(to_account)
                }
            }
        return {
            'success': False,
            'message': 'Transfer failed - insufficient funds or invalid accounts',
            'data': None
        }
    
    def get_balance(self, account_id: str) -> Dict:
        """
        API endpoint to get account balance
        GET /api/accounts/{account_id}/balance
        """
        balance = self.platform.get_account_balance(account_id)
        if balance is not None:
            return {
                'success': True,
                'message': 'Balance retrieved successfully',
                'data': {
                    'account_id': account_id,
                    'balance': balance
                }
            }
        return {
            'success': False,
            'message': 'Account not found',
            'data': None
        }
    
    def get_transactions(self, account_id: str) -> Dict:
        """
        API endpoint to get account transaction history
        GET /api/accounts/{account_id}/transactions
        """
        transactions = self.platform.get_account_transactions(account_id)
        return {
            'success': True,
            'message': f'Retrieved {len(transactions)} transactions',
            'data': {
                'account_id': account_id,
                'transactions': [t.to_dict() for t in transactions]
            }
        }
    
    def get_user_accounts(self, user_id: str) -> Dict:
        """
        API endpoint to get all accounts for a user
        GET /api/users/{user_id}/accounts
        """
        accounts = self.platform.get_user_accounts(user_id)
        return {
            'success': True,
            'message': f'Retrieved {len(accounts)} accounts',
            'data': {
                'user_id': user_id,
                'accounts': [acc.to_dict() for acc in accounts]
            }
        }


if __name__ == '__main__':
    # Demo API usage
    api = MobileFinanceAPI()
    
    print("=== Mobile Finance API Demo ===\n")
    
    # Register users
    print("1. Registering users...")
    result = api.register_user('U001', 'Carlos Rodríguez', 'carlos@example.com', '+34600111222')
    print(f"   {result['message']}")
    
    result = api.register_user('U002', 'Ana Martínez', 'ana@example.com', '+34600333444')
    print(f"   {result['message']}")
    
    # Create accounts
    print("\n2. Creating accounts...")
    result = api.create_account('U001', 'ACC001', 'savings')
    print(f"   {result['message']}")
    
    result = api.create_account('U002', 'ACC002', 'checking')
    print(f"   {result['message']}")
    
    # Process transactions
    print("\n3. Processing transactions...")
    result = api.deposit('T001', 'ACC001', 2000.0, 'Salary deposit')
    print(f"   Deposit: {result['message']}")
    
    result = api.deposit('T002', 'ACC002', 1500.0, 'Salary deposit')
    print(f"   Deposit: {result['message']}")
    
    result = api.withdraw('T003', 'ACC001', 300.0, 'ATM withdrawal')
    print(f"   Withdrawal: {result['message']}")
    
    result = api.transfer('T004', 'ACC001', 'ACC002', 200.0, 'Payment')
    print(f"   Transfer: {result['message']}")
    
    # Check balances
    print("\n4. Checking balances...")
    result = api.get_balance('ACC001')
    print(f"   Account ACC001: ${result['data']['balance']:.2f}")
    
    result = api.get_balance('ACC002')
    print(f"   Account ACC002: ${result['data']['balance']:.2f}")
    
    # Get transaction history
    print("\n5. Transaction history for ACC001:")
    result = api.get_transactions('ACC001')
    for trans in result['data']['transactions']:
        print(f"   - {trans['transaction_type']}: ${trans['amount']:.2f} ({trans['status']})")
