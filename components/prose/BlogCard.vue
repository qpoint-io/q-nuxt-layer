<template>
  <NuxtLink
    :to="`/blog/${post.slug}`"
    class="flex flex-col text-content rounded-0 border-b border-b-stroke py-3 overflow-hidden cursor-pointer group hover:rounded-lg hover:text-grape-500 transition-all duration-200"
  >
    <h3 class="text-18 text-content mt-2 mb-1 group-hover:text-grape-500 transition-colors">{{ post.title }}</h3>
    <p v-if="post.description" class="text-14 text-content-muted mb-2 line-clamp-2">{{ post.description }}</p>
    <ProseBlogAuthor
      :person="author"
      :name="post.author || 'QPoint Team'"
      :publishDate="formattedDate(post.date)"
      :img="post.authorImage"
    />
  </NuxtLink>
</template>

<script setup>
const props = defineProps({
  post: { type: Object, required: true },
  author: { type: Object, default: null },
})

const formattedDate = (date) => {
  if (!date) return ''

  // Ensure YYYY-MM-DD strings aren't shifted by timezone during rendering
  const [year, month, day] = date.split('-').map(Number)
  const dateObj = Number.isFinite(year) && Number.isFinite(month) && Number.isFinite(day)
    ? new Date(year, month - 1, day)
    : new Date(date)

  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>
