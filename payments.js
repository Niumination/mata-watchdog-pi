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

// Pi Payments Integration (per official Pi App Studio docs)

// Track payment completion to deliver product after verification
let paymentCompleted = false;
let currentProductId = null;

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
    alert("Gagal menginisialisasi Pi SDK.");
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
    // Call App Studio backend to approve payment
    // For static frontend: notify user that payment is being processed
    console.log(`Payment ${paymentId} ready for approval`);
    
    // In production: send to your backend
    // await fetch('/api/payments/approve', { ... })
    
    // For MVP (static frontend): show pending notification
    alert(`Pembayaran sedang diproses. Tunggu konfirmasi...`);
  } catch (err) {
    console.error("Approval failed:", err);
  }
}

// STEP 3: Server Completion — notify backend to complete payment & deliver product
async function handlePaymentCompletion(paymentId, txid, productId, dossierId) {
  try {
    console.log(`Payment ${paymentId} completed. TXID: ${txid}`);
    
    // In production: verify with backend
    // await fetch('/api/payments/complete', { ... })
    
    // For MVP: mark as completed and deliver product
    paymentCompleted = true;
    
    // Deliver product based on type
    deliverProduct(productId, dossierId);
    
    alert("Pembayaran berhasil! Mengunduh file...");
  } catch (err) {
    console.error("Completion failed:", err);
    alert("Pembayaran gagal dikonfirmasi.");
  }
}

// STEP 4: Deliver product to user
function deliverProduct(productId, dossierId) {
  switch (productId) {
    case "dossier_pdf":
      if (dossierId) {
        showPdfDownload(dossierId);
      } else {
        showPdfDownload("demo");
      }
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

// Incomplete payment handler (REQUIRED by App Studio)
function onIncompletePaymentFound(payment) {
  console.log("Incomplete payment found:", payment);
  
  // Check if this payment belongs to our app
  if (payment.metadata && payment.metadata.productId) {
    const productId = payment.metadata.productId;
    
    // Resume the payment completion flow
    if (payment.status === "approved") {
      // Payment was approved but not completed — complete it
      handlePaymentCompletion(payment.identifier, payment.transaction ? payment.transaction.txid : null, productId, payment.metadata.dossierId);
    }
  }
}

// Demo product delivery functions (replace with real backend integration)
function showPdfDownload(dossierId) {
  // In production: generate real PDF with backend
  alert(`📄 Demo: Mengunduh PDF Dossier ${dossierId}...\nFitur lengkap akan tersedia setelah backend Pi Payments terhubung.`);
}

function downloadCsv() {
  // In production: generate real CSV from MATA backend
  alert(`📊 Demo: Mengunduh CSV...\nFitur lengkap akan tersedia setelah backend Pi Payments terhubung.`);
}

function downloadFullReport() {
  // In production: generate comprehensive report
  alert(`📋 Demo: Mengunduh Laporan Lengkap...\nFitur lengkap akan tersedia setelah backend Pi Payments terhubung.`);
}
