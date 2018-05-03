//https://github.com/markdown-it/markdown-it-container
var md = require('markdown-it')();
const name  = "iframe";

const pluginConfiguration =
{
	validate: function(val)
	{
		return val.trim().indexOf('iframe') !== -1;
	},
	render: function(tokens, idx)
	{	
		if (tokens[idx].nesting === 1)
		{
			var params = /\(([^)]+)\)/.exec(tokens[idx].info)[1].split(',');
			return '<iframe class="md-iframe" src="' + params[0] + '" height="' + params[1] + '"></iframe>\n';
		}
		else
		{
			return '';
		}
	}
};
module.exports = {
	name: name,
	config: pluginConfiguration
}
