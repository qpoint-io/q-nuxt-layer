import  { createElementVNode, openBlock, createElementBlock } from 'vue'


export default function render() {
  return (openBlock(), createElementBlock("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 22 22",
    stroke: "currentColor",
    "aria-hidden": "true"
  }, [
    createElementBlock("g", {
      "stroke-width": "2",
      "stroke-linecap": "round",
      "transform": "translate(1, 0.471500)"
    }, [
      createElementVNode("line", { x1:"18", y1:"0", x2:"0", y2:"18" }),
      createElementVNode("line", { x1:"18", y1:"18", x2:"0", y2:"0" })
    ])
  ]))
}
