"""
Configuration settings for the Mobile Finance Platform
"""

# Platform Configuration
PLATFORM_NAME = "Cellublock Mobile Finance"
VERSION = "1.0.0"
SUPPORTED_LANGUAGES = ["es", "en"]

# Account Types
ACCOUNT_TYPES = {
    'savings': 'Cuenta de Ahorros',
    'checking': 'Cuenta Corriente',
    'investment': 'Cuenta de Inversión'
}

# Transaction Types
TRANSACTION_TYPES = {
    'deposit': 'Depósito',
    'withdrawal': 'Retiro',
    'transfer': 'Transferencia'
}

# Transaction Limits
MIN_TRANSACTION_AMOUNT = 0.01
MAX_TRANSACTION_AMOUNT = 1000000.00
DAILY_WITHDRAWAL_LIMIT = 10000.00
DAILY_TRANSFER_LIMIT = 50000.00

# Currency Settings
DEFAULT_CURRENCY = "EUR"
CURRENCY_SYMBOL = "€"
DECIMAL_PLACES = 2

# API Settings
API_VERSION = "v1"
API_BASE_PATH = "/api"
REQUEST_TIMEOUT = 30  # seconds
MAX_REQUESTS_PER_MINUTE = 60

# Security Settings
PASSWORD_MIN_LENGTH = 8
SESSION_TIMEOUT = 3600  # seconds
MAX_LOGIN_ATTEMPTS = 5

# Database Settings (for future implementation)
DB_CONNECTION_POOL_SIZE = 10
DB_TIMEOUT = 30

# Notification Settings
ENABLE_SMS_NOTIFICATIONS = True
ENABLE_EMAIL_NOTIFICATIONS = True
ENABLE_PUSH_NOTIFICATIONS = True

# Feature Flags
ENABLE_MULTI_CURRENCY = False
ENABLE_OVERDRAFT = False
ENABLE_SCHEDULED_PAYMENTS = True
ENABLE_RECURRING_PAYMENTS = True
