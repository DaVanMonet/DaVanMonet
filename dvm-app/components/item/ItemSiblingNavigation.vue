<template>
  <div v-if="showNavigation">
    <div class="item__footer-navigation">
      <template v-if="previousItem">
        <div class="item__footer-navigation-link item__footer-navigation-link--previous">
          <small>Previous</small>
          <router-link
            :to="previousItem.Href"
            class="heading heading--regular">{{ previousItem.Title }}</router-link>
        </div>
      </template>

      <template v-if="nextItem">
        <div class="item__footer-navigation-link item__footer-navigation-link--next">
          <small>Next</small>
          <router-link
            :to="nextItem.Href"
            class="heading heading--regular">{{ nextItem.Title }}</router-link>
        </div>
      </template>
    </div>
  </div>
</template>

<script>

export default {
  name: 'item-sibling-navigation',
  props: ['nextItem', 'previousItem'],
  computed: {
    showNavigation() { return this.nextItem || this.previousItem; },
  },
};
</script>
