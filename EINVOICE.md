# e-Invoice Module Documentation

## Overview

The e-Invoice module prepares invoice data for submission to LHDN's MyInvois system. It supports both portal and API transmission methods.

## ⚠️ Important

- This module does NOT automatically submit to LHDN
- Real submission requires explicit configuration with valid credentials
- All e-Invoice requirements must be verified with LHDN before production use
- Credentials are stored in Cloudflare Secrets only (never in source code)

## Adapter Architecture

```typescript
interface EInvoiceAdapter {
  submit(document: EInvoiceDocument): Promise<EInvoiceResponse>;
  cancel(uuid: string, reason: string): Promise<EInvoiceResponse>;
  getStatus(uuid: string): Promise<EInvoiceStatus>;
  validate(document: EInvoiceDocument): Promise<ValidationResult>;
}
```

### Available Adapters

| Adapter | Status | Purpose |
|---------|--------|---------|
| MockAdapter | ✅ Active in dev | Returns simulated responses |
| MyInvoisSandboxAdapter | ⚠️ Placeholder | For LHDN sandbox testing |
| MyInvoisProductionAdapter | ⚠️ Placeholder | For live submission |

## e-Invoice Data Fields

### Required Fields
- Supplier TIN
- Buyer TIN
- Business Registration Number (BRN/SSM)
- Buyer name and address
- State and country code
- Invoice number and date/time
- Item descriptions with classification codes
- Quantity and unit price
- Tax type, rate, and amount
- Total amount and currency
- Payment mode

### Optional Fields
- Discount amount
- Original invoice reference (for credit/debit/refund notes)
- QR code / validation link

## e-Invoice Status Flow

```
not_ready → draft → queued → submitted → valid
                                    ↓
                                 invalid
                                    ↓
                                 rejected
                                    
Any → cancelled (by supplier)
```

## Classification Codes

Malaysian e-Invoice requires classification codes for goods/services. These are configurable in the system and should be verified against the latest LHDN classification list.

## MyInvois Integration

### Portal Method
1. System prepares e-Invoice data
2. User downloads formatted document
3. User manually uploads to MyInvois portal
4. User enters validation ID back into system

### API Method
1. System authenticates with LHDN API
2. System submits document via API
3. System receives validation response
4. System stores UUID and validation ID
5. QR code generated for buyer verification

## Configuration

Required secrets (Cloudflare Secrets):
```
MYINVOIS_CLIENT_ID=<from LHDN>
MYINVOIS_CLIENT_SECRET=<from LHDN>
MYINVOIS_API_URL=<sandbox or production URL>
```

## Testing

The mock adapter returns configurable responses:
- Success: Returns valid UUID and validation ID
- Rejection: Returns rejection reason
- Timeout: Simulates API timeout
- Validation Error: Returns field-level errors
