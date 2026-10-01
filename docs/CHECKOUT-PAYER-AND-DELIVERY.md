# Checkout: who pays, who receives

Specification for the cart and everything it sets in motion. Written against the
code as it stands in `Trifolium_2026`. Agreed 1.10.2026.

---

## 1. The two rules

- **Payment never blocks production.** A practitioner on credit terms sends the
  order to the lab unpaid; the debt accrues and is collected separately.
- **A missing recipient authorisation always blocks production.** Whoever takes
  the parcel from the courier must have signed a power of attorney, and there
  must be an address. Until both exist, nothing is compounded.

---

## 2. What already exists — do not rebuild it

| Thing | Where |
|---|---|
| `payer` — practitioner \| patient | `Order.payer`, enum `App\Enums\Payer`, set at checkout |
| Credit terms | `User.payment_terms`, enum `PaymentTerms` (`immediate` \| `credit`), default `immediate`, set by `Admin\UsersController::updatePaymentTerms` with `credit_approved_at` / `credit_approved_by` |
| Payment link | `Order.payment_token` + `payment_expires_at` |
| Payment provider | **Pelecard** (`pelecard_token`, `pelecard_transaction_id`, `pelecard_confirmation`), alongside GoCredit |
| Payment confirmation | `WebhookController` sets the order to `paid` |
| Courier authorisation | `Order.courier_auth` — **a boolean only** |
| Status history | `OrderStatusHistory`, one row per change |
| Stale orders | `CancelStaleOrders` — cancels `pending_payment` after 7 days |

**The checkout never reads `payment_terms`.** Every order is created
`pending_payment` with a token, whoever pays and whatever their terms. That is
the gap this specification fills.

---

## 3. Inputs

| Input | Values | Status |
|---|---|---|
| `payer` | practitioner \| patient | Exists |
| `recipient` | practitioner \| patient \| pickup | **New.** Today only `delivery_type` (`shipping` \| `self_pickup`) exists; who receives is implied by `recipient_name` and the address |
| `User.payment_terms` | immediate \| credit | Exists. Read-only here |

`payment_terms` is the only thing that decides whether "pay later" is offered.
No second permission, no credit limit.

**Change to existing behaviour:** the cart locks the recipient to the paying
patient. That lock is removed — a patient may pay for a parcel that goes to the
clinic.

---

## 4. Who pays

**The practitioner pays**

- `payment_terms = immediate` — straight to Pelecard. No choice is offered.
- `payment_terms = credit` — ask "Pay now?". Yes goes to Pelecard; No goes to
  the order summary and final confirmation, and the order is created on credit.

Pricing follows `payer`, not the moment of payment.

**The patient pays** — unchanged. The practitioner submits the cart, the patient
gets a WhatsApp payment link, fills delivery details when the parcel is going to
them, sees the order summary, pays through Pelecard, and lands on a success or
failure page.

---

## 5. Authorisation and address

The power of attorney authorises the courier to hand the preparation over. It is
signed by **the person who receives it**.

| Recipient | Power of attorney | Address |
|---|---|---|
| Practitioner | Signed by the practitioner, in the cart | From the practitioner's closed list |
| Patient | Signed by the patient | Entered by the patient |
| Pickup | Not required — no courier | The pharmacy's address |

**The signature must be stored.** `CourierPoaModal` already collects full name,
national ID and a drawn signature, and today only `courier_auth` (a boolean)
survives the request. Persist all three, so the authorisation can be produced if
a delivery is ever disputed: `courier_auth_name`, `courier_auth_id`,
`courier_auth_signature` (file reference), `courier_auth_signed_at`. The existing
boolean stays as the quick flag the admin list reads.

When the recipient is the patient, where they sign depends on who pays. If the
patient pays, inside their own payment flow. If the practitioner pays or defers,
through a **details-completion link** sent by WhatsApp — address and signature,
no payment step.

---

## 6. The six cases

| Pays | Receives | Result |
|---|---|---|
| Practitioner | Practitioner | Everything collected in the cart. Proceeds. |
| **Practitioner** | **Patient** | **Paid at checkout → blocked, awaiting the customer.** |
| **Practitioner** | **Patient** | **On credit → blocked, awaiting the customer.** |
| Practitioner | Pickup | No courier, no authorisation. Proceeds. |
| Patient | Practitioner | Practitioner signs in the cart. Proceeds on payment. |
| Patient | Patient | Collected inside the payment flow. Proceeds on payment. |

Only the two bold rows wait on anybody. Rows 1, 4 and 5 also apply on credit:
the order proceeds unpaid.

---

## 7. Order statuses

`app/Enums/OrderStatus.php` holds seven today. `SapImport::mapOrderStatus()`
brings the old system's `ORDR.U_OrderState` into them:

| SAP | Hebrew | New production |
|---|---|---|
| 1 | הזמנה חדשה | `pending_payment` |
| 2 | בטיפול | `paid` |
| 3 | מעבדה | `in_production` |
| 4 | ארוז | `ready_for_delivery` |
| 5 | נשלח | `shipped` |
| 6 | סגור | `completed` |
| 7, 8 | מושהה, מבוטל | `cancelled` |

### Two new statuses

Added to the same enum. They are the only additions this specification makes.

| Case | Value | Hebrew label |
|---|---|---|
| `PaidAwaitingDetails` | `paid_awaiting_details` | שולם — ממתין לייפוי כוח וכתובת מהלקוח |
| `CreditAwaitingDetails` | `credit_awaiting_details` | בהקפה — ממתין לייפוי כוח וכתובת מהלקוח |

Both:

- **block production** — not compounded, no stock allocated, not sent to the lab;
- are **not** terminal — `isTerminal()` returns false;
- are **not** active — `isActive()` returns false. They are paid or owed, but
  they are not progressing, and the admin screens must not count them as such;
- are released the same way — the patient submits the details-completion page
  with a valid address and a signed authorisation, after which the order moves
  to `paid` or `in_production` exactly as a complete order would.

They have no SAP equivalent and are never produced by the import.

---

## 8. Timeouts, failure, and one thing to fix first

**Reminder.** No submission after 3 days — the same link is sent again,
automatically.

**Escalation.** No submission after 7 days from the order — raised as an
exception on the admin exceptions list. **Not cancelled**: the money has been
taken, or the goods are owed.

**`CancelStaleOrders` must not touch the two new statuses.** It cancels anything
in `pending_payment` older than its `--days` window, and the new states must be
outside its reach.

**The same command needs a guard before it is ever run on production.** It has
none today, and the SAP import brought in **17,711 orders in state 1 as
`pending_payment`**, all of them older than seven days. One run cancels every
one of them. Restrict it to orders that have a `payment_token` and no
`sap_doc_entry`.

**A failed payment.** No order is created — the cart is left as it was and
nothing is written. See section 10.

---

## 9. Build order

1. **Enum and schema.** The two new statuses with both labels; `recipient` on
   the order; the four courier-authorisation columns.
2. **Guard `CancelStaleOrders`** (section 8) — before anything else runs against
   real data.
3. **Cart.** Remove the shipping lock; make the authorisation conditional on the
   recipient rather than on a checkbox; switch the address source by recipient;
   post the signature, not just the flag.
4. **Checkout branch.** Read `payment_terms`; the practitioner's two paths;
   hide "pay later" from a practitioner on `immediate`.
5. **Order creation.** The decision table of section 6, producing the right
   status.
6. **The two outbound links.** The payment link as it is today, and the new
   details-completion link.
7. **Release.** Submitting the details-completion page clears the blocking
   status.
8. **Reminder and exception.**

---

## 10. Open items

**A failed payment when the patient is the payer.** "No order is created" is
exact when the practitioner pays at checkout. It cannot hold when the patient
pays: the order must already exist before the WhatsApp goes out, because the
link has to point at something. Proposal — keep "no order is created" for the
practitioner's own payment; for the patient, treat a failure as payment not
completed, order kept, link still valid. **Needs confirming.**

**SAP 7 and 8 both became `cancelled`.** 88 on-hold orders arrived as cancelled
and cannot be separated again from the new database. Outside this specification,
but worth knowing before anyone reports on cancellations.
