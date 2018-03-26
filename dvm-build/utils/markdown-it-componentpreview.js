//https://github.com/markdown-it/markdown-it-container
var md = require('markdown-it')();
const name  = "componentpreview";
const matchRegEx = /^componentpreview\s+(.*)$/ig;
const pluginConfiguration =
{
	validate: function(val)
	{
		console.log('val', val)
		console.log('val.trim().match(matchRegEx)',val.trim().match(/^componentpreview\s+(.*)$/))
		//return val.trim().match(/^componentpreview\s+(.*)$/);
		return val.trim().indexOf('componentpreview') !== -1;
	},
	render: function(tokens, idx)
	{
		console.log('tokens[idx]',tokens[idx])
		var m = tokens[idx].info.trim().match(matchRegEx);
		if(m != null)
		{
			if (tokens[idx].nesting === 1)
			{
				console.log('m',m)
				// opening tag
				return '<div data-componentpreview>' + md.utils.escapeHtml(m[1]) + '\n';

			}
			else
			{
				// closing tag
				return '</div>\n';
			}
		}
	}

};
module.exports = {
	name: name,
	config: pluginConfiguration
}
