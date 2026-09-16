// MATA Watchdog — Pi Payments Integration
// Reference: https://pi-apps.github.io/pi-sdk-docs/quick-start/genai/Payments

// Payment Products Configuration
const PAYMENT_PRODUCTS = {
  dossier_pdf: {
    id: "dossier_pdf",
    name: "Unduh Dossier PDF",
    description: "Dossier lengkap indikasi pengadaan dalam format PDF",
    amount: 2,
    memo: "MATA Watchdog - Unduh Dossier PDF"
  },
  csv_export: {
    id: "csv_export",
    name: "Export CSV",
    description: "Data pengadaan lengkap dalam format CSV",
    amount: 5,
    memo: "MATA Watchdog - Export CSV"
  },
  full_report: {
    id: "full_report",
    name: "Laporan Lengkap",
    description: "Laporan analisis pengadaan menyeluruh",
    amount: 10,
    memo: "MATA Watchdog - Laporan Lengkap"
  }
};

// Backend URL
const BACKEND_URL = 'http://localhost:3001';

// Payment state
let paymentCompleted = false;
let currentProductId = null;

// Incomplete payment handler (REQUIRED by App Studio)
function onIncompletePaymentFound(payment) {
  console.log("Incomplete payment found:", payment);
  
  if (payment.metadata && payment.metadata.productId) {
    const productId = payment.metadata.productId;
    
    if (payment.status === "approved" && payment.transaction) {
      handlePaymentCompletion(
        payment.identifier,
        payment.transaction.txid,
        productId,
        payment.metadata.dossierId
      );
    }
  }
}

// STEP 1: Purchase product (User-to-App payment)
async function purchaseProduct(productId, dossierId) {
  const product = PAYMENT_PRODUCTS[productId];
  if (!product) {
    alert("Produk tidak ditemukan.");
    return;
  }

  currentProductId = productId;
  paymentCompleted = false;

  // Check if Pi is available
  if (!window.Pi) {
    alert("Pi SDK tidak tersedia. Pastikan Anda membuka di Pi Browser.");
    return;
  }

  try {
    await Pi.init({ version: "2.0" });
  } catch (err) {
    console.error("Pi.init failed:", err);
    alert("Gagal menginisialiasi Pi SDK.");
    return;
  }

  // Check if we have a session token
  if (!window.__piSession || !window.__piSession.sessionToken) {
    alert("Silakan login terlebih dahulu.");
    return;
  }

  const paymentData = {
    amount: product.amount,
    memo: product.memo,
    metadata: {
      productId: product.id,
      productName: product.name,
      dossierId: dossierId || null,
      sessionToken: window.__piSession.sessionToken
    }
  };

  console.log("Creating payment:", paymentData);

  try {
    await Pi.createPayment(paymentData, {
      onReadyForServerApproval: async (paymentId) => {
        console.log("onReadyForServerApproval:", paymentId);
        await handlePaymentApproval(paymentId, productId);
      },
      onReadyForServerCompletion: async (paymentId, txid) => {
        console.log("onReadyForServerCompletion:", paymentId, txid);
        await handlePaymentCompletion(paymentId, txid, productId, dossierId);
      },
      onCancel: (paymentId) => {
        console.log("Payment cancelled:", paymentId);
        alert("Pembayaran dibatalkan.");
        resetPaymentState();
      },
      onError: (error, payment) => {
        console.error("Payment error:", error, payment);
        alert("Pembayaran gagal: " + (error.message || error));
        resetPaymentState();
      }
    });
  } catch (err) {
    console.error("Pi.createPayment failed:", err);
    alert("Gagal membuat pembayaran. Silakan coba lagi.");
    resetPaymentState();
  }
}

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

// STEP 4: Deliver product to user
function deliverProduct(productId, dossierId) {
  switch (productId) {
    case "dossier_pdf":
      showPdfDownload(dossierId || "demo");
      break;
    case "csv_export":
      downloadCsv();
      break;
    case "full_report":
      downloadFullReport();
      break;
    default:
      alert("Produk tidak dikenal.");
  }
  resetPaymentState();
}

function resetPaymentState() {
  setTimeout(() => {
    paymentCompleted = false;
    currentProductId = null;
  }, 1000);
}

// Demo product delivery (replace with real backend integration)
function showPdfDownload(dossierId) {
  alert(`📄 Demo: Mengunduh PDF Dossier ${dossierId}...\nFitur lengkap akan tersedia setelah backend MATA VPS terhubung.`);
}

function downloadCsv() {
  alert(`📊 Demo: Mengunduh CSV...\nFitur lengkap akan tersedia setelah backend MATA VPS terhubung.`);
}

function downloadFullReport() {
  alert(`📋 Demo: Mengunduh Laporan Lengkap...\nFitur lengkap akan tersedia setelah backend MATA VPS terhubung.`);
}
