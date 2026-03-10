import  { createElementVNode, openBlock, createElementBlock } from 'vue'


export default function render() {
  return (openBlock(), createElementBlock("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 67 57",
    fill: "currentColor",
    "aria-hidden": "true"
  }, [
    createElementVNode("path", { d: "M53.38,15.33c-.53-1.03-1.11-2.02-1.76-2.97-.22-.4-.34-.63-.34-.63v.16C46.16,4.7,37.76,0,28.26,0,12.65,0,0,12.65,0,28.26s12.65,28.26,28.26,28.26c9.51,0,17.91-4.7,23.03-11.89v.16s.11-.23.33-.62c.67-.98,1.27-2.01,1.81-3.07,2.75-4.32,7.77-10.89,12.96-10.89v-3.96c-5.22,0-10.27-6.61-13.01-10.91Z" })
  ]))
}
