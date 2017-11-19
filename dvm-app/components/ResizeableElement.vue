<template>
  <div class="resizeable-element" :style="[size]">
    <div v-if="size.width && size.height" :class="{ 'resizeable-element__size--is-visible': isSizeElementVisible }" class="resizeable-element__size">{{ size.width }} × {{ size.height }}</div>
    <slot></slot>
    <div class="resizeable-element__button">
      <div @mousedown="onDragAreaMousedown($event)" @mouseup="onDragAreaMouseup()" class="resizeable-element__drag-area"></div>
    </div>
  </div>
</template>

<script>
import { clampInt } from '@/src/utils';

export default {
  name: 'resizeable-element',
  data() {
    return {
      sizeWidth: undefined,
      sizeHeight: undefined,
      minWidth: 100, // TODO: Arbitrary for now, think of logic for this?
      minHeight: 100, // TODO: Arbitrary for now, think of logic for this?
      maxWidth: Number.MAX_SAFE_INTEGER,
      maxHeight: Number.MAX_SAFE_INTEGER,
      isSizeElementVisible: false,
      sizeElementVisibilityTimeoutDuration: 1000,
    };
  },
  computed: {
    size() {
      function addSizeUnit(size) {
        // Return size immediately if it contains '%'-unit,
        // otherwise assume and append 'px'
        return String(size).indexOf('%') >= 0 ? size : `${size}px`;
      };

      return {
        width: this.sizeWidth ? addSizeUnit(this.sizeWidth) : undefined,
        height: this.sizeHeight ? addSizeUnit(this.sizeHeight) : undefined,
      };
    },
  },
  methods: {
    onDragAreaMousedown(event) {
      this.setInitialSizeConstraints();
      this.setSizeElementVisible();

      this.lastClientX = event.clientX;
      this.lastClientY = event.clientY;

      window.addEventListener('mousemove', this.onMouseMove, { passive: true });

      window.addEventListener('mouseup', () => {
        window.removeEventListener('mousemove', this.onMouseMove, { passive: true });
      }, { passive: true });
    },
    onDragAreaMouseup() {
      // TODO: Handle case if this.$el is larger than its parent?
    },
    onMouseMove(event) {
      this.setSizeElementVisible();

      // Multiply mouseDeltaX with a factor 2 because ResizeableElement is centered in its parent
      const mouseDeltaX = (event.clientX - this.lastClientX) * 2;
      const mouseDeltaY = event.clientY - this.lastClientY;

      const sizeWidth = this.sizeWidth === '100%' ? this.$el.offsetWidth : this.sizeWidth;
      const sizeHeight = this.sizeHeight === '100%' ? this.$el.offsetHeight : this.sizeHeight;

      this.sizeWidth = clampInt(sizeWidth + mouseDeltaX, this.minWidth, this.maxWidth);
      this.sizeHeight = clampInt(sizeHeight + mouseDeltaY, this.minHeight, this.maxHeight);

      this.lastClientX = event.clientX;
      this.lastClientY = event.clientY;
    },
    onWindowResize() {
      const parentWidth = this.$el.parentNode.offsetWidth;

      if (parentWidth < this.sizeWidth) {
        this.sizeWidth = parentWidth;
      }
    },
    setWidth(width) {
      this.setInitialSizeConstraints();
      this.setSizeElementVisible();

      this.sizeWidth = clampInt(width, this.minWidth, this.maxWidth);
    },
    setHeight(height) {
      this.setInitialSizeConstraints();
      this.setSizeElementVisible();

      this.sizeHeight = clampInt(height, this.minHeight, this.maxHeight);
    },
    setInitialSizeConstraints() {
      const parentWidth = this.$el.parentNode.offsetWidth;
      const parentHeight = this.$el.parentNode.offsetHeight;

      this.maxWidth = parentWidth;
      this.maxHeight = Math.max(parentHeight, this.maxHeight);

      if (!this.sizeWidth) { this.sizeWidth = parentWidth; }

      if (!this.sizeHeight) { this.sizeHeight = parentHeight; }
    },
    setSizeElementVisible() {
      if (!this.size.width || !this.size.height) { return; }

      if (this.sizeElementVisibilityTimeout) {
        clearTimeout(this.sizeElementVisibilityTimeout);
      }

      this.isSizeElementVisible = true;

      this.sizeElementVisibilityTimeout = setTimeout(() => {
        this.isSizeElementVisible = false;
      }, this.sizeElementVisibilityTimeoutDuration);
    },
  },
  watch: {
    sizeWidth(value) { this.$emit('onWidthChange', value); },
  },
  created() {
    window.addEventListener('resize', this.onWindowResize, { passive: true });
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onWindowResize, { passive: true });
  },
};
</script>
