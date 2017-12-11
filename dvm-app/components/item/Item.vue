<template>
  <article class="item">
    <item-header
      :key="itemData.ItemId"
      :title="itemData.Title"
      :preamble="itemData.Preamble"
      :relatedItems="relatedItemsData">
    </item-header>

    <template v-if="itemTabs && itemTabs.length">
      <item-richtext v-if="itemContent" :content="itemContent"></item-richtext>

      <tabs class="tabset" :key="itemId">
        <tab v-for="itemTab in itemTabs" :name="itemTab.Title" :key="itemTab.ItemId">
          <component v-if="itemTab.Component" :is="itemTab.Component" :item="itemData"></component>
          <item-richtext v-if="itemTab.Content" :content="itemTab.Content"></item-richtext>

          <template v-if="itemTab.ComponentItems">
            <div v-if="itemTab.Content" class="divider mb-4 pb-5"></div>
            <component-repo-select :parentId="itemId"></component-repo-select>
            <component-showcase v-for="componentItem in orderedComponentItems(itemTab.ComponentItems)" :key="componentItem.Title" :showcase-data="componentItem" :itemKey="componentItem.Key"></component-showcase>

            <template v-if="MOCK_CONFIG.SHOW_COMPONENT_CURRENT_STATUS">
              <div class="divider mb-4 pb-5"></div>
              <component-status></component-status>
            </template>
          </template>
        </tab>
      </tabs>
    </template>

    <template v-else-if="itemContent">
      <div class="divider"></div>
      <item-richtext :content="itemContent"></item-richtext>
    </template>

    <template v-if="feedVisible">
      <div class="divider mt-5 mb-2"></div>
      <item-feed :items="itemChildItems" :key="itemData.ItemId"></item-feed>
    </template>

    <item-footer
      :createdDate="itemData.CreatedDateTime"
      :updatedDate="itemData.UpdatedDateTime"
      :authorName="itemData.Author"
      :itemKey="itemData.Key"
      authorEmail="namn.namnsson@seb.se">
      <item-sibling-navigation v-if="itemParent" :nextItem="nextSiblingItem" :previousItem="previousSiblingItem"></item-sibling-navigation>
    </item-footer>
  </article>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex';

import MOCK_CONFIG from '@/config/mock';
import { slugify } from '@/utils';
import getCustomTabsForPath from '@/utils/get-custom-tabs-for-path';

import store from '@/store';
import ItemHeader from '@/components/item/ItemHeader';
import ItemFooter from '@/components/item/ItemFooter';
import ItemRichtext from '@/components/item/ItemRichtext';
import ItemFeed from '@/components/feed/ItemFeed';
import ItemSiblingNavigation from '@/components/item/ItemSiblingNavigation';
import ComponentShowcase from '@/components/component/ComponentShowcase';
import ComponentStatus from '@/components/component/ComponentStatus';
import ComponentRepoSelect from '@/components/component/ComponentRepoSelect';
import ColorSwatches from '@/components/ColorSwatches';

export default {
  name: 'item',
  components: {
    ItemFeed,
    ItemHeader,
    ItemRichtext,
    ItemFooter,
    ItemSiblingNavigation,
    ComponentShowcase,
    ComponentStatus,
    ComponentRepoSelect,
  },
  data() {
    return {
      itemCustomTabs: [],
      selectedRepos: [],
      MOCK_CONFIG: {},
    };
  },
  computed: {
    ...mapState({ repos:'repos' }),
    ...mapGetters({
      itemIdForPath: 'itemIdForPath',
      navigationParentForId: 'navigationParentForId',
      navigationActiveParentId: 'navigationActiveParentId',
      // repos: 'repos',
    }),
    itemId() {
      return this.itemIdForPath(this.$route.path);
    },
    itemParent() {
      return this.navigationParentForId(this.itemId);
    },
    itemSiblings() {
      return this.itemParent.Items;
    },
    itemData() {
      return store.getters.itemDataForId(this.itemId) || {};
    },
    itemTabs() {
      if (this.itemData.Tabs) {
        return this.itemData.Tabs.concat(this.itemCustomTabs);
      }

      return this.itemData.Tabs;
    },
    itemContent() {
      return this.itemData.Content;
    },
    itemChildItems() {
      return this.itemData.Items;
    },
    nextSiblingItem() {
      let nextSiblingItem;

      this.itemSiblings.forEach((siblingItem, index) => {
        if (this.itemId === siblingItem.ItemId) {
          nextSiblingItem = this.itemSiblings[index + 1];
        }
      });

      return nextSiblingItem;
    },
    previousSiblingItem() {
      let previousSiblingItem;

      this.itemSiblings.forEach((siblingItem, index) => {
        if (this.itemId === siblingItem.ItemId) {
          previousSiblingItem = this.itemSiblings[index - 1];
        }
      });

      return previousSiblingItem;
    },
    relatedItemsData() {
      const related = [];
      if(this.itemData.Tags && this.itemData.Tags.length > 0) {
        related.push({
          "Title": "Tags",
          "Links": this.tagLinks
        });
      }
      return related;
    },
    tagLinks() {
      return this.itemData.Tags.map(tag => {
        tag.Href = '/tags/' + slugify(tag.Title);
        return tag;
      });
    },
    feedVisible() {
      const showChildItems = this.itemData.ShowChildItems && this.itemChildItems;
      const hasNoOwnContent = (this.itemTabs && this.itemTabs.length === 0) && !this.itemContent;
      return hasNoOwnContent ? true : showChildItems;
    },
  },
  methods: {
    ...mapActions({
      fetchItemData: 'fetchItemData',
      fetchRepos: 'fetchRepos',
    }),
    updateComponentData() {
      this.itemCustomTabs = getCustomTabsForPath(this.$route.path);

      this.fetchItemData(this.itemId);
    },
    orderedComponentItems(originalItems)
    {
      let items = originalItems.concat([]);
      items.sort((a, b) =>
      {
        if(typeof a.VariantId === "string")
        {
          var variantIdA = a.VariantId.toUpperCase(); // ignore upper and lowercase
          var variantIdB = b.VariantId.toUpperCase(); // ignore upper and lowercase
          if (variantIdA < variantIdB)
          {
            return -1;
          }
          if (variantIdA > variantIdB)
          {
            return 1;
          }
        }

        // names must be equal
        return 0;
      });

      return items;
    },
  },
  watch: {
    '$route.path': function() {
      this.updateComponentData();
    },
  },
  created() {
    this.MOCK_CONFIG = MOCK_CONFIG;

    this.fetchRepos();
    this.updateComponentData();
  },
};
</script>
