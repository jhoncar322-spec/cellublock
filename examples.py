"""
Example usage of the Mobile Finance Platform
Demonstrates common scenarios and use cases
"""

from app import MobileFinancePlatform
from api import MobileFinanceAPI
from utils import format_currency, generate_statement
import json


def example_basic_operations():
    """Example: Basic platform operations"""
    print("=" * 60)
    print("EXAMPLE 1: Basic Operations")
    print("=" * 60)
    
    platform = MobileFinancePlatform()
    
    # Create users
    platform.create_user('U001', 'Pedro González', 'pedro@email.com', '+34600111222')
    platform.create_user('U002', 'Laura Fernández', 'laura@email.com', '+34600333444')
    
    # Create accounts
    platform.create_account('ACC001', 'U001', 'savings')
    platform.create_account('ACC002', 'U002', 'checking')
    
    # Process transactions
    platform.process_deposit('T001', 'ACC001', 5000.0, 'Salario mensual')
    platform.process_deposit('T002', 'ACC002', 3000.0, 'Salario mensual')
    platform.process_withdrawal('T003', 'ACC001', 500.0, 'Cajero automático')
    
    # Display balances
    print(f"\nBalance de Pedro: {format_currency(platform.get_account_balance('ACC001'))}")
    print(f"Balance de Laura: {format_currency(platform.get_account_balance('ACC002'))}")
    print(f"Total de transacciones: {len(platform.transactions)}")


def example_money_transfer():
    """Example: Money transfer between accounts"""
    print("\n" + "=" * 60)
    print("EXAMPLE 2: Money Transfer")
    print("=" * 60)
    
    platform = MobileFinancePlatform()
    
    # Setup accounts
    platform.create_user('U001', 'Miguel Torres', 'miguel@email.com', '+34600555666')
    platform.create_user('U002', 'Carmen Ruiz', 'carmen@email.com', '+34600777888')
    
    platform.create_account('ACC001', 'U001', 'savings')
    platform.create_account('ACC002', 'U002', 'checking')
    
    # Initial deposits
    platform.process_deposit('T001', 'ACC001', 10000.0, 'Depósito inicial')
    platform.process_deposit('T002', 'ACC002', 5000.0, 'Depósito inicial')
    
    print(f"\nBalance inicial Miguel: {format_currency(platform.get_account_balance('ACC001'))}")
    print(f"Balance inicial Carmen: {format_currency(platform.get_account_balance('ACC002'))}")
    
    # Transfer money
    platform.transfer('T003', 'ACC001', 'ACC002', 2500.0, 'Pago de alquiler')
    
    print(f"\nDespués de transferencia de €2,500:")
    print(f"Balance Miguel: {format_currency(platform.get_account_balance('ACC001'))}")
    print(f"Balance Carmen: {format_currency(platform.get_account_balance('ACC002'))}")


def example_transaction_history():
    """Example: Transaction history and statements"""
    print("\n" + "=" * 60)
    print("EXAMPLE 3: Transaction History")
    print("=" * 60)
    
    platform = MobileFinancePlatform()
    
    # Setup
    platform.create_user('U001', 'Roberto Sánchez', 'roberto@email.com', '+34600999000')
    platform.create_account('ACC001', 'U001', 'checking')
    
    # Multiple transactions
    platform.process_deposit('T001', 'ACC001', 3000.0, 'Salario')
    platform.process_withdrawal('T002', 'ACC001', 200.0, 'Supermercado')
    platform.process_withdrawal('T003', 'ACC001', 100.0, 'Gasolina')
    platform.process_deposit('T004', 'ACC001', 500.0, 'Freelance')
    platform.process_withdrawal('T005', 'ACC001', 80.0, 'Restaurante')
    
    # Get transaction history
    transactions = platform.get_account_transactions('ACC001')
    
    print(f"\nHistorial de transacciones para cuenta ACC001:")
    print("-" * 60)
    for trans in transactions:
        print(f"{trans.transaction_type:12} | {format_currency(trans.amount):12} | {trans.status:10} | {trans.description}")
    
    print(f"\nBalance final: {format_currency(platform.get_account_balance('ACC001'))}")
    
    # Generate statement
    statement = generate_statement(transactions, 'ACC001')
    print(f"\nResumen del estado de cuenta:")
    print(f"Total depósitos: {format_currency(statement['total_deposits'])}")
    print(f"Total retiros: {format_currency(statement['total_withdrawals'])}")
    print(f"Número de transacciones: {statement['transaction_count']}")


def example_api_usage():
    """Example: Using the API interface"""
    print("\n" + "=" * 60)
    print("EXAMPLE 4: Mobile API Usage")
    print("=" * 60)
    
    api = MobileFinanceAPI()
    
    # Register user via API
    result = api.register_user('U001', 'Isabel Moreno', 'isabel@email.com', '+34611222333')
    print(f"\nUser registration: {result['message']}")
    
    # Create account via API
    result = api.create_account('U001', 'ACC001', 'savings')
    print(f"Account creation: {result['message']}")
    
    # Deposit via API
    result = api.deposit('T001', 'ACC001', 4000.0, 'Depósito inicial')
    print(f"Deposit: {result['message']}")
    print(f"New balance: {format_currency(result['data']['new_balance'])}")
    
    # Withdraw via API
    result = api.withdraw('T002', 'ACC001', 600.0, 'Compras')
    print(f"Withdrawal: {result['message']}")
    print(f"New balance: {format_currency(result['data']['new_balance'])}")
    
    # Get balance via API
    result = api.get_balance('ACC001')
    print(f"\nBalance query: {result['message']}")
    print(f"Current balance: {format_currency(result['data']['balance'])}")


def example_multi_account():
    """Example: User with multiple accounts"""
    print("\n" + "=" * 60)
    print("EXAMPLE 5: Multiple Accounts per User")
    print("=" * 60)
    
    platform = MobileFinancePlatform()
    
    # Create user with multiple accounts
    platform.create_user('U001', 'Francisco López', 'francisco@email.com', '+34622333444')
    platform.create_account('ACC001', 'U001', 'savings')
    platform.create_account('ACC002', 'U001', 'checking')
    
    # Fund accounts
    platform.process_deposit('T001', 'ACC001', 15000.0, 'Ahorros')
    platform.process_deposit('T002', 'ACC002', 2000.0, 'Gastos mensuales')
    
    # Get all user accounts
    accounts = platform.get_user_accounts('U001')
    
    print(f"\nCuentas de Francisco López:")
    print("-" * 60)
    for acc in accounts:
        print(f"Cuenta: {acc.account_id} | Tipo: {acc.account_type:10} | Balance: {format_currency(acc.balance)}")
    
    # Transfer between own accounts
    platform.transfer('T003', 'ACC001', 'ACC002', 1000.0, 'Transferencia entre cuentas propias')
    
    print(f"\nDespués de transferencia interna de €1,000:")
    for acc in platform.get_user_accounts('U001'):
        print(f"Cuenta: {acc.account_id} | Balance: {format_currency(acc.balance)}")


def example_data_export():
    """Example: Export platform data"""
    print("\n" + "=" * 60)
    print("EXAMPLE 6: Data Export")
    print("=" * 60)
    
    platform = MobileFinancePlatform()
    
    # Create sample data
    platform.create_user('U001', 'Test User', 'test@email.com', '+34600000000')
    platform.create_account('ACC001', 'U001', 'savings')
    platform.process_deposit('T001', 'ACC001', 1000.0, 'Test deposit')
    
    # Export data
    data_json = platform.export_data()
    data = json.loads(data_json)
    
    print(f"\nDatos exportados del sistema:")
    print(f"Total usuarios: {len(data['users'])}")
    print(f"Total cuentas: {len(data['accounts'])}")
    print(f"Total transacciones: {len(data['transactions'])}")
    print("\nJSON export preview:")
    print(json.dumps(data, indent=2)[:500] + "...")


if __name__ == '__main__':
    print("\n")
    print("*" * 60)
    print("  MOBILE FINANCE PLATFORM - EJEMPLOS DE USO")
    print("  Plataforma de Financiero Móviles - Cellublock")
    print("*" * 60)
    
    # Run all examples
    example_basic_operations()
    example_money_transfer()
    example_transaction_history()
    example_api_usage()
    example_multi_account()
    example_data_export()
    
    print("\n" + "=" * 60)
    print("¡Todos los ejemplos completados exitosamente!")
    print("=" * 60 + "\n")
