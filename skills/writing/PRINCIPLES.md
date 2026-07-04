# Core Writing Principles

These principles apply to every academic writing task. For journal- and IEEE-specific
style, section templates, and structure checks, see [JOURNAL.md](JOURNAL.md). For LaTeX
and BibTeX conventions, see [LATEX.md](LATEX.md). For polishing the formal statement of a
theorem, lemma, or proposition, see [THEOREMS.md](THEOREMS.md).

Three tests underlie every rule here: is the writing **concise** (no wasted words), **clear** (one meaning, easy to follow), and **well-formed** (clean structure, correct usage, tidy on the page)? When a choice is unclear, pick the option that best satisfies all three.

## Preserve Meaning and Integrity

Do not introduce unsupported claims, new results, fake citations, or stronger novelty language than the source justifies. If the draft is ambiguous, resolve it conservatively.

- Never fabricate data, numbers, experimental conditions, or results.
- Tie each claim to specific evidence — a result, dataset, measurement, citation, or comparison — placed right after the claim.
- When drafting from notes, organize and argue only what the source supplies; flag gaps instead of inventing them.
- Introduce no new results in the conclusion or discussion; restate and interpret only.

## Prefer Clarity Over Formulaic Stiffness

Aim for formal academic tone, but do not make the prose robotic. Use passive voice when it improves objectivity or aligns with the surrounding text, but prefer whichever construction is clearer and more compact.

Prefer moderate sentence length. If a sentence starts carrying method, result, implication, and comparison all at once, split it into two tighter sentences.

## One Paragraph, One Job

Give each paragraph a clear function. Open with a strong topic sentence stating the main point, develop it with reasoning or evidence, and, where helpful, close with a brief transition to the next paragraph. Remove sentences that repeat nearby material, and keep one sub-topic per paragraph.

## Point-First English

Lead with the conclusion, then support it.

- Lead each paragraph with the claim, then back it with reasoning, evidence, and comparison.
- Build the argument as a chain: thesis -> reason or method -> result -> impact.
- When source notes are background-first, restructure to conclusion-first rather than translating word-for-word.
- Write the main clause first, then attach time, place, or condition modifiers.
- Make logical relations explicit with connectives: first/then/finally, however, therefore, moreover, in contrast.

## Guide With Structure, Not Cross-References

Lean on logical continuity and demonstratives — "this bound," "the previous estimate" — before an explicit back-reference. Refer to a specific earlier equation, figure, or result only when the reader genuinely must jump to it; every cross-reference the reader does not need is added reading distance. In a full paper this is reinforced by structure: the section and subsection order is conventional and already previewed in the introduction's roadmap, so a well-organized argument rarely needs to point backward.

## Keep Claims Proportional

Use measured language. Replace hype, certainty inflation, and vague praise with concrete statements about method, data, comparisons, limits, and practical implications.

## Favor Specific Technical Language

Replace filler phrases and abstract wording with direct verbs, concrete nouns, and, when available, quantities or comparisons.

## Parenthetical Material

Parentheses hold only droppable content. A reader must be able to skip everything in `(...)` without losing the meaning of the main clause — parentheses exist to shorten the reading path, not to store facts the sentence depends on. If the material is essential — a defining condition, a classification, a qualifier the claim rests on — take it out of the parentheses and integrate it into the sentence, or set it with a colon, an em dash, or an appositive. (English is stricter here than Chinese, where parentheses routinely carry limiting or defining roles.)

## Flow Between Sentences

Make adjacent sentences connect cleanly.

- Let the first sentence establish context or the main claim.
- Let the next sentence narrow to method, evidence, or limitation.
- Avoid choppy sentence-to-sentence jumps where each sentence feels isolated.
- When revising abstracts and introductions, prefer a clear progression such as problem -> method -> result -> implication.

## Editing Heuristics

During revision, actively look for and remove patterns such as:

- "it should be noted that"
- "it is worth mentioning that"
- empty novelty claims like "very innovative" or "highly effective"
- repeated restatement of the same contribution
- the same claim repeated across the introduction, background, and conclusion
- a reference, phrase, or clause echoed in adjacent sentences (e.g. "…in Fig. 5a. As shown in Fig. 5a, …") — delete the immediate repeat
- vague wording where a specific term, quantity, or comparison would be more precise
- broad claims not tied to data, experiments, or citations
- subjective judgment adverbs — `obviously`, `clearly`, `easily`, `naturally`, `of course`, `needless to say`, `undoubtedly` — that assert rather than show; give the reason or derivation instead. Keep `straightforward`, `direct`, or `simple` only when the step shown truly is.
- unnecessary first-person wording such as `we propose`, `we develop`, `we show`, or `we conduct/perform experiments` when the sentence works better as an impersonal construction

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
