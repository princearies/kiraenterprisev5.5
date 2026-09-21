# Accounting Rules

## Double-Entry Bookkeeping

Every journal entry must have at least two lines. The sum of all debits must equal the sum of all credits.

```
Total Debit = Total Credit (always)
```

## Journal Entry Lifecycle

1. **Draft** - Can be edited, deleted. Not included in reports.
2. **Posted** - Cannot be edited or deleted. Included in all reports.
3. **Reversed** - A reversal entry has been created. Original remains.
4. **Voided** - Marked as void. Original remains for audit trail.

## Correction Rules

- Posted transactions CANNOT be silently edited or deleted
- Corrections must use reversal or adjustment entries
- Draft entries can be freely edited
- Posted entries require specific permission to reverse

## Period Locking

- Accounting periods can be locked by authorized users
- Locked periods cannot accept new journal postings
- Reopening a locked period requires elevated permission
- All actions on locked periods are audit-logged

## Monetary Calculations

- All amounts stored as INTEGER cents (e.g., RM 100.00 = 10000)
- No JavaScript floating-point arithmetic for financial totals
- Currency code stored with each amount
- Exchange rate stored for multi-currency entries
- Default currency: MYR (Malaysian Ringgit)

## Account Types

| Type | Normal Balance | Increases With |
|------|---------------|----------------|
| Asset | Debit | Debit |
| Liability | Credit | Credit |
| Equity | Credit | Credit |
| Revenue | Credit | Credit |
| Expense | Debit | Debit |

## Reports

### Trial Balance
Lists all accounts with their debit or credit balances. Total debits must equal total credits.

### Profit and Loss
Revenue minus Expenses equals Net Profit/Loss for the period.

### Statement of Financial Position
Assets = Liabilities + Equity (including current period profit)

## Year-End Workflow

1. Run pre-closing checks
2. Generate trial balance
3. Generate P&L and balance sheet
4. Create adjustment entries if needed
5. Lock all periods for the financial year
6. Publish immutable snapshot
7. Export year-end package

## Invoice Numbering

- Invoice numbers are sequential per company
- A posted/issued invoice number CANNOT be reused
- Cancelled/voided invoices retain their number
- Different document types may have separate sequences
