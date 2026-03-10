import  { createElementVNode, openBlock, createElementBlock } from 'vue'


export default function render() {
  return (openBlock(), createElementBlock("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 3 15.5",
    stroke: "currentColor",
    "aria-hidden": "true"
  }, [
    createElementBlock("g", {
      "stroke-width": "3",
      "stroke-linecap": "round",
      "transform": "translate(1, 0.471500)"
    },  [
      createElementVNode("line", { x1:"1" ,y1:"13" ,x2:"1" ,y2:"14.46" }),
      createElementVNode("line", { x1:"1" ,y1:"1" ,x2:"1" ,y2:"8.24" }),
    ])
  ]))
}
