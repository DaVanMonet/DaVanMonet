import React from 'react';
import ReactDOM from 'react-dom';
import ReactExampleComponent from './components/React Components/ReactExampleComponent.jsx';

const AllComponents = {
	"ReactExampleComponent":ReactExampleComponent
};

const appRenderEl =  document.getElementById('showcase__render');
let showcaseMarkupIsInserted = false;
if(appRenderEl)
{
	window.addEventListener('message', (message) =>
	{
		if(typeof message.data === "string" && message.data.indexOf('render-react') === 0 && showcaseMarkupIsInserted === false)
		{
			initializeComponents();
		}
	}, false);
}

function initializeComponents()
{
	showcaseMarkupIsInserted = true;

	let Component = null;
	if(appRenderEl.children.length === 1)
	{
		const componentName = appRenderEl.children[0].tagName;
		if(componentName[0] !== componentName[0].toLocaleLowerCase())
		{
			Component = AllComponents[componentName];
		}
	}
	
	if(Component)
	{
		ReactDOM.render(<Component/>, appRenderEl);
	}
	else
	{
		ReactDOM.render(<div dangerouslySetInnerHTML={{ __html: appRenderEl.innerHTML }} />, appRenderEl)
	}
}

class Container extends React.Component {
  render() {
    return <Component />
  }
}
