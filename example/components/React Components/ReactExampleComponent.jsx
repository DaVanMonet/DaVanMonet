import React, { Component } from 'react';

class ReactExampleComponent extends Component
{
	render()
	{
		var text = "This was rendered using react";
		return (
			<div className="reactexamplecomponent">
					{text}
			</div>
		);
	}
}

export default ReactExampleComponent;
