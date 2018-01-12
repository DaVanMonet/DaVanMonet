<template>
  <header class="item__header">
    <h2 class="item__subheading heading heading--small">{{ subtitle }}</h2>
    <h1 class="heading heading--large">{{ title }}</h1>
    <div class="row">
      <div class="col-md-8 col-sm-12">
        <p class="heading heading--small">{{ preamble }}</p>
      </div>

      <div class="col-md-3 offset-md-1 col-sm-12">
        <aside class="item__header-related-items">
          <div v-for="relatedItemsList in relatedItems" :key="relatedItemsList.Title">
            <h4 class="heading heading--inline">{{ relatedItemsList.Title }}</h4>
            <ul class="item__header-related-items-list">
              <li v-for="relatedItemListLink in relatedItemsList.Links">
                <router-link :to="relatedItemListLink.Href">{{ relatedItemListLink.Title }}</router-link>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  </header>
</template>

<script>
import store from '@/store';
import { slugify, deSlugify } from '@/utils';
import ItemRichtext from '@/components/item/ItemRichtext';

export default {
  name: 'item-header',
  components: { ItemRichtext },
  props: {
    title: String,
    subtitle: {
      type: String,
      default: () => {
        return deSlugify(slugify(store.getters.parentRoutePath));
      },
    },
    preamble: String,
    relatedItems: Array,
  },
};
</script>
