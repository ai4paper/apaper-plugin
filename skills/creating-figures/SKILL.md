---
name: creating-figures
description: Creates publication-quality scientific figures for academic papers using LaTeX/TikZ or Typst. Use when creating block diagrams, system architectures, flowcharts, or technical illustrations for papers and theses. Always render a temporary PNG/JPG preview and self-verify visual quality before finalizing figure files.
---

# Creating Scientific Figures

Create compact, print-friendly figures for academic papers. Two backends are supported:

- **LaTeX/TikZ** — the established academic standard, ideal for papers already built on LaTeX.
- **Typst** — modern alternative with fast incremental compilation, ideal for Typst-based papers (uses the [`cetz`](https://typst.app/universe/package/cetz) package, a TikZ-inspired drawing library for Typst).

Pick the backend that matches the surrounding paper. If the host document is unknown, ask the user (or look for `.tex` vs `.typ` files in the working tree).

## Quick Start

### LaTeX/TikZ

Minimal block diagram:

```latex
\documentclass[tikz,border=2mm]{standalone}
\usetikzlibrary{arrows.meta,positioning}
\begin{document}
\begin{tikzpicture}[
  block/.style={rectangle, draw, fill=gray!15, minimum width=2cm, minimum height=0.8cm, font=\small\sffamily},
  arrow/.style={->, >=Stealth, thick}
]
  \node[block] (a) {Input};
  \node[block, right=of a] (b) {Process};
  \node[block, right=of b] (c) {Output};
  \draw[arrow] (a) -- (b);
  \draw[arrow] (b) -- (c);
\end{tikzpicture}
\end{document}
```

### Typst (CeTZ)

Minimal block diagram:

```typst
#import "@preview/cetz:0.3.4"

#set page(width: auto, height: auto, margin: 2mm)
#set text(font: "New Computer Modern Sans", size: 9pt)

#cetz.canvas(length: 1cm, {
  import cetz.draw: *
  set-style(stroke: 0.6pt + luma(25%))

  let block(name, pos, body) = {
    rect((rel: (-1, -0.4), to: pos), (rel: (1, 0.4), to: pos),
      fill: luma(85%), name: name)
    content(pos, body)
  }

  block("in",   (0, 0), [Input])
  block("proc", (3, 0), [Process])
  block("out",  (6, 0), [Output])

  line("in.east",   "proc.west", mark: (end: ">"))
  line("proc.east", "out.west",  mark: (end: ">"))
})
```

## Design Principles

Key principles for academic figures (apply equally to both backends):

1. **Grayscale palette**: Print-friendly, no color dependency
2. **Compactness**: Minimize whitespace, maximize information
3. **Consistency**: Uniform sizing, spacing, typography
4. **Hierarchy**: Line weight and gray levels show importance

See [PRINCIPLES.md](PRINCIPLES.md) for complete design guidelines.

## Implementation

- **LaTeX/TikZ block diagrams**: See [TIKZ.md](TIKZ.md) for preamble setup, style definitions, common patterns (linear, parallel, feedback loops), positioning, and edge labels.
- **Typst block diagrams**: See [TYPST.md](TYPST.md) for the `cetz` setup, style helpers, named anchors, common patterns, and edge labeling.

**Working examples**:

- [examples/tikz/block-diagram.tex](examples/tikz/block-diagram.tex) — PID control system in TikZ
- [examples/typst/block-diagram.typ](examples/typst/block-diagram.typ) — PID control system in Typst/CeTZ

## Workflow

1. **Pick backend** to match the paper (LaTeX vs Typst). If unsure, check the working directory or ask.
2. **Plan layout**: sketch block arrangement on paper.
3. **Define styles**: set up colors, node styles, and spacing constants.
4. **Place nodes**: use relative positioning (named anchors in CeTZ, `right=of`/`below=of` in TikZ).
5. **Draw connections**: add arrows with appropriate routing.
6. **Add labels**: annotate edges and groups.
7. **Refine spacing**: adjust for visual balance.
8. **Render preview**: compile the standalone figure and create a temporary PNG/JPG preview.
9. **Self-verify**: inspect the preview for visual quality and fix issues before finalizing.
10. **Test print**: verify grayscale readability.

## Required Self-Verification

Every figure creation task must include a local render-and-check loop before final delivery. Successful compilation does not prove visual quality — labels may be unreadable, arrows may overlap, whitespace may be awkward, groups may be misaligned. The raster preview catches these problems before the user sees them.

1. Save the figure as a standalone source file (`.tex` or `.typ`).
2. Compile it to PDF:
   - LaTeX: `latexmk -pdf figure.tex` (or `pdflatex figure.tex`)
   - Typst: `typst compile figure.typ`
3. Convert the PDF (or directly render PNG from Typst) to a temporary preview:
   - LaTeX: `pdftoppm -png -singlefile -r 200 figure.pdf figure.preview` (or ImageMagick `magick`/`convert`)
   - Typst: `typst compile --format png --ppi 200 figure.typ figure.preview.png`
4. Open/read the temporary preview image and inspect it visually.
5. Fix any quality problems, then rerender and reinspect until the preview is acceptable.
6. Keep the final source and requested deliverables; remove or clearly mark temporary preview files unless the user asks to keep them.

Use a temporary preview filename such as `figure-name.preview.png`, or place previews under a temporary directory. Do not treat successful compilation as sufficient verification.

Self-check the preview for:

- text legibility at paper scale and at 50% zoom
- no overlapping text, labels, arrows, nodes, or group boxes
- arrowheads and line routes point in the intended direction
- consistent node sizes, spacing, alignment, and margins
- enough padding between container labels and inner blocks
- compact layout without excessive whitespace or clipped content
- grayscale contrast that remains readable in print

Example verification commands:

```bash
# LaTeX
latexmk -pdf system-diagram.tex
pdftoppm -png -singlefile -r 200 system-diagram.pdf system-diagram.preview

# Typst
typst compile system-diagram.typ
typst compile --format png --ppi 200 system-diagram.typ system-diagram.preview.png
```

If `latexmk` is unavailable, use `pdflatex`. If `pdftoppm` is unavailable, use ImageMagick or another installed PDF-to-image converter.

## File Organization

LaTeX project:

```
your-paper/
├── figures/
│   ├── system-diagram.tex    % Standalone TikZ source
│   └── system-diagram.pdf    % Compiled figure
└── paper.tex                 % \includegraphics{figures/system-diagram}
```

Typst project:

```
your-paper/
├── figures/
│   ├── system-diagram.typ    // Standalone fletcher/cetz source
│   └── system-diagram.svg    // Compiled figure (or .pdf)
└── paper.typ                 // #figure(image("figures/system-diagram.svg"))
```

Compile standalone figures separately, then include the rendered PDF/SVG for faster paper compilation. Typst can also embed a `.typ` figure directly via `#include`, but a precompiled image keeps the parent document fast.
