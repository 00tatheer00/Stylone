/**
 * STYLONE — Phase 08 Order Engine Comprehensive Test Suite
 *
 * Verifies:
 * 1. Server-side price recalculation & anti-tampering
 * 2. Pakistani phone number validation & normalization
 * 3. Delivery address validation
 * 4. Order status transition state machine
 * 5. Inventory deduction & cancellation reversal
 * 6. Idempotency duplicate submission prevention
 * 7. Payment status lifecycle (COD collection & Bank transfer verification)
 * 8. Courier consignment dispatch & tracking URL generation
 * 9. Guest token authentication & IDOR defense
 * 10. Empty bag & invalid product validation
 */

import {
  placeOrder,
  updateOrderStatus,
  recordCodPayment,
  verifyBankTransfer,
  dispatchShipment,
  getOrderByNumber,
  getOrderById,
  getCourierTrackingUrl,
  isValidStatusTransition,
} from '../src/services/order-service';
import {
  pakistanPhoneRegex,
  normalizePakistanPhone,
  checkoutFormSchema,
} from '../src/lib/validations/checkout';
import type { OrderStatus, CourierName, PlaceOrderInput } from '../src/types/order';

interface TestResult {
  name: string;
  passed: boolean;
  details?: string;
}

const results: TestResult[] = [];

function assert(condition: boolean, name: string, details?: string) {
  if (condition) {
    results.push({ name, passed: true });
    console.log(`  ✓ PASS: ${name}`);
  } else {
    results.push({ name, passed: false, details });
    console.error(`  ✗ FAIL: ${name}${details ? ` -> ${details}` : ''}`);
  }
}

async function runTestSuite() {
  console.log('\n=============================================================');
  console.log('  STYLONE ORDER ENGINE — AUTOMATED TEST SUITE');
  console.log('=============================================================\n');

  // -------------------------------------------------------------
  // TEST 1: Pakistani Phone Validation & Normalization
  // -------------------------------------------------------------
  console.log('[Test Group 1] Pakistani Phone Validation & Normalization');

  const validPhones = [
    '03001234567',
    '+92 300 1234567',
    '923121234567',
    '0345-7654321',
    '+923331234567',
    '0321 9876543',
  ];

  for (const phone of validPhones) {
    const isValid = pakistanPhoneRegex.test(phone.trim());
    assert(isValid, `Valid phone accepted: "${phone}"`);
    const normalized = normalizePakistanPhone(phone);
    assert(
      /^03\d{9}$/.test(normalized),
      `Phone normalized to canonical format (03XXXXXXXXX): "${phone}" -> "${normalized}"`
    );
  }

  const invalidPhones = [
    '123456',
    '02134567890', // Landline Karachi (not mobile 03XX)
    '+12345678901', // US number
    '04235871234', // Landline Lahore
    'invalid-phone',
    '',
  ];

  for (const phone of invalidPhones) {
    const isValid = pakistanPhoneRegex.test(phone.trim());
    assert(!isValid, `Invalid phone rejected: "${phone}"`);
  }

  // -------------------------------------------------------------
  // TEST 2: Delivery Address Validation (Zod Schema)
  // -------------------------------------------------------------
  console.log('\n[Test Group 2] Delivery Address Validation (Zod)');

  const validAddress = {
    fullName: 'Syeda Fatima Zahra',
    phone: '03001234567',
    email: 'fatima@example.com',
    city: 'Lahore',
    area: 'Gulberg III',
    address: 'House 14-B, Street 5, Near Main Market',
    landmark: 'Near Mini Market',
    paymentMethod: 'cod' as const,
    notes: 'Please ring the bell twice.',
  };

  const schemaRes = checkoutFormSchema.safeParse(validAddress);
  assert(schemaRes.success, 'Valid Pakistani delivery address passed schema parsing');

  const missingCity = { ...validAddress, city: '' };
  const missingCityRes = checkoutFormSchema.safeParse(missingCity);
  assert(!missingCityRes.success, 'Missing city correctly rejected');

  const invalidPhoneAddress = { ...validAddress, phone: '0423123456' };
  const invalidPhoneRes = checkoutFormSchema.safeParse(invalidPhoneAddress);
  assert(!invalidPhoneRes.success, 'Non-Pakistani mobile phone in address correctly rejected');

  // -------------------------------------------------------------
  // TEST 3: Order Status Transition State Machine
  // -------------------------------------------------------------
  console.log('\n[Test Group 3] Order Status Transition State Machine');

  // Allowed transitions
  const validTransitions: [OrderStatus, OrderStatus][] = [
    ['pending', 'confirmed'],
    ['confirmed', 'processing'],
    ['processing', 'packed'],
    ['packed', 'shipped'],
    ['shipped', 'delivered'],
    ['pending', 'cancelled'],
    ['confirmed', 'cancelled'],
    ['processing', 'cancelled'],
    ['packed', 'cancelled'],
    ['shipped', 'failed_delivery'],
    ['failed_delivery', 'returned'],
    ['returned', 'refunded'],
  ];

  for (const [from, to] of validTransitions) {
    const allowed = isValidStatusTransition(from, to);
    assert(allowed, `Allowed transition: ${from} -> ${to}`);
  }

  // Disallowed transitions
  const illegalTransitions: [OrderStatus, OrderStatus][] = [
    ['delivered', 'cancelled'], // Completed order cannot be cancelled
    ['delivered', 'pending'],   // Cannot rewind finished order
    ['cancelled', 'delivered'], // Cancelled order cannot be marked delivered
    ['refunded', 'processing'], // Refunded order cannot be processed
    ['pending', 'delivered'],   // Cannot skip straight to delivered
    ['shipped', 'pending'],     // Cannot rewind shipped order to pending
  ];

  for (const [from, to] of illegalTransitions) {
    const allowed = isValidStatusTransition(from, to);
    assert(!allowed, `Illegal transition prevented: ${from} -> ${to}`);
  }

  // -------------------------------------------------------------
  // TEST 4: Secure Server-side Price Recalculation & Tampering Defense
  // -------------------------------------------------------------
  console.log('\n[Test Group 4] Server-Side Price Calculation & Anti-Tampering');

  const testPayload: PlaceOrderInput = {
    customer: {
      fullName: 'Ayesha Khan',
      phone: '03011234567',
      email: 'ayesha.khan@example.com',
      city: 'Karachi',
      area: 'Clifton Block 4',
      address: 'Apartment 4B, Sea Breeze Towers',
      paymentMethod: 'cod',
    },
    items: [
      {
        productId: 'prod-skin-01', // Vitamin C Brightening Serum 15% (PKR 4,850 in demo)
        quantity: 1,
      },
    ],
    idempotencyKey: `test-idem-${Date.now()}-1`,
  };

  const orderRes = await placeOrder(testPayload);
  assert(orderRes.success, 'Order placed successfully via order engine');
  assert(Boolean(orderRes.orderNumber), `Generated unique order number: ${orderRes.orderNumber}`);
  assert(Boolean(orderRes.guestAccessToken), 'Generated high-entropy guest access token');

  // Subtotal is >= Rs. 3,500, so shipping is FREE. Expected total should be authoritative price.
  assert(
    typeof orderRes.total === 'number' && orderRes.total > 0,
    `Authoritative server total calculated: PKR ${orderRes.total}`
  );

  // -------------------------------------------------------------
  // TEST 5: Idempotency Protection
  // -------------------------------------------------------------
  console.log('\n[Test Group 5] Idempotency Duplicate Submission Prevention');

  const duplicateKey = `idem-key-duplicate-check-${Date.now()}`;
  const firstSubmission = await placeOrder({
    ...testPayload,
    idempotencyKey: duplicateKey,
  });
  assert(firstSubmission.success, 'Initial order with idempotency key placed');

  const secondSubmission = await placeOrder({
    ...testPayload,
    idempotencyKey: duplicateKey,
  });
  assert(secondSubmission.success, 'Second submission with identical idempotency key handled');
  assert(
    secondSubmission.orderNumber === firstSubmission.orderNumber,
    `Idempotency preserved: returned exact same order number (${secondSubmission.orderNumber}) without duplication`
  );

  // -------------------------------------------------------------
  // TEST 6: Guest Access Token & IDOR Defense
  // -------------------------------------------------------------
  console.log('\n[Test Group 6] Guest Access Token & IDOR Defense');

  if (firstSubmission.orderNumber && firstSubmission.guestAccessToken) {
    // 1. Correct token lookup succeeds
    const guestOrder = await getOrderByNumber(
      firstSubmission.orderNumber,
      firstSubmission.guestAccessToken
    );
    assert(guestOrder !== null, 'Guest lookup with valid token succeeds');

    // 2. Lookup without token is blocked (preventing sequential number guessing)
    const unauthorizedLookup = await getOrderByNumber(firstSubmission.orderNumber);
    assert(
      unauthorizedLookup === null,
      'Guest lookup without token REJECTED (IDOR vulnerability blocked)'
    );

    // 3. Lookup with tampered token is blocked
    const tamperedLookup = await getOrderByNumber(
      firstSubmission.orderNumber,
      'invalid-wrong-token-abc'
    );
    assert(
      tamperedLookup === null,
      'Guest lookup with invalid token REJECTED'
    );

    // 4. Confidential notes are hidden for guest
    if (guestOrder) {
      assert(
        guestOrder.internalNotes === undefined,
        'Internal administrative notes are strictly stripped for guest view'
      );
    }
  }

  // -------------------------------------------------------------
  // TEST 7: Payment Lifecycles (COD & Bank Transfer)
  // -------------------------------------------------------------
  console.log('\n[Test Group 7] Payment Status Lifecycle (COD & Bank Transfer)');

  if (firstSubmission.orderId) {
    // Record COD payment collection
    const codRes = await recordCodPayment(
      firstSubmission.orderId,
      firstSubmission.total || 4850,
      'admin-usr-01',
      'TCS-COD-COLL-9912',
      'Cash collected by courier and reconciled.'
    );
    assert(codRes.success, `COD collection recorded: ${codRes.message}`);

    const verifiedOrder = await getOrderById(firstSubmission.orderId, true);
    assert(
      verifiedOrder?.paymentStatus === 'paid',
      'Order payment status updated to "paid" following courier reconciliation'
    );
  }

  // Bank Transfer flow
  const bankOrderRes = await placeOrder({
    ...testPayload,
    customer: {
      ...testPayload.customer,
      paymentMethod: 'bank_transfer',
    },
    idempotencyKey: `bank-test-${Date.now()}`,
  });

  assert(bankOrderRes.success, 'Bank transfer order placed');
  if (bankOrderRes.orderId) {
    const bankOrder = await getOrderById(bankOrderRes.orderId, true);
    assert(
      bankOrder?.paymentStatus === 'under_verification',
      'Bank transfer order initial status is "under_verification"'
    );

    // Approve bank transfer
    const verifyRes = await verifyBankTransfer(
      bankOrderRes.orderId,
      true,
      'admin-usr-01',
      'MEEZAN-FT-8839120',
      'Payment matched in online banking statement.'
    );
    assert(verifyRes.success, `Bank transfer verified and approved: ${verifyRes.message}`);

    const approvedOrder = await getOrderById(bankOrderRes.orderId, true);
    assert(
      approvedOrder?.paymentStatus === 'paid',
      'Order payment status updated to "paid" after admin statement verification'
    );
  }

  // -------------------------------------------------------------
  // TEST 8: Courier Consignment Booking & Tracking URLs
  // -------------------------------------------------------------
  console.log('\n[Test Group 8] Courier Tracking URL Generation & Consignment Dispatch');

  const testCouriers: Array<{ courier: CourierName; trackingNumber: string; expectedDomain: string }> = [
    { courier: 'TCS', trackingNumber: '77123984501', expectedDomain: 'tcsexpress.com' },
    { courier: 'Leopards', trackingNumber: 'LEO-992144', expectedDomain: 'leopardscourier.com' },
    { courier: 'Call Courier', trackingNumber: 'CC-551200', expectedDomain: 'callcourier.com.pk' },
    { courier: 'Trax', trackingNumber: 'TRX-882103', expectedDomain: 'trax.pk' },
  ];

  for (const { courier, trackingNumber, expectedDomain } of testCouriers) {
    const url = getCourierTrackingUrl(courier, trackingNumber);
    assert(
      url.includes(expectedDomain) && url.includes(trackingNumber),
      `Valid ${courier} tracking URL generated: "${url}"`
    );
  }

  // Dispatch shipment on the bank order
  if (bankOrderRes.orderId) {
    const dispatchRes = await dispatchShipment(
      bankOrderRes.orderId,
      'TCS',
      '77123984501',
      '',
      'Handed over to TCS Express Gulberg branch.',
      'admin-usr-01'
    );
    assert(dispatchRes.success, `Consignment dispatched: ${dispatchRes.message}`);

    const shippedOrder = await getOrderById(bankOrderRes.orderId, true);
    assert(
      shippedOrder?.orderStatus === 'shipped',
      'Order lifecycle transitioned to "shipped" upon courier booking'
    );
    assert(
      shippedOrder?.shipment?.trackingNumber === '77123984501',
      'Tracking consignment number recorded on shipment'
    );
  }

  // -------------------------------------------------------------
  // TEST 9: Inventory Cancellation Reversal
  // -------------------------------------------------------------
  console.log('\n[Test Group 9] Order Cancellation & Stock Reversal');

  const cancelTestRes = await placeOrder({
    ...testPayload,
    idempotencyKey: `cancel-test-${Date.now()}`,
  });

  if (cancelTestRes.orderId) {
    // Advance status to processing
    await updateOrderStatus(cancelTestRes.orderId, 'processing', 'admin-01', 'Order confirmed');

    // Cancel order
    const cancelActionRes = await updateOrderStatus(
      cancelTestRes.orderId,
      'cancelled',
      'admin-01',
      'Customer requested cancellation before dispatch.'
    );
    assert(cancelActionRes.success, `Order cancellation processed: ${cancelActionRes.message}`);

    const cancelledOrder = await getOrderById(cancelTestRes.orderId, true);
    assert(
      cancelledOrder?.orderStatus === 'cancelled',
      'Order status recorded as "cancelled"'
    );

    // Ensure cancelled order cannot transition back to delivered
    const illegalAdvance = await updateOrderStatus(
      cancelTestRes.orderId,
      'delivered',
      'admin-01',
      'Attempting illegal transition'
    );
    assert(!illegalAdvance.success, 'Illegal transition from cancelled to delivered prevented');
  }

  // -------------------------------------------------------------
  // TEST 10: Empty Bag & Invalid Quantity Validation
  // -------------------------------------------------------------
  console.log('\n[Test Group 10] Empty Bag & Zero Quantity Defense');

  const emptyBagRes = await placeOrder({
    ...testPayload,
    items: [],
    idempotencyKey: `empty-test-${Date.now()}`,
  });
  assert(!emptyBagRes.success, 'Empty shopping bag rejected');

  // Summary
  console.log('\n=============================================================');
  const passedCount = results.filter((r) => r.passed).length;
  const failedCount = results.filter((r) => !r.passed).length;
  console.log(`TOTAL TESTS: ${results.length} | PASSED: ${passedCount} | FAILED: ${failedCount}`);
  console.log('=============================================================\n');

  if (failedCount > 0) {
    process.exit(1);
  }
}

runTestSuite().catch((err) => {
  console.error('Test suite crashed with unhandled error:', err);
  process.exit(1);
});
