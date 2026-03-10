<!-- TODO : place this into the Xaxis class -->
<template>
  <div class="w-full h-full flex">

    <!-- Labels -->
    <div v-if="linesAr.labels && showLabels"
      class="absolute flex justify-between w-full items-center text-12"
      :class="placeLabelsBottom? 'place-bottom' : 'place-top'"
    >
      <div v-for="(label, index) in linesAr.labels" :key="index">
        {{ label }}
      </div>
    </div>

    <!-- Vertical Lines -->
    <div
      v-for="count in linesAr.totalSections" :key="count"
      class="flex justify-between w-full"
    >
      <div
        v-for="(line, index) in linesAr.section" :key="index"
        class="border-l-1 border-l-black/20"
        :class="`border-l-${line}`"
      />
    </div>
  </div>
</template>

<style scoped>
  .place-bottom{
    bottom: -40px
  }
  .place-top{
    top: -30px
  }
</style>

<script setup>
  const props = defineProps({
    timeframe        : {type:String,  default: Time.week},
    showLabels       : {type:Boolean, default: true},
    placeLabelsBottom: {type:Boolean, default: false}
  })

  const linesAr = computed(()=>{
    if (props.timeframe == Time.fifteen) {
      return {
        totalSections: 1,
        section: [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      }
    }

    if (props.timeframe == Time.hour) {
      return {
        totalSections: 1,
        section: [1,1,1,1,1,1,1,1,1,1,1,1,1]
      }
    }

    if (props.timeframe == Time.day) {
      return {
        totalSections: 4,
        section: [2,1,1,1,1,1,1],
        labels: getDayLabels()
      }
    }

    if (props.timeframe == Time.week) {
      return {
        totalSections: 1,
        section: [1,1,1,1,1,1,1,1],
        labels: getWeekLabels()
      }
    }

    if (props.timeframe == Time.month) {
      return {
        totalSections: 3,
        section: [1,1,1,1,1,1,1,1,1,1],
        labels: getMonthLabels()
      }
    }
  })

  const getDayLabels = ()=>{
    let start     = timeFrameToStart( Time.day )
    let startDate = new Date( start * 1000 )
    var hours     = []

    for(let i = 0; i < 4; i++){
      hours.push( getShortHour(startDate) )
      startDate.setHours(startDate.getHours() + 6)
    }
    hours.push('Now')
    return hours;
  }

  const getWeekLabels = ()=>{
    let start     = timeFrameToStart( Time.week )
    let startDate = new Date(start * 1000 )
    var weekDays  = []

    for(let i = 0; i < 8; i++){
      let day = startDate.toLocaleDateString('en', { weekday: 'short' })
      weekDays.push( day.substring(0,2) )
      startDate.setDate(startDate.getDate() + 1)
    }
    return weekDays;
  }

  const getMonthLabels = ()=>{
    let start     = timeFrameToStart( Time.month )
    let startDate = new Date(start * 1000 )
    var days  = []

    for(let i = 0; i < 30; i++){
      days.push( startDate.getDate() )
      startDate.setDate(startDate.getDate() + 1)
    }
    return days;
  }

  const getShortHour = (date)=>{
    let hour = date.getHours()
    let ampm = hour >= 12 ? 'pm' : 'am'

    hour = hour % 12
    hour = hour ? hour : 12  // the hour '0' should be '12'
    return `${hour}${ampm}`
  }
</script>
