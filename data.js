// Demo data — MATA Watchdog
const DATA = {
  summary: {
    total_packages: 657,
    total_value: 133601537390,
    active_indications: 5,
    high_risk: 2,
    last_updated: "2026-09-12",
    region: "Kabupaten Aceh Tengah",
    fiscal_year: 2026
  },
  indications: [
    { id: "D1-001", code: "D1", name: "Dominasi Penyedia", provider: "PT Bebesen Abadi", packages: 10, value: 36700000000, pct: 27.5, risk: "TINGGI", evidence: "PT Bebesen Abadi memenangkan 10 dari 48 proyek. Porsi nilai 27.5% dari total pengadaan." },
    { id: "D2-001", code: "D2", name: "Penggelembungan Harga", provider: "PT Cipta Karya", packages: 3, value: 4500000000, pct: 3.4, risk: "TINGGI", evidence: "Harga penawaran 45% di atas pagu. Selisih Rp 1.4M dari pagu Rp 3.1M." },
    { id: "D3-001", code: "D3", name: "Perubahan Kontrak Berulang", provider: "CV Maju Bersama", packages: 5, value: 8900000000, pct: 6.7, risk: "SEDANG", evidence: "3 dari 5 kontrak addendum >2x. Total addendum Rp 2.3M (26%)." },
    { id: "D4-001", code: "D4", name: "Pengadaan Mendesak Tanpa Justifikasi", provider: "PT Nusantara", packages: 2, value: 1200000000, pct: 0.9, risk: "SEDANG", evidence: "2 paket ULP tanpa justifikasi. Total Rp 1.2M." },
    { id: "D5-001", code: "D5", name: "Pembatasan Peserta", provider: "Multi vendor", packages: 0, value: 0, pct: 0, risk: "RENDAH", evidence: "4 paket dengan persyaratan spesifik. Total terdampak Rp 5.6M." }
  ],
  packages: [
    { id: "P001", name: "Paket E — Saluran air (Tahap 4)", opd: "Dinas Perumahan", value: 1978682052, status: "Non Tender", source: "APBD" },
    { id: "P002", name: "Paket G — Jalan lingkungan (Tahap 6)", opd: "Dinas Perumahan", value: 1938691637, status: "Tender", source: "APBD" },
    { id: "P003", name: "Paket J — Jalan lingkungan (Tahap 9)", opd: "Dinas PU", value: 1921715915, status: "Non Tender", source: "APBD" },
    { id: "P004", name: "Paket K — Perbaikan talud (Tahap 10)", opd: "Dinas PU", value: 1788512900, status: "Non Tender", source: "APBD" },
    { id: "P005", name: "Paket I — Pengadaan meubelair (Tahap 8)", opd: "Dinas PU", value: 1599845158, status: "E-Katalog", source: "APBD" },
    { id: "P006", name: "Pembangunan Gedung Kantor", opd: "Sekretariat Daerah", value: 2500000000, status: "Tender", source: "APBD" },
    { id: "P007", name: "Pengadaan Kendaraan Dinas", opd: "Dinas Kesehatan", value: 850000000, status: "E-Katalog", source: "APBD" },
    { id: "P008", name: "Renovasi Puskesmas", opd: "Dinas Kesehatan", value: 1200000000, status: "Non Tender", source: "APBD" },
    { id: "P009", name: "Pengadaan Obat dan Alkes", opd: "Dinas Kesehatan", value: 3200000000, status: "E-Katalog", source: "APBD" },
    { id: "P010", name: "Pembangunan Fasilitas Pendidikan", opd: "Dinas Pendidikan", value: 4500000000, status: "Tender", source: "APBD" },
    { id: "P011", name: "Rehabilitasi Jalan Lingkungan", opd: "Dinas PU", value: 1650000000, status: "Non Tender", source: "APBD" },
    { id: "P012", name: "Pengadaan Meubelair Kantor", opd: "Sekretariat Daerah", value: 780000000, status: "E-Katalog", source: "APBD" },
    { id: "P013", name: "Pembangunan Drainase", opd: "Dinas PU", value: 2100000000, status: "Tender", source: "APBD" },
    { id: "P014", name: "Pengadaan Alat Kesehatan", opd: "Dinas Kesehatan", value: 1900000000, status: "E-Katalog", source: "APBD" },
    { id: "P015", name: "Renovasi Sekolah", opd: "Dinas Pendidikan", value: 3400000000, status: "Tender", source: "APBD" },
    { id: "P016", name: "Pembangunan Perumahan", opd: "Dinas Perumahan", value: 2800000000, status: "Non Tender", source: "APBD" },
    { id: "P017", name: "Pengadaan IT Server", opd: "Diskominfo", value: 1500000000, status: "E-Katalog", source: "APBD" },
    { id: "P018", name: "Pembangunan Jalan Lingkungan", opd: "Dinas PU", value: 3200000000, status: "Tender", source: "APBD" },
    { id: "P019", name: "Pengadaan Logistik Bencana", opd: "BPBD", value: 950000000, status: "Non Tender", source: "APBN" },
    { id: "P020", name: "Renovasi Balai Desa", opd: "Dinas Permdes", value: 650000000, status: "Tender", source: "APBD" },
    { id: "P021", name: "Pembangunan MCK", opd: "Dinas Perumahan", value: 420000000, status: "Non Tender", source: "APBD" },
    { id: "P022", name: "Pengadaan Ambulans", opd: "Dinas Kesehatan", value: 1100000000, status: "E-Katalog", source: "APBD" },
    { id: "P023", name: "Rehabilitasi Gor", opd: "Dinas Pendidikan", value: 750000000, status: "Tender", source: "APBD" },
    { id: "P024", name: "Pembangunan Taman Kota", opd: "Dinas PU", value: 1800000000, status: "Non Tender", source: "APBD" }
  ],
  stats: {
    monthly: [
      { month: "Jan", count: 45 },
      { month: "Feb", count: 52 },
      { month: "Mar", count: 48 },
      { month: "Apr", count: 61 },
      { month: "Mei", count: 55 },
      { month: "Jun", count: 72 },
      { month: "Jul", count: 68 },
      { month: "Agu", count: 75 },
      { month: "Sep", count: 80 },
      { month: "Okt", count: 45 },
      { month: "Nov", count: 32 },
      { month: "Des", count: 24 }
    ],
    by_opd: [
      { opd: "Dinas PU", packages: 180, value: 45000000000 },
      { opd: "Dinas Kesehatan", packages: 120, value: 28000000000 },
      { opd: "Dinas Perumahan", packages: 95, value: 22000000000 },
      { opd: "Dinas Pendidikan", packages: 85, value: 18000000000 },
      { opd: "Sekretariat Daerah", packages: 60, value: 12000000000 },
      { opd: "Lainnya", packages: 117, value: 8601537390 }
    ],
    by_source: [
      { source: "APBD", packages: 580, value: 125000000000 },
      { source: "APBN", packages: 45, value: 6500000000 },
      { source: "Lainnya", packages: 32, value: 2101537390 }
    ]
  }
};

function formatRp(n) {
  return "Rp " + n.toLocaleString("id-ID");
}

function statusBadge(s) {
  const colors = {
    "Non Tender": "#ff9800",
    "Tender": "#4caf50",
    "E-Katalog": "#2196f3"
  };
  return `<span style="background:${colors[s] || '#999'};color:#fff;padding:2px 6px;border-radius:4px;font-size:10px;">${s}</span>`;
}
