# Mobile Finance Platform (Plataforma de Financiero Móviles)

A comprehensive mobile finance platform for managing financial transactions, user accounts, and payment processing.

## Features

- **User Management**: Create and manage user profiles
- **Account Management**: Support for multiple account types (savings, checking)
- **Transaction Processing**: Deposit, withdrawal, and transfer operations
- **Transaction History**: Track all financial transactions
- **Mobile-Friendly API**: RESTful API interface for mobile applications
- **Balance Tracking**: Real-time balance updates and queries

## Components

### Core Platform (`app.py`)
The main application containing the core business logic:
- `User`: User account management
- `Account`: Financial account handling
- `Transaction`: Transaction processing and tracking
- `MobileFinancePlatform`: Main platform orchestrator

### API Interface (`api.py`)
RESTful API wrapper for mobile applications:
- User registration
- Account creation
- Deposit/Withdrawal operations
- Money transfers
- Balance inquiries
- Transaction history

## Installation

```bash
# Clone the repository
git clone https://github.com/jhoncar322-spec/cellublock.git
cd cellublock

# No external dependencies required - uses Python standard library
```

## Usage

### Running the Core Platform Demo

```bash
python app.py
```

This will run a demonstration showing:
- User creation
- Account setup
- Transaction processing
- Balance queries
- Data export

### Running the API Demo

```bash
python api.py
```

This demonstrates the mobile API interface with:
- User registration
- Account creation
- Deposits and withdrawals
- Money transfers
- Balance checks
- Transaction history

### Using as a Library

```python
from app import MobileFinancePlatform

# Initialize platform
platform = MobileFinancePlatform()

# Create user
user = platform.create_user('U001', 'John Doe', 'john@example.com', '+1234567890')

# Create account
account = platform.create_account('ACC001', 'U001', 'savings')

# Process deposit
platform.process_deposit('T001', 'ACC001', 1000.0, 'Initial deposit')

# Check balance
balance = platform.get_account_balance('ACC001')
print(f"Balance: ${balance:.2f}")
```

### Using the API Interface

```python
from api import MobileFinanceAPI

# Initialize API
api = MobileFinanceAPI()

# Register user
result = api.register_user('U001', 'Jane Doe', 'jane@example.com', '+1234567890')

# Create account
result = api.create_account('U001', 'ACC001', 'checking')

# Make deposit
result = api.deposit('T001', 'ACC001', 500.0, 'Salary')

# Transfer money
result = api.transfer('T002', 'ACC001', 'ACC002', 100.0, 'Payment')
```

## API Endpoints

The platform simulates the following RESTful API endpoints:

- `POST /api/users/register` - Register new user
- `POST /api/accounts/create` - Create new account
- `POST /api/transactions/deposit` - Process deposit
- `POST /api/transactions/withdraw` - Process withdrawal
- `POST /api/transactions/transfer` - Transfer money
- `GET /api/accounts/{account_id}/balance` - Get account balance
- `GET /api/accounts/{account_id}/transactions` - Get transaction history
- `GET /api/users/{user_id}/accounts` - Get user accounts

## Data Models

### User
- `user_id`: Unique identifier
- `name`: User's full name
- `email`: Email address
- `phone`: Phone number
- `created_at`: Registration timestamp
- `is_active`: Account status

### Account
- `account_id`: Unique identifier
- `user_id`: Owner's user ID
- `account_type`: Type (savings/checking)
- `balance`: Current balance
- `created_at`: Creation timestamp
- `is_active`: Account status

### Transaction
- `transaction_id`: Unique identifier
- `account_id`: Associated account
- `transaction_type`: Type (deposit/withdrawal/transfer)
- `amount`: Transaction amount
- `description`: Transaction description
- `timestamp`: Transaction time
- `status`: Status (pending/completed/failed)

## Security Notes

This is a demonstration platform. For production use, consider implementing:
- User authentication and authorization
- Data encryption
- Secure API endpoints (HTTPS)
- Input validation and sanitization
- Rate limiting
- Audit logging
- Database persistence
- Transaction rollback mechanisms

## License

MIT License

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. 
