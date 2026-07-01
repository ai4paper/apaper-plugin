---
name: writing
description: Revises and strengthens academic writing for papers, especially when the user is drafting or polishing LaTeX sections, improving technical prose, aligning with reviewer expectations, or asking for more formal, concise, publication-ready language. Use this skill whenever the task involves rewriting abstract, introduction, methods, results, discussion, conclusion, captions, or reviewer responses for an engineering or scientific paper. When the work targets a journal or IEEE-style manuscript — even if the user does not say "IEEE" — also apply the journal rules in JOURNAL.md.
---

# Academic Writing

Help the user turn rough academic prose into clear, publication-ready writing without changing the technical meaning. Preserve the author's intended meaning while meeting publication standards.

## Goals

- Preserve the author's claims, evidence, and intended emphasis.
- Improve clarity, rigor, concision, and logical flow.
- Prefer neutral, evidence-driven phrasing over promotional language.
- Keep the result LaTeX-ready when the user is working in `.tex` files.

## When Working

First identify what kind of help the user wants:

- polish a sentence or paragraph
- rewrite a full section
- align a manuscript with a target venue's tone
- improve structure and flow
- tighten claims for technical accuracy
- make LaTeX prose cleaner and more consistent

Match the depth of the response to the request. If the user asks for a direct rewrite, give the rewrite first. If the user asks for critique, explain the issues first and then propose fixes.

## Rule Sets

The writing rules are split by concern. Always apply [PRINCIPLES.md](PRINCIPLES.md); apply the others when the task calls for them.

| File                           | When to apply                                                                                                            |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| [PRINCIPLES.md](PRINCIPLES.md) | Always. Core prose principles, sentence flow, editing heuristics, safeguards, and self-review.                          |
| [JOURNAL.md](JOURNAL.md)       | Journal or IEEE-style manuscripts — even if the user never says "IEEE." Venue tone, section templates, structure checks. |
| [LATEX.md](LATEX.md)           | The user is editing a LaTeX manuscript or `*.bib` file. LaTeX and BibTeX conventions.                                    |

### Detecting journal / IEEE work

Apply [JOURNAL.md](JOURNAL.md) when any of these hold, even without the word "IEEE":

1. The user names a journal, an IEEE / ACM / Elsevier / Springer venue, or a manuscript submission.
2. The text is an abstract, introduction, methods, results, discussion, or conclusion for an engineering or scientific paper.
3. The user asks for reviewer-ready, publication-ready, or formal academic tone for a paper.

When in doubt on an academic paper, default to applying the journal rules — they are a superset of good general academic style.

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

## Output Quality Bar

Before finishing, make sure the revision is:

- faithful to the source meaning
- more concise than the original unless detail was missing
- easier to read sentence by sentence
- consistent in terminology and tense
- suitable for the target venue (see [JOURNAL.md](JOURNAL.md) for IEEE-style work)

## Example Behaviors

**Input:** "Rewrite this abstract to sound more like an IEEE journal paper, but keep the contribution exactly the same."

**Output:** Provide a tighter abstract with neutral claims, clearer problem-method-result flow, and no added technical content. (Apply [JOURNAL.md](JOURNAL.md).)

**Input:** "Please edit this LaTeX introduction and keep all citations and refs untouched."

**Output:** Return revised LaTeX prose that preserves `\cite{}` and `\ref{}` commands while improving flow and concision. (Apply [LATEX.md](LATEX.md).)
