// Communication job: show validation, correction, and convergence to output.
// Primary grammar: decision workflow with one corrective branch.
// Target geometry: single-column figure, natural width approximately 8.5 cm or less.
// Semantic status: schematic.
// Compile with: typst compile decision-workflow.typ
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

  let block(name, pos, body, width: 1.35cm, height: 0.75cm, fill: fig-light) = {
    rect(
      (rel: (-width/2, -height/2), to: pos),
      (rel: (width/2, height/2), to: pos),
      fill: fill, name: name,
    )
    content(pos, body)
  }

  let decision(name, pos, body, width: 1.45, height: 1.00) = {
    let (x, y) = pos
    group(name: name, {
      line(
        (x, y + height/2), (x + width/2, y),
        (x, y - height/2), (x - width/2, y), close: true,
        fill: fig-light,
      )
      anchor("north", (x, y + height/2))
      anchor("south", (x, y - height/2))
      anchor("east", (x + width/2, y))
      anchor("west", (x - width/2, y))
    })
    content(pos, body)
  }

  let arrow(from, to) = line(from, to,
    mark: (end: ">"), stroke: 0.8pt + fig-dark)
  let edge-label(pos, body) = content(pos,
    box(fill: white, inset: 1pt, text(size: 0.8em, body)))

  block("input", (0.00, 0.00), [Input], width: 1.05cm, height: 0.65cm, fill: white)
  decision("check", (1.90, 0.00), [Valid?])
  block("process", (4.05, 0.00), [Process])
  block("output", (6.25, 0.00), [Output], width: 1.05cm, height: 0.65cm, fill: white)
  block("revise", (1.90, -1.45), [Revise])

  arrow("input.east", "check.west")
  arrow("check.east", "process.west")
  edge-label((rel: (0, 0.22), to: ("check.east", 50%, "process.west")), [yes])
  arrow("process.east", "output.west")
  arrow("check.south", "revise.north")
  edge-label((rel: (0.24, 0), to: ("check.south", 50%, "revise.north")), [no])
  line("revise.east", (4.05, -1.45), "process.south",
    mark: (end: ">"), stroke: 0.8pt + fig-dark)
})
