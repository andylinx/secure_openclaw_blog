# PoC and Defense Review: Securing OpenClaw Position Paper

**Reviewer notes** -- Cross-referencing each PoC against the actual OpenClaw codebase (`/home/nanxi/workspace/openclaw`) to verify realism of attack scenarios and accuracy of defense characterizations.

---

## Part 1: Threat Landscape PoCs

### 1. Zero-Click IPI via Fetched Webpage (Prompt Injection section)

**Verdict: Realistic**

The PoC describes an attacker embedding hidden instructions in a webpage that the agent fetches via `web_fetch`, causing it to read MEMORY.md and exfiltrate contents. Verified against the codebase:

- OpenClaw's only IPI defense is XML tag wrapping (`<external-content>`) around fetched content -- a soft convention, not a hard boundary.
- `web_fetch` is available as a standard tool outside sandbox mode, with no outbound domain restrictions.
- MEMORY.md is a plaintext file loaded into the prompt context with no access control.
- No DLP or content inspection exists on outbound requests.

**No issues found.** This is a well-grounded conceptual PoC.

---

### 2. Fragmented Attack Bypassing Detection (Supply Chain section)

**Verdict: Realistic**

The PoC shows benign file writes that concatenate into a reverse shell. Verified:

- `write_file` and `exec` are separate tool calls; no tool-result guard inspects cross-call compositions.
- The skill scanner (`src/security/skill-scanner.ts`) uses line-level regex rules (`dangerous-exec`, `potential-exfiltration`) that analyze individual patterns, not multi-step compositions.
- No cross-action invariant checking exists in the codebase.

**No issues found.** The fragmentation evasion is realistic given that detection is per-action.

---

### 3. Persistent Exfiltration via Memory Poisoning

**Verdict: Realistic**

The PoC describes IPI injecting a fake "company policy" into MEMORY.md that persists across sessions. Verified:

- Memory writes have no integrity checking, provenance tracking, or access control. The hash stored in the memory schema (`memory-schema.ts`) is never verified on read.
- No mechanism distinguishes "user saved this" from "IPI injected this."
- Memory entries are loaded into every future prompt unconditionally.

**No issues found.** This is one of the strongest PoCs -- the lack of memory provenance is a real, verified gap.

---

### 4. NHI Credential Chain Attack

**Verdict: Realistic but abstract**

The PoC describes lateral movement via machine credentials found in agent memory. Verified:

- Environment variable sanitization (`host-env-security.ts`) blocks dangerous env vars from being passed to containers, but this does not prevent credentials stored in files or memory from being read.
- No credential lifecycle management or rotation mechanism exists.
- The single-operator trust model means one compromised agent has access to all configured credentials.

**Minor note:** The PoC is quite abstract (4 steps). It would benefit from grounding in specific OpenClaw credential storage paths (e.g., `~/.openclaw/credentials/`), but the threat is real.

---

## Part 2: Individual Defense PoCs

### 5. Data Exfiltration from a Perfectly Sandboxed Agent (Sandboxing section)

**Verdict: INACCURATE in default configuration -- needs qualification**

This is the most significant issue found. The PoC claims:
> "The agent still has `web_fetch` -- a permitted, allowlisted tool" inside a sandboxed container.

Verified against the actual codebase:

- **`web_fetch` is NOT in the sandbox's `DEFAULT_TOOL_ALLOW` list** (`src/agents/sandbox/constants.ts`, lines 13-28). The allowed tools are: `exec`, `process`, `read`, `write`, `edit`, `apply_patch`, `image`, `sessions_*`, and `subagents`.
- **Network access is disabled by default** in sandboxed containers: `network: "none"` (`src/agents/sandbox/config.ts`, line 109).
- **All Linux capabilities are dropped**: `capDrop: ["ALL"]` (line 111).

This means the PoC's core premise -- that a sandboxed agent can make outbound HTTP requests via `web_fetch` -- is **false under default sandbox configuration**. The attack would only work if the operator explicitly:
1. Added `web_fetch` to the sandbox tool allow list, AND
2. Changed the network mode from `"none"` to `"bridge"` or similar.

This makes the PoC a misconfiguration scenario, not a sandbox design weakness. The paper presents it as an inherent limitation of sandboxing ("sandboxes enforce system-level isolation but are blind to semantic-level attacks"), which is philosophically true, but the specific PoC doesn't demonstrate this against OpenClaw's actual defaults.

**Recommendation:** The PoC should either:
- (a) Acknowledge that it requires non-default sandbox configuration (network enabled + web_fetch allowed), which is a realistic deployment scenario for agents that need internet access, OR
- (b) Reframe the attack to use a tool that IS in the default sandbox allow list (e.g., `sessions_send` to relay data through another agent session that has network access, or `exec` with a DNS exfiltration via a simple `nslookup` if DNS is allowed even when network is "none").

The underlying argument (sandboxes can't stop semantic exfiltration through permitted channels) remains valid, but the specific demonstration doesn't match the actual default configuration.

---

### 6. Benign Prompt + Memory + Skill Composition (Prompt Injection Defenses section)

**Verdict: Realistic and well-constructed**

The PoC demonstrates that individually benign components (skill instruction, memory entry, user prompt) produce malicious behavior when combined. Verified:

- Skills run with the agent's full permission set -- confirmed via `pi-tools.ts`. No per-skill capability isolation exists.
- Memory entries are loaded into the prompt unconditionally with no provenance annotation.
- Per-input classifiers (PIGuard, StruQ, SecAlign) would indeed only see individual inputs, not their composition.

**No issues found.** This is one of the paper's strongest PoCs because it demonstrates a fundamental structural limitation, not just an implementation gap.

---

### 7. Evading PRISM via Temporal Fragmentation (Runtime Detection section)

**Verdict: Valid as a conceptual attack on PRISM's design, but PRISM is not part of OpenClaw**

Important context: PRISM is an external academic framework (UNSW, 2026), not implemented in the OpenClaw codebase. OpenClaw's built-in detection is limited to a basic skill scanner with regex rules (`src/security/skill-scanner.ts`).

The PoC correctly targets PRISM's documented design: per-session analysis that can't correlate actions across sessions. The temporal fragmentation (recon in Session 1, priming in Session 2, exfiltration in Session 3) is a realistic attack pattern.

**No issues found** with the PoC's logic against PRISM's stated architecture. But readers should understand this attacks an external framework, not OpenClaw's native defenses.

---

### 8. Memory Entries That Are Statically Clean but Semantically Malicious (Memory Integrity section)

**Verdict: Realistic**

The PoC describes memory entries formatted as organizational policies that pass all static audits but create a standing exfiltration instruction. Verified:

- Memory hashes are stored but never verified on read.
- No semantic analysis of memory content exists.
- No mechanism to validate that URLs in memory entries are legitimate.
- The entries would pass any syntactic scan because they contain no injection patterns, credentials, or executable code.

**No issues found.** The distinction between syntactic and semantic malice is well-articulated.

---

### 9. Skill That Looks Innocent Statically (Static Audit section)

**Verdict: Realistic**

The PoC shows a benign "auto-updater" skill that becomes malicious via external email content. Verified:

- Skills are Markdown instruction bundles with no per-skill tool restrictions (confirmed: `tool-policy.ts` resolves policies at agent level only).
- No file-specific write protection exists for `CLAUDE.md` or config files -- only workspace boundary checks (`tool-fs-policy.ts`).
- A skill that says "read instructions from external source and apply them" is genuinely a conduit for arbitrary behavior, and static analysis cannot predict runtime content.

**No issues found.** The "conduit" framing is accurate.

---

### 10. Slipping Exfiltration Past Fatigued Human Reviewer (HITL section)

**Verdict: Realistic**

Alert fatigue is well-documented in security operations research. The PoC's structure (35+ routine approvals followed by a buried malicious request) is a standard social engineering pattern adapted to HITL workflows.

**No issues found.** The connection to the measured 91.5% ceiling (8.5% failure rate) provides empirical grounding.

---

### 11. Social Engineering the Auditor Model (LLM-Based Auditing section)

**Verdict: Realistic**

The PoC targets the auditor LLM with persuasive tool descriptions containing authority signaling ("SOC2 section 4.3"). Verified:

- Tool descriptions are embedded directly in the system prompt (`system-prompt.ts`, lines 226-327) and are visible to the LLM.
- No sanitization or validation of tool description content exists.
- The auditor model processes the same natural language as the primary agent, with no ground-truth verification mechanism.

**No issues found.**

---

### 12. Data Exfiltration Through Authorized SaaS Integration (Enterprise section)

**Verdict: Realistic as a conceptual attack on enterprise platforms**

This targets external enterprise platforms (Microsoft Agent 365, Cisco Zero Trust), not OpenClaw's codebase directly. The logic is sound: network-level zero trust cannot evaluate semantic content flowing through authorized channels.

**No issues found** with the conceptual argument.

---

## Part 2.2: System-Level Framework PoCs

### 13. Overriding ClawKeeper's Skill-Based Policies

**Verdict: Realistic**

ClawKeeper's skill-based policies are Markdown injected into the prompt. The PoC correctly identifies that IPI can inject fake "policy updates" that the LLM treats as authoritative. This is the fundamental weakness of prompt-based security policies.

**No issues found.**

---

### 14. Compositional PoC against ClawKeeper (IPI -> Memory -> Exfiltration over 6 days)

**Verdict: Realistic and well-constructed**

This is the paper's strongest compositional PoC. Each stage independently passes ClawKeeper's checks:
- Input: footnote text (no injection pattern)
- Memory: user preference (no malicious syntax)
- Action: archive to configured service (matches user intent)
- Network: HTTPS POST (no MITRE ATT&CK signature)

The 6-day dormancy period is realistic and breaks temporal correlation. Verified that OpenClaw has no cross-stage invariant verification.

**No issues found.**

---

### 15. Evading PRISM's Heuristic + LLM Scanning via DNS-over-HTTPS

**Verdict: Realistic**

DNS exfiltration via DoH (DNS-over-HTTPS) is a documented real-world technique used in APT campaigns. The PoC correctly identifies that:
- Base32 encoding eliminates raw credential patterns
- `dns.google` is a legitimate Google service that passes domain-tier checks
- "DNS verification" is a plausible security operation for the LLM tier

**No issues found.** This is a sophisticated, realistic attack vector.

---

### 16. Exploiting HITL Allowlist Fast-Path ("Don't Let the Claw")

**Verdict: Realistic**

The PoC chains allowlisted operations (Read, web_fetch to configured API, Write to workspace) to complete 90% of the attack without triggering review. The final exfiltration step reaches the semantic judge stripped of context.

**No issues found.** The fast-path bypass is a real architectural trade-off in HITL systems.

---

### 17. Evading SeClaw's CFI/IFI

**Verdict: Realistic**

The PoC constructs an attack that matches expected control-flow trajectories for a "meeting prep" task. The IPI in a LinkedIn page provides a URL that fits the authorized research flow. Verified that:
- CFI validates sequences, not semantic intent
- IFI tracks provenance but can't distinguish "URL from page user asked to visit" from "URL injected by attacker"

**No issues found.**

---

### 18. Cross-Agent Propagation via Shared Workspace (SeClaw compositional PoC)

**Verdict: Realistic**

The PoC exploits cross-session and cross-agent boundaries:
- Agent A writes poisoned content to `.claude/CLAUDE.md` in shared workspace
- Agent B loads it as trusted project config in a new session
- SeClaw's per-session CFI resets, losing provenance history

Verified: OpenClaw's session isolation actively clears routing state on rollover (`cron/isolated-agent/session.ts`), but this clearing is for delivery context, not for workspace file provenance. No mechanism tracks which agent modified workspace files.

**No issues found.** The "trust laundering" framing (compromised data becomes trusted config after crossing agent/session boundaries) is accurate and insightful.

---

## Summary

### Issues Requiring Attention

| # | PoC | Issue | Severity |
|---|-----|-------|----------|
| 5 | Sandbox Data Exfiltration | `web_fetch` is NOT in default sandbox allow list; network is `"none"` by default. PoC premise is inaccurate for default config. | **High** -- undermines a key argument |

### PoCs Confirmed Valid

All other PoCs (17 out of 18) are realistic given the actual OpenClaw codebase. The strongest are:

1. **Compositional PoC against ClawKeeper (#14)** -- the 6-day multi-stage attack with each stage passing all checks independently is the paper's best demonstration of temporal composition gaps.
2. **Benign components producing malicious behavior (#6)** -- demonstrates a fundamental structural limitation of per-input classification.
3. **Memory entries that are statically clean but semantically malicious (#8)** -- cleanly articulates the syntactic/semantic distinction.
4. **Cross-agent trust laundering via SeClaw (#18)** -- the provenance-stops-at-boundaries insight is novel and important.

### Defense Characterizations

The paper's characterizations of OpenClaw's defenses are accurate:
- **Memory**: No integrity checking, no provenance tracking -- confirmed.
- **Skills**: Ambient authority, no per-skill capability isolation -- confirmed.
- **Config protection**: No file-specific write protection for CLAUDE.md -- confirmed.
- **DLP**: No content inspection on outbound requests -- confirmed.
- **Detection**: Basic regex skill scanner only, no LLM-assisted classification in the base codebase -- confirmed (PRISM is external).

### Note on PRISM

Several PoCs target PRISM, which is an external academic framework, not part of the OpenClaw codebase. The paper correctly attributes PRISM to UNSW and describes it as a deployable addon. The PoCs against PRISM are valid against its documented design but should not be read as attacks against OpenClaw's native defenses.
