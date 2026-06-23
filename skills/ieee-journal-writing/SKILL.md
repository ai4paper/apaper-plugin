---
name: ieee-journal-writing
description: Revises and strengthens IEEE-style journal writing for academic papers, especially when the user is drafting or polishing LaTeX sections, improving technical prose, aligning with reviewer expectations, or asking for more formal, concise, publication-ready language. Use this skill whenever the task involves rewriting abstract, introduction, methods, results, discussion, conclusion, captions, or responses for an engineering or scientific paper, even if the user does not explicitly mention IEEE.
---

# IEEE Journal Writing

Help the user turn rough academic prose into clear, publication-ready IEEE-style writing without changing the technical meaning. Preserve the author's intended meaning while meeting publication standards.

## Goals

- Preserve the author's claims, evidence, and intended emphasis.
- Improve clarity, rigor, concision, and logical flow.
- Prefer neutral, evidence-driven phrasing over promotional language.
- Keep the result LaTeX-ready when the user is working in `.tex` files.

## When Working

First identify what kind of help the user wants:

- polish a sentence or paragraph
- rewrite a full section
- align a manuscript with IEEE tone
- improve structure and flow
- tighten claims for technical accuracy
- make LaTeX prose cleaner and more consistent

Match the depth of the response to the request. If the user asks for a direct rewrite, give the rewrite first. If the user asks for critique, explain the issues first and then propose fixes.

## Core Writing Principles

### Preserve Meaning and Integrity

Do not introduce unsupported claims, new results, fake citations, or stronger novelty language than the source justifies. If the draft is ambiguous, resolve it conservatively.

- Never fabricate data, numbers, experimental conditions, or results.
- Tie each claim to specific evidence — a result, dataset, measurement, citation, or comparison — placed right after the claim.
- When drafting from notes, organize and argue only what the source supplies; flag gaps instead of inventing them.
- Introduce no new results in the conclusion or discussion; restate and interpret only.

### Prefer Clarity Over Formulaic Stiffness

Aim for formal academic tone, but do not make the prose robotic. Use passive voice when it improves objectivity or aligns with the surrounding text, but prefer whichever construction is clearer and more compact.

Prefer moderate sentence length. If a sentence starts carrying method, result, implication, and comparison all at once, split it into two tighter sentences.

### One Paragraph, One Job

Give each paragraph a clear function. Open with a strong topic sentence stating the main point, develop it with reasoning or evidence, and, where helpful, close with a brief transition to the next paragraph. Remove sentences that repeat nearby material, and keep one sub-topic per paragraph.

### Point-First English

Lead with the conclusion, then support it.

- Lead each paragraph with the claim, then back it with reasoning, evidence, and comparison.
- Build the argument as a chain: thesis -> reason or method -> result -> impact.
- When source notes are background-first, restructure to conclusion-first rather than translating word-for-word.
- Write the main clause first, then attach time, place, or condition modifiers.
- Make logical relations explicit with connectives: first/then/finally, however, therefore, moreover, in contrast.

### Keep Claims Proportional

Use measured language. Replace hype, certainty inflation, and vague praise with concrete statements about method, data, comparisons, limits, and practical implications.

### Favor Specific Technical Language

Replace filler phrases and abstract wording with direct verbs, concrete nouns, and, when available, quantities or comparisons.

## IEEE-Oriented Style Guidance

- Define acronyms on first use and keep terminology consistent afterward.
- Prefer precise, neutral statements over marketing language.
- Present methods and results objectively, without claiming novelty for the methodology.
- Emphasize reproducibility, methodological detail, and evidence-backed conclusions.
- Avoid first-person pronouns by default, including `we`, unless the user explicitly wants to preserve an existing first-person house style.
- Keep sentences compact. Split overloaded sentences that try to carry multiple claims.

## Flow Between Sentences

Make adjacent sentences connect cleanly.

- Let the first sentence establish context or the main claim.
- Let the next sentence narrow to method, evidence, or limitation.
- Avoid choppy sentence-to-sentence jumps where each sentence feels isolated.
- When revising abstracts and introductions, prefer a clear progression such as problem -> method -> result -> implication.

## Section Templates

State the paper's contribution factually; describe, do not advertise. Use these templates as a checklist for what each section should cover.

- **Abstract:** background, gap, method, key quantified result, significance, scope or limits. Keep results specific but compact.
- **Introduction:** field background and trends, existing work, the unsolved gap, this paper's contribution, then a short outline of the remaining sections.
- **Methods:** enough procedural and parameter detail for replication; present it objectively without claiming novelty.
- **Results:** key experiments, validation method, interpretation, and comparison against baselines.
- **Discussion:** significance, comparison with prior work, constraints, applications, and possible extensions.
- **Conclusion:** main findings, contribution, limitations, and future directions (restate and interpret; no new data, per the integrity rules above).
- **Title:** concise; centered on the research object and what the work does.

## Structure Checks

When revising a section, look for these issues:

1. missing problem statement or motivation
2. weak transitions between paragraphs
3. repeated claims across sections
4. method descriptions that are too vague to follow
5. results stated without context, comparison, or takeaway
6. conclusions that overstate significance

Fix the issue in the rewrite rather than merely pointing it out, unless the user asked for review only.

## LaTeX and BibTeX Conventions

If the user is editing a LaTeX manuscript, preserve the source so the result can be pasted back with minimal cleanup.

### LaTeX

- Preserve LaTeX commands, labels, citations, math, and cross-references; do not break equations, macros, or environments during rewriting.
- Use `\cite{}` keys already present in the manuscript rather than inventing new references; cite BibTeX entries from the project `*.bib` and never number references by hand.
- Keep `\ref{}` and `\label{}` usage consistent, with prefixes such as `fig:`, `tab:`, and `eq:`.
- Use `booktabs` rules for tables; avoid manual vertical lines.
- Use `\emph{}` for emphasis, not manual bold.
- Follow math conventions: italic variables (`x`), roman functions and units (`\sin`, `\mathrm{cm}`), bold vectors (`\mathbf{x}`); define symbols on first use and keep notation consistent.
- Use `\section{}`/`\subsection{}` and `itemize`/`enumerate`; never set font sizes by hand.
- Prefer compact layouts; avoid excessive whitespace.

### BibTeX

- Titles in sentence case: capitalize only the first word and proper nouns.
- Journal and conference names in title case.
- Brace-protect acronyms and proper nouns so tools do not recase them, e.g. `title = {Detecting {DoH} Tunnels with Drift Adaptation}`.
- Use one consistent citation-key convention across the project (e.g. `Author:Keyword:VenueYear` or `type_year_Author_Keyword`).
- Match the project's existing `*.bib` exactly: field alignment, indentation, field order, commas, and brace style.

## Response Patterns

### Small Rewrite Requests

Return:

1. the revised text
2. a short note on what improved, only if useful

If a single-sentence rewrite becomes long or crowded, prefer two shorter sentences with a tighter logical link.

Unless the user asks for labels, avoid adding headings like `Revised text:` before a short rewrite.

### Section-Level Rewrites

Return:

1. a polished LaTeX-ready section
2. brief notes on major structural or stylistic changes
3. any factual gaps or citation gaps that still need author input

### Review-Only Requests

Return:

1. the main writing issues
2. concrete recommended edits
3. optional sample rewrites for the most important passages

## Editing Heuristics

During revision, actively look for and remove patterns such as:

- "it should be noted that"
- "it is worth mentioning that"
- empty novelty claims like "very innovative" or "highly effective"
- repeated restatement of the same contribution
- the same claim repeated across the introduction, background, and conclusion
- vague wording where a specific term, quantity, or comparison would be more precise
- broad claims not tied to data, experiments, or citations
- unnecessary first-person wording such as `we propose`, `we develop`, or `we show` when the sentence works better as an impersonal construction

Also check whether adjacent sentences can be merged for flow or split for readability.

## Technical Content Safeguards

- Keep enough methodological detail for a knowledgeable reader to follow the work.
- Do not rewrite away important assumptions, limits, or implementation details.
- If a claim appears unsupported, soften the wording rather than pretending the evidence exists.
- If terminology conflicts across the draft, normalize it to one consistent term unless the distinction is meaningful.

## Self-Review

After drafting or revising a full section (not a small rewrite), report briefly:

- the key assumptions the draft relies on
- information still needed to complete or strengthen the argument (missing data, citations, or experimental detail)
- possible logic gaps, weak transitions, or unsupported claims

## Output Quality Bar

Before finishing, make sure the revision is:

- faithful to the source meaning
- more concise than the original unless detail was missing
- easier to read sentence by sentence
- consistent in terminology and tense
- suitable for an IEEE-style engineering paper

## Example Behaviors

**Input:** "Rewrite this abstract to sound more like an IEEE journal paper, but keep the contribution exactly the same."

**Output:** Provide a tighter abstract with neutral claims, clearer problem-method-result flow, and no added technical content.

**Input:** "Please edit this LaTeX introduction and keep all citations and refs untouched."

**Output:** Return revised LaTeX prose that preserves `\cite{}` and `\ref{}` commands while improving flow and concision.
