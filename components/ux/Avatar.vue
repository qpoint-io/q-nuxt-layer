<template>
  <div
    class="border-2  rounded-full font-bold  text-center grid items-center justify-center flex-shrink-0 select-none hover:text-primary cursor-pointer"
    :class="[ pending ? 'border-content-muted border-dashed' : 'border-content hover:border-primary' ,
              (size == 'small')? 'w-9 h-9 text-18' : 'w-11 h-11 text-21'
    ]">
    {{ initials }}
  </div>
</template>

<script setup>
const props = defineProps({
  name:{type:String, required:true},
  pending:{type:Boolean, default:false},
  size:{type:String, default:'reg'},
})

const initials = computed(()=>{
  let ar = props.name.split(' ')
  if(ar.length == 1)
    return ar[0].charAt(0)

  return `${ar[0].charAt(0)}${ar[ar.length-1].charAt(0)}`
})

</script>
