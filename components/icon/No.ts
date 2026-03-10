import  { createElementVNode, openBlock, createElementBlock } from 'vue'

export default function render() {
  return (openBlock(), createElementBlock("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 6 15 15",
    stroke: "currentColor",
    fill:"none",
    "aria-hidden": "true"
  }, [
    createElementVNode("circle", { cx:"7.19791667", cy:"13", r:"5", 'stroke-width':1.8  }),
    createElementVNode("line", { x1:"13.0104167", y1:"7", x2:"0.885416667", y2:"19", 'stroke-linecap':"round", 'stroke-width':1.8 }),
  ]))
}
