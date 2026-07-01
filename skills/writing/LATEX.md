# LaTeX and BibTeX Conventions

Apply these when the user is editing a LaTeX manuscript or a `*.bib` file, on top of
[PRINCIPLES.md](PRINCIPLES.md). Preserve the source so the result can be pasted back with
minimal cleanup.

## LaTeX

- Preserve LaTeX commands, labels, citations, math, and cross-references; do not break equations, macros, or environments during rewriting.
- Use `\cite{}` keys already present in the manuscript rather than inventing new references; cite BibTeX entries from the project `*.bib` and never number references by hand.
- Keep `\ref{}` and `\label{}` usage consistent, with prefixes such as `fig:`, `tab:`, and `eq:`.
- Use `booktabs` rules for tables; avoid manual vertical lines.
- Use `\emph{}` for emphasis, not manual bold.
- Follow math conventions: italic variables (`x`), roman functions and units (`\sin`, `\mathrm{cm}`), bold vectors (`\mathbf{x}`); define symbols on first use and keep notation consistent.
- Use `\section{}`/`\subsection{}` and `itemize`/`enumerate`; never set font sizes by hand.
- Prefer compact layouts; avoid excessive whitespace.

## BibTeX

- Titles in sentence case: capitalize only the first word and proper nouns.
- Journal and conference names in title case.
- Brace-protect acronyms and proper nouns so tools do not recase them, e.g. `title = {Detecting {DoH} Tunnels with Drift Adaptation}`.
- Use one consistent citation-key convention across the project (e.g. `Author:Keyword:VenueYear` or `type_year_Author_Keyword`).
- Match the project's existing `*.bib` exactly: field alignment, indentation, field order, commas, and brace style.
