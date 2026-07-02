# Figure Design Principles

Design principles for creating publication-quality scientific figures.

## Core Philosophy

Follow Tufte's principles: maximize data-ink ratio, minimize chartjunk. Every element must serve a purpose.

## Grayscale Palette

Print-friendly grayscale values for academic figures. The same five-stop palette works for both backends:

LaTeX/TikZ:

```latex
% Primary grayscale palette
\definecolor{figblack}{gray}{0.0}      % Text, primary lines
\definecolor{figdark}{gray}{0.25}      % Borders, arrows
\definecolor{figmid}{gray}{0.5}        % Secondary elements
\definecolor{figlight}{gray}{0.85}     % Block fills
\definecolor{figpale}{gray}{0.95}      % Group backgrounds
```

Typst:

```typst
#let fig-black = luma(0%)    // Text, primary lines
#let fig-dark  = luma(25%)   // Borders, arrows
#let fig-mid   = luma(50%)   // Secondary elements
#let fig-light = luma(85%)   // Block fills
#let fig-pale  = luma(95%)   // Group backgrounds
```

| Element           | Gray Value  | Use Case                   |
| ----------------- | ----------- | -------------------------- |
| Text/Labels       | 0.0 (black) | All text content           |
| Borders/Arrows    | 0.25        | Node outlines, connections |
| Secondary lines   | 0.5         | Grid lines, annotations    |
| Block fills       | 0.85        | Interior of nodes          |
| Group backgrounds | 0.95        | Subsystem groupings        |

## Layout Principles

### Compactness

- **Tight spacing**: Use minimum necessary whitespace
- **Consistent gaps**: 5-8mm between adjacent blocks
- **No decorative elements**: Remove unnecessary borders, shadows, gradients

### Alignment

- **Grid-based**: Align nodes to implicit grid
- **Centered connections**: Arrows connect at node centers or edges
- **Balanced composition**: Distribute visual weight evenly

### Sizing

- **Uniform nodes**: Same-type blocks have identical dimensions
- **Proportional hierarchy**: Important elements slightly larger
- **Readable at scale**: Test at 50% zoom

Standard block dimensions:

```
Minimum width:  2.0cm (primary blocks)
Minimum height: 0.8cm (primary blocks)
Small blocks:   1.5cm x 0.6cm
Text padding:   2mm internal margin
```

## Typography

### Font Selection

- **Sans-serif**: Use `\sffamily` (LaTeX) or `#set text(font: "...")` with a sans family (Typst) for all figure text
- **Match document**: Same font family as paper body when possible
- **Consistent weight**: Regular weight for labels, bold sparingly

### Font Sizes

**The base font size of a figure is the host paper's body text size.** Figure text must print at the same size as the surrounding paragraph text — never pick a fixed size for the figure independent of the paper.

- **Derive, don't hardcode**: LaTeX — give the standalone class the same size option as the paper's class (e.g. `\documentclass[tikz,border=2mm,10pt]{standalone}` for a 10pt paper). Typst — set `#set text(size: ...)` to the exact value the paper uses and keep the two in sync (or move the value into a shared style file both import).
- **Primary labels**: body size — no size command at all in LaTeX (inherit `\normalsize`); inherit the base `#set text` size in Typst.
- **Secondary annotations** (edge labels, group titles): one relative step down — `\footnotesize` (LaTeX), `0.8em` (Typst).
- **Tertiary details** (use sparingly): `\scriptsize` (LaTeX), `0.7em` (Typst).
- **Never rescale at inclusion**: `\includegraphics[width=...]`, `\resizebox`, `scale` with `transform shape`, or Typst `image(..., width: ...)` all change the effective font size and break the match with the body text. Include at natural size and fit the column by shrinking the figure's geometry (spacing, node sizes), not its text. In Typst, also verify the figure's intrinsic width fits the column — an over-wide image is silently downscaled even without `width:`.

Relative commands and `em` units track the base size, so the hierarchy survives a paper-wide font size change without editing the figure.

### Label Placement

- **Inside blocks**: Centered, single line preferred
- **Edge labels**: Positioned at midpoint, offset from line
- **External labels**: Consistent distance from referenced element

## Line Weights

Hierarchy through stroke width:

```latex
thin        % 0.4pt - tertiary lines, grids
semithick   % 0.6pt - secondary connections
thick       % 0.8pt - primary arrows (recommended)
very thick  % 1.2pt - emphasis only
```

## Arrow Styles

Standard arrow conventions:

- **Data flow**: Solid line, filled arrowhead (`-Stealth`)
- **Control flow**: Solid line, open arrowhead (`-{Latex[open]}` — plain `-Latex` is filled and indistinguishable from `-Stealth`)
- **Optional/conditional**: Dashed line
- **Bidirectional**: Double-headed arrow

## Block Diagram Conventions

### Node Types

| Type         | Shape       | Fill     | Border  | Use                    |
| ------------ | ----------- | -------- | ------- | ---------------------- |
| Process      | Rectangle   | figlight | figdark | Main processing blocks |
| Input/Output | Rectangle   | white    | figdark | System boundaries      |
| Decision     | Diamond     | figlight | figdark | Conditional logic      |
| Storage      | Cylinder    | figlight | figdark | Data stores            |
| Group        | Dashed rect | figpale  | figmid  | Subsystem grouping     |

### Connection Rules

1. **Horizontal preference**: Flow left-to-right when possible
2. **Orthogonal lines**: Use right angles, avoid diagonal connections
3. **Minimal crossings**: Rearrange to reduce line intersections
4. **Consistent direction**: Maintain flow direction within subsystems

### Tap Junctions (Branching off a Wire)

When a feedback or branch path taps off an existing wire (e.g. tapping the
output of a plant into a sensor), three rules keep the junction readable:

1. **Tap from the wire, not the box.** Place the tap point on the wire
   itself, offset from the source node's edge. If the tap shares an x or y
   coordinate with the source node's border, the tap line visually merges
   with the border and the reader cannot tell where the signal is being
   sampled.
2. **Clear of the arrowhead.** Place the tap before the arrowhead body of
   the wire's terminal arrow (not in the last 2–3 mm). A tap line that
   crosses the arrowhead clips the arrow and breaks the directional cue.
3. **Mark the junction.** Draw a small filled dot (≈1–1.5 pt radius, dark
   gray) at the tap point. The dot tells the reader "signal sampled here"
   and disambiguates from accidental line crossings.

Apply the same rules wherever one wire splits into two — branching points
need the same dot+offset treatment as feedback taps.

### Grouping

Use dashed rectangles to indicate:

- Subsystems or modules
- Repeated structures
- Logical groupings

Group styling (LaTeX):

```latex
group/.style={
  draw=figmid,
  dashed,
  fill=figpale,
  rounded corners=2pt,
  inner sep=8pt
}
```

Group styling (Typst/CeTZ — manually-sized rectangle behind inner content):

```typst
rect(p1, p2,
  stroke: (paint: fig-mid, thickness: 0.6pt, dash: "dashed"),
  fill: fig-pale,
  radius: 2pt)
```

## Accessibility

### Contrast

- Minimum contrast ratio 4.5:1 for text
- Test figure in grayscale (already optimized)
- Ensure readability when printed

### Patterns

When color distinction needed (future extension):

- Combine color with pattern (hatching, dots)
- Use shape variation alongside color
- Add text labels as backup

## Quality Checklist

Before finalizing a figure:

- [ ] Standalone source (`.tex` or `.typ`) compiles without errors
- [ ] Temporary PNG/JPG preview was rendered from the compiled figure
- [ ] Preview was visually inspected and any issues were fixed
- [ ] All text readable at intended print size
- [ ] Figure text prints at the paper's body font size (base size taken from the paper, no hardcoded figure-specific size, no scaling at inclusion)
- [ ] Consistent spacing throughout
- [ ] No orphaned or misaligned elements
- [ ] Arrows point in logical flow direction
- [ ] Labels do not overlap lines or nodes
- [ ] Figure works in grayscale
- [ ] Minimal visual clutter
