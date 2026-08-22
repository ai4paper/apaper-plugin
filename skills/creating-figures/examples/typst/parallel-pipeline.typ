// Communication job: show one input processed in parallel and fused once.
// Primary grammar: fan-out/fan-in parallel pipeline.
// Target geometry: single-column figure, natural width approximately 8.5 cm or less.
// Semantic status: schematic.
// Compile with: typst compile parallel-pipeline.typ
#import "@preview/cetz:0.3.4"

#set page(width: auto, height: auto, margin: 2mm)
// Copy the host paper's font family and body size.
#set text(size: 10pt)

#let fig-dark = luma(25%)
#let fig-light = luma(85%)

#cetz.canvas(length: 1cm, {
  import cetz.draw: *

  set-style(
    stroke: 0.6pt + fig-dark,
    content: (padding: 2pt),
    mark: (fill: fig-dark, scale: 0.8),
  )

  let block(name, pos, body, width: 1.45cm, height: 0.70cm, fill: fig-light) = {
    rect(
      (rel: (-width/2, -height/2), to: pos),
      (rel: (width/2, height/2), to: pos),
      fill: fill, name: name,
    )
    content(pos, body)
  }

  let arrow(from, to) = line(from, to,
    mark: (end: ">"), stroke: 0.8pt + fig-dark)

  block("input", (0.00, 0.00), [Input], width: 1.05cm, height: 0.65cm, fill: white)
  block("path-a", (2.55, 0.75), [Path A])
  block("path-b", (2.55, -0.75), [Path B])
  block("fusion", (5.10, 0.00), [Fusion])
  block("output", (7.00, 0.00), [Output], width: 1.15cm, height: 0.65cm, fill: white)

  let split = (1.10, 0.00)
  let merge = (4.10, 0.00)
  line("input.east", split, stroke: 0.8pt + fig-dark)
  circle(split, radius: 1.2pt, fill: fig-dark, stroke: none)
  line(split, (1.35, 0.00), (1.35, 0.75), "path-a.west",
    mark: (end: ">"), stroke: 0.8pt + fig-dark)
  line(split, (1.35, 0.00), (1.35, -0.75), "path-b.west",
    mark: (end: ">"), stroke: 0.8pt + fig-dark)

  line("path-a.east", (3.75, 0.75), (3.75, 0.00), merge,
    stroke: 0.8pt + fig-dark)
  line("path-b.east", (3.75, -0.75), (3.75, 0.00), merge,
    stroke: 0.8pt + fig-dark)
  circle(merge, radius: 1.2pt, fill: fig-dark, stroke: none)
  arrow(merge, "fusion.west")
  arrow("fusion.east", "output.west")
})
