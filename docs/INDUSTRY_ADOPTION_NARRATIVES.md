# TSP Industry Adoption Narratives

Purpose: translate cryptographic mechanics into operational buyer outcomes without claiming compliance guarantees.

## Cross-Sector Outcome

TSP gives important AI outputs a signed TrustEnvelope: who issued it, what source and process were declared, when it was signed, and whether the bytes still match. That gives buyers, auditors, and implementers a common evidence object instead of screenshots or vendor dashboard claims.

## Public Sector

Operational problem: public bodies need to explain automated or AI-assisted decisions after the fact.

TSP narrative:

- every important AI output can carry a signed receipt;
- the manifest identifies the issuer;
- the verifier can check the content hash and signature independently;
- evidence can be shared without granting dashboard access.

First workflow: one citizen-facing answer or internal caseworker assistant response, using synthetic or non-sensitive content first.

## Healthcare

Operational problem: clinical or administrative AI support must be traceable without leaking patient data into broad logs.

TSP narrative:

- hash-only or redacted envelope patterns can separate evidence from protected content;
- issuer identity and process metadata travel with the output;
- audit review can inspect whether the receipt is intact without trusting a vendor screenshot.

First workflow: non-diagnostic administrative AI output, not clinical decision automation.

## Legal and Compliance

Operational problem: AI-generated summaries and advice need source, policy, and timestamp evidence.

TSP narrative:

- citations and primary source declarations are explicit;
- redacted system prompt hashes can show policy continuity without revealing internal prompts;
- tamper detection gives reviewers a stable object to examine.

First workflow: contract summary or policy memo draft, clearly marked as assistant output.

## Finance and Procurement

Operational problem: buyers need evidence that vendors can answer "what did the AI system output and under which controls?"

TSP narrative:

- procurement can require a signed TrustEnvelope or functionally equivalent open evidence object;
- vendor claims become testable;
- pilot acceptance can include fixture pass reports and hosted manifest checks.

First workflow: vendor evaluation question that requires signed sample outputs.

## Defense and Critical Infrastructure

Operational problem: provenance, tamper evidence, and key ownership matter more than dashboard convenience.

TSP narrative:

- self-hosted keys and manifests avoid required dependence on LexiCo infrastructure;
- cryptographic checks can run in restricted environments;
- operational logs can store hashes and signatures without centralizing sensitive content.

First workflow: offline or restricted verifier for non-sensitive command-support text.
