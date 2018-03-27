<template v-if="content">
    <section>
        <div ref="richtext" v-html="content" :class="{ 'richtext--is-collapsed': isCollapsed }" class="item richtext"></div>
        <a v-if="canCollapse" @click="toggleCollapsed()" href="javascript:;" class="richtext__read-more-link" :class="{ 'richtext__read-more-link--is-expanded': !isCollapsed }">
            <template v-if="isCollapsed">Read more</template>
            <template v-else>Show less</template>
        </a>
    </section>
</template>

<script>
import Vue from 'vue';
import Loader from '@/src/modules/loader.js';
import ItemChecklist from '@/components/item/ItemChecklist';
import ItemSpanlist from '@/components/item/ItemSpanlist';
import ItemCodeBlock from '@/components/item/ItemCodeBlock';
import ItemComponentPreview from '@/components/item/ItemComponentPreview';

const CONTENT_COMPONENT_SPECS = [
{
    selector: '.checklist',
    component: ItemChecklist,
},
{
    selector: '.spanlist',
    component: ItemSpanlist,
},
{
    selector: 'pre[class*=\'language-\']',
    component: ItemCodeBlock,
},
{
    selector: '[data-componentpreview]',
    component: ItemComponentPreview,
}, ];

export default
{
    name: 'item-richtext',
    components:
    {
        ItemChecklist,
        ItemSpanlist,
        ItemCodeBlock
    },
    props:
    {
        content:
        {
            type: String,
            default: ''
        },
        collapsed:
        {
            type: Boolean,
            default: false,
        },
    },
    data()
    {
        return {
            canCollapse: false,
            isCollapsed: false,
        };
    },
    watch:
    {
        content(value)
        {
            if (value && this.$el)
            {
                this.$nextTick(this.mountItemContentComponents);
            }
        },
    },
    methods:
    {
        async mountItemContentComponents()
        {
            await Loader.LoadData();
            CONTENT_COMPONENT_SPECS.forEach(contentComponentSpec =>
            {
				// TODO: Temp. avoid toArray here because of build problems
                Array.prototype.slice.call(this.$el.querySelectorAll(contentComponentSpec.selector)).forEach(el =>
                {
					if(typeof el.parentNode.dataset["componentpreview"] === "undefined")
					{
						const componentInstance = new Vue(Object.assign(
						{}, contentComponentSpec.component,
						{
							propsData:
							{
                                html: el,
                                projectconfig: Loader.ProjectConfig
							}
						}));

						componentInstance.$mount(el);
					}
                });
            });
        },
        toggleCollapsed()
        {
            this.isCollapsed = !this.isCollapsed;
        },
    },
    mounted()
    {
        if (this.content)
        {
            this.mountItemContentComponents();

            // Set local isCollapsed bool based on passed prop. and if there are
            // multiple children to actually collapse.
            //this.canCollapse = this.collapsed && this.$refs.richtext.children.length > 1;
            this.canCollapse = false;
            this.isCollapsed = this.collapsed;
        }
    },
};

</script>
