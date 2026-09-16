// MATA Watchdog App Logic — with Pi Authentication (App Studio Required)

// STEP 1: Pi Authentication (REQUIRED by App Studio)
async function initPiAuth() {
  try {
    // Await Pi.init before any SDK calls
    await Pi.init({ version: "2.0" });
    
    // Authenticate user (no sandbox flag — auto-detected now)
    const auth = await window.Pi.authenticate(
      ["username", "payments"],
      onIncompletePaymentFound
    );
    
    if (!auth || !auth.accessToken) {
      throw new Error("Authentication failed - no access token");
    }
    
    // STEP 2: Exchange accessToken with App Studio (REQUIRED)
    const APP_STUDIO_AUTH_URL = "https://backend.appstudio-u7cm9zhmha0ruwv8.piappengine.com/pi/auth/v1/login";
    
    const res = await fetch(APP_STUDIO_AUTH_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accessToken: auth.accessToken })
    });
    
    if (!res.ok) {
      throw new Error(`App Studio auth failed: ${res.status}`);
    }
    
    const session = await res.json();
    
    if (!session.sessionToken || !session.user) {
      throw new Error("Invalid session response from App Studio");
    }
    
    // Store session token in memory (NEVER store uid/username from Pi.authenticate)
    window.__piSession = session;
    
    // Display user info from App Studio (trusted source)
    const userInfo = document.getElementById('userInfo');
    if (userInfo) {
      userInfo.textContent = `👤 ${session.user.username} • Verified`;
    }
    
    return session;
    
  } catch (err) {
    console.error("Pi Auth error:", err);
    document.getElementById('main').innerHTML = `
      <div style="padding:20px;text-align:center;">
        <h3>⚠️ Authentication Required</h3>
        <p style="color:#666;">Please sign in with Pi Network to access MATA Watchdog.</p>
        <p style="font-size:11px;color:#999;margin-top:12px;">${err.message}</p>
      </div>
    `;
    throw err;
  }
}

function onIncompletePaymentFound(payment) {
  console.log("Incomplete payment found:", payment);
  // App Studio handles incomplete payments automatically
  // Do NOT complete them yourself
}

document.addEventListener('DOMContentLoaded', async () => {
  try {
    // REQUIRED: Authenticate BEFORE loading any app content
    await initPiAuth();
    
    // Only after successful auth, load app data
    loadDashboard();
    loadPackages();
    loadDossier();
    loadStats();
    
  } catch (err) {
    // Auth failed — app remains on auth error screen
    console.error("App initialization failed:", err);
  }
});

// Navigation
document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const page = btn.dataset.page;
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(page).classList.add('active');
    document.getElementById('dossierDetail').style.display = 'none';
    document.getElementById('dossierList').style.display = 'block';
  });
});

// Dashboard
function loadDashboard() {
  const top = document.getElementById('topIndications');
  top.innerHTML = DATA.indications.slice(0, 5).map(i => `
    <li onclick="showDossierDetail('${i.id}')">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <span class="code">${i.code} — ${i.name}</span>
        <span class="risk-badge risk-${i.risk}">${i.risk}</span>
      </div>
      <div class="desc">${i.provider} · ${i.packages} paket · ${i.pct}%</div>
    </li>
  `).join('');
}

// Packages
function loadPackages() {
  const body = document.getElementById('packagesBody');
  const filterOpd = document.getElementById('filterOpd');
  const filterStatus = document.getElementById('filterStatus');
  
  const opds = [...new Set(DATA.packages.map(p => p.opd))].sort();
  opds.forEach(o => filterOpd.innerHTML += `<option value="${o}">${o}</option>`);
  
  const statuses = [...new Set(DATA.packages.map(p => p.status))].sort();
  statuses.forEach(s => filterStatus.innerHTML += `<option value="${s}">${s}</option>`);
  
  function render() {
    const q = document.getElementById('searchInput').value.toLowerCase();
    const opd = filterOpd.value;
    const status = filterStatus.value;
    const filtered = DATA.packages.filter(p => {
      const matchQ = !q || p.name.toLowerCase().includes(q) || p.opd.toLowerCase().includes(q);
      const matchOpd = !opd || p.opd === opd;
      const matchStatus = !status || p.status === status;
      return matchQ && matchOpd && matchStatus;
    });
    body.innerHTML = filtered.map((p, i) => `
      <tr>
        <td>${i + 1}</td>
        <td>${p.name}</td>
        <td>${p.opd}</td>
        <td>${formatRp(p.value)}</td>
        <td>${statusBadge(p.status)}</td>
      </tr>
    `).join('');
  }
  
  document.getElementById('searchInput').addEventListener('input', render);
  filterOpd.addEventListener('change', render);
  filterStatus.addEventListener('change', render);
  render();
}

// Dossier
function loadDossier() {
  const list = document.getElementById('dossierList');
  list.innerHTML = DATA.indications.map(i => `
    <li onclick="showDossierDetail('${i.id}')">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <span class="code">${i.code} — ${i.name}</span>
        <span class="risk-badge risk-${i.risk}">${i.risk}</span>
      </div>
      <div class="desc">${i.provider} · ${i.packages} paket · ${formatRp(i.value)}</div>
    </li>
  `).join('');
}

function showDossierDetail(id) {
  const item = DATA.indications.find(i => i.id === id);
  if (!item) return;
  document.getElementById('dossierList').style.display = 'none';
  const detail = document.getElementById('dossierDetail');
  detail.style.display = 'block';
  detail.innerHTML = `
    <h4>${item.code} — ${item.name}</h4>
    <p><strong>Penyedia:</strong> ${item.provider}</p>
    <p><strong>Paket dimenangkan:</strong> ${item.packages}</p>
    <p><strong>Total nilai:</strong> ${formatRp(item.value)}</p>
    <p><strong>Porsi:</strong> ${item.pct}% dari total pengadaan</p>
    <p><strong>Tingkat Keparahan:</strong> <span class="risk-badge risk-${item.risk}">${item.risk}</span></p>
    <p><strong>Bukti:</strong> ${item.evidence}</p>
    <div style="background:#f8f9fa;padding:12px;border-radius:8px;margin-top:12px;">
      <p style="font-size:11px;color:#666;">📄 <em>Pratinjau PDF tersedia. Fitur lengkap akan tersedia setelah app di-deploy dengan backend MATA.</em></p>
    </div>
    <button onclick="downloadPDF('${item.id}')" style="background:#1e3a5f;color:#fff;padding:10px 20px;border:none;border-radius:8px;margin-top:12px;cursor:pointer;font-size:12px;">📥 Unduh PDF (Demo)</button>
    <button onclick="document.getElementById('dossierList').style.display='block';this.parentElement.style.display='none'" style="background:#666;color:#fff;padding:10px 20px;border:none;border-radius:8px;margin-top:12px;margin-left:8px;cursor:pointer;font-size:12px;">← Kembali</button>
  `;
}

function downloadPDF(id) {
  alert('Demo: Fitur unduh PDF akan tersedia setelah app terhubung ke backend MATA VPS.');
}

// Statistics
function loadStats() {
  const maxCount = Math.max(...DATA.stats.monthly.map(m => m.count));
  document.getElementById('trendChart').innerHTML = DATA.stats.monthly.map(m => {
    const pct = (m.count / maxCount) * 100;
    return `<div class="bar" style="height:${pct}%" title="${m.month}: ${m.count} paket"></div>`;
  }).join('');
  
  const maxValue = Math.max(...DATA.stats.by_opd.map(o => o.value));
  document.getElementById('opdChart').innerHTML = DATA.stats.by_opd.map(o => {
    const pct = (o.value / maxValue) * 100;
    return `<div class="bar-row"><span class="bar-label">${o.opd}</span><div class="bar" style="width:${pct}%"></div><span style="font-size:9px;color:#666;">${formatRp(o.value)}</span></div>`;
  }).join('');
  
  const totalVal = DATA.stats.by_source.reduce((s, x) => s + x.value, 0);
  const colors = ['#1e3a5f', '#d4af37', '#4caf50'];
  document.getElementById('sourceChart').innerHTML = DATA.stats.by_source.map((s, i) => {
    const pct = ((s.value / totalVal) * 100).toFixed(1);
    return `<div class="pie-item"><div class="pie-color" style="background:${colors[i]}"></div>${s.source}: ${pct}%</div>`;
  }).join('');
}
