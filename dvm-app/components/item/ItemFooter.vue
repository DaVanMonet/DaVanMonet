<template>
  <div class="item__footer-wrapper">
    <footer v-if="$slots.default || authorName" class="item__footer">
      <div class="item__footer-meta">
        <p v-if="authorName" class="item__footer-created-modified">
          Created <template v-if="createdDate">{{ createdDate }}</template> by <a :href="`mailto:${authorEmail}`">{{ authorName }}</a><template v-if="updatedDate">, latest update {{ updatedDate }}</template>.
        </p>

        <p v-if="itemKey" class="item__footer-identifier">
          Article identifier:
          <copy-to-clipboard title="Copy to clipboard" :copy-data="itemKey">
            <a href="javascript:;">{{ itemKey }}</a>
          </copy-to-clipboard>
        </p>
      </div>

      <slot></slot>
    </footer>
  </div>
</template>

<script>
import CopyToClipboard from '@/components/CopyToClipboard';

export default {
  name: 'item-footer',
  props: {
    createdDate: String,
    updatedDate: String,
    authorName: String,
    authorEmail: String,
    itemKey: String,
  },
  components: { CopyToClipboard },
};
</script>
