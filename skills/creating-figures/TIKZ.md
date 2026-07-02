# TikZ Block Diagrams

Implementation guide for creating block diagrams with LaTeX TikZ.

## Preamble Setup

Required packages and configuration:

```latex
\usepackage{tikz}
\usetikzlibrary{
  shapes.geometric,    % Diamond, ellipse shapes
  shapes.misc,         % Rounded rectangle
  arrows.meta,         % Modern arrow tips
  positioning,         % Relative positioning
  fit,                 % Fitting nodes around others
  backgrounds,         % Background layers
  calc                 % Coordinate calculations
}
```

## Color Definitions

Grayscale palette (add to preamble):

```latex
\definecolor{figblack}{gray}{0.0}
\definecolor{figdark}{gray}{0.25}
\definecolor{figmid}{gray}{0.5}
\definecolor{figlight}{gray}{0.85}
\definecolor{figpale}{gray}{0.95}
```

## Standard Styles

Define reusable styles at the start of your tikzpicture or in preamble. Primary node styles carry **no font size command** — they inherit the document's body size (`\normalsize`), which is what keeps figure text the same size as the paper's text. Only secondary/tertiary styles step down, and only with relative commands (`\footnotesize`, `\scriptsize`) that track the base size:

```latex
\tikzset{
  % Primary processing block — no size command: inherits body size
  block/.style={
    rectangle,
    draw=figdark,
    fill=figlight,
    minimum width=2cm,
    minimum height=0.8cm,
    align=center,
    font=\sffamily
  },
  % Input/output terminal
  terminal/.style={
    rectangle,
    draw=figdark,
    fill=white,
    minimum width=1.5cm,
    minimum height=0.6cm,
    align=center,
    font=\sffamily
  },
  % Decision diamond
  decision/.style={
    diamond,
    draw=figdark,
    fill=figlight,
    minimum width=1.2cm,
    minimum height=1.2cm,
    align=center,
    font=\sffamily,
    aspect=1.5
  },
  % Small auxiliary block
  smallblock/.style={
    rectangle,
    draw=figdark,
    fill=figlight,
    minimum width=1.5cm,
    minimum height=0.6cm,
    align=center,
    font=\footnotesize\sffamily
  },
  % Subsystem grouping
  group/.style={
    draw=figmid,
    dashed,
    fill=figpale,
    rounded corners=2pt,
    inner sep=8pt
  },
  % Standard arrow
  arrow/.style={
    ->,
    >={Stealth[length=2mm]},
    thick,
    draw=figdark
  },
  % Bidirectional arrow
  biarrow/.style={
    <->,
    >={Stealth[length=2mm]},
    thick,
    draw=figdark
  },
  % Dashed arrow (optional flow)
  dasharrow/.style={
    ->,
    >={Stealth[length=2mm]},
    thick,
    dashed,
    draw=figmid
  },
  % Edge label
  edgelabel/.style={
    font=\footnotesize\sffamily,
    fill=white,
    inner sep=1pt
  }
}
```

## Basic Patterns

### Linear Flow

Simple left-to-right sequence:

```latex
\begin{tikzpicture}
  \node[terminal] (in) {Input};
  \node[block, right=of in] (proc) {Process};
  \node[terminal, right=of proc] (out) {Output};

  \draw[arrow] (in) -- (proc);
  \draw[arrow] (proc) -- (out);
\end{tikzpicture}
```

### Vertical Stack

Top-to-bottom flow:

```latex
\begin{tikzpicture}
  \node[block] (a) {Block A};
  \node[block, below=of a] (b) {Block B};
  \node[block, below=of b] (c) {Block C};

  \draw[arrow] (a) -- (b);
  \draw[arrow] (b) -- (c);
\end{tikzpicture}
```

### Parallel Branches

Split and merge pattern:

```latex
\begin{tikzpicture}
  \node[block] (start) {Start};
  \node[block, above right=0.5cm and 1.5cm of start] (a) {Path A};
  \node[block, below right=0.5cm and 1.5cm of start] (b) {Path B};
  \node[block, right=3cm of start] (end) {Merge};

  \draw[arrow] (start) |- (a);
  \draw[arrow] (start) |- (b);
  \draw[arrow] (a) -| (end);
  \draw[arrow] (b) -| (end);
\end{tikzpicture}
```

### Feedback Loop

Closed-loop system:

```latex
\begin{tikzpicture}
  \node[terminal] (in) {$r$};
  \node[block, right=of in] (ctrl) {Controller};
  \node[block, right=of ctrl] (plant) {Plant};
  \node[terminal, right=of plant] (out) {$y$};
  \node[block, below=of ctrl] (fb) {Feedback};

  % Forward path
  \draw[arrow] (in) -- (ctrl);
  \draw[arrow] (ctrl) -- (plant);
  \draw[arrow] (plant) -- (out);

  % Feedback path
  \draw[arrow] (plant.east) -- ++(0.3,0) |- (fb.east);
  \draw[arrow] (fb.west) -| ($(in)!0.5!(ctrl)$) -- (ctrl.west);
\end{tikzpicture}
```

## Advanced Patterns

### Multi-Input Multi-Output

System with multiple I/O:

```latex
\begin{tikzpicture}
  % Inputs
  \node[terminal] (in1) {$x_1$};
  \node[terminal, below=0.5cm of in1] (in2) {$x_2$};

  % Main block
  \node[block, right=1.5cm of $(in1)!0.5!(in2)$, minimum height=1.5cm] (sys) {System};

  % Outputs
  \node[terminal, right=1.5cm of sys, yshift=0.3cm] (out1) {$y_1$};
  \node[terminal, right=1.5cm of sys, yshift=-0.3cm] (out2) {$y_2$};

  \draw[arrow] (in1) -- (in1 -| sys.west);
  \draw[arrow] (in2) -- (in2 -| sys.west);
  \draw[arrow] (sys.east |- out1) -- (out1);
  \draw[arrow] (sys.east |- out2) -- (out2);
\end{tikzpicture}
```

### Hierarchical Blocks

Nested subsystems using `fit`:

```latex
\begin{tikzpicture}
  % Inner blocks
  \node[smallblock] (a) {A};
  \node[smallblock, right=of a] (b) {B};

  % Group around inner blocks
  \begin{scope}[on background layer]
    \node[group, fit=(a)(b), label=above:{\footnotesize\sffamily Subsystem}] (sub) {};
  \end{scope}

  % External connections
  \node[terminal, left=of sub] (in) {In};
  \node[terminal, right=of sub] (out) {Out};

  \draw[arrow] (in) -- (a);
  \draw[arrow] (a) -- (b);
  \draw[arrow] (b) -- (out);
\end{tikzpicture}
```

### Decision Branch

Conditional flow with diamond:

```latex
\begin{tikzpicture}
  \node[block] (proc) {Process};
  \node[decision, right=of proc] (dec) {Check};
  \node[block, right=of dec] (yes) {Accept};
  \node[block, below=of dec] (no) {Reject};

  \draw[arrow] (proc) -- (dec);
  \draw[arrow] (dec) -- node[edgelabel, above] {yes} (yes);
  \draw[arrow] (dec) -- node[edgelabel, right] {no} (no);
\end{tikzpicture}
```

## Positioning Techniques

### Relative Positioning

Use `positioning` library for clean layouts:

```latex
right=of node      % Default separation (1cm)
right=2cm of node  % Custom separation
above right=1cm and 2cm of node  % Diagonal offset
```

### Coordinate Calculations

Use `calc` library for precise placement:

```latex
% Midpoint between two nodes
\coordinate (mid) at ($(node1)!0.5!(node2)$);

% Point along a line
\coordinate (pt) at ($(node1)!0.3!(node2)$);

% Perpendicular offset
\coordinate (off) at ($(node1)!1cm!90:(node2)$);
```

### Anchors

Connect at specific points:

```latex
\draw[arrow] (node1.east) -- (node2.west);
\draw[arrow] (node1.south) |- (node2.west);
\draw[arrow] (node1.north east) -- (node2.south west);
```

## Edge Labels

### Inline Labels

```latex
\draw[arrow] (a) -- node[above] {label} (b);
\draw[arrow] (a) -- node[edgelabel] {data} (b);
```

### Positioned Labels

```latex
\draw[arrow] (a) -- node[pos=0.3, above] {near start} (b);
\draw[arrow] (a) -- node[pos=0.7, below] {near end} (b);
```

### Sloped Labels

```latex
\draw[arrow] (a) -- node[sloped, above] {follows line} (b);
```

## Scaling and Export

### Fitting the Column Width

Never shrink a finished figure to fit — scaled-down text no longer matches the paper's body size. The working levers are:

- reduce `node distance` and `minimum width` values,
- shorten labels or break them onto two lines (`\\` with `align=center`).

`[scale=...]` is **not** a usable lever: plain `scale` rescales only explicit numeric coordinates (`at (4,0)`). It does nothing to `right=of`/`below=of` positioning offsets, node-anchor coordinates, or `minimum width`/`minimum height` — on the positioning-based layouts this guide teaches it is a silent no-op, and on absolute-coordinate layouts it moves node centers while node bodies stay full size, which can create overlaps.

Avoid `\resizebox{\columnwidth}{!}{...}`, `every node/.style={scale=...}`, `transform shape`, and `\includegraphics[width=\columnwidth]{...}` on figures that contain text — all of them silently change the effective font size.

### Standalone Compilation

For separate PDF figures. The class size option must **match the host paper's base size** (e.g. `10pt` for a 10pt IEEEtran paper) — this is what `\normalsize` inside the figure resolves against. Load the same font packages as the paper so the family matches too:

```latex
% 10pt = the host paper's base font size — copy it from the paper
\documentclass[tikz,border=2mm,10pt]{standalone}
\usetikzlibrary{...}
% same font packages as the paper
% color definitions
% style definitions
\begin{document}
\begin{tikzpicture}
  % ... content ...
\end{tikzpicture}
\end{document}
```

Caveat: standalone's default underlying class is article, which supports only `10pt`/`11pt`/`12pt`. Any other size option (e.g. `9pt` for a 9pt IEEEtran paper) is **silently ignored** — the figure falls back to 10pt with nothing but an `Unused global option(s)` line in the log, so the figure text ends up larger than the body text. For such papers load the paper's own class instead:

```latex
\documentclass[9pt,border=2mm,class=IEEEtran,tikz]{standalone}
```

Either way, verify the rendered text size in the preview against a sample of the paper's body text.

### Preview Rendering and QA

After compilation, always render a temporary PNG or JPG preview and inspect it before finalizing. Compilation only proves the source is syntactically valid; the preview confirms the figure is visually usable.

```bash
latexmk -pdf system-diagram.tex
pdftoppm -png -singlefile -r 200 system-diagram.pdf system-diagram.preview
```

If `latexmk` is unavailable, run `pdflatex system-diagram.tex`. If `pdftoppm` is unavailable, use ImageMagick `magick`/`convert` or another installed converter. Rework the TikZ source and rerender if the preview shows overlap, cramped labels, misaligned nodes, excessive whitespace, clipped content, or weak grayscale contrast.

### Integration in Document

Embedding the `tikzpicture` directly in the paper is the guaranteed size match — the figure inherits the document's font family and body size automatically:

```latex
\begin{figure}[htbp]
  \centering
  \begin{tikzpicture}
    % ... content ...
  \end{tikzpicture}
  \caption{System block diagram.}
  \label{fig:block-diagram}
\end{figure}
```

When including a precompiled standalone PDF instead, include it at natural size — no `width=` — so the text stays at body size:

```latex
\includegraphics{figures/system-diagram}   % NOT [width=\columnwidth]
```

## Common Issues

### Figure Text Smaller Than Body Text

Cause: a hardcoded size command in node styles (`font=\small`), a standalone class size that differs from the paper's, or shrink-on-include (`width=\columnwidth`, `\resizebox`). Fix: drop the size command from primary styles, match the standalone class size option to the paper, and include at natural size — see [Fitting the Column Width](#fitting-the-column-width).

### Overlapping Labels

Solution: Adjust `inner sep`, use `fill=white` on labels, or reposition.

### Inconsistent Spacing

Solution: Use relative positioning consistently, define spacing as variables:

```latex
\newcommand{\blocksep}{1.2cm}
\node[block, right=\blocksep of prev] (next) {...};
```

### Container Labels and Inner Block Spacing

When a container box has a label at the top, inner blocks must leave enough space below the label. Use consistent spacing for all similar containers:

```latex
% Container with label
\node[roundbox, minimum width=1.4cm] (round1) {};
\node[roundlabel, anchor=north] at ([yshift=-1pt]round1.north) {Round 1};

% Inner block needs sufficient offset from container top to avoid label
\node[opblock, below=0.35cm of round1.north] (sbox1) {S-box};  % Good: 0.35cm
% NOT: below=0.25cm of round1.north  % Bad: may overlap with label
```

Ensure all similar containers use the same offset value for consistency.

### Tap Junction Merges with Source Box Edge

If a feedback tap drops from `(node.east)` directly, the down-line shares an
x-coordinate with the box border and visually merges with the rectangle.
Offset the tap onto the wire itself and mark the junction with a small
filled dot — see the [Tap Junctions](PRINCIPLES.md#tap-junctions-branching-off-a-wire)
rule:

```latex
% Tap on the wire, not at the box edge
\coordinate (tap) at ($(plant.east)+(0.35cm,0)$);
\fill[figdark] (tap) circle (1.2pt);
\draw[thick, draw=figdark] (tap) |- (sensor.east);
```

### Arrow Alignment

Solution: Use anchors explicitly:

```latex
\draw[arrow] (a.east) -- (b.west);  % Not just (a) -- (b)
```

## Quick Reference

| Task         | Code                           |
| ------------ | ------------------------------ |
| Basic block  | `\node[block] (id) {Label};`   |
| Arrow        | `\draw[arrow] (a) -- (b);`     |
| Right-angle  | `\draw[arrow] (a) -\| (b);`    |
| Edge label   | `node[edgelabel] {text}`       |
| Group        | `\node[group, fit=(a)(b)] {};` |
| Relative pos | `right=1cm of node`            |
