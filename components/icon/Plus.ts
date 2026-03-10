import  { createElementVNode, openBlock, createElementBlock } from 'vue'


export default function render() {
  return (openBlock(), createElementBlock("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 12 12",
    fill: "currentColor",
    "aria-hidden": "true"
  }, [
    createElementVNode("path", { d: "M10.98,4.99h-3.99V1c0-.55-.45-1-1-1s-1,.45-1,1v3.99H1c-.55,0-1,.45-1,1s.45,1,1,1h3.99v3.99c0,.55,.45,1,1,1s1-.45,1-1v-3.99h3.99c.55,0,1-.45,1-1s-.45-1-1-1Z" }),
  ]))
}
