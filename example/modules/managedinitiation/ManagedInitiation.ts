/// <reference path="managedinitiation.d.ts" />
/**

# Managed initiation
The triggering selector is [data-managedinitiation-trigger]

## Parameters
### data-managedinitiation-trigger
	possible values:
	* queued - Will run after document ready in the order that it appears in the DOM
	* approached - Will run when the user scrolls close enough to a section
	* interaction - Will run only when a button has triggered the element to initiate

### data-managedinitiation-approachthreshhold
	integer of pixels. When the user has scrolled down so the area is less than that amount of pixels from the viewport the area will initiate

### managedinitiation-triggerdelay
	number of miliseconds that 

## Code examples

### Approach
<div data-managedinitiation-trigger="approached" data-managedinitiation-approachthreshhold="300">
</div>

### User interaction
<button class="only-js js-togglemanager"
		aria-expanded="false"
		aria-controls="loremipsum"
		data-togglemanager-action="toggle"
		data-togglemanager-trigger="toggle-isvisible[window|ManagedInitiation-Triggered]"
		data-extrabehavior="preventdefault">Toggle Lorem ipsum</button>
<div id="loremipsum" data-managedinitiation-trigger="interaction">
</div>

*/


import MMB = require("./ManagedModuleBase");
class ManagedInitiation extends MMB.ManagedModule.Base
{
	"use strict";
	public moduleName = 'ManagedInitiation';
	public elementselector = '[data-managedinitiation-trigger]';
	protected queue: HTMLElement[] = [];
	protected approachSections: HTMLElement[] = [];
	protected allApproachSections: HTMLElement[] = [];
	constructor() 
	{
		super(); 
		this.initiateElements_local();
	}

	public initiateElements_local()
	{
		let elements = $(this.elementselector).not('[data-initialized-scripts~="' + this.moduleName + '"]').get();

		elements.map((el, i) =>
		{
			this.evaluateElements(el,i);
			this.setElementAsInitialized(el, i);
		});
		this.elements = this.elements.concat(elements);
		if (this.approachSections.length !== 0)
		{
			this.initiateApproachBehavior();
		}
		this.processQueue();
		//this.checkApproachSectionsPosition();
	}

	protected initiateApproachBehavior()
	{
		this.$w.on('scroll', this.checkApproachSectionsPosition.bind(this));
	}

	protected checkApproachSectionsPosition()
	{
		if (this.approachSections.length)
		{
			let viewport =
				{
					height: (window.innerHeight || document.documentElement.clientHeight || 0),
					width: (window.innerWidth || document.documentElement.clientWidth || 0),
					top: (window.pageYOffset || document["scrollTop"] || 0) - (document["clientTop"] || 0),
					bottom: 0
				};
			viewport.bottom = viewport.top + viewport.height;

			let elementsToRemove = [];
			this.approachSections.forEach((el, i) =>
			{
				let scrolledTo = el.dataset["scrolltosectionmanagerScrolledto"] + "",
					threshhold = parseInt(el.dataset["managedinitiationApproachthreshhold"], 10);

				if (scrolledTo === "false" || scrolledTo === "undefined")
				{
					threshhold = (threshhold > 0) ? threshhold : 200;

					let rect = el.getBoundingClientRect(),
						pixelsFromViewportBottom = (rect.top - viewport.height);

					if (pixelsFromViewportBottom < threshhold)
					{
						$(el).trigger(this.moduleName + 'trigger-load');
						elementsToRemove.push(i);
					}
				}
			});
			if (elementsToRemove.length > 0)
			{
				elementsToRemove.forEach((val, i) =>
				{
					this.approachSections.splice(val, 1);
				});
			}
		}
		else
		{
			this.$w.off('scroll', this.checkApproachSectionsPosition.bind(this));
		}
	}

	public filterManagedElements(el)
	{
		//We want it to remove items that is going to be managed by us
		return $(el).parents(this.elementselector).length === 0;
	}

	protected evaluateElements(el: HTMLElement, i: number)
	{
		let options = this.getElementOptions(el);
		switch (options.trigger)
		{
			case "queued":
				this.queue.push(el);
				break;
			case "approached":
				this.approachSections.push(el);
				this.allApproachSections.push(el);
				break;
			case "interaction":
				$(el).on('ARIAButtonManager-changestate', this.triggerElement.bind(this));
				break;
			default: break;
		}
		$(el).on(this.moduleName + 'trigger-load', this.triggerElement.bind(this));
		$(el).on(this.moduleName + 'trigger-completed', this.triggerCompletedElement.bind(this));
	}

	protected processQueue()
	{
		if (this.queue.length > 0)
		{
			$(this.queue[0]).trigger(this.moduleName + 'trigger-load');
		}
	}
	protected triggerElement(e)
	{
		let $el = $(e.target);
		$el.attr('data-' + this.moduleName + '-triggeredtime', (new Date()).toISOString());
		this.$w.trigger(this.Helper.GlobalTriggerEvent, $el);
	}

	protected triggerCompletedElement(e)
	{
		let $el = $(e.target);

		if (this.queue.length > 0)
		{
			this.queue.map((el, i) =>
			{
				if (el === $el.get(0))
				{
					this.queue.splice(i, 1);
				}
			});
			if (this.queue.length > 0)
			{
				this.processQueue();
			}
			else
			{
				$el.attr(this.moduleName + 'triggered', "true");
			}
		}
	}

	protected getElementOptions(el)
	{
		let $el = $(el),
			trigger = this.getElData($el, 'managedinitiation-trigger'),
			approachthreshhold = <number>this.getElData($el, 'managedinitiation-approachthreshhold'),
			options: ManagedInitiationElementOptions = {
				trigger: trigger,
				approachthreshhold: approachthreshhold
			};
		return options;
	}
}
export = new ManagedInitiation();
