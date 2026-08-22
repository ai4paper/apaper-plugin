// Communication job: show two subsystem boundaries and their interface.
// Primary grammar: left-to-right grouped system architecture.
// Target geometry: single-column figure, natural width approximately 8.5 cm or less.
// Semantic status: schematic.
// Compile with: typst compile system-architecture.typ
#import "@preview/cetz:0.3.4"

#set page(width: auto, height: auto, margin: 2mm)
// Copy the host paper's font family and body size.
#set text(size: 10pt)

#let fig-dark = luma(25%)
#let fig-mid = luma(50%)
#let fig-light = luma(85%)
#let fig-pale = luma(95%)

#cetz.canvas(length: 1cm, {
  import cetz.draw: *

  set-style(
    stroke: 0.6pt + fig-dark,
    content: (padding: 2pt),
    mark: (fill: fig-dark, scale: 0.8),
  )

  let block(name, pos, body, width: 1.35cm, height: 0.75cm) = {
    rect(
      (rel: (-width/2, -height/2), to: pos),
      (rel: (width/2, height/2), to: pos),
      fill: fig-light, name: name,
    )
    content(pos, body)
  }

  let arrow(from, to) = line(from, to,
    mark: (end: ">"), stroke: 0.8pt + fig-dark)

  // Group containers are drawn first so they remain behind the blocks.
  rect((-0.80, -0.60), (2.80, 0.90),
    stroke: (paint: fig-mid, thickness: 0.6pt, dash: "dashed"),
    fill: fig-pale, radius: 2pt, name: "acq")
  rect((3.70, -0.60), (7.30, 0.90),
    stroke: (paint: fig-mid, thickness: 0.6pt, dash: "dashed"),
    fill: fig-pale, radius: 2pt, name: "inf")
  content((1.00, 0.66), text(size: 0.8em)[Acquisition])
  content((5.50, 0.66), text(size: 0.8em)[Inference])

  block("sample", (0.00, -0.10), [Sample])
  block("clean", (2.00, -0.10), [Clean])
  block("encode", (4.50, -0.10), [Encode])
  block("decide", (6.50, -0.10), [Decide])

  arrow("sample.east", "clean.west")
  arrow("clean.east", "encode.west")
  content(("clean.east", 50%, "encode.west"),
    box(fill: white, inset: 1pt, text(size: 0.8em)[features]))
  arrow("encode.east", "decide.west")
})
