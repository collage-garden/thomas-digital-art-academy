# Wave Superposition and Binaural Beats

*Why two slightly different notes create a pulse that isn't really there.*

> **Work connection**: [Binaural Beats Explorer](../../works/) — Pure Tone mode demonstrates acoustic beating; Music SSB mode uses physical frequency shifting to create the same inter-ear difference from a single source.

---

## The Setup

Play a 400 Hz sine wave in the left ear and a 410 Hz sine wave in the right. You hear a steady tone that pulses ten times per second. Where does the pulse come from?

It depends on which "pulse" you mean — and that distinction is the entire point.

---

## Acoustic Beating: Two Waves in the Same Medium

When two sinusoidal waves of similar frequency travel through the same medium (say, two tuning forks in the same room), they superpose:

$$y(t) = \sin(2\pi f_1 t) + \sin(2\pi f_2 t)$$

Applying the sum-to-product identity:

$$y(t) = 2\cos\!\Bigl(2\pi\,\frac{f_1 - f_2}{2}\,t\Bigr) \;\sin\!\Bigl(2\pi\,\frac{f_1 + f_2}{2}\,t\Bigr)$$

The result is a carrier tone at the average frequency $(f_1+f_2)/2$, whose amplitude is modulated by a slow envelope at half the difference frequency $(f_1-f_2)/2$. Because human hearing perceives loudness via the *squared* amplitude, you hear two "beats" per full envelope cycle — so the audible beat frequency equals $|f_1 - f_2|$.

This is **physical** beating. It exists in the air pressure waveform. A microphone records it. It requires both waves to exist in the same medium at the same point.

---

## Binaural Beats: No Superposition in the Air

Now separate the two tones: left ear gets $f_1$, right ear gets $f_2$, via headphones. The sound waves never share a medium. There is no point in space where they add and cancel. A microphone placed at either ear records a pure, steady sine wave — no amplitude modulation, no physical beat.

Yet the listener hears a pulsation at $|f_1 - f_2|$ Hz.

This beat exists only in the brainstem. It is a **neural product**, not an acoustic one. The physics ends at the eardrum; after that, neuro-processing takes over (see [Binaural Processing](../../knowledge/neuroscience/binaural-processing.md)).

**This is the central surprise of the Explorer's Pure Tone mode**: you are "hearing" something that does not exist in the physical signal. Your perception has diverged from the physics.

---

## SSB Frequency Shifting: Making Physics Do the Work

In the Explorer's Music mode, the situation reverses: now the beat *is* physical.

Given an input signal $x(t)$ (a song), Single-Sideband modulation shifts every frequency component by exactly $+\Delta f$ Hz:

$$y(t) = \text{Re}\!\left[x_a(t) \cdot e^{j2\pi \Delta f\, t}\right] = x(t)\cos(2\pi \Delta f\, t) - \hat{x}(t)\sin(2\pi \Delta f\, t)$$

where $x_a(t) = x(t) + j\hat{x}(t)$ is the analytic signal obtained via the Hilbert transform.

This is a **linear** shift — every component moves up by the same additive amount. A 200 Hz partial becomes 210 Hz; a 2000 Hz partial becomes 2010 Hz. This is fundamentally different from pitch shifting (which multiplies frequencies, preserving ratios), and it is the only operation that produces a correct interaural frequency difference for binaural beats.

When the left ear receives the original music and the right ear receives the SSB-shifted version, every frequency pair has a difference of exactly $\Delta f$. The brain integrates all these pairs into a single perceived beat at $\Delta f$.

See [Fourier and Hilbert Transform](../../knowledge/mathematics/fourier-and-hilbert.md) for the math underneath SSB.

---

## Symmetric Distribution: Halving the Damage

At large $\Delta f$ (say 30 Hz), shifting all 30 Hz onto one ear audibly distorts the timbre — harmonic relationships are destroyed. The symmetric strategy splits the shift:

$$y_L(t) = \text{Re}\!\left[x_a(t) \cdot e^{-j\pi\Delta f\, t}\right], \qquad y_R(t) = \text{Re}\!\left[x_a(t) \cdot e^{+j\pi\Delta f\, t}\right]$$

$$f_R - f_L = \Delta f \quad \text{(beat preserved)}$$

Each ear shifts by only $\Delta f/2$. Timbral damage roughly quarters (it scales with the square of the shift), while the binaural beat is unchanged. This is a direct application of the superposition principle: the brain's beat detector cares only about the *difference*, not the absolute values.

---

## Key Takeaways

| Concept | Physical beating | Binaural beats (headphones) |
|---|---|---|
| Waves superpose? | Yes, in the air | No — isolated ears |
| Beat exists in waveform? | Yes — microphone records it | No — purely neural |
| Requires same medium? | Yes | No — separate channels |
| Upper frequency limit? | None — works at any $\Delta f$ | ~30–35 Hz (brainstem phase-locking limit) |

The Explorer lets you experience both: SSB music mode has real physical frequency differences, while Pure Tone headphone mode has a beat that exists nowhere but in your head. Same pulsation, completely different origin.

---

## Further Reading

- Rossing, Moore, & Wheeler, *The Science of Sound* (3rd ed.) — Chapter 7 on beats
- Licklider, Webster, & Hedlun (1950). "On the frequency limits of binaural beats." *JASA*, 22(4), 468–473.
- [Binaural Processing](../../knowledge/neuroscience/binaural-processing.md) — where the neural story picks up
- [Fourier and Hilbert Transform](../../knowledge/mathematics/fourier-and-hilbert.md) — the math of SSB
