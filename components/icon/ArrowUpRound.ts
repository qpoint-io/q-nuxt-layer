import  { createElementVNode, openBlock, createElementBlock } from 'vue'


export default function render() {
  return (openBlock(), createElementBlock("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 13 10",
    fill: "currentColor",
    "aria-hidden": "true"
  }, [
    createElementVNode("path", { d:"M1036.53027,307 L1026.46932,307 C1025.30655,307 1024.60584,305.796484 1025.23822,304.883603 L1030.26869,297.625342 C1030.84701,296.791553 1032.15359,296.791553 1032.73191,297.625342 L1037.76239,304.883603 C1038.39375,305.796484 1037.69303,307 1036.53027,307" })
  ]))
}
