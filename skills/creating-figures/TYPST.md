# Typst Block Diagrams

Implementation guide for creating block diagrams in Typst using **[CeTZ](https://typst.app/universe/package/cetz)**.

CeTZ is a TikZ-inspired drawing package for Typst. It exposes primitives (`rect`, `circle`, `line`, `content`, `group`), named anchors (`.north`, `.east`, etc.), styles via `set-style`, and arrow marks — close enough to TikZ that diagrams port cleanly between the two.

## Imports and Page Setup

Standalone figure preamble:

```typst
#import "@preview/cetz:0.3.4"
#import cetz.draw: *

// Tight page: figure decides its own size.
#set page(width: auto, height: auto, margin: 2mm)
// 10pt = the host paper's body text size — copy it from the paper's
// #set text(size: ...) and keep the two in sync.
#set text(font: "New Computer Modern Sans", size: 10pt)
```

The font must actually be installed (or supplied via `--font-path`) — "New Computer Modern Sans" ships with LaTeX, not with Typst. A missing family produces only an `unknown font family` **warning** while Typst silently falls back to its default serif, so treat that warning as a failure.

Pin the cetz version (e.g. `0.3.4`) so future rebuilds stay reproducible. Bump deliberately, not opportunistically. The CeTZ API has changed between minor versions — examples in this document target `0.3.x`.

The whole figure lives inside one canvas:

```typst
#cetz.canvas(length: 1cm, {
  import cetz.draw: *
  // ... drawing commands ...
})
```

`length: 1cm` makes coordinate units equal 1cm by default; arithmetic on coordinates becomes intuitive (`(2, 0)` is 2 cm right of origin).

## Color Definitions

Grayscale palette (mirrors the TikZ palette in [PRINCIPLES.md](PRINCIPLES.md)):

```typst
#let fig-black = luma(0%)
#let fig-dark  = luma(25%)
#let fig-mid   = luma(50%)
#let fig-light = luma(85%)
#let fig-pale  = luma(95%)
```

## Standard Styles

Wrap the recurring node/arrow shapes in small helpers — the CeTZ equivalent of `\tikzset{ block/.style={...} }`. Define them once at the top of the canvas closure, then call them throughout.

```typst
#cetz.canvas(length: 1cm, {
  import cetz.draw: *

  set-style(
    stroke: 0.6pt + fig-dark,
    content: (padding: 2pt),
    mark: (fill: fig-dark, scale: 0.8),
  )

  // Primary processing block: name + center coordinate + label
  let block(name, pos, body, width: 2cm, height: 0.8cm) = {
    rect(
      (rel: (-width/2, -height/2), to: pos),
      (rel: ( width/2,  height/2), to: pos),
      fill: fig-light, name: name,
    )
    content(pos, body)
  }

  // Input/output terminal
  let terminal(name, pos, body, width: 1.2cm, height: 0.6cm) = {
    rect(
      (rel: (-width/2, -height/2), to: pos),
      (rel: ( width/2,  height/2), to: pos),
      fill: white, name: name,
    )
    content(pos, body)
  }

  // Summing junction (small circle)
  let sum(name, pos, body) = {
    circle(pos, radius: 0.25cm, fill: white, name: name)
    content(pos, text(size: 0.7em, body))
  }

  // Decision diamond. Dimensions are canvas-unit numbers (not lengths) so
  // they can be added to the position components. A closed line only
  // exposes a centroid anchor in cetz, so declare the compass anchors
  // explicitly inside a named group.
  let decision(name, pos, body, width: 1.4, height: 1.0) = {
    let (x, y) = pos
    group(name: name, {
      line(
        (x, y + height/2), (x + width/2, y),
        (x, y - height/2), (x - width/2, y), close: true,
        fill: fig-light,
      )
      anchor("north", (x, y + height/2))
      anchor("south", (x, y - height/2))
      anchor("east",  (x + width/2, y))
      anchor("west",  (x - width/2, y))
    })
    content(pos, body)
  }

  // Standard arrow
  let arrow(from, to) = line(from, to,
    mark: (end: ">"),
    stroke: 0.8pt + fig-dark)

  // Dashed arrow
  let dasharrow(from, to) = line(from, to,
    mark: (end: ">"),
    stroke: (paint: fig-mid, thickness: 0.8pt, dash: "dashed"))

  // ... drawing commands using the helpers ...
})
```

Two patterns that recur:

- **Center-anchored rectangles**: define blocks by their *center* coordinate so positioning is intuitive (matches TikZ `\node[block] at (x, y)`). The `rel:` syntax computes the two corner points from the center.
- **Named shapes**: pass `name:` so later `line` calls can target `"block-id.east"`, `"block-id.north"`, etc., instead of recomputing coordinates.

## Coordinate Model

CeTZ uses absolute Cartesian coordinates (x right, y up). After a named shape, anchors are addressable as strings:

```typst
rect((0, 0), (2, 1), name: "a")
// "a.center", "a.north", "a.south", "a.east", "a.west",
// "a.north-east", "a.south-west", etc.

line("a.east", "b.west", mark: (end: ">"))
```

Relative coordinates use `(rel: (dx, dy), to: anchor)`:

```typst
line("a.east", (rel: (1, 0), to: "a.east"), mark: (end: ">"))
```

For midpoints and arithmetic, bind positions to `let` variables or compute inline (there is no `coordinate` function in cetz; for reusable named positions, declare an `anchor(...)` inside a named `group`):

```typst
let mid = ((0, 0), 50%, (4, 0))   // 50% along the segment
line("ctrl.east", mid, mark: (end: ">"))
```

## Basic Patterns

### Linear Flow

```typst
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

### Vertical Stack

Lay nodes along decreasing `y`:

```typst
block("a", (0,  0), [Block A])
block("b", (0, -1.4), [Block B])
block("c", (0, -2.8), [Block C])
line("a.south", "b.north", mark: (end: ">"))
line("b.south", "c.north", mark: (end: ">"))
```

### Parallel Branches

Use orthogonal multi-segment lines via intermediate coordinates:

```typst
block("start", (0, 0), [Start])
block("a",     (3,  1), [Path A])
block("b",     (3, -1), [Path B])
block("end",   (6, 0), [Merge])

line("start.east", (1.5, 0), (1.5,  1), "a.west", mark: (end: ">"))
line("start.east", (1.5, 0), (1.5, -1), "b.west", mark: (end: ">"))
line("a.east", (4.5,  1), (4.5, 0), "end.west", mark: (end: ">"))
line("b.east", (4.5, -1), (4.5, 0), "end.west", mark: (end: ">"))
```

### Feedback Loop

Route the return path around the forward chain with explicit waypoints:

```typst
terminal("ref", (0, 0), $r$)
sum("sum", (1.5, 0), $Sigma$)
block("ctrl", (3.5, 0), [Controller])
block("plnt", (6.5, 0), [Plant])
terminal("out", (9, 0), $y$)
block("sens", (5, -1.5), [Sensor])

arrow("ref.east",  "sum.west")
arrow("sum.east",  "ctrl.west")
arrow("ctrl.east", "plnt.west")
arrow("plnt.east", "out.west")

// Tap between Plant and y — on the wire, clear of the arrowhead — down to
// Sensor's right, back to sum's south. A filled dot marks the junction.
let tap = ((rel: (0.35, 0), to: "plnt.east"))
circle(tap, radius: 1.2pt, fill: fig-dark, stroke: none)
line(tap, (rel: (0, -1.5), to: tap), "sens.east",
  stroke: 0.8pt + fig-dark)
line("sens.west", (1.5, -1.5), "sum.south", mark: (end: ">"))
```

### Grouped Subsystem

CeTZ does not have a one-call `fit` like TikZ, but the `group` primitive plus a manually-sized `rect` underneath gives the same effect. Draw the container *first* so it sits behind the inner blocks:

```typst
// Container (dashed, pale fill, behind inner content)
rect((-0.2, -0.6), (3.2, 0.8),
  stroke: (paint: fig-mid, thickness: 0.6pt, dash: "dashed"),
  fill: fig-pale,
  radius: 2pt,
  name: "sub")
content((rel: (0, 0.2), to: "sub.north"),
  text(size: 0.8em)[Subsystem])

// Inner blocks
block("a", (0.5, 0), [A])
block("b", (2.5, 0), [B])
arrow("a.east", "b.west")
```

If you do not want to hand-size the rectangle, draw the inner blocks first inside a `group(name: "sub", { ... })`, then place the container `rect` using `("sub.north-west")` and `("sub.south-east")` as corners — see the CeTZ docs for `group` bounding-box anchors.

### Decision Branch

```typst
block("proc", (0, 0), [Process])
decision("dec", (3, 0), [Check])
block("yes", (6, 1), [Accept])
block("no", (6, -1), [Reject])

arrow("proc.east", "dec.west")
line("dec.east", (4.5, 0), (4.5,  1), "yes.west",
  mark: (end: ">"))
line("dec.east", (4.5, 0), (4.5, -1), "no.west",
  mark: (end: ">"))

content((4.7, 0.6), text(size: 0.8em)[yes])
content((4.7, -0.6), text(size: 0.8em)[no])
```

Note: Typst code mode forbids whitespace between a function name and its argument list — TikZ-style aligned calls like `block   ("proc", ...)` are syntax errors.

## Edge Labels

Place labels with `content` at a computed midpoint, optionally with a white background to mask the line underneath. Draw order is z-order in cetz, so draw the line **first** and the label after it — otherwise the line paints on top of the label and strikes through the text:

```typst
let mid = ("a.east", 50%, "b.west")
line("a.east", "b.west", mark: (end: ">"))
content(mid, box(fill: white, inset: 1pt,
  text(size: 0.8em)[data]))
```

For labels above/below the line, offset the content point:

```typst
content((rel: (0, 0.3), to: mid), text(size: 0.8em)[above])
content((rel: (0, -0.3), to: mid), text(size: 0.8em)[below])
```

For sloped labels along a non-horizontal line, compute the angle (`calc.atan2(...)`) and pass it as `angle:` to `content`.

## Typography

- Set the figure's base text size to **the host paper's body text size** — copy the value from the paper's `#set text(size: ...)` and keep the two in sync (or move the value into a shared style file both import). Never pick a figure-specific size.
- Primary labels carry no explicit size: they inherit the base `#set text` size, so figure text prints at the same size as paragraph text.
- Express the internal hierarchy in `em` units so it tracks the base size:
  - inherit (primary labels — no size argument)
  - `0.8em` ≈ `\footnotesize` (edge labels, secondary annotations)
  - `0.7em` ≈ `\scriptsize` (tertiary only)
- For math, use Typst math mode directly inside any content argument: `$y(t)$`, `$C(s)$`. CeTZ accepts arbitrary content.

## Compilation

Tight single-figure compile:

```bash
typst compile system-diagram.typ                          # → system-diagram.pdf
typst compile --format svg system-diagram.typ             # → system-diagram.svg
typst compile --format png --ppi 200 \
  system-diagram.typ system-diagram.preview.png           # for QA
```

`typst watch system-diagram.typ` gives a live rebuild loop while iterating on layout.

## Self-Verification Loop

Same expectation as the LaTeX workflow: compile, render a raster preview, open it, and look. Successful Typst compilation only proves the source parses — it does not prove labels are legible or that edges land where intended.

```bash
typst compile system-diagram.typ
typst compile --format png --ppi 200 system-diagram.typ system-diagram.preview.png
```

Check for the same issues listed in [SKILL.md](SKILL.md): overlap, cramped labels, misaligned nodes, weak grayscale contrast, clipped content, container-label spacing.

## Integration in a Typst Paper

Include the compiled figure with no `width:` argument:

```typst
#figure(
  image("figures/system-diagram.svg"),   // NOT image(..., width: 80%)
  caption: [System block diagram.],
) <fig:block-diagram>
```

Omitting `width:` is necessary but **not sufficient**: Typst silently downscales any image wider than the column to fit the container — no warning, no error — so an over-wide figure still ends up with shrunken text. Check the compiled figure's intrinsic width (the `width="...pt"` attribute of the generated SVG, or the standalone PDF's page width) against the column width, and tighten the canvas geometry (block spacing, widths) until it fits. Never fix an over-wide figure by scaling.

Reference with `@fig:block-diagram`. Compiling figures separately to SVG/PDF keeps the parent paper's build fast.

## Common Issues

### Figure text smaller than the paper's body text

Cause: a hardcoded `#set text(size: ...)` that differs from the paper's body size, absolute pt sizes on labels, shrink-on-include (`image(..., width: 80%)`), or an over-wide figure silently auto-shrunk to the column — Typst downscales images wider than the container even without `width:`. Fix: copy the base size from the paper, use `em` units for the internal hierarchy, include the image without `width:`, and verify the figure's intrinsic width fits the column (removing `width:` alone does not prevent auto-shrink).

### Arrows attach to the wrong side

Element-name endpoints (`line("a", "b")`) are auto-clipped to the shapes' borders in cetz — the line does not vanish into the fill. Still, prefer explicit anchors (`"a.east"`, `"b.west"`): the border-intersection point follows the line's direction, so in multi-segment routes it can attach to an unintended side.

### Overlapping labels and lines

Wrap the label in `box(fill: white, inset: 1pt, ...)` so it punches a hole in the line beneath it. This is the CeTZ analog to TikZ's `edgelabel/.style={fill=white, inner sep=1pt}`.

### Container label collides with inner blocks

Same rule as TikZ: leave consistent padding between a container's top label and its inner blocks. Compute the container `rect` with explicit corners and leave at least `0.3cm`–`0.4cm` of headroom for the label.

### Coordinates do not match expected positions

`length: 1cm` on `cetz.canvas` is the unit for raw numeric coordinates. If you set `length: 1pt` instead, `(2, 0)` is two points wide, not two centimeters. Pick one length unit per figure and stick with it.

### Tap junction merges with source box edge

If a feedback tap drops from a coordinate at the source node's edge
(`"plant.east"`), the down-line shares an x-coordinate with the box border
and looks like an extension of the rectangle. Offset the tap onto the wire
itself and mark the junction with a small filled dot — see the [Tap
Junctions](PRINCIPLES.md#tap-junctions-branching-off-a-wire) rule:

```typst
let tap = (rel: (0.35, 0), to: "plant.east")
circle(tap, radius: 1.2pt, fill: fig-dark, stroke: none)
line(tap, (rel: (0, -1.6), to: tap), "sensor.east",
  stroke: 0.8pt + fig-dark)
```

### Math mode rendering

Inside any content slot, write math with `$...$` (Typst math). Don't paste LaTeX `\frac{}{}` — Typst math syntax differs (`frac(a, b)`, `Sigma`, etc.).

## Quick Reference

| Task             | Code                                                  |
| ---------------- | ----------------------------------------------------- |
| Named rectangle  | `rect((0,0), (2,1), name: "a")`                       |
| Centered label   | `content("a.center", [Label])`                        |
| Arrow            | `line("a.east", "b.west", mark: (end: ">"))`          |
| Right-angle path | `line("a.east", (mx, my), "b.north", mark: ...)`      |
| Edge label       | `content(mid, box(fill: white, [data]))`              |
| Group container  | `rect(p1, p2, stroke: (dash: "dashed"), fill: ...)`   |
| Math in node     | `content("a.center", $C(s)$)`                         |
| Relative coord   | `(rel: (1, 0), to: "a.east")`                         |
| Midpoint         | `("a.east", 50%, "b.west")`                           |
