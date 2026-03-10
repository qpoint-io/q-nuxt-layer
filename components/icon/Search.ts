import  { createElementVNode, openBlock, createElementBlock } from 'vue'

export default function render() {
  return (openBlock(), createElementBlock("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 18 18",
    stroke: "currentColor",
    fill:"none",
    "stroke-width" : "2px",
    "aria-hidden": "true"
  }, [
    createElementVNode("circle", {cx:"7.49", cy:"7.49", r:"6.49"}),
    createElementVNode("line",   {x1:"12.13", y1:"12.13", x2:"17.03", y2:"17.03"}),
  ]))
}
