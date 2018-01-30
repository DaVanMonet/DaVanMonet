<script>
import Vue from 'vue';
import VueExampleComponent from './components/VueComponents/VueExampleComponent.vue';
const appRenderEl =  document.getElementById('showcase__render');
let showcaseMarkupIsInserted = false;
if(appRenderEl)
{
	window.addEventListener('message', (message) =>
	{
		if(typeof message.data === "string" && message.data.indexOf('render-vue') === 0 && showcaseMarkupIsInserted === false)
		{
			initializeComponents();
		}
	}, false);
}
else
{
}

function initializeComponents()
{
	showcaseMarkupIsInserted = true;
	new Vue(
	{
		//el:'#showcase__app-render',
		el:'#' + appRenderEl.id,
		name:'VueComponents',
		components:{ VueExampleComponent },
		data() 
		{
			return {
				
			}
		},
		created()
		{
		},
		mounted()
		{
		}
	})
}
</script>
