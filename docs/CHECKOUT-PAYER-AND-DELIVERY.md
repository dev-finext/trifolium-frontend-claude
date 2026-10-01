# Checkout: who pays, who receives

Specification for the cart page (`resources/js/pages/Cart.vue`) and everything it
sets in motion. Written for implementation; every rule here is testable.

Status: agreed 1.10.2026. One open item is marked at the end.

---

## 1. The two rules everything follows

**Payment never blocks production.** A practitioner approved for deferred
payment can send an order to the lab without paying. The debt accrues and the
admin collects it separately. An unpaid order is not a held order.

**A missing recipient authorisation does block production.** Whoever physically
takes the parcel from the courier must have filled and signed a power of
attorney, and there must be an address to send it to. Until both exist, nothing
is compounded.

Everything below is these two rules applied to the cases.

---

## 2. Inputs

The cart already holds the first two. The third is read, never set here.

| Input | Values | Where it comes from |
|---|---|---|
| `payer` | `practitioner` \| `patient` | Cart — "פרטי תשלום" |
| `recipient` | `practitioner` \| `patient` \| `pickup` | Cart — "משלוח" |
| `practitioner.credit` | boolean | The practitioner's card in the admin |

`practitioner.credit` is the existing deferred-payment approval (הקפה). It is
granted per practitioner by an admin and it is the only thing that decides
whether "pay later" is offered. There is no second permission and no credit
limit — the system warns, it never blocks.

### Removed: the shipping lock

Today the cart locks `recipient` to the paying patient whenever
`payer === 'patient'`. **That lock is removed.** A patient may pay for a parcel
that goes to the practitioner's clinic. See §6, case 5.

---

## 3. Who pays — the branch at checkout

### 3.1 The practitioner pays

```
practitioner.credit === false
    → Placard. No choice is offered; there is no other way to place the order.

practitioner.credit === true
    → Ask: "Pay now?"
        Yes → Placard
        No  → Order summary and final confirmation.
              The order is created as a credit order; the balance accrues as
              open debt.
```

The "Pay now?" question appears **only** when the practitioner holds the
permission. A practitioner without it never sees a "pay later" option — showing
and then refusing it is worse than not showing it.

Practitioner pricing (the 60% / 40% / 20% bands already in the cart) is
unaffected by this choice. It follows `payer`, not the moment of payment.

### 3.2 The patient pays

The existing flow, unchanged:

1. The practitioner completes the cart and submits.
2. The patient receives a **WhatsApp message with a payment link**.
3. If the parcel is going to the patient, the link opens on the delivery-details
   screen — address, and the power of attorney.
4. Order summary, with the button through to payment.
5. Placard.
6. Success or failure page.

---

## 4. Power of attorney and address

The power of attorney authorises the courier to hand the preparation over. It is
signed by **the person who receives it**, not by the patient on someone else's
behalf. It collects full name, national ID and a signature — the existing
`CourierPoaModal`.

| Recipient | Power of attorney | Address |
|---|---|---|
| Practitioner | Signed by the practitioner, in the cart | Chosen from the practitioner's closed, pre-defined list |
| Patient | Signed by the patient | Entered by the patient |
| Pickup | Not required — there is no courier | The pharmacy's own address, fixed |

When the recipient is the patient, where they sign depends on who pays:

- **The patient pays** — in their delivery-details screen, before payment. The
  order is complete when the payment clears; nothing is ever pending.
- **The practitioner pays, or defers** — the patient is not in the flow at all,
  so they are sent a **details-completion link** by WhatsApp. That page asks for
  the address and the signature and has no payment step. Submitting it releases
  the order.

---

## 5. The two new statuses

Both mean the same thing operationally — the lab must not start — and differ
only in what has happened to the money. They are separate so that the orders
screen answers "has this been paid?" without opening the order.

| id | Hebrew | English |
|---|---|---|
| `paid_awaiting_customer` | שולם — ממתין לייפוי כוח וכתובת מהלקוח | Paid — awaiting customer authorisation and address |
| `credit_awaiting_customer` | בהקפה — ממתין לייפוי כוח וכתובת מהלקוח | On credit — awaiting customer authorisation and address |

**Both block production.** An order in either state is not compounded, not
allocated stock and not sent to the lab.

**Both are released the same way:** the patient submits the details-completion
page with a valid address and a signed power of attorney. The order then moves
into the normal flow exactly as if it had arrived complete.

The existing statuses (`new`, `in_process`, `lab`, `packed`, `sent`, `closed`,
`on_hold`, `cancelled`) are unchanged. These two are additions.

---

## 6. The whole matrix

Six combinations. Only two of them wait on anybody.

| # | Pays | Receives | What happens |
|---|---|---|---|
| 1 | Practitioner | Practitioner | Address and signature are both collected in the cart. Order proceeds on creation. |
| 2 | Practitioner (paid) | Patient | → `paid_awaiting_customer`. Details-completion link sent. **Blocked.** |
| 3 | Practitioner (credit) | Patient | → `credit_awaiting_customer`. Details-completion link sent. **Blocked.** |
| 4 | Practitioner | Pickup | No courier, no authorisation. Order proceeds on creation. |
| 5 | Patient | Practitioner | The practitioner signs in the cart and picks the address there. The patient only pays. Order proceeds when the payment clears. |
| 6 | Patient | Patient | Address and signature are collected inside the payment flow. Order proceeds when the payment clears. |

Cases 1, 4 and 5 also apply when the practitioner is on credit: the order
proceeds unpaid and the debt accrues. Nothing waits.

---

## 7. When the patient does not respond

An order in `paid_awaiting_customer` or `credit_awaiting_customer` cannot sit
there indefinitely.

1. **Reminder.** A second WhatsApp with the same link, automatically, after
   **3 days** without a submission.
2. **Exception.** If there is still nothing after **7 days** from the order, the
   order is raised as an exception on the admin's exceptions list, for a person
   to deal with.

Both intervals are configuration, not constants in the code.

---

## 8. A failed payment

**No order is created.** The cart is left as it was, the practitioner or the
patient returns to it and tries again, and nothing is written to the admin.

This is unambiguous for case 1, 4 and 5 — the practitioner pays at checkout and
there is nothing to clean up. For cases where the patient pays, see the open
item below.

---

## 9. Build order

Not the order the cases were described in — the order that makes each step
possible.

1. **Data model.** The two new statuses with their labels in both languages; the
   order's `payer`, `recipient`, power-of-attorney record and address source;
   reading `practitioner.credit` on the practitioner's card.
2. **Cart.** Remove the shipping lock. Make the power of attorney conditional on
   the recipient rather than on a checkbox. Switch the address source by
   recipient.
3. **Checkout branch.** The practitioner's two paths (§3.1), including hiding
   "pay later" from a practitioner without the permission.
4. **Order creation.** The decision table of §6, producing the right status.
5. **The patient's two links.** The payment link as it is today, and the new
   details-completion link.
6. **Release.** Submitting the details-completion page clears the blocking
   status and lets the order into the lab.
7. **Reminder and exception** (§7).
8. **Failure handling** (§8).

Steps 1–4 are enough to place every kind of order. Steps 5–6 are what make cases
2 and 3 finishable. Steps 7–8 are the edges.

---

## 10. Open item

**A failed payment when the patient is the payer.** For the practitioner's own
payment, "no order is created" is exact. But for cases 2, 3 and 6 the order must
already exist before the WhatsApp goes out — the link has to point at something.
So on a failed patient payment the order cannot be un-created; it stays unpaid
and the patient retries from the same link.

The proposal: keep "no order is created" for a practitioner's own payment at
checkout, and for the patient treat a failure as "payment not completed" with
the order kept and the link still valid. **Needs confirming.**
