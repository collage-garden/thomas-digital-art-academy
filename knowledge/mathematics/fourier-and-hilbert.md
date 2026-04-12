# Fourier and Hilbert Transform

*The math that lets you shift a song's frequency without changing its speed.*

> **Work connection**: [Binaural Beats Explorer](../../works/) — Music SSB mode applies Hilbert transform + SSB modulation to shift an entire song by a precise number of Hz. The implementation uses hand-written radix-2 FFT with overlap-save chunked processing in a Web Worker.

---

## The Problem

You want binaural beats with music — not just boring sine waves. The idea: shift the right ear's copy of a song up by 10 Hz, so every frequency component is 10 Hz higher than the left ear. The brain hears a 10 Hz binaural beat embedded in music.

But "shift every frequency up by 10 Hz" is not as simple as it sounds.

---

## Why Pitch Shifting Is Wrong

Pitch shifting changes playback speed (then time-stretches to compensate). It **multiplies** all frequencies by a constant factor:

$$f' = f \cdot r$$

A song shifted up by a semitone has $r = 2^{1/12} \approx 1.0595$. A 200 Hz component becomes 211.9 Hz (+11.9 Hz), while a 2000 Hz component becomes 2119 Hz (+119 Hz). The frequency differences between left and right ears vary wildly across the spectrum — the brain cannot integrate them into a single clean beat.

What we need is **linear** (additive) shifting:

$$f' = f + \Delta f$$

Every component moves by the same $\Delta f$ Hz. This is called frequency shifting or single-sideband (SSB) modulation.

---

## The Analytic Signal and Hilbert Transform

SSB starts with the **analytic signal**. Given a real signal $x(t)$, its analytic signal is:

$$x_a(t) = x(t) + j\hat{x}(t)$$

where $\hat{x}(t)$ is the **Hilbert transform** of $x(t)$ — the same signal with every frequency component phase-shifted by $-90°$. In the frequency domain:

$$\hat{X}(f) = -j\,\text{sgn}(f) \cdot X(f)$$

The analytic signal has the remarkable property that its spectrum is zero for all negative frequencies. It is the "one-sided" version of the original signal.

### Discrete Hilbert Transform via FFT

For a discrete signal of $N$ samples:

1. Compute $X[k] = \text{FFT}(x[n])$
2. Construct the analytic spectrum:
   - $X_a[0] = X[0]$ (DC — unchanged)
   - $X_a[k] = 2X[k]$ for $1 \le k \le N/2 - 1$ (positive frequencies — doubled)
   - $X_a[N/2] = X[N/2]$ (Nyquist — unchanged)
   - $X_a[k] = 0$ for $k > N/2$ (negative frequencies — zeroed)
3. $x_a[n] = \text{IFFT}(X_a[k])$

The real part of $x_a$ is the original signal; the imaginary part is $\hat{x}$.

---

## SSB Modulation

With the analytic signal in hand, frequency shifting by $\Delta f$ is a single complex multiplication:

$$y(t) = \text{Re}\!\left[x_a(t) \cdot e^{j2\pi\Delta f\, t}\right]$$

Expanding:

$$y(t) = x(t)\cos(2\pi\Delta f\, t) - \hat{x}(t)\sin(2\pi\Delta f\, t)$$

The cosine term alone would produce both upper and lower sidebands (amplitude modulation). The $-\hat{x}\sin$ term cancels the lower sideband, leaving only the upper — hence "single-sideband." Every frequency component moves up by exactly $\Delta f$.

For downward shifting, negate $\Delta f$. For symmetric binaural distribution, the left ear gets $-\Delta f/2$ and the right ear gets $+\Delta f/2$.

---

## The FFT: Cooley-Tukey Radix-2

The Explorer implements its own FFT rather than using a library. The algorithm:

Given $N = 2^m$ complex samples, the DFT decomposes into two half-size DFTs:

$$X[k] = \sum_{n=0}^{N/2-1} x[2n]\, W_N^{2nk} + W_N^k \sum_{n=0}^{N/2-1} x[2n+1]\, W_N^{2nk}$$

where $W_N = e^{-j2\pi/N}$. Each level of recursion halves the problem, giving $O(N \log N)$ complexity instead of $O(N^2)$.

The implementation uses in-place computation with bit-reversal permutation, operating on interleaved real/imaginary Float32Arrays.

---

## Overlap-Save: Handling Long Audio

A 5-minute song at 44.1 kHz has ~13 million samples. A single FFT would require $N = 2^{24} \approx 16M$ points — two Float32Arrays consuming 128 MB. For mobile browsers, this is an immediate out-of-memory.

**Overlap-save** (also called overlap-scrap) processes the signal in manageable chunks:

1. Choose FFT size $L$ (the Explorer uses 32768) and overlap size $P$ (4096)
2. Each input block: $L$ samples, where the first $P$ samples overlap with the previous block
3. Apply FFT → Hilbert transform → IFFT on each block
4. Discard the first $P$ and last $P$ samples (guard bands contaminated by circular convolution artifacts)
5. Keep only the middle $L - 2P$ samples (the "trusted" region)
6. Concatenate trusted regions to form the output

The circular convolution error from the DFT is confined to the guard bands and thrown away. The result is mathematically equivalent to processing the entire signal at once, within floating-point tolerance.

---

## Real-Time SSB: Separate from Preprocessing

The Hilbert transform (FFT-based, computed offline in a Web Worker) produces $\hat{x}[n]$. The actual frequency shifting happens in real time during playback — an AudioWorklet processor multiplies sample-by-sample:

```
out[n] = x[n] · cos(φ) − x̂[n] · sin(φ)
φ += 2π · Δf / sampleRate
```

This separation is key: the expensive $O(N \log N)$ preprocessing happens once when the file loads; the real-time SSB is $O(1)$ per sample — just two multiplies and two adds.

---

## Key Formulas at a Glance

| Operation | Formula |
|---|---|
| Beat frequency | $\Delta f = \|f_1 - f_2\|$ |
| Analytic signal | $x_a(t) = x(t) + j\hat{x}(t)$ |
| SSB shift by $\Delta f$ | $y = x\cos(2\pi\Delta f\,t) - \hat{x}\sin(2\pi\Delta f\,t)$ |
| Symmetric distribution | $y_L$: shift $-\Delta f/2$, $y_R$: shift $+\Delta f/2$ |
| Overlap-save trusted region | $L - 2P$ samples per block |

---

## Further Reading

- Oppenheim & Willsky, *Signals and Systems* — Chapters 4–5 on Fourier analysis
- Haykin & Van Veen, *Signals and Systems* — Chapter on modulation
- [Wave Superposition](../../knowledge/physics/wave-superposition.md) — the physical context
- [Binaural Beats Explorer: Architecture](https://github.com/collage-garden/binaural-beats/tree/main/docs) — implementation details
