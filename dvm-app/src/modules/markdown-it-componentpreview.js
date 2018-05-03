//https://github.com/markdown-it/markdown-it-container
var md = require('markdown-it')();
const name  = "componentpreview";

const pluginConfiguration =
{
	validate: function(val)
	{
		return val.trim().indexOf('componentpreview') !== -1;
	},
	render: function(tokens, idx)
	{
		if (tokens[idx].nesting === 1)
		{
			// opening tag
			return '<div data-componentpreview>\n';
		}
		else
		{
			// closing tag
			return '\n</div>\n';
		}
	}
};
module.exports = {
	name: name,
	config: pluginConfiguration
}
