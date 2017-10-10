<template>
<nav v-if="navigation && navigation.length > 0" class="davanmonet-nav">
    <navigation-list :items="navigation" :source-directory="sourceDirectory" :level="1"></navigation-list>
  </nav>
</template>

<script>
module.exports = {
  name: 'navigation',
  components:
  [
    "url:/vuecomponents/NavigationList.vue"
  ],
  props: ['navigation', 'sourceDirectory']
};
</script>
