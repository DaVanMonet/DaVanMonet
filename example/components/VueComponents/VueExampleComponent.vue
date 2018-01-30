<template>
    <div class="vueexamplecomponent">
		<div v-html="content"></div>
    </div>
</template>

<script>
export default
{
	name:'vue-example-component',
    data() 
	{
        return {
            content:"This content was rendered using vue"
        }
    }
}
</script>

<style lang="less">
	.vueexamplecomponent
	{
		padding:5px;
		border:1px solid #ccc;
	}
</style>

