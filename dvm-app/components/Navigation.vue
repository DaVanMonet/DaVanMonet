<template>
    <nav v-if="navigation && navigation.length > 0" class="davanmonet-nav">
        <navigation-list :items="navigation" :source-directory="sourceDirectory" :current-page-path="currentPagePath" :level="1"></navigation-list>
    </nav>
</template>

<script>
import NavigationList from '@/components/NavigationList.vue';

export default
{
    name: 'navigation',
    components:
    {
        NavigationList
    },
    props: ['navigation', 'sourceDirectory', 'currentPagePath']

};

</script>
