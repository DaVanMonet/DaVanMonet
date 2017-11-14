<template>
  <div class="component_showcase_csslinks" v-if="csslinks">
    <link v-for="href in csslinks" :href="href" rel="stylesheet" type="text/css" disabled data-previewcss/>
  </div>
</template>

<script>
module.exports =  {
  name: 'component-showcase-csslinks',
  props: ["csslinks"]
};
</script>
