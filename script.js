(() => {
  "use strict";
  const CONFIG = { adminJakmall: 6600, rounding: 100 };
  const DEFAULT_INPUTS = {
    "margin-percent": "10",
    "fixed-margin": "2.000",
    "marketplace-fee-percent": "44",
    "marketplace-fixed-fee": "1.600"
  };
  const ids = ["supplier-price", "margin-percent", "fixed-margin", "marketplace-fee-percent", "marketplace-fixed-fee"];
  const input = Object.fromEntries(ids.map(id => [id, document.getElementById(id)]));
  const output = Object.fromEntries(["selling-price", "net-profit", "marketplace-fee", "pre-rounding-price", "margin-profit", "rounding-difference"].map(id => [id, document.getElementById(id)]));
  const message = document.getElementById("validation-message"), copyButton = document.getElementById("copy-button"), toast = document.getElementById("toast");
  let latest = null, toastTimer;
  const number = value => Number(String(value).replace(/[^0-9]/g, "")) || 0;
  const decimal = value => Number(String(value).replace(",", ".").replace(/[^0-9.]/g, "")) || 0;
  const rupiah = value => `Rp${Math.round(value).toLocaleString("id-ID")}`;
  const setOutputs = values => Object.entries(values).forEach(([key, value]) => output[key].textContent = value);
  function calculate() {
    const supplier = number(input["supplier-price"].value), marginPercent = decimal(input["margin-percent"].value), fixedMargin = number(input["fixed-margin"].value), feePercent = decimal(input["marketplace-fee-percent"].value), fixedFee = number(input["marketplace-fixed-fee"].value);
    const filled = supplier > 0 && Number.isFinite(marginPercent) && Number.isFinite(feePercent);
    if (!filled) { latest = null; copyButton.disabled = true; message.textContent = ""; setOutputs({"selling-price":"—","net-profit":"—","marketplace-fee":"—","pre-rounding-price":"—","margin-profit":"—","rounding-difference":"—"}); return; }
    if (feePercent >= 100) { latest = null; copyButton.disabled = true; message.textContent = "Fee marketplace harus kurang dari 100%."; return; }
    message.textContent = "";
    const profitMargin = Math.round(supplier * marginPercent / 100 + fixedMargin);
    const target = supplier + CONFIG.adminJakmall + profitMargin;
    const preRounding = Math.round((target + fixedFee * (1 - feePercent / 100)) / (1 - feePercent / 100));
    const selling = Math.ceil(preRounding / CONFIG.rounding) * CONFIG.rounding;
    const marketplaceFee = selling * feePercent / 100 + fixedFee * (1 - feePercent / 100);
    const netProfit = Math.round(selling - marketplaceFee - supplier - CONFIG.adminJakmall);
    latest = selling; copyButton.disabled = false;
    setOutputs({"selling-price":rupiah(selling),"net-profit":rupiah(netProfit),"marketplace-fee":rupiah(marketplaceFee),"pre-rounding-price":rupiah(preRounding),"margin-profit":rupiah(profitMargin),"rounding-difference":rupiah(selling-preRounding)});
  }
  function formatCurrency(event) { const digits = String(event.target.value).replace(/\D/g, ""); event.target.value = digits ? Number(digits).toLocaleString("id-ID") : ""; calculate(); }
  function formatPercentage(event) { event.target.value = event.target.value.replace(/[^0-9.,]/g, "").replace(",", "."); calculate(); }
  [input["supplier-price"], input["fixed-margin"], input["marketplace-fixed-fee"]].forEach(element => element.addEventListener("input", formatCurrency));
  [input["margin-percent"], input["marketplace-fee-percent"]].forEach(element => element.addEventListener("input", formatPercentage));
  input["supplier-price"].addEventListener("click", () => { input["supplier-price"].value = ""; calculate(); });
  document.getElementById("reset-button").addEventListener("click", () => { ids.forEach(id => input[id].value = ""); calculate(); });
  copyButton.addEventListener("click", async () => { if (!latest) return; try { await navigator.clipboard.writeText(String(latest)); showToast("Harga jual berhasil disalin"); } catch { showToast("Tidak dapat menyalin harga"); } });
  function showToast(text) { toast.textContent = text; toast.classList.add("show"); clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove("show"), 2200); }
  const themeToggle = document.getElementById("theme-toggle");
  function applyTheme(theme) { document.documentElement.dataset.theme = theme; themeToggle.textContent = theme === "dark" ? "☀" : "☾"; localStorage.setItem("marketprice-theme", theme); }
  const savedTheme = localStorage.getItem("marketprice-theme"); applyTheme(savedTheme || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
  Object.entries(DEFAULT_INPUTS).forEach(([id, value]) => { input[id].value = value; });
  themeToggle.addEventListener("click", () => applyTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark"));
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("service-worker.js", { updateViaCache: "none" })
      .then(registration => registration.update());
  }
})();
