<template>
<ul v-if="items && items.length > 0" class="davanmonet-nav-list" :data-listlevel="level" :expand-children="expandChildren + ''">
    <li v-for="(item,index) in items" class="davanmonet-nav-listitem" :key="item.name" :localIndex="index">
      <span class="davanmonet-nav-listiteminner" v-if="item.href">
        <a
          v-if="(expandChildren || (!expandChildren && !(index > 1)))" 
          v-bind:href="getLinkHref(item.href)"
          v-on:click="onNavigationClick"
          :class="'davanmonet-nav-link' + getLinkClass(item)"
          >{{item.title}}</a>
          <strong 
            class="davanmonet-nav-expandlink"
            v-if="!expandChildren && index == 2" 
            v-on:click="onExpandNavClick(item)"
            v-html="'+ Show ' + (items.length - 2) + ' more item' + (((items.length - 2) > 1) ? 's':'')"></strong>
      </span>
      <span class="davanmonet-nav-listiteminner" v-else>
        <strong class="davanmonet-nav-directory">{{item.title}}</strong>
      </span>
      <div v-if="item.items && item.items.length > 0">
        <navigation-list :items="item.items" :source-directory="sourceDirectory" :level="level +1" :current-page-path="currentPagePath"></navigation-list>
      </div>
  </li>
  
</ul>
</template>

<script>
export default {
  name: 'navigation-list',
  props: ['items', 'sourceDirectory', 'level', 'currentPagePath'],
  data()
  {
    return {
      //currentPagePath : "",
      expandChildren : (this.level > 2) ? ((this.items.length > 2) ? false : true) : true
    }
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

      this.$root.loadPage(this,href);
    },
    onExpandNavClick(item)
    {
      this.expandChildren = true;
    },
    getLinkClass(item)
    {
      if(item.href && item.href === this.currentPagePath.substr(1))
      {
        return " is-active";

      }
      return "";
    }
  },
  mounted()
  {
    var activeItems = this.items.filter(x => x.href).filter(x =>{ return x.href === this.currentPagePath.substr(1) });
    if(activeItems.length)
    {
      this.expandChildren = true;
    }
    
  }

};
</script>
