"""
Mobile Finance Platform - Main Application
A platform for managing mobile financial transactions
"""

from datetime import datetime
from typing import Dict, List, Optional
import json


class User:
    """Represents a user in the mobile finance platform"""
    
    def __init__(self, user_id: str, name: str, email: str, phone: str):
        self.user_id = user_id
        self.name = name
        self.email = email
        self.phone = phone
        self.created_at = datetime.now()
        self.is_active = True
    
    def to_dict(self) -> Dict:
        return {
            'user_id': self.user_id,
            'name': self.name,
            'email': self.email,
            'phone': self.phone,
            'created_at': self.created_at.isoformat(),
            'is_active': self.is_active
        }


class Account:
    """Represents a financial account"""
    
    def __init__(self, account_id: str, user_id: str, account_type: str = 'savings'):
        self.account_id = account_id
        self.user_id = user_id
        self.account_type = account_type
        self.balance = 0.0
        self.created_at = datetime.now()
        self.is_active = True
    
    def deposit(self, amount: float) -> bool:
        """Deposit money into the account"""
        if amount <= 0:
            return False
        self.balance += amount
        return True
    
    def withdraw(self, amount: float) -> bool:
        """Withdraw money from the account"""
        if amount <= 0 or amount > self.balance:
            return False
        self.balance -= amount
        return True
    
    def get_balance(self) -> float:
        """Get current account balance"""
        return self.balance
    
    def to_dict(self) -> Dict:
        return {
            'account_id': self.account_id,
            'user_id': self.user_id,
            'account_type': self.account_type,
            'balance': self.balance,
            'created_at': self.created_at.isoformat(),
            'is_active': self.is_active
        }


class Transaction:
    """Represents a financial transaction"""
    
    def __init__(self, transaction_id: str, account_id: str, 
                 transaction_type: str, amount: float, description: str = ''):
        self.transaction_id = transaction_id
        self.account_id = account_id
        self.transaction_type = transaction_type  # 'deposit', 'withdrawal', 'transfer'
        self.amount = amount
        self.description = description
        self.timestamp = datetime.now()
        self.status = 'pending'
    
    def complete(self):
        """Mark transaction as completed"""
        self.status = 'completed'
    
    def fail(self):
        """Mark transaction as failed"""
        self.status = 'failed'
    
    def to_dict(self) -> Dict:
        return {
            'transaction_id': self.transaction_id,
            'account_id': self.account_id,
            'transaction_type': self.transaction_type,
            'amount': self.amount,
            'description': self.description,
            'timestamp': self.timestamp.isoformat(),
            'status': self.status
        }


class MobileFinancePlatform:
    """Main platform class for managing mobile finance operations"""
    
    def __init__(self):
        self.users: Dict[str, User] = {}
        self.accounts: Dict[str, Account] = {}
        self.transactions: List[Transaction] = []
    
    def create_user(self, user_id: str, name: str, email: str, phone: str) -> Optional[User]:
        """Create a new user"""
        if user_id in self.users:
            return None
        user = User(user_id, name, email, phone)
        self.users[user_id] = user
        return user
    
    def create_account(self, account_id: str, user_id: str, account_type: str = 'savings') -> Optional[Account]:
        """Create a new account for a user"""
        if account_id in self.accounts or user_id not in self.users:
            return None
        account = Account(account_id, user_id, account_type)
        self.accounts[account_id] = account
        return account
    
    def process_deposit(self, transaction_id: str, account_id: str, amount: float, description: str = '') -> bool:
        """Process a deposit transaction"""
        if account_id not in self.accounts:
            return False
        
        transaction = Transaction(transaction_id, account_id, 'deposit', amount, description)
        account = self.accounts[account_id]
        
        if account.deposit(amount):
            transaction.complete()
            self.transactions.append(transaction)
            return True
        else:
            transaction.fail()
            self.transactions.append(transaction)
            return False
    
    def process_withdrawal(self, transaction_id: str, account_id: str, amount: float, description: str = '') -> bool:
        """Process a withdrawal transaction"""
        if account_id not in self.accounts:
            return False
        
        transaction = Transaction(transaction_id, account_id, 'withdrawal', amount, description)
        account = self.accounts[account_id]
        
        if account.withdraw(amount):
            transaction.complete()
            self.transactions.append(transaction)
            return True
        else:
            transaction.fail()
            self.transactions.append(transaction)
            return False
    
    def transfer(self, transaction_id: str, from_account_id: str, to_account_id: str, 
                 amount: float, description: str = '') -> bool:
        """Transfer money between accounts"""
        if from_account_id not in self.accounts or to_account_id not in self.accounts:
            return False
        
        from_account = self.accounts[from_account_id]
        to_account = self.accounts[to_account_id]
        
        if from_account.withdraw(amount):
            to_account.deposit(amount)
            transaction = Transaction(transaction_id, from_account_id, 'transfer', amount, 
                                    f"Transfer to {to_account_id}: {description}")
            transaction.complete()
            self.transactions.append(transaction)
            return True
        return False
    
    def get_account_balance(self, account_id: str) -> Optional[float]:
        """Get account balance"""
        if account_id not in self.accounts:
            return None
        return self.accounts[account_id].get_balance()
    
    def get_account_transactions(self, account_id: str) -> List[Transaction]:
        """Get all transactions for an account"""
        return [t for t in self.transactions if t.account_id == account_id]
    
    def get_user_accounts(self, user_id: str) -> List[Account]:
        """Get all accounts for a user"""
        return [acc for acc in self.accounts.values() if acc.user_id == user_id]
    
    def export_data(self) -> str:
        """Export platform data as JSON"""
        data = {
            'users': [user.to_dict() for user in self.users.values()],
            'accounts': [acc.to_dict() for acc in self.accounts.values()],
            'transactions': [t.to_dict() for t in self.transactions]
        }
        return json.dumps(data, indent=2)


if __name__ == '__main__':
    # Demo usage
    platform = MobileFinancePlatform()
    
    # Create users
    user1 = platform.create_user('U001', 'Juan Pérez', 'juan@example.com', '+34123456789')
    user2 = platform.create_user('U002', 'María García', 'maria@example.com', '+34987654321')
    
    # Create accounts
    acc1 = platform.create_account('ACC001', 'U001', 'savings')
    acc2 = platform.create_account('ACC002', 'U002', 'checking')
    
    # Process transactions
    platform.process_deposit('T001', 'ACC001', 1000.0, 'Initial deposit')
    platform.process_deposit('T002', 'ACC002', 500.0, 'Initial deposit')
    platform.process_withdrawal('T003', 'ACC001', 200.0, 'Cash withdrawal')
    platform.transfer('T004', 'ACC001', 'ACC002', 150.0, 'Transfer payment')
    
    # Display results
    print("=== Mobile Finance Platform Demo ===\n")
    print(f"User 1 Balance: ${platform.get_account_balance('ACC001'):.2f}")
    print(f"User 2 Balance: ${platform.get_account_balance('ACC002'):.2f}")
    print(f"\nTotal Transactions: {len(platform.transactions)}")
    
    # Export data
    print("\n=== Platform Data Export ===")
    print(platform.export_data())
