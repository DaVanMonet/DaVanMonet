<template>
  <div class="showcase__source">
    <syntax-highlighter :source="source" :language="language"></syntax-highlighter>

    <ul class="showcase__source-controls">
      <li>
        <copy-to-clipboard copied-title="Copied!" :copy-data="source">
          <a href="javascript:;">Copy to clipboard</a>
        </copy-to-clipboard>
      </li>
    </ul>
  </div>
</template>

<script>
import CopyToClipboard from '@/components/CopyToClipboard';
import SyntaxHighlighter from '@/components/SyntaxHighlighter';

export default {
  name: 'component-showcase-source',
  components: { CopyToClipboard, SyntaxHighlighter },
  props: {
    source: String,
    language: {
      type: String,
      default: 'markup',
    },
  },
};
</script>


<style lang="less">
@color--grey:#d6d6d6;

@color--blue:#0093e8;//0097A7
@color--white:#fff;
@showcase--background-color: #efefef;
@color--some-blue-why-is-this-not-consistent: #41b0ee;

/* _showcase default */

  .showcase { margin-bottom: 7.5rem; }

  .showcase__example
  {
    ul, ol
    {
      margin: 0;
      padding: 0;
    }
  }

  .showcase__header + .showcase__example { margin-top: 3rem; }

  .showcase__render-iframe-wrapper {
    position: relative;
    z-index: 2;
  }

  .showcase__settings-drawer {
    position: relative;
    z-index: 4;
    .row
    {
      display: flex;
      justify-content: space-between;
    }
  }

  .showcase__settings-drawer-toolbar {
    font-size:1.4rem;
    position: relative;
    padding: 1.75rem 2.5rem 1.5rem;
    background: @color--white;
    border: 1px solid @color--grey;
  }

  .showcase__settings-drawer-expanded {
    position: relative;
    color: @color--white;
    background: #494949;
    padding: 4rem;
  }

  .showcase__show-settings-drawer-button {
    position: relative;
    font-size:inherit;
    color: @color--blue;
    background: none;
    padding-left: 0;
    border: none;
    border-radius: 0;
    appearance: none;
    cursor: pointer;
    transition: transform 0.3s ease;
    padding-right: 1.4rem;
    text-decoration: none;

    &:after {
      display: block;
      position: absolute;
      right: -0.1rem;
      top: 0.5rem;
      width: 1rem;
      height: 1rem;
      content: '';
      pointer-events: none;
      background-image: url(data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgMTAwMCAxMDAwIiBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCAxMDAwIDEwMDAiIHhtbDpzcGFjZT0icHJlc2VydmUiPjxnPjxwYXRoIHN0eWxlPSJmaWxsOiMwMDkzZTgiIGQ9Ik01MDAsNjU4LjZMNjcuNywyMjYuMkwxMCwyODMuOGw0OTAsNDkwbDQ5MC00OTBsLTU3LjctNTcuN0w1MDAsNjU4LjZ6Ii8+PC9nPjwvc3ZnPg==);
      background-size: 100% auto;
    }

    &:focus {
      text-decoration: underline;
      outline: none;
    }

    label {
      display: block;
      margin-bottom: 1.25rem;
      cursor: pointer;

      input { margin-right: 0.5rem; }

      &:last-child { margin-bottom: 0; }
    }

    .showcase__wrapper--settings-drawer-is-open &:after { transform: scaleY(-1); }
  }

  .showcase__size-selector {
    transition: transform 0.3s ease;
    transform: translate3d(-50%, 0, 0);
    display: flex;
    height: 3rem;
    top:1.3rem;
    align-content: center;
    justify-content: center; 
    position: absolute;
    z-index: 2;
    //bottom: 1.65rem;
    left: 50%;
  }
  

  .showcase__size-selector-button {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    transition: transform 0.3s ease, opacity 0.3s ease;
    
    text-align: center;
    cursor: pointer;
    color: @color--some-blue-why-is-this-not-consistent;
    //border: 2px solid @color--grey;
    margin: 0 0.4rem;
    padding:0 .5rem;

    svg {
      width: 2rem;
      height: auto;

      path { fill: currentColor; }
    }

    &:hover { color: darken(@color--some-blue-why-is-this-not-consistent, 15%); }

    &.showcase__size-selector-button--is-active
    {
      //background:@color--grey;
      color:#000;
      text-decoration: underline;
    }

    // &:after {
    //   transition: opacity 0.1s ease;
    //   display: block;
    //   content: '';
    //   position: absolute;
    //   bottom: -0.75rem;
    //   left: 50%;
    //   margin-left: -0.2rem;
    //   // width: 0.4rem;
    //   // height: 0.4rem;
    //   border-radius: 50%;
    //   background: @color--blue;
    //   opacity: 0;
    // }

    &--is-active:after { opacity: 1; }

    &--desktop svg {
      position: relative;
      top: 0.2rem;
    }
  }

  .showcase__render-state
  {
    float: right;
  }

  .showcase__render-wrapper,
  .showcase__render-resizeable {
    position: relative;
    margin: 0 auto;
    line-height: 0;

    &:after {
      display: block;
      z-index: 1;
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: calc(100% + 2rem);
      background: @color--white;
    }
  }

  .showcase__render-wrapper {
    line-height: inherit;
    border: 1px solid @color--grey;
    background: @showcase--background-color;
    border-bottom: none;

    &:after { display: none; }
  }

  .showcase__render-iframe {
    position: relative;
    z-index: 2;
    width: 100%;
    border: none;
  }

  .showcase__render {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10rem 2.5rem;

    &--buttons {
      flex-direction: row;

      * {
        margin-right: 2.5%;

        &:last-child { margin-right: 0; }
      }
    }

    &--checkboxes,
    &--radio-buttons { flex-direction: column; }

    &--checkboxes * {
      margin-bottom: 1.25rem;

      &:last-child { margin-bottom: 0; }
    }
  }
  
  .showcase__source-wrapper {
    font-size:16px;
    position: relative;
    border-right: 1px solid @color--grey;
    border-bottom: 1px solid @color--grey;
    border-left: 1px solid @color--grey;
  }

  .showcase__source { position: relative; }
  .showcase__source pre
  {
    margin:0 !important;
  }
  .showcase__source-link {
    position: absolute;
    z-index: 1;
    top: 2.25rem;
    right: 2.25rem;

    &:after {
      display: inline-block;
      content: '';
      width: 1.2rem;
      height: 1.2rem;
      margin-left: 0.625rem;
      background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgaGVpZ2h0PSIxMiIgd2lkdGg9IjEyIiB2ZXJzaW9uPSIxLjEiIHhtbG5zOmNjPSJodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9ucyMiIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyI+ICA8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwIC0xMDQwLjQpIiBmaWxsPSIjMDA5M2U4Ij4gICAgPHBhdGggZD0ibTEuOTY4OCAxMDQzLjRjLTEuMDkzOSAwLTEuOTY4OCAwLjgtMS45Njg4IDEuOXY1LjA5MzVjMCAxLjA5MzggMC44NzQ5MiAxLjk3NTQgMS45Njg4IDEuOTY4N2w1LjA2MjUtMC4wMzFjMS4wOTM4IDAgMS45Njg3LTAuOSAxLjk2ODctMnYtMy4wMzEzaC0xdjNjMCAwLjU1NC0wLjQ0NjAxIDAuOTk2Ni0xIDFsLTUgMC4wMzFjLTAuNTUzOTggMC0xLTAuNDQ2LTEtMXYtNS4wMzFjMC0wLjU1NCAwLjQ0Ni0xIDEtMWgzdi0xeiIvPiAgICA8cGF0aCBkPSJtNyAxMDQwLjQtMC4wMDAwMDQ4IDFoMy4zMTI2bC03LjEzMTcgNy4xNTE0IDAuNjg3NDUgMC42ODc0IDcuMTMxNi03LjE1MTQgMC4wMDAwNjUgMy4zMTI2aDFsLTAuMDAwMDQtNC4wMDAxIDAuMDAwMDc1LTAuOTk5OXoiLz4gIDwvZz48L3N2Zz4=);
    }
  }

  .showcase__source-controls {
    float: right;;
    display: flex;
    flex-direction: row;
    margin-top: 1.75rem;
    list-style: none;

    li {
      margin-right: 2.5rem;

      &:last-child {
        margin-left: auto;
        margin-right: 0;
      }
    }
    a
    {
        color: @color--blue;
        text-decoration: none;
        display: inline-block;
        margin-top:0.5rem;
    }
  }


  /*
 * _resizeable-element.scss
 */

/* _resizeable-element config */
@color--some-blue-why-is-this-not-consistent: #41b0ee;

/* _resizeable-element default */


  .resizeable-element { position: relative; }

  .resizeable-element__wrapper {
    display: flex;
    justify-content: center;
  }

  .resizeable-element__size {
    transition: opacity 0.3s ease;
    opacity: 0;
    position: absolute;
    z-index: 10;
    top: 3.5rem;
    right: 3rem;
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
    right: 0;
    width: 5rem;
    height: 5rem;
    cursor: nwse-resize;

    &:after {
      display: block;
      content: '';
      position: absolute;
      top: 20%;
      left: 0%;
      width: 19px;
      height: 19px;
      pointer-events: none;
      opacity: 0.9;
      background-image: url(data:image/svg+xml,%0A%3Csvg%20width%3D%2223px%22%20height%3D%2223px%22%20viewBox%3D%220%200%2023%2023%22%20version%3D%221.1%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20xmlns%3Axlink%3D%22http%3A//www.w3.org/1999/xlink%22%3E%0A%20%20%20%20%3Cg%20id%3D%22Page-1%22%20stroke%3D%22none%22%20stroke-width%3D%221%22%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%20stroke-linecap%3D%22square%22%3E%0A%20%20%20%20%20%20%20%20%3Cg%20id%3D%22Buttons%22%20transform%3D%22translate%28-1416.000000%2C%20-1579.000000%29%22%20stroke%3D%22%230091E1%22%20stroke-width%3D%221.5%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3Cg%20id%3D%22Group%22%20transform%3D%22translate%281427.181981%2C%201590.789087%29%20rotate%28-45.000000%29%20translate%28-1427.181981%2C%20-1590.789087%29%20translate%281420.681981%2C%201575.289087%29%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cpath%20d%3D%22M6.75%2C2.1%20L6.75%2C29.6625938%22%20id%3D%22Line-3%22%3E%3C/path%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cpath%20d%3D%22M1.4%2C6%20L6.78813665%2C0.611863349%22%20id%3D%22Line-2%22%3E%3C/path%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cpath%20d%3D%22M7%2C6%20L12.3881367%2C0.611863349%22%20id%3D%22Line-2%22%20transform%3D%22translate%289.800000%2C%203.200000%29%20scale%28-1%2C%201%29%20translate%28-9.800000%2C%20-3.200000%29%20%22%3E%3C/path%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cg%20id%3D%22Group-Copy%22%20transform%3D%22translate%286.989592%2C%2027.010408%29%20rotate%28-180.000000%29%20translate%28-6.989592%2C%20-27.010408%29%20translate%280.989592%2C%2023.510408%29%22%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cpath%20d%3D%22M0.4%2C6%20L5.78813665%2C0.611863349%22%20id%3D%22Line-2%22%3E%3C/path%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cpath%20d%3D%22M6%2C6%20L11.3881367%2C0.611863349%22%20id%3D%22Line-2%22%20transform%3D%22translate%288.800000%2C%203.200000%29%20scale%28-1%2C%201%29%20translate%28-8.800000%2C%20-3.200000%29%20%22%3E%3C/path%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C/g%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C/g%3E%0A%20%20%20%20%20%20%20%20%3C/g%3E%0A%20%20%20%20%3C/g%3E%0A%3C/svg%3E);
      background-size: 100%;
      background-repeat: no-repeat;
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



  /*
 * _demo-radio-button.scss
 *
 */

/* _demo-radio-button config */
@demo-radio-button--color-text: #333;
@demo-radio-button--color-grey: #b3b3b3;
@demo-radio-button--color-blue: #41b0ee;
@color--grey:#d6d6d6;

@color--blue:#0093e8;//0097A7
@color--white:#fff;
/* _demo-radio-button default */

  .demo-radio-button {
    display: flex;
    flex-direction: row;
    line-height: 1.95rem;

    .demo-form-group__label + & { margin-top: 1.5rem; }

    & + .demo-radio-button { margin-top: 1rem; }

    &--white {
      .demo-radio-button__label { color: @color--white; }

      &:not(.demo-radio-button--is-disabled) .demo-radio-button__label:hover div.demo-radio-button__custom-radio-button {
        border-color: @color--white;
      }

      .demo-radio-button__input:checked + .demo-radio-button__label .demo-radio-button__custom-radio-button {
        border-color: @color--white !important; // FML
      }

      .demo-radio-button__custom-radio-button:after { background: @color--white; }
    }
  }

  .demo-form-group--radio-button-toggle.demo-form-group { min-width: 16rem; }

  .demo-radio-button__label {
    display: flex;
    align-items: center;
    margin-bottom: 0;
    color: @demo-radio-button--color-text;
    letter-spacing: 0.075rem;
    cursor: pointer;

    .demo-radio-button--is-disabled & {
      color: lighten(@demo-radio-button--color-text, 40%);
      cursor: not-allowed;
    }
  }

  .demo-radio-button__custom-radio-button {
    position: relative;
    width: 1.6rem;
    height: 1.6rem;
    margin: -0.3rem 1.75rem 0 0;
    border-radius: 50%;
    border: 1px solid @demo-radio-button--color-grey;
    cursor: pointer;

    .demo-radio-button:not(.demo-radio-button--is-disabled) .demo-radio-button__label:hover & {
      border-color: @demo-radio-button--color-blue;
    }

    &:after {
      transition: opacity 100ms ease;
      display: block;
      content: '';
      position: absolute;
      top: 0.2rem;
      left: 0.2rem;
      width: 1rem;
      height: 1rem;
      border-radius: 50%;
      background: @demo-radio-button--color-blue;
      opacity: 0;
    }

    .demo-radio-button__input:checked + .demo-radio-button__label & {
      border-color: @demo-radio-button--color-blue;

      &:after { opacity: 1; }
    }
  }

</style>
