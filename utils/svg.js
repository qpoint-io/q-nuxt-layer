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

  // Build a simple chart from the raw data we get from the server
  sparkChart:(dataPts, ceiling=0, padding=0)=>{

    // init
    let points            = []
    let width             = 0
    let height            = 0
    let widthIncrament    = 100 / dataPts.length
    let verticalIncrament = 1

    // start the line flush left
    points.push(new Point(0, -10))

    // add all the points..
    for ( let pt of dataPts ){
      let ptHeight = pt.count * verticalIncrament
      height = height > ptHeight ? height : ptHeight
      points.push( new Point(width, ptHeight) )
      width += widthIncrament
    }

    // remove the extra space at the end
    width -= widthIncrament

    // end flush right
    points.push(new Point(width + 10, -1))

    // If we're showing multiple charts, calibrate to tallest value
    if( ceiling > height )
      height = ceiling

    // Give a bit of padding. Knowing the final aspect ratio is helpful here,
    // currently, I'm giving the y axis extra padding because it gets
    // shrunk down the most. Might be good to revisit if this proves
    // to be problematic
    let Ypadding = padding*8
    let Xpadding = padding*2

    return {
      viewBox : `${-Xpadding} ${-Ypadding * 0.5} ${width+Xpadding*2} ${height + Ypadding}`,
      points  : svgMachine.compile(points)
    }
  }

}
