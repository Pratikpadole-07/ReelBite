# Concurrency Proof: Atomic Order Status Updates

## Problem Statement

In a real-world system, multiple actors can attempt to update the same resource simultaneously.
In ReelBite, duplicate requests or parallel partner actions may try to update the same order status at the same time.

Without protection, this causes:
- Duplicate state transitions
- Corrupted order history
- Inconsistent UI and analytics

This document proves that ReelBite is safe under concurrent updates.

---

## Design Decision

Concurrency is handled at the **database level**, not in application memory.

Key principles:
- Single atomic database operation
- Strict state transition validation
- Idempotent updates
- No in-memory locks
- No queues
- No race-prone flags

MongoDB is treated as the source of truth.

---

## Atomic Update Implementation

Order status updates use a single atomic `findOneAndUpdate` call
with strict match conditions.

```js
const updatedOrder = await Order.findOneAndUpdate(
  {
    _id: orderId,
    status: currentStatus,
    "statusHistory.status": { $ne: nextStatus }
  },
  {
    $set: { status: nextStatus },
    $push: {
      statusHistory: {
        status: nextStatus,
        at: new Date()
      }
    }
  },
  { new: true }
);


Test result :

Running concurrency test…

Request 1:
STATUS: 200
DATA: { message: 'No state change' }

Request 2:
STATUS: 200
DATA:
{
  _id: '694e78ebc970b1eb4fb9ac26',
  food: '6947bd285d68ee92fa5f5ef1',
  user: '694a5e2e6020a377f86bf756',
  partner: '6947a8aa91a3a2299c3d256c',
  status: 'accepted',
  createdAt: '2025-12-26T12:00:43.966Z',
  updatedAt: '2025-12-26T12:01:41.555Z'
}
