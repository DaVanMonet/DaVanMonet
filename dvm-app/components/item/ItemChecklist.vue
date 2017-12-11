<template>
  <ul class="checklist">
    <li v-for="(listItem, index) in listItems">
      <div class="input-checkbox">
        <input type="checkbox" :name="`checklist-item-${index}`" :id="`checklist-item-${index}`">
        <label class="input-checkbox__label" :for="`checklist-item-${index}`">
          <div class="input-checkbox__label-checkbox">
            <div class="input-checkbox__label-checkbox-checkmark"></div>
          </div>
          <p>{{ listItem.text }}</p>
        </label>
      </div>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'item-checklist',
  props: ['html'],
  data() {
    return {
      listItems: [],
    };
  },
  created() {
    const listEls = Array.prototype.slice.call(this.html.querySelectorAll('li'));

    listEls.forEach((listEl, index) => {
      this.$set(this.listItems, index, { text: listEl.innerHTML });
    });
  },
};
</script>
