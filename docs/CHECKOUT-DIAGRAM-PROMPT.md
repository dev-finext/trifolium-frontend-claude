# Prompt for Claude — checkout flow diagram

Paste everything below the line into Claude and ask for the artifact.

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

1. **Payment never blocks production.** A practitioner approved for deferred
   payment ("credit") sends the order to the lab unpaid.
2. **A missing recipient authorisation does block production.** Whoever takes
   the parcel from the courier must sign a power of attorney, and there must be
   an address. Until both exist, nothing is compounded.

## The nodes and edges

**Start:** `Cart — practitioner selects payer and recipient`

**Branch 1 — the practitioner pays.** Decision: `Practitioner approved for
deferred payment?`

- **No** → `Placard payment` (no alternative is offered)
- **Yes** → decision `Pay now?`
  - **Yes** → `Placard payment`
  - **No** → `Order summary and final confirmation` → `Order created on credit`

**Branch 2 — the patient pays.**
`Order created` → `WhatsApp: payment link` → `Delivery details (address +
power of attorney)` — *this screen only when the parcel goes to the patient* →
`Order summary` → `Placard payment` → `Success or failure`

**After the order exists**, a second decision governs it:
`Does the recipient's authorisation and address already exist?`

- **Yes** → `Order proceeds to the lab`
- **No** (this happens only when the parcel goes to the patient and the patient
  is not the payer) → one of two blocking states:
  - `Paid — awaiting customer authorisation and address`
  - `On credit — awaiting customer authorisation and address`

  Both → `WhatsApp: details-completion link` → `Patient submits address and
  signature` → `Order proceeds to the lab`

  And from the blocking states, a timeout path:
  `No response after 3 days` → `Automatic reminder` →
  `No response after 7 days` → `Raised as an admin exception`

**Failure path:** `Placard payment` → on failure → `No order created; back to
the cart` (for the practitioner's own payment).

## The six cases

Show these as a compact table beside or beneath the diagram, not as six separate
branches — the branches would be unreadable and the table is exact:

| Pays | Receives | Result |
|---|---|---|
| Practitioner | Practitioner | Everything collected in the cart. Proceeds. |
| Practitioner (paid) | Patient | Blocked — paid, awaiting customer |
| Practitioner (credit) | Patient | Blocked — on credit, awaiting customer |
| Practitioner | Pickup | No courier, no authorisation. Proceeds. |
| Patient | Practitioner | Practitioner signs in the cart. Proceeds on payment. |
| Patient | Patient | Collected inside the payment flow. Proceeds on payment. |

## How it should look

- **Left to right**, with the two payer branches as two clearly separate lanes
  that rejoin at the authorisation decision. The rejoining is the point of the
  diagram: both ways of paying meet the same gate.
- **Decisions as diamonds**, states as rounded rectangles, the two blocking
  states visually distinct from every other node — they are the only places an
  order stops.
- **Colour carries meaning and nothing else.** One hue for the flow, one for
  blocked states, one for the terminal success state. No decoration, no
  gradients on nodes, no drop shadows for their own sake.
- **Label every edge** that leaves a decision — "yes", "no", "to patient", "to
  practitioner", and so on. An unlabelled edge out of a diamond is a bug.
- The timeout path (reminder → exception) should read as secondary: thinner,
  quieter, clearly a side road rather than the main line.
- Legible at A4 width, and readable in both light and dark.
- English labels.

Keep the node text short — three or four words. The detail lives in the table
and in the specification, not inside the boxes.
