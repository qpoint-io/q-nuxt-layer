// health algorithms
// When hot, they return true

export const healthModes = {

  // hot if value is anything besides zero
  ZERO_TOLERANCE : function(value){
    return (value >  0)
  },
  // never hot, always return false
  NEVER_HOT : function(value){
    return false
  },

  // must be greater than 99.999
  FIVE_NINES : function(value){
    return (value < 99.999)
  },

  // TODO : grab user preferences for defining a slow request
  SLOW_REQUEST : function(value){
    return (value > 500)
  }
}


// @value      The number to evaluate
// @evaluator  The logic used to derive health
export function isHot(value, evaluator) {

  // if evaluator is a function, call it
  if(typeof evaluator == Function)
    return evaluator(value)

  throw('Evaluator is not a function')
}
