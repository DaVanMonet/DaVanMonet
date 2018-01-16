<template>
    <nav v-if="navigation && navigation.length > 0" class="davanmonet-nav" :data-menuvisible="menuIsOpen + ''">
        <button 
        v-if="!menuIsOpen"
        class="davanmonet-nav-button davanmonet-nav-showmenu"
        @click="toggleNavigation()"><svg class="menuicon" style="width:24px;height:24px" viewBox="0 0 24 24"><path d="M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z" /></svg></button>
         <button 
         v-if="menuIsOpen"
         class="davanmonet-nav-button davanmonet-nav-hidemenu"
         @click="toggleNavigation()"><svg style="width:24px;height:24px" viewBox="0 0 24 24"><path d="M19,3H16.3H7.7H5A2,2 0 0,0 3,5V7.7V16.4V19A2,2 0 0,0 5,21H7.7H16.4H19A2,2 0 0,0 21,19V16.3V7.7V5A2,2 0 0,0 19,3M15.6,17L12,13.4L8.4,17L7,15.6L10.6,12L7,8.4L8.4,7L12,10.6L15.6,7L17,8.4L13.4,12L17,15.6L15.6,17Z" /></svg></button>
        <navigation-list v-if="menuIsOpen" :items="navigation" :source-directory="sourceDirectory" :current-page-path="currentPagePath" :level="1"></navigation-list>
    </nav>
</template>

<script>
import NavigationList from '@/components/NavigationList.vue';

export default
{
    name: 'navigation',
    props: ['navigation', 'sourceDirectory', 'currentPagePath'],
    data(){
        return {
            menuIsOpen:true
        }
    },
    components:
    {
        NavigationList
    },
    created()
    {
        if(sessionStorage)
        {
            let menuIsOpen = sessionStorage.getItem("menuIsOpen")
            this.menuIsOpen = menuIsOpen === null || menuIsOpen === "true";
        }
    },
    methods:
    {
         toggleNavigation()
         {
            this.menuIsOpen = (this.menuIsOpen) ? false : true;
            sessionStorage.setItem("menuIsOpen", this.menuIsOpen + ""); 
         }
    }

};

</script>

<style lang="less">
.davanmonet-nav-button
{
    border:0;
	background: none;
	position: absolute;
	top: 6px;
	right: 0;
	
    cursor: pointer;
    path
    {
        fill:#999;
        transition:fill .15s ease;
    }
    &:hover,
    &:focus,
    &:active
    {
        path
        {
            fill:#333;
        }
    }
}

.davanmonet-nav-hidemenu
{
    
}

</style>
