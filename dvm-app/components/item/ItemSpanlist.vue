<template>
  <ul class="spanlist">
    <li v-for="(listItem, index) in listItems">
      <figure class="figure">
        <div class="figure__image" v-html="listItem.image"></div>
        <figcaption class="figure__figcaption">
          {{ listItem.caption }}
        </figcaption>
      </figure>
    </li>
  </ul>
</template>

<script>
//import { toArray } from '@/utils';

export default {
  name: 'item-spanlist',
  props: ['html'],
  data: function() {
    return {
      listItems: [],
    };
  },
  created() {
    const listEls = Array.prototype.slice.call(this.html.querySelectorAll('li'));

    listEls.forEach((listEl, index) => {
      const caption = listEl.querySelector('figcaption');
      const image = listEl.querySelector('img');

      if (image) {
        image.removeAttribute('height');
        image.removeAttribute('width');
      }

      this.$set(this.listItems, index, {
        image: image ? image.outerHTML : undefined,
        caption: caption ? caption.innerHTML : undefined,
      });
    });
  },
};
</script>
