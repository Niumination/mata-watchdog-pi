// Pi Payments Integration — calling MATA backend server
const BACKEND_URL = 'http://localhost:3001';

// STEP 2: Server Approval — notify backend to approve payment
async function handlePaymentApproval(paymentId, productId) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/payments/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentId })
    });
    if (!res.ok) throw new Error(`Approval failed: ${res.status}`);
    alert('Pembayaran sedang diproses...');
  } catch (err) {
    console.error('Approval failed:', err);
    alert('Gagal memproses pembayaran.');
  }
}

// STEP 3: Server Completion — notify backend to complete payment & deliver product
async function handlePaymentCompletion(paymentId, txid, productId, dossierId) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/payments/complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentId, txid })
    });
    if (!res.ok) throw new Error(`Completion failed: ${res.status}`);
    paymentCompleted = true;
    deliverProduct(productId, dossierId);
    alert('Pembayaran berhasil! Mengunduh file...');
  } catch (err) {
    console.error('Completion failed:', err);
    alert('Pembayaran gagal dikonfirmasi.');
  }
}
