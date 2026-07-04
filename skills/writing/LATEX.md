# LaTeX and BibTeX Conventions

Apply these when the user is editing a LaTeX manuscript or a `*.bib` file, on top of
[PRINCIPLES.md](PRINCIPLES.md). Preserve the source so the result can be pasted back with
minimal cleanup.

## LaTeX

- Preserve LaTeX commands, labels, citations, math, and cross-references; do not break equations, macros, or environments during rewriting.
- Use `\cite{}` keys already present in the manuscript rather than inventing new references; cite BibTeX entries from the project `*.bib` and never number references by hand.
- Keep `\ref{}` and `\label{}` usage consistent, with prefixes such as `fig:`, `tab:`, and `eq:`.
- Auto-number everything — never hand-number an equation, figure, table, section, or theorem. Put each in its environment (`equation`, `figure`, `table`, `theorem`, …) with a `\label{}`, and refer to it through `\ref{}`/`\eqref{}` (or `\cref{}`), so numbers and hyperlinks stay correct after edits.
- `~` is a non-breaking space, not a general spacer: use it only in fixed ties such as `Figure~\ref{...}`, `Table~\ref{...}`, `Eq.~\eqref{...}`, and `word~\cite{...}`. Put no ordinary space before a `~`.
- Use `booktabs` rules for tables; avoid manual vertical lines.
- Use `\emph{}` for emphasis, not manual bold.
- Follow math conventions: italic variables (`x`), roman functions and units (`\sin`, `\mathrm{cm}`), bold vectors (`\mathbf{x}`); define symbols on first use and keep notation consistent. Give one role one character class — e.g. keep every rate parameter Greek — so related quantities look related. For theorem-specific notation such as `h_{\mathrm{top}}` vs `h_{\text{top}}`, `\liminf`, and brace minimization, see [THEOREMS.md](THEOREMS.md).
- Use `\section{}`/`\subsection{}` and `itemize`/`enumerate`; never set font sizes by hand.
- Never shrink to fit. Do not use `\fontsize`, `\small`/`\tiny`, or `\resizebox` to force a table or equation into the column — font size is semantic, not a spacing knob. Restructure the content, reformat the table (see below), or reflow the equation instead.
- Inline `$…$`, unnumbered `\[…\]`, and numbered `equation` are all part of the sentence grammatically. Punctuate the surrounding sentence as if the math were a noun phrase, and number a display (`equation` + `\label`) only when it is referenced.
- Treat tangled source or ugly output as a signal the construction is wrong: in TeX, clean source and clean output are meant to arrive together, so reach for a simpler construction rather than patching the symptom.
- Prefer compact layouts; avoid excessive whitespace.

### Figures

- Set `\graphicspath{{figures/}}` once in the preamble; then `\includegraphics{plot}` needs only the base filename, with no extension. `graphicx` resolves the directory and picks the right extension (`.pdf`/`.png`/`.jpg`) for the current engine, so the source survives a format or engine switch.
- Define reusable dimensions with `\newlength`/`\setlength` in the preamble — e.g. a shared subfigure width — and size `\includegraphics` from them instead of repeating magic numbers, so the whole paper's figure sizing changes in one place.
- Distribute subfigures and their gaps with `\hfill`, not fixed `\hspace{...}`; `\hfill` adapts to the column width and spreads the space evenly.
- Write `\caption{}` as one complete, self-contained phrase or sentence, without an interior full stop that breaks it into fragments.

### Tables

- Fit a wide table by narrowing it honestly — tighten `\setlength{\tabcolsep}{...}`, abbreviate or restructure the columns, or split the table — not by wrapping it in `\resizebox{\linewidth}{!}{...}` or dropping to `\tiny`. (`\renewcommand{\arraystretch}{...}` sets row height and `booktabs` gives clean horizontal rules; use them for vertical compactness and a tidy look, not to reclaim width.) A rescaled or shrunk table reads as a typesetting failure; the target is a naturally sized `table` with a proper `\caption{}` and `\label{}`.

## BibTeX

- Titles in sentence case: capitalize only the first word and proper nouns.
- Journal and conference names in title case.
- Brace-protect acronyms and proper nouns so tools do not recase them, e.g. `title = {Detecting {DoH} Tunnels with Drift Adaptation}`.
- Use one consistent citation-key convention across the project (e.g. `Author:Keyword:VenueYear` or `type_year_Author_Keyword`).
- Match the project's existing `*.bib` exactly: field alignment, indentation, field order, commas, and brace style.
