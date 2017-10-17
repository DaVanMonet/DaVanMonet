/// <reference path="ariabuttonmanager.d.ts" />


/*
   
# ARIA attributes
Since we're writing semantinc markup we want to use existing attributes that help screenreaders instead of custom classes that mean the same thing.

Using the attribute aria-hidden="true" should hide the actual content.

## Tabs
With the combination of the attributes aria-selected, role="tabs" and aria-controls we can say that a button should have a tabbed behavior.

## Toggle buttons
With the combination of the attributes aria-pressed and aria-controls we can say that a button should have a toggling behavior.

## Close buttons
If a button only has the attribute aria-controls it will default to be a close button that sets aria-hidden to true when pressed

# Additional features
## data-triggerevent="buttontype[parentobject|triggername]"
This property will take a button type (toggle, close, tab) and toggle-isvisible, toggle-ishidden.
It will trigger an event on the object with the name specified.
toggle[window|ManagedInitiation-Triggered]

## data-runmodules="modulename1,modulename2"
This attribute will load in additional modules through require and run their init method with the button as the first parameter

## data-behavior="behavior1, behavior2"
This attribute will see if this script support any of the behaviors specified in this attribute. Is so an additional script will be loaded that will add the extra functionality

# Example
<h3>Tab list</h3>
<div role="tablist">
    <button aria-selected="true" role="tab" id="tabbutton1" aria-controls="tab1content">tab 1</button>
    <button aria-selected="false" role="tab" id="tabbutton2" aria-controls="tab2content">tab 2</button>
    <button aria-selected="false" role="tab" id="tabbutton3" aria-controls="tab3content">tab 3</button>

	<div id="tab1content" aria-hidden="false" aria-labelledby="tabbutton1" role="tabpanel">
		tab 1 content
	</div>
	<div id="tab2content" aria-hidden="true" aria-labelledby="tabbutton2" role="tabpanel">
		tab 2 content
	</div>
	<div id="tab3content" aria-hidden="true" aria-labelledby="tabbutton3" role="tabpanel">
		tab 3 content
	</div>
</div>

<h3>Accordion</h3>
<div role="tablist">
    <button aria-selected="false" role="tab" id="accordionbutton1" aria-controls="accordion1content" data-behavior="accordiontabs">Accordion 1</button>
	<div id="accordion1content" aria-hidden="true" aria-labelledby="accordionbutton1" role="tabpanel">
		Accordion 1 content
	</div>
	<button aria-selected="false" role="tab" id="accordionbutton2" aria-controls="accordion2content" data-behavior="accordiontabs">Accordion 2</button>
	<div id="accordion2content" aria-hidden="true" aria-labelledby="accordionbutton2" role="tabpanel">
		Accordion 2 content
	</div>
	<button aria-selected="false" role="tab" id="accordionbutton3" aria-controls="accordion3content" data-behavior="accordiontabs">Accordion 3</button>
	<div id="accordion3content" aria-hidden="true" aria-labelledby="accordionbutton3" role="tabpanel">
		Accordion 3 content
	</div>
</div>

<h3>Toggle button</h3>
<div>
    <button aria-pressed="false" aria-expanded="false" aria-controls="togglecontent">Toggle content</button>
    <div id="togglecontent" aria-hidden="true">
        This content will show when the button is pressed
    </div>
</div>

<h3>Close button</h3>
<div>
    <button aria-expanded="false" aria-controls="closecontent">Close button</button>
    <div id="closecontent" aria-hidden="false">
        This content will be hidden when the close button is pressed
    </div>
</div>



    NOT IMPLEMENTED YET
	Possible extrabehaviors:
		hidevisiblefirst
		preventdefault
		closesiblings
		closesimilar
		addclasstoparent
		addhiddenclass
		lazyloadimages
		nevercloseall
		removefocusclose
		addclasstosiblings
		focusinput

*/

import MMB = require("../managedinitiation/ManagedModuleBase");
class ARIAButtonManager extends MMB.ManagedModule.Base
{
    "use strict";
	public moduleName = 'ARIAButtonManager';
	public elementselector: string = 'a[aria-controls],button[aria-controls],button[data-runmodules],label[aria-controls],div[role="button"][aria-controls]'; 
	protected tabbuttonSelector = '[role=tab]';
    protected transitionTime = 200;

	public ButtonTypes: ARIAButtonManagerButtonTypes =
	{
		Toggle: "Toggle",
		Close: "Close",
		Tab: "Tab"
	}

	public Behaviors: ARIAButtonManagerBehaviors =
	{ 
		AccordionTabs: "accordiontabs",
		CloseOnBodyClick: "closeonbodyclick",
		PreventDefault: "preventdefault",
		FocusInput: "focusinput",
		CloseOnLoadMobile: "closeonloadmobile",
		AddToGlobalState: "addtoglobalstate"
		
	}

	public Events: ARIAButtonManagerEvents =
	{
		ShowTarget: this.moduleName + '-show',
		HideTarget: this.moduleName + '-hide',
		ChangeState: this.moduleName + '-changestate',
	}

    constructor()
	{
		super();
		this.addGlobalEvents();
        this.initiateElements(this.$body);
		
    }


	protected initiateElement($parent: JQuery, element: HTMLElement)
	{
		this.addEventsToElements(element);
	}

	public addGlobalEvents()
	{
		this.$w.on('ARIAButtonManager-initialize', this.initiateElements.bind(this, $('body')));
      //  this.$w.on('hashchange', this.onHashChange.bind(this));
		this.Helper.RunOnSectionInitiation(this.initiateElements.bind(this))
	}

    protected addEventsToElements(element: HTMLElement)
	{
		let $element = $(element),
			options = this.getButtonOptions($element),
			$target = $(options.targetselector);
		
        $element.on('click keydown', this.onButtonInteraction.bind(this, $element)); //touchstart
		$element.on(this.Events.ChangeState, this.changeButtonState.bind(this));

		if ($target.length > 0 && typeof $target.attr('data-' + this.moduleName + "-hasevents") !== "string")
		{
			//$target.on(this.moduleName + '-show', this.setTargetState.bind(this, this.VisibleStates.Show));
			//$target.on(this.moduleName + '-hide', this.setTargetState.bind(this, this.VisibleStates.Hide));
			$target.on(this.Events.ShowTarget, this.targetShow.bind(this));
			$target.on(this.Events.HideTarget, this.targetHide.bind(this));
			$target.attr('data-' + this.moduleName + "-hasevents", "true");
		}

		if (options.behavior.length > 0)
		{
			require(["./ARIAButtonManagerAdditionalBehavior"], (ARIAButtonManagerAdditionalBehavior: ARIAButtonManagerAdditionalBehaviorsModule) =>
			{
				ARIAButtonManagerAdditionalBehavior.addBehaviors($element, $target);
			});
		}
		
    }

	protected isBehavior(option: ARIAButtonManagerButtonOptions, type)
	{
		return ((option.behavior + '').indexOf(type) !== -1);
	}

	protected onButtonInteraction($button : JQuery, e: KeyboardEvent)
	{
		if (this.evaluateEvent(e, { click: true, keydown: true, enter: true }))
		{
			let button = $button.get(0),
				options = this.getButtonOptions(button),
				localMethodName = "on" + options.eventtype;
			if (typeof this[localMethodName] === "function")
			{
				this[localMethodName].call(this, $button, options, e);
			}
			else
			{
				//console.log(localMethodName + ' is not a local function')
			} 
			if (this.isBehavior(options, this.Behaviors.PreventDefault))
			{
				e.preventDefault();
			}
			if (typeof options.runmodules === "string" && options.runmodules.length > 0)
			{
				let modules = options.runmodules.split(",");
				if (modules.length > 0)
				{
					require(modules, (...args) =>
					{
						args.map((module) =>
						{
							if (typeof module === "object")
							{
								if (typeof module.init === "function")
								{
									module.init($button, options);
								}
								if (typeof module.onButtonInteraction === "function")
								{
									module.ButtonInteraction($button, options);
								}
							}
						});
					});
				}
			}
		}
	}

	protected onToggle($button: JQuery, options: ARIAButtonManagerButtonOptions, e: KeyboardEvent)
	{
		let $target = $(options.targetselector),
			ishidden = <boolean>this.getElAttr($target, "aria-hidden"),
			eventType = (ishidden) ? this.Events.ShowTarget : this.Events.HideTarget;
		//We trigger the show or hide event on the target
		$target.trigger(eventType, [$button, options, e]);
	}

	protected onClose($button: JQuery, options: ARIAButtonManagerButtonOptions, e: KeyboardEvent)
	{
		let $target = $(options.targetselector);
		//We trigger the hide event on the target
		$target.trigger(this.Events.HideTarget, [$button, options, e]);
	}

	protected onTab($button: JQuery, options: ARIAButtonManagerButtonOptions, e: KeyboardEvent)
	{
		let $target = $(options.targetselector),
			$siblings = this.traverseResolve($button, this.tabbuttonSelector), // $button.siblings(this.tabbuttonSelector)
			ishidden = <boolean>this.getElAttr($target, "aria-hidden");
		e.preventDefault();
		// If a tab is already active we don't want to hide it
		if (ishidden)
		{
			$siblings.each((i, sibling) =>
			{
				let $sibling = $(sibling),
					siblingoptions = this.getButtonOptions($sibling),
					$siblingtarget = $(siblingoptions.targetselector);
				$siblingtarget.trigger(this.moduleName + "-hide", [$sibling, siblingoptions, e]);
			});
			//We trigger the show event on the target
			$target.trigger(this.Events.ShowTarget, [$button, options, e]);
		}
		else
		{
			if (this.isBehavior(options, this.Behaviors.AccordionTabs))
			{
				//Accordions may all be closed.
				$target.trigger(this.Events.HideTarget, [$button, options, e]);
			}
		}
	}
	
	private targetShow(currentEvent: Event, $button?: JQuery, buttonOptions?: ARIAButtonManagerButtonOptions, originalEvent?: KeyboardEvent)
	{
		let $target = $(currentEvent.target),
			targetoptions: ARIAButtonManagerTargetOptions = this.getTargetOptions($target),
			$buttons: JQuery = $('[aria-controls=' + targetoptions.id + ']');
		$target.attr('aria-hidden', "false");
		$buttons.trigger(this.Events.ChangeState, [$target, originalEvent]);
	}

	private targetHide(currentEvent: Event, $button?: JQuery, buttonOptions?: ARIAButtonManagerButtonOptions, originalEvent?: KeyboardEvent)
	{
		let $target = $(currentEvent.target),
			targetoptions: ARIAButtonManagerTargetOptions = this.getTargetOptions($target),
			$buttons: JQuery = $('[aria-controls=' + targetoptions.id + ']');
		$target.attr('aria-hidden', "true");
		$buttons.trigger(this.Events.ChangeState, [$target, originalEvent]);
	}

	protected changeButtonState(e, $target: JQuery, originalEvent: KeyboardEvent)
	{
		let $button = $(e.target),
			options = this.getButtonOptions(e.target),
			targetoptions = this.getTargetOptions($target);
		switch (options.eventtype)
		{
			case this.ButtonTypes.Close:
				//console.log('Right now the close button doesn\'t have any expanded property', $button)
				break;
			case this.ButtonTypes.Tab:
				//console.log('No support for tabs yet', $button)
				$button.attr('aria-selected', (targetoptions.hidden) ? "false" : "true");
				
			break;
			case this.ButtonTypes.Toggle: 
				//console.log('change state on toggle', $button)

				$button.attr('aria-expanded', (targetoptions.hidden) ? "false" : "true");
				$button.attr('aria-pressed', (targetoptions.hidden) ? "false" : "true");
			break;
		}
	}

	protected triggerEvents($button)
	{
		var options = this.getButtonOptions($button);
		if (options.triggerevents !== "")
		{
			//Triggers look like this "toggle[window|ManagedInitiation-Triggered]". "buttontype[parentobject|triggername]".
			var triggers = options.triggerevents.split(" ");

			triggers.map((trigger) =>
			{
				//Check if the trigger is relevant to the buttons action
				var runevent = (trigger.indexOf(options.eventtype) === 0)

				//Check if there are any additional methods regarding the trigger (-isvisible -ishidden)
				if (trigger.indexOf('-isvisible[') !== -1 || trigger.indexOf('-ishidden[') !== -1)
				{
					runevent = false;
					runevent = (trigger.indexOf('-isvisible') !== -1 && options.expanded === true) ? true : runevent;
					runevent = (trigger.indexOf('-ishidden') !== -1 && options.expanded === false) ? true : runevent;
				}
				
				if (runevent)
				{
					var parameterIndex = trigger.indexOf('['),
						actionnamestart = trigger.indexOf('|') + 1,
						action = trigger.substr(actionnamestart, (parameterIndex !== -1) ? (parameterIndex - actionnamestart) : trigger.length),
						parameters: string[] = (parameterIndex !== -1) ? trigger.substr(parameterIndex + 1, (trigger.length - parameterIndex - 2)).split("|") : [];
					
					if (parameters.length !== 0)
					{
						let selector: string | Window = parameters[0],
							$buttontarget = $(options.targetselector),
							eventparameters = [];
						selector = (selector === 'window') ? window : selector;
						let $element = $(selector),
							eventname = parameters[1];
						if ($element.length === 0)
						{
							$element = (selector === 'buttonparent') ? $button.parent() : null;
							$element = (selector === 'parent') ? $buttontarget.parent() : null;
						}
						
						
						if ($element.length !== 0)
						{
							eventparameters.push($buttontarget, $button);
							eventparameters = eventparameters.concat(parameters.slice(2));
							$element.trigger(eventname, eventparameters);
						}
					}
				}
			});
		}
	}

	public getButtonOptions(el)
	{
		let $el = $(el),
			buttontarget = <string>this.getElAttr($el, 'aria-controls')+'',
			expanded = <boolean>this.getElAttr($el, 'aria-expanded'),
			pressed = <boolean>this.getElAttr($el, 'aria-pressed'),
			role = <string>this.getElAttr($el, 'role'),
			behavior = (<string>this.getElData($el, 'behavior') + '').toLowerCase(),
			triggerevents = <string>this.getElData($el, 'triggerevent'),
			runmodules = <string>this.getElData($el, 'runmodules'),
			
			options: ARIAButtonManagerButtonOptions = {
				buttontarget: buttontarget,
				targetselector: ((buttontarget.indexOf('#') === -1 && buttontarget.length > 0) ? '#' : '') + buttontarget,
				pressed: pressed,
				role: role,
				expanded: expanded,
				behavior: behavior,
				runmodules: runmodules,
				eventtype:null
			};
		
		options.eventtype = this.parseEventType(options, $el);
		return options;
	}

	// This function will try to find siblings, and if unsuccessful look for similar items in the parents hierarchy
	protected traverseResolve($el: JQuery, selector: string)
	{
		let $targets = $el.siblings(selector);
		if ($targets.length === 0)
		{
			var $parent = $el.parent(),
				maxIterations = 5;
			for (var i = 0; i < maxIterations; i++)
			{
				$targets = $parent.find(selector);
				if ($targets.length <= 1) //Since we're looking from above in the hierarchy we will always find the original button 
				{
					$parent = $parent.parent();
				}
				else
				{
					break;
				}
			}
		}
		return $targets;
	}

	public getTargetOptions($el)
	{
		let hidden = <boolean>this.getElAttr($el, 'aria-hidden'),
			id = <string>this.getElAttr($el, 'id'),
			options: ARIAButtonManagerTargetOptions =
				{
					hidden: hidden,
					id:id
				};
		return options;
	}

	public parseEventType(options: ARIAButtonManagerButtonOptions, $el: JQuery)
	{
		let type = null;
		
		if (typeof options.role === "string" && options.role.length > 0)
		{
			if (options.role === "tab")
			{
				type = this.ButtonTypes.Tab;
			}
			else
			{
				type = options.role;
			}
		}
		else
		{
			if ($el.attr('aria-pressed') === null && $el.attr('aria-expanded') === null)
			{
				type = this.ButtonTypes.Close;
			}
			else
			{
				type = this.ButtonTypes.Toggle;
			}
		}

		return type;
	}
}


export = new ARIAButtonManager();