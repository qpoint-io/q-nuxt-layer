// -------------- POINT CLASS

// Utility class
export class Point{
  constructor(x,y){
    this.x = x
    this.y = y
  }

  // convert to string
  toString(){ return `${this.x} ${this.y}` }
}

// --------------- Helpers

export const svgMachine = {

  // Comile an array of Points
  compile:(pts)=> {
    return pts.join(' ')
  },

  // Build a simple chart from the raw data we get from the server.
  // closePath adds baseline anchor points before/after the data so a polygon
  // fill closes cleanly — skip it (closePath=false) for a stroked line with no
  // fill: those anchors would otherwise render as a visible drop at each end.
  sparkChart:(dataPts, ceiling=0, padding=0, closePath=true)=>{

    // init
    let points            = []
    let width             = 0
    let height            = 0
    let widthIncrament    = 100 / dataPts.length
    let verticalIncrament = 1

    // start the line flush left
    if (closePath) points.push(new Point(0, -10))

    // add all the points.. A day that wasn't collected (`{ count: null }` or a
    // bare null) keeps its x slot but plots nothing: it splits the known points
    // into runs, so the line breaks there instead of reading as a zero (c103).
    let runs = [[]]
    for ( let pt of dataPts ){
      if (pt == null || pt.count == null) {
        if (runs[runs.length - 1].length) runs.push([])
        width += widthIncrament
        continue
      }
      let ptHeight = pt.count * verticalIncrament
      height = height > ptHeight ? height : ptHeight
      let point = new Point(width, ptHeight)
      points.push( point )
      runs[runs.length - 1].push( point )
      width += widthIncrament
    }
    runs = runs.filter((r) => r.length)
    const gapped = runs.length > 1 || points.length < dataPts.length

    // remove the extra space at the end
    width -= widthIncrament

    // end flush right
    if (closePath) points.push(new Point(width + 10, -1))

    // If we're showing multiple charts, calibrate to tallest value
    if( ceiling > height )
      height = ceiling

    // Give a bit of padding. Knowing the final aspect ratio is helpful here,
    // currently, I'm giving the y axis extra padding because it gets
    // shrunk down the most. Might be good to revisit if this proves
    // to be problematic
    let Ypadding = padding*8
    let Xpadding = padding*2

    const result = {
      viewBox : `${-Xpadding} ${-Ypadding * 0.5} ${width+Xpadding*2} ${height + Ypadding}`,
      points  : svgMachine.compile(points)
    }

    // With gaps, draw per run instead of `points`: each run of two or more
    // known days is its own line (`lines`, the top edge only) and, for a fill,
    // its own area closed to the baseline at the run's ends (`segments`); a
    // lone known day between gaps is a dot. No gaps → no change.
    if (gapped) {
      const multi = runs.filter((r) => r.length > 1)
      result.lines = multi.map((r) => svgMachine.compile(r))
      result.segments = closePath
        ? multi.map((r) => svgMachine.compile([new Point(r[0].x, 0), ...r, new Point(r[r.length - 1].x, 0)]))
        : []
      result.dots = runs.filter((r) => r.length === 1).map((r) => r[0])
    }
    return result
  }

}
