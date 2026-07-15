# MarketPrice

Kalkulator harga jual untuk satu produk. Semua kalkulasi dilakukan langsung di browser.

## Rumus

- Admin : Rp6.600
- Profit margin: `(Harga Jakmall × Margin %) + Margin Tetap`, dibulatkan ke rupiah terdekat.
- Harga sebelum pembulatan: `(Target + Fee Tetap × (1 − Fee %)) / (1 − Fee %)`.
- Harga jual: dibulatkan ke atas ke kelipatan Rp100.
- Biaya marketplace: `(Harga Jual × Fee %) + (Fee Tetap × (1 − Fee %))`.

`Fee tetap` mengikuti rumus dari simulasi sebelumnya: total potongan marketplace = `((harga jual − fee tetap) × fee %) + fee tetap`.
