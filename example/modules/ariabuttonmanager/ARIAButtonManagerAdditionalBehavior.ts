/// <reference path="ariabuttonmanager.d.ts" />
/*
# ARIA Button additional behaviors
* closeonbodyclick
* focusinput
* addtoglobalstate


    NOT IMPLEMENTED YET
	Possible extrabehaviors:
		hidevisiblefirst
		closeonbodyclick
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


class ARIAButtonManagerAdditionalBehaviors
{
	"use strict";
	protected $html = $('html');
	protected $body = $('body');
	protected ARIAButtonManager: ARIAButtonManagerModule = null;
	protected buttonsToProcess: ARIAButtonManagerAdditionalBehaviorsModuleProcessQueueObj[] = [];
	protected bodyClickButtonTargets: string[] = [];
	protected Behaviors: ARIAButtonManagerBehaviors ;
    constructor()
	{
		require(["./ARIAButtonManager"], (ARIAButtonManager: ARIAButtonManagerModule) =>
		{
			this.ARIAButtonManager = ARIAButtonManager;
			this.Behaviors = this.ARIAButtonManager.Behaviors;
			this.processQueue();
		});
		this.$body.on('click', this.onBodyClick.bind(this));
		this.$body.on('keydown', this.onKeyDown.bind(this));
    }


	private processQueue()
	{
		this.buttonsToProcess.map((obj: ARIAButtonManagerAdditionalBehaviorsModuleProcessQueueObj) =>
		{
			if (!obj.processed)
			{
				this.addBehaviors(obj.$button, obj.$target);
				obj.processed = true;
			}
		});
	}
    public addBehaviors($button: JQuery, $target: JQuery)
	{
		if (this.ARIAButtonManager === null)
		{
			this.buttonsToProcess.push({ $button: $button, $target: $target, processed: false });
		}
		else
		{
			var btnoptions = this.ARIAButtonManager.getButtonOptions($button);
			// ## Close target on body click
			if (this.isBehavior(btnoptions, this.Behaviors.CloseOnBodyClick))
			{
				this.bodyClickButtonTargets.push(btnoptions.buttontarget);
			}
			
			// ## Focus closest input when target is shown
			if (this.isBehavior(btnoptions, this.Behaviors.FocusInput))
			{
				let $target = $(btnoptions.targetselector);
				
				$target.on(this.ARIAButtonManager.Events.ShowTarget, (e) =>
				{
					$target.find('input[type=search], input[type=text]').eq(0).trigger('focus');
				});
			}
			// ## Close on mobile load
			if (this.isBehavior(btnoptions, this.Behaviors.CloseOnLoadMobile))
			{
				try
				{
					if (window.matchMedia("(max-width:48em)").matches)
					{
						$target.trigger(this.ARIAButtonManager.Events.HideTarget);
					}
				} catch (e) { }
			}

			// ## Add to global state
			if (this.isBehavior(btnoptions, this.Behaviors.AddToGlobalState))
			{
				let initialoptions = this.ARIAButtonManager.getTargetOptions($target); 
				this.$html.attr('data-targetvisibility-' + initialoptions.id, (initialoptions.hidden !== false) ? "hidden" : "visible");
				$target.on(this.ARIAButtonManager.Events.ChangeState, (e) =>
				{
					let options = this.ARIAButtonManager.getTargetOptions($target);
					this.$html.attr('data-targetvisibility-' + options.id, (options.hidden !== false) ? "hidden" : "visible");
				});
			}
		}
    }

	protected isBehavior(option: ARIAButtonManagerButtonOptions, type)
	{
		return ((option.behavior + '').indexOf(type) !== -1);
	}

    protected onBodyClick(e: KeyboardEvent)
	{
        if (this.ARIAButtonManager.evaluateEvent(e, { click: true, keydown: true, esc: true }))
		{
			let $eventtarget = $(e.target)
			this.bodyClickButtonTargets.map((selector) =>
			{
				if ((e.type === "keydown") ||
					((e.type === "click") &&
					($eventtarget.attr('id') !== selector) &&
					($eventtarget.attr('aria-controls') !== selector) &&
					($eventtarget.parents('#' + selector).length === 0)))
				{
					let $target = $('#' + selector);
					if ($target.length > 0)
					{
						let targetoptions = this.ARIAButtonManager.getTargetOptions($target);
						if ($eventtarget.parents("[aria-controls='" + targetoptions.id + "']").length === 0)
						{
							if (!targetoptions.hidden)
							{
								$target.trigger(this.ARIAButtonManager.moduleName + '-hide');
							}
						}
					}
				}
			});
        }
    }

	protected onKeyDown(e: KeyboardEvent)
	{
		this.onBodyClick(e);
	}

}

export = new ARIAButtonManagerAdditionalBehaviors();