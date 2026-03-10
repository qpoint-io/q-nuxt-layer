import  { createElementVNode, openBlock, createElementBlock } from 'vue'


export default function render() {
  return (openBlock(), createElementBlock("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 21 13",
    stroke: "currentColor",
    "aria-hidden": "true"
  }, [
    createElementBlock("g", {
      "stroke-width": "2",
      "stroke-linecap": "round",
      "transform": "translate(1, 0.471500)"
    },  [
      createElementVNode("line", { x1:"1" ,y1:"11.49" ,x2:"9.33" ,y2:"11.49" }),
      createElementVNode("line", { x1:"13.4" ,y1:"11.49" ,x2:"16.36" ,y2:"11.49" }),
      createElementVNode("line", { x1:"7.86" ,y1:"6.24" ,x2:"10.81" ,y2:"6.24" }),
      createElementVNode("line", { x1:"1" ,y1:"6.24" ,x2:"3.96" ,y2:"6.24" }),
      createElementVNode("line", { x1:"15.12" ,y1:"1" ,x2:"20.02" ,y2:"1" }),
      createElementVNode("line", { x1:"1" ,y1:"1" ,x2:"10.81" ,y2:"1" }),
    ])
  ]))
}
