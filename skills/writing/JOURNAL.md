# Journal & IEEE-Style Writing

Apply these rules on top of [PRINCIPLES.md](PRINCIPLES.md) whenever the task targets a
journal or IEEE-style manuscript — even if the user never says "IEEE." See the detection
rule in [SKILL.md](SKILL.md). For LaTeX and BibTeX conventions, see [LATEX.md](LATEX.md).
For the formal statement of a theorem, lemma, or proposition, also apply
[THEOREMS.md](THEOREMS.md).

## IEEE-Oriented Style Guidance

- Define acronyms on first use and keep terminology consistent afterward. Introduce an abbreviation only for a term that recurs — roughly three or more uses — since below that the reader pays more decoding cost than the density saves. Do not expand foundational terms the readership already reads as words, such as DNA or CPU.
- Prefer precise, neutral statements over marketing language.
- Present methods and results objectively, without claiming novelty for the methodology.
- Emphasize reproducibility, methodological detail, and evidence-backed conclusions.
- Avoid first-person pronouns by default, including `we`, unless the user explicitly wants to preserve an existing first-person house style.
- Drop possessive `our` used as filler: `our approach`, `our method`, `our results` become `the approach`, `the proposed method`, `the results`. The content is objective and needs no owner; watch especially for sentences that stack several `our`s.
- Do not open a sentence with an abbreviation. Spell it out at the start — `Figure 3 shows…`, `Equation (4) gives…`, `Section II describes…` — and abbreviate (`Fig. 3`, `Eq. (4)`, `Sec. II`) only mid-sentence, where it raises information density. Keep one abbreviation style throughout.

## Section Templates

State the paper's contribution factually; describe, do not advertise. Use these templates as a checklist for what each section should cover.

- **Abstract:** background, gap, method, key quantified result, significance, scope or limits. Keep results specific but compact. The abstract is an expansion of the title; whenever the title is settled or changed, revise the abstract to match.
- **Introduction:** field background and trends, existing work, the unsolved gap, this paper's contribution, then a one-paragraph roadmap of the rest of the paper. The roadmap conventionally opens with `The rest of the paper is organized as follows.` and ends with `The last section concludes the paper.`; keep this closing paragraph and follow the fixed phrasing. Write it as continuous prose of roughly two to three pages: no subsection headings, and no figure or table — a display fragments the narrative before the reader has the full framing, and its information density is too low to justify the space.
- **Contributions (when listed):** introduce the list with the fixed lead-in `The main contributions of this paper are summarized as follows:`, then name each contribution as a noun or gerund phrase describing the contribution itself, not a sentence about author activity. Doing work is not a contribution — "Extensive experiments are conducted on two datasets" states an activity; the contribution is a genuinely novel method, experimental design, implementation, or dataset construction, not the conclusion those experiments establish or the act of running them. Reserve the list for methods, results, and insights.
- **Methods:** enough procedural and parameter detail for replication; present it objectively without claiming novelty.
- **Results:** key experiments, validation method, interpretation, and comparison against baselines.
- **Discussion:** significance, comparison with prior work, constraints, applications, and possible extensions.
- **Conclusion:** main findings, contribution, limitations, and future directions (restate and interpret; no new data, per the integrity rules in [PRINCIPLES.md](PRINCIPLES.md)).
- **Title:** concise; centered on the research object and what the work does. Tailor it to the target journal's scope and topical preferences as well as to the work itself, so the manuscript clears the editor's pre-screen.

## Writing About Figures, Tables, and Equations

- A figure or table is a grammatical subject that *presents* evidence, not an agent that *performs* research. Pair it with a reporting verb: a figure *shows, illustrates, presents, depicts, displays, demonstrates,* or *visualizes*; a table *reports, lists,* or *summarizes* data, whose values then *show, indicate, reveal,* or *suggest* a finding. Do not let the artifact do the authors' action — "Table I selects eight methods" becomes "Table I lists the eight methods compared"; "a table demonstrates the improvement" becomes "the results in Table VI show the improvement."
- Link a symbol or quantity to its defining expression with *defined as* or *given by*, not a bare *is*: "the normalized embeddings **are** (1)" is ungrammatical; write "the normalized embeddings are **given by** (1)" or "the normalized embeddings are **defined as** in (1)."
- Keep captions self-contained: a reader should grasp the figure or table from its caption alone. The caption carries the description, so do not also set a title across the top of the figure — reserve on-figure titles for slides, posters, and talks, where there is no caption to read. (For caption formatting, see [LATEX.md](LATEX.md).)

## Structure Checks

When revising a section, look for these issues:

1. missing problem statement or motivation
2. weak transitions between paragraphs
3. repeated claims across sections
4. method descriptions that are too vague to follow
5. results stated without context, comparison, or takeaway
6. conclusions that overstate significance
7. a figure or table whose caption or verb does not match what the artifact actually shows

Fix the issue in the rewrite rather than merely pointing it out, unless the user asked for review only.
