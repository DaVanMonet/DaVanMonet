module.exports = {
    
    extractVariantMDSnipplets: function(md) {
        let snipplets = [];
		const regExGetsnipplet = /((?:##)(.|\w|\W|\r|\n)*?(```$))/gim;
		let m;

		while ((m = regExGetsnipplet.exec(md)) !== null)
		{

			// This is necessary to avoid infinite loops with zero-width matches
			if (m.index === regExGetsnipplet.lastIndex)
			{
				regExGetsnipplet.lastIndex++;
			}
			
			// The result can be accessed through the `m`-variable.
			m.forEach((match, groupIndex) =>
			{
				if (groupIndex === 0)
				{
					let snipplet =
					{
						content:match
					};
					snipplets.push(snipplet);
				}
				//console.log(`Found match, group ${groupIndex}: ${match}`);
			});
        }

        return snipplets;
    },

    extractHTMLSnipplets: function (markdownSnipplets) {
        let HTMLSnipplets = [];

        markdownSnipplets.forEach(function(snipplet) {
            const regExtGetHTMLSnipplet = /```html\n(.+)\n```/gim;
            let snip = regExtGetHTMLSnipplet.exec(snipplet.content);
            
            if(snip !== null)
                snip.some((match, groupIndex) => {
                    if (groupIndex === 1) {
                        HTMLSnipplets.push(match);
                        return true;
                    }
                });
            
        }, this);

        return HTMLSnipplets;
    }
}