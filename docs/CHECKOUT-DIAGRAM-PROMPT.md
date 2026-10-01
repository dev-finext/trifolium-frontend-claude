# Prompt for Claude — checkout flow diagram

Paste everything below the line into Claude and ask for the artifact. The status
names are the real ones from `app/Enums/OrderStatus.php`; keep them exact.

---

Draw me a process diagram of a checkout flow, as a single self-contained HTML
artifact with inline SVG. This is for a compounding pharmacy's practitioner
portal. The diagram is going into a development specification, so it has to be
exact and readable before it is attractive — but it should still look like
someone designed it.

## What the flow is

A practitioner fills a cart for a patient. Two independent choices are made in
the cart, and together they decide everything that follows:

- **Who pays** — the practitioner, or the patient.
- **Who receives the parcel** — the practitioner, the patient, or self-pickup at
  the pharmacy.

Two rules govern the whole flow, and the diagram should make both legible at a
glance:

1. **Payment never blocks production.** A practitioner whose account is on
   credit terms sends the order to the lab unpaid.
2. **A missing recipient authorisation does block production.** Whoever takes
   the parcel from the courier must sign a power of attorney, and there must be
   an address. Until both exist, nothing is compounded.

## Status names — use these exactly

The order statuses are a fixed set. Where a node is a status, label it with the
value in code font:

`pending_payment` · `paid` · `in_production` · `ready_for_delivery` ·
`shipped` · `completed` · `cancelled`

Two are being added by this specification, and the diagram must mark them
visibly as new — a badge, a dashed outline, something that reads as "does not
exist yet":

`paid_awaiting_details` · `credit_awaiting_details`

The payment provider is **Pelecard**. The practitioner's permission is a field
called `payment_terms` with two values, `immediate` and `credit`.

## The nodes and edges

**Start:** `Cart — practitioner selects payer and recipient`

**Branch 1 — the practitioner pays.** Decision: `payment_terms = credit?`

- **No** (`immediate`) → `Pelecard payment` — no alternative is offered
- **Yes** → decision `Pay now?`
  - **Yes** → `Pelecard payment`
  - **No** → `Order summary and final confirmation` → `Order created — on credit,
    unpaid`

**Branch 2 — the patient pays.**
`Order created — pending_payment` → `WhatsApp: payment link` → `Delivery details
(address + power of attorney)` — *this screen only when the parcel goes to the
patient* → `Order summary` → `Pelecard payment` → on success the webhook sets
`paid`

**After the order exists**, both branches meet at one decision:
`Does the recipient's authorisation and address already exist?`

- **Yes** → `in_production`
- **No** — this happens only when the parcel goes to the patient and the patient
  is not the payer → one of the two new blocking statuses:
  - `paid_awaiting_details` — the practitioner paid at checkout
  - `credit_awaiting_details` — the practitioner is on credit

  Both → `WhatsApp: details-completion link` → `Patient submits address and
  signature` → `in_production`

  And from both, a timeout path:
  `No submission after 3 days` → `Automatic reminder, same link` →
  `No submission after 7 days` → `Raised as an admin exception`.
  Label this path clearly as **not** a cancellation — the money has been taken,
  or the goods are owed.

**Failure path:** `Pelecard payment` → on failure → `No order created; back to
the cart`.

## The six cases

Show these as a compact table beside or beneath the diagram, not as six separate
branches — the branches would be unreadable and the table is exact:

| Pays | Receives | Result |
|---|---|---|
| Practitioner | Practitioner | Everything collected in the cart. Proceeds. |
| Practitioner (paid) | Patient | Blocked — `paid_awaiting_details` |
| Practitioner (credit) | Patient | Blocked — `credit_awaiting_details` |
| Practitioner | Pickup | No courier, no authorisation. Proceeds. |
| Patient | Practitioner | Practitioner signs in the cart. Proceeds on payment. |
| Patient | Patient | Collected inside the payment flow. Proceeds on payment. |

## How it should look

- **Left to right**, with the two payer branches as two clearly separate lanes
  that rejoin at the authorisation decision. The rejoining is the point of the
  diagram: both ways of paying meet the same gate.
- **Decisions as diamonds**, states as rounded rectangles, the two new blocking
  statuses visually distinct from every other node twice over — they are the
  only places an order stops, *and* they are the only things that do not exist
  in the code yet.
- **Colour carries meaning and nothing else.** One hue for the flow, one for
  blocked states, one for the terminal success state, and a separate visual
  treatment (not a fourth hue) for "new". No decoration, no gradients on nodes,
  no drop shadows for their own sake.
- **Label every edge** that leaves a decision — "yes", "no", "to patient", "to
  practitioner", and so on. An unlabelled edge out of a diamond is a bug.
- The timeout path should read as secondary: thinner, quieter, clearly a side
  road rather than the main line.
- Legible at A4 width, and readable in both light and dark.
- English labels. Status values in code font so they stand apart from prose.

Keep the node text short — three or four words. The detail lives in the table
and in the specification, not inside the boxes.
