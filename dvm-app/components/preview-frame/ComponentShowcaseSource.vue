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

@import '../../styles/colors';

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

</style>
