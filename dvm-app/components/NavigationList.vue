<template>
<ul v-if="items && items.length > 0" class="davanmonet-nav-list" :data-listlevel="level">
    <li v-for="item in items" class="davanmonet-nav-listitem" :key="item.name">
      <span class="davanmonet-nav-listiteminner" v-if="item.href">
        <a
          v-bind:href="getLinkHref(item.href)"
          v-on:click="onNavigationClick"
          :class="'davanmonet-nav-link' + getLinkClass(item)"
          >{{item.title}}</a>
      </span>
      <span class="davanmonet-nav-listiteminner" v-else>
        <strong class="davanmonet-nav-directory">{{item.title}}</strong>
      </span>
      <div v-if="item.items && item.items.length > 0">
        <navigation-list :items="item.items" :source-directory="sourceDirectory" :level="level +1"></navigation-list>
      </div>
  </li>
</ul>
</template>

<script>
export default {
  name: 'navigation-list',
  props: ['items', 'sourceDirectory', 'level'],
  data()
  {
    return { currentPagePath : "" }
  },
  methods:
  {
    getLinkHref(href)
    {
      href = "/" + href;
      if(this.$root.isLocalhost)
      {
        href = "#" + href;
      }
      return href;
    },
    onNavigationClick(event)
    {
      const link = event.target;
      const linkname = link.innerText;
      let href = link.attributes.href.value;
      if(this.$root.isLocalhost)
      {
        href = href.replace("#","");
      }
      else
      {
        event.preventDefault();
        
        history.pushState('', linkname, href);
      }
      this.currentPagePath = href;
      this.$root.loadPage(this,href);
      
    },
    getLinkClass(item)
    {
      // if(href === window.location.pathname.substr(1))
      // {
      //   return " is-active";
      // }
      // return "";
      console.log('this.currentPagePath',this.currentPagePath.substr(1))
      console.log('item.href',item.href)
      if(item.href && item.href === this.currentPagePath.substr(1))
      {
        return " is-active";
      }
      return "";
    }
  },
  mounted()
  {
    this.currentPagePath = window.location.pathname;
  }

};
</script>
