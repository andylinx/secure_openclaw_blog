---
layout: home
title: OpenClaw Security Research
---

<style>
.hero-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
  max-width: 900px;
  margin: 0 auto 40px;
  padding: 0 24px;
}
.hero-stat {
  background: linear-gradient(135deg, rgba(245,101,101,0.08), rgba(246,173,85,0.04));
  border: 1px solid rgba(245,101,101,0.2);
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  transition: all 0.3s ease;
}
.hero-stat:hover {
  border-color: rgba(245,101,101,0.4);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(245,101,101,0.1);
}
.hero-stat .num {
  font-size: 2.2em;
  font-weight: 900;
  background: linear-gradient(135deg, #f56565, #f6ad55);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.2;
}
.hero-stat .lbl {
  font-size: 0.82em;
  color: #8b949e;
  margin-top: 6px;
  line-height: 1.3;
}
.cta-section {
  text-align: center;
  padding: 40px 24px 60px;
}
.cta-section p {
  color: #8b949e;
  max-width: 700px;
  margin: 0 auto 24px;
  font-size: 1.1em;
  line-height: 1.7;
}
</style>

<hero>

# Securing OpenClaw

## 14 Attack Surfaces, 8 Defense Categories, and the Frameworks Bringing Them Together

A comprehensive analysis of OpenClaw — a large-scale TypeScript codebase powering autonomous agents — surveying every major defense mechanism, what each protects, and how integrated frameworks like ClawKeeper, PRISM, and lifecycle-spanning architectures are closing the gaps.

</hero>

<div class="hero-stats">
  <div class="hero-stat">
    <div class="num">14</div>
    <div class="lbl">Distinct attack surfaces surveyed</div>
  </div>
  <div class="hero-stat">
    <div class="num">8</div>
    <div class="lbl">Defense categories evaluated</div>
  </div>
  <div class="hero-stat">
    <div class="num">5</div>
    <div class="lbl">Integrated defense frameworks analyzed</div>
  </div>
</div>

<div class="cta-section">
<p>
We surveyed fourteen attack surfaces, evaluated eight defense categories, and analyzed five integrated security frameworks — including ClawKeeper, PRISM, and the "Taming OpenClaw" lifecycle architecture. No single defense is enough, but combined frameworks achieve 70-95% defense rates on known attacks. Three fundamental gaps remain.
</p>

[Read the Position Paper →](/paper/)

</div>
