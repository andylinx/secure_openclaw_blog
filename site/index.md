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

# Every Defense Fails

## What 14 Attack Surfaces Teach Us About AI Agent Security

A comprehensive analysis of OpenClaw — 687K lines of TypeScript powering autonomous agents — revealing why sandboxing, guardrails, Rust, and LLM auditing all fall short.

</hero>

<div class="hero-stats">
  <div class="hero-stat">
    <div class="num">94.4%</div>
    <div class="lbl">Agents vulnerable to prompt injection</div>
  </div>
  <div class="hero-stat">
    <div class="num">97.1%</div>
    <div class="lbl">Jailbreak success by reasoning models</div>
  </div>
  <div class="hero-stat">
    <div class="num">17%</div>
    <div class="lbl">Survive sandbox escape attempts</div>
  </div>
  <div class="hero-stat">
    <div class="num">30+</div>
    <div class="lbl">MCP CVEs in year one</div>
  </div>
  <div class="hero-stat">
    <div class="num">0%</div>
    <div class="lbl">Defend ambiguous instructions</div>
  </div>
</div>

<div class="cta-section">
<p>
We surveyed 14 attack surfaces, evaluated 7 defense categories, and analyzed incidents through March 2026. No single defense covers even half the threats. No defense provides deterministic guarantees. Every defense has documented bypasses.
</p>

[Read the Technical Blog →](/blog/)  &nbsp; &nbsp; [Read the Full Paper →](/paper/)

</div>
