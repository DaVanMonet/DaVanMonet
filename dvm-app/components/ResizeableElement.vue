<template>
<div>
  <div v-if="size.width && size.height" :class="{ 'resizeable-element__size--is-visible': isSizeElementVisible }" class="resizeable-element__size">{{ size.width }} × {{ size.height }}</div>
  <div class="resizeable-element__wrapper">
    <div class="resizeable-element" :style="[size]">
      <slot></slot>
      <div class="resizeable-element__button">
        <div @mousedown="onDragAreaMousedown($event)" class="resizeable-element__drag-area"></div>
      </div>
    </div>
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

      event.preventDefault();
      event.stopPropagation();

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
      //const mouseDeltaY = event.clientY - this.lastClientY;

      const sizeWidth = this.sizeWidth === '100%' ? this.$el.offsetWidth : this.sizeWidth;
      //const sizeHeight = this.sizeHeight === '100%' ? this.$el.offsetHeight : this.sizeHeight;

      this.sizeWidth = clampInt(sizeWidth + mouseDeltaX, this.minWidth, this.maxWidth);
      //this.sizeHeight = clampInt(sizeHeight + mouseDeltaY, this.minHeight, this.maxHeight);

      this.lastClientX = event.clientX;
      //this.lastClientY = event.clientY;

      return false;
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

      this.maxWidth = parentWidth - 2;
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
  mounted() {
    this.$on('register-iframe', iframe => {
      
      // Save any previous onmousemove handler
      var existingOnMouseMove = iframe.contentWindow.onmousemove;

      // Attach a new onmousemove listener
      iframe.contentWindow.onmousemove = function(e){
          // Fire any existing onmousemove listener 
          if(existingOnMouseMove) existingOnMouseMove(e);

          // Create a new event for the this window
          var evt = document.createEvent("MouseEvents");

          // We'll need this to offset the mouse move appropriately
          var boundingClientRect = iframe.getBoundingClientRect();

          // Initialize the event, copying exiting event values
          // for the most part
          evt.initMouseEvent( 
              "mousemove",
              true, // bubbles
              false, // not cancelable 
              window,
              e.detail,
              e.screenX,
              e.screenY, 
              e.clientX + boundingClientRect.left, 
              e.clientY + boundingClientRect.top, 
              e.ctrlKey, 
              e.altKey,
              e.shiftKey, 
              e.metaKey,
              e.button, 
              null // no related element
          );

          // Dispatch the mousemove event on the iframe element
          iframe.dispatchEvent(evt);
      };

      var existingOnMouseUp = iframe.contentWindow.onmousemove;
      iframe.contentWindow.onmouseup = function(e) {
          // Fire any existing onmousemove listener 
          if(existingOnMouseUp) existingOnMouseUp(e);

          // Create a new event for the this window
          var evt = document.createEvent("MouseEvents");

          // We'll need this to offset the mouse move appropriately
          var boundingClientRect = iframe.getBoundingClientRect();

          // Initialize the event, copying exiting event values
          // for the most part
          evt.initMouseEvent( 
              "mouseup",
              true, // bubbles
              false, // not cancelable 
              window,
              e.detail,
              e.screenX,
              e.screenY, 
              e.clientX + boundingClientRect.left, 
              e.clientY + boundingClientRect.top, 
              e.ctrlKey, 
              e.altKey,
              e.shiftKey, 
              e.metaKey,
              e.button, 
              null // no related element
          );

          // Dispatch the mousemove event on the iframe element
          iframe.dispatchEvent(evt);
      };

    });
  }
};
</script>

<style lang="less">

@import '../styles/colors';

.resizeable-element {
  position: relative;
  box-shadow: 0 0 20px rgba(0,0,0,0.3);
  background: #fff;  
}

  .resizeable-element__wrapper {
    display: flex;
    justify-content: center;
    background-color: @showcase--background-color;
    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQyIDc5LjE2MDkyNCwgMjAxNy8wNy8xMy0wMTowNjozOSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo3RjBGQjlDRkRGRkYxMUU3OTJGREU1MEJCRUUwRjlGOSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo3RjBGQjlEMERGRkYxMUU3OTJGREU1MEJCRUUwRjlGOSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjdGMEZCOUNEREZGRjExRTc5MkZERTUwQkJFRTBGOUY5IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjdGMEZCOUNFREZGRjExRTc5MkZERTUwQkJFRTBGOUY5Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8++xe3QgAAAC1JREFUeNpifP/+PQM2ICAggFWciYFEMKqBGMD4//9/rBIfPnwYDSX6aQAIMADiqwjp8c8LDwAAAABJRU5ErkJggg==');
    line-height: inherit;
    border: 1px solid @color--grey;
    border-bottom: none;
    overflow: hidden;

    &:after { display: none; }
  }

  .resizeable-element__size {
    transition: opacity 0.3s ease;
    opacity: 0;
    position: absolute;
    z-index: 10;
    top: -1.5rem;
    right: 0rem;
    color: darken(@color--grey, 20%);
    white-space: nowrap;
    pointer-events: none;

    &.resizeable-element__size--is-visible {
      opacity: 1;
      pointer-events: all;
    }
  }

  .resizeable-element__button {
    transition: opacity 0.15s ease;
    opacity: 0;
    position: absolute;
    z-index: 10;
    bottom: 0;
    right: 0px;
    width: 14px;
    height: 100%;
    cursor: ew-resize;
    background: #eee;

    /* Permalink - use to edit and share this gradient: http://colorzilla.com/gradient-editor/#e5e5e5+0,ffffff+100 */
    background: #eeeeee; /* Old browsers */
    background: -moz-linear-gradient(left, #eeeeee 0%, #fafafa 100%); /* FF3.6-15 */
    background: -webkit-linear-gradient(left, #eeeeee 0%,#fafafa 100%); /* Chrome10-25,Safari5.1-6 */
    background: linear-gradient(to right, #eeeeee 0%,#fafafa 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#eeeeee', endColorstr='#fafafa',GradientType=1 ); /* IE6-9 */

    &:after {
      display: block;
      content: '';
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      left: 5px;
      width: 2px;
      height: 20px;
      border-left: 1px #999 solid;
      border-right: 1px #999 solid;
      pointer-events: none;
      opacity: 0.9;
      //background-image: url(data:image/svg+xml,%0A%3Csvg%20width%3D%2223px%22%20height%3D%2223px%22%20viewBox%3D%220%200%2023%2023%22%20version%3D%221.1%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20xmlns%3Axlink%3D%22http%3A//www.w3.org/1999/xlink%22%3E%0A%20%20%20%20%3Cg%20id%3D%22Page-1%22%20stroke%3D%22none%22%20stroke-width%3D%221%22%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%20stroke-linecap%3D%22square%22%3E%0A%20%20%20%20%20%20%20%20%3Cg%20id%3D%22Buttons%22%20transform%3D%22translate%28-1416.000000%2C%20-1579.000000%29%22%20stroke%3D%22%230091E1%22%20stroke-width%3D%221.5%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cg%20id%3D%22Group%22%20transform%3D%22translate%281427.181981%2C%201590.789087%29%20rotate%28-45.000000%29%20translate%28-1427.181981%2C%20-1590.789087%29%20translate%281420.681981%2C%201575.289087%29%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cpath%20d%3D%22M6.75%2C2.1%20L6.75%2C29.6625938%22%20id%3D%22Line-3%22%3E%3C/path%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cpath%20d%3D%22M1.4%2C6%20L6.78813665%2C0.611863349%22%20id%3D%22Line-2%22%3E%3C/path%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cpath%20d%3D%22M7%2C6%20L12.3881367%2C0.611863349%22%20id%3D%22Line-2%22%20transform%3D%22translate%289.800000%2C%203.200000%29%20scale%28-1%2C%201%29%20translate%28-9.800000%2C%20-3.200000%29%20%22%3E%3C/path%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cg%20id%3D%22Group-Copy%22%20transform%3D%22translate%286.989592%2C%2027.010408%29%20rotate%28-180.000000%29%20translate%28-6.989592%2C%20-27.010408%29%20translate%280.989592%2C%2023.510408%29%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cpath%20d%3D%22M0.4%2C6%20L5.78813665%2C0.611863349%22%20id%3D%22Line-2%22%3E%3C/path%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cpath%20d%3D%22M6%2C6%20L11.3881367%2C0.611863349%22%20id%3D%22Line-2%22%20transform%3D%22translate%288.800000%2C%203.200000%29%20scale%28-1%2C%201%29%20translate%28-8.800000%2C%20-3.200000%29%20%22%3E%3C/path%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/g%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C/g%3E%0A%20%20%20%20%20%20%20%20%3C/g%3E%0A%20%20%20%20%3C/g%3E%0A%3C/svg%3E);
      //background-size: 100%;
      //background-repeat: no-repeat;
    }

    .resizeable-element:hover & { opacity: 1; }

    &:hover .resizeable-element__drag-area { display: block; }
  }

  .resizeable-element__drag-area {
    display: none;
    position: absolute;
    z-index: 11;
    bottom: -50%;
    right: -50%;
    width: 300%;
    height: 300%;
  }

</style>