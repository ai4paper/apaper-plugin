// Block Diagram Example: PID Control System with Feedback
// Compile with: typst compile block-diagram.typ
#import "@preview/cetz:0.3.4"

#set page(width: auto, height: auto, margin: 2mm)
// Pick a sans font that matches the host paper; default Typst font used here.
#set text(size: 9pt)

// Grayscale palette
#let fig-dark  = luma(25%)
#let fig-light = luma(85%)

#cetz.canvas(length: 1cm, {
  import cetz.draw: *

  set-style(
    stroke: 0.6pt + fig-dark,
    content: (padding: 2pt),
    mark: (fill: fig-dark, scale: 0.8),
  )

  // Helpers
  let block(name, pos, body, width: 2.2cm, height: 0.9cm) = {
    rect(
      (rel: (-width/2, -height/2), to: pos),
      (rel: ( width/2,  height/2), to: pos),
      fill: fig-light, name: name,
    )
    content(pos, body)
  }

  let terminal(name, pos, body, width: 1.2cm, height: 0.7cm) = {
    rect(
      (rel: (-width/2, -height/2), to: pos),
      (rel: ( width/2,  height/2), to: pos),
      fill: white, name: name,
    )
    content(pos, body)
  }

  let sum(name, pos) = {
    circle(pos, radius: 0.28cm, fill: white, name: name)
    content(pos, text(size: 8pt, $Sigma$))
  }

  let arrow(from, to) = line(from, to,
    mark: (end: ">"),
    stroke: 0.8pt + fig-dark)

  // Main signal path
  terminal("ref", (0, 0), $r(t)$)
  sum("sum", (1.5, 0))
  block("ctrl", (3.5, 0), [Controller $C(s)$])
  block("plant", (6.3, 0), [Plant $G(s)$])
  terminal("out", (8.7, 0), $y(t)$)

  // Feedback sensor
  block("sensor", (4.9, -1.6), [Sensor $H(s)$])

  // Forward path
  arrow("ref.east", "sum.west")
  arrow("sum.east", "ctrl.west")
  arrow("ctrl.east", "plant.west")
  arrow("plant.east", "out.west")

  // Feedback loop. Tap from a point along the Plant -> y(t) arrow, clear of
  // both Plant's right edge (so the tap-down line is not mistaken for the
  // box border) and the arrowhead at y(t).west. A small filled dot marks
  // the tap junction.
  let tap = (rel: (0.35, 0), to: "plant.east")
  circle(tap, radius: 1.2pt, fill: fig-dark, stroke: none)
  line(tap, (rel: (0, -1.6), to: tap), "sensor.east",
    stroke: 0.8pt + fig-dark)
  line("sensor.west", (1.5, -1.6), "sum.south",
    mark: (end: ">"),
    stroke: 0.8pt + fig-dark)

  // Signs on summing junction. White-filled boxes mask the underlying arrow
  // line, so the glyph never visually overlaps the stroke.
  //  "+" annotates the r(t) -> Sum arrow (above the line, near Sum)
  //  "-" annotates the feedback arrow entering Sum from below (left of arrow)
  let sign-box(body) = box(fill: white, inset: (x: 1pt, y: 0pt),
    text(size: 7pt, body))
  content(("ref.east", 65%, "sum.west"),
    anchor: "south", padding: 3pt,
    sign-box([$+$]))
  content((rel: (-0.22, -0.22), to: "sum.south"),
    sign-box([$-$]))
})
