import  { createElementVNode, openBlock, createElementBlock } from 'vue'


export default function render() {
  return (openBlock(), createElementBlock("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 11 11",
    fill: "none",
    stroke: "currentColor",
    "stroke-miterlimit":"10",
    "stroke-linecap":"round",
    "stroke-width": "2",
    "aria-hidden": "true"
  }, [
    createElementVNode("path", { d: "M1 9.63L9.63 1" }),
    createElementVNode("path", { d: "M9.62986 8.02V1H2.60986" })
  ]))
}
