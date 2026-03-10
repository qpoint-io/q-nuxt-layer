import  { createElementVNode, openBlock, createElementBlock } from 'vue'

export default function render() {
  return (openBlock(), createElementBlock("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 17 17",
    fill: "currentColor",
    "aria-hidden": "true"
  }, [
    createElementVNode("rect", { x:".53", y:"6.01", width:"17.81", height:"2", transform:"translate(-2.19 8.72) rotate(-45)" }),
    createElementVNode("polygon", { points:"0 16.51 1.72 16.51 0 14.34 0 16.51" }),
  ]))
}
