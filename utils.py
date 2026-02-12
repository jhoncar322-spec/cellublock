"""
Utility functions for the Mobile Finance Platform
"""

from datetime import datetime
from typing import Any, Dict
import hashlib
import random
import string


def generate_transaction_id() -> str:
    """Generate a unique transaction ID"""
    timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
    random_suffix = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
    return f"TXN{timestamp}{random_suffix}"


def generate_account_id() -> str:
    """Generate a unique account ID"""
    timestamp = datetime.now().strftime('%Y%m%d')
    random_suffix = ''.join(random.choices(string.digits, k=8))
    return f"ACC{timestamp}{random_suffix}"


def generate_user_id() -> str:
    """Generate a unique user ID"""
    timestamp = datetime.now().strftime('%Y%m%d')
    random_suffix = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
    return f"USR{timestamp}{random_suffix}"


def format_currency(amount: float, currency_symbol: str = "€") -> str:
    """Format amount as currency string"""
    return f"{currency_symbol}{amount:,.2f}"


def validate_email(email: str) -> bool:
    """Basic email validation"""
    if not email or '@' not in email:
        return False
    parts = email.split('@')
    if len(parts) != 2:
        return False
    if not parts[0] or not parts[1]:
        return False
    if '.' not in parts[1]:
        return False
    return True


def validate_phone(phone: str) -> bool:
    """Basic phone number validation"""
    if not phone:
        return False
    # Remove common separators
    clean_phone = phone.replace(' ', '').replace('-', '').replace('(', '').replace(')', '')
    # Check if it starts with + and has digits
    if clean_phone.startswith('+'):
        return clean_phone[1:].isdigit() and len(clean_phone) >= 10
    return clean_phone.isdigit() and len(clean_phone) >= 9


def hash_password(password: str) -> str:
    """Hash a password using SHA-256"""
    return hashlib.sha256(password.encode()).hexdigest()


def format_timestamp(dt: datetime) -> str:
    """Format datetime for display"""
    return dt.strftime('%Y-%m-%d %H:%M:%S')


def calculate_transaction_fee(amount: float, fee_percentage: float = 0.0) -> float:
    """Calculate transaction fee"""
    return amount * (fee_percentage / 100)


def validate_transaction_amount(amount: float, min_amount: float = 0.01, 
                                max_amount: float = 1000000.00) -> bool:
    """Validate transaction amount is within limits"""
    return min_amount <= amount <= max_amount


def sanitize_input(text: str) -> str:
    """Sanitize user input to prevent injection attacks"""
    if not text:
        return ""
    # Remove potentially dangerous characters
    dangerous_chars = ['<', '>', '"', "'", ';', '&', '|', '`']
    sanitized = text
    for char in dangerous_chars:
        sanitized = sanitized.replace(char, '')
    return sanitized.strip()


def generate_statement(transactions: list, account_id: str) -> Dict[str, Any]:
    """Generate an account statement"""
    if not transactions:
        return {
            'account_id': account_id,
            'period': datetime.now().strftime('%Y-%m'),
            'transactions': [],
            'total_deposits': 0.0,
            'total_withdrawals': 0.0,
            'transaction_count': 0
        }
    
    total_deposits = sum(t.amount for t in transactions if t.transaction_type == 'deposit')
    total_withdrawals = sum(t.amount for t in transactions if t.transaction_type == 'withdrawal')
    
    return {
        'account_id': account_id,
        'period': datetime.now().strftime('%Y-%m'),
        'transactions': [t.to_dict() for t in transactions],
        'total_deposits': total_deposits,
        'total_withdrawals': total_withdrawals,
        'transaction_count': len(transactions)
    }
