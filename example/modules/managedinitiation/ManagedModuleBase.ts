/// <reference path="managedinitiation.d.ts" />

import _Helper = require("./ManagedInitiationHelper");
export module ManagedModule
{
	export class Base
	{
		public moduleName: string = '';
		public elementselector = '';
		protected Helper = _Helper;
		protected $w = $(window);
		protected $body = $('body');
		protected elements: HTMLElement[] = [];
		
		constructor()
		{
			if (this.moduleName.length < 2)
			{
				let newName = this.constructor.toString().match(/\w+/g)[1];
				this.moduleName = (typeof newName === "string" && newName.length > 1) ? newName : this.moduleName;
			}
		}
		public getUniqueId()
		{
			return Math.random().toString(36).slice(-12);
		}

		protected initiateElements($parent: JQuery, elementselector? : string, elementsArray?: HTMLElement[])
		{
			let selector = (typeof elementselector === "string") ? elementselector : this.elementselector;
			let arElements = (typeof elementsArray !== "undefined") ? elementsArray : this.elements;

			let elements = $parent.find(selector).not('[data-initialized-scripts~="' + this.moduleName + '"]').get();

			elements = elements.filter((el) => { return this.Helper.filterManagedElements(el, $parent) });

			if (elements.length)
			{
				elements.map(this.initiateElement.bind(this, $parent));
				elements.map(this.setElementAsInitialized.bind(this));
				arElements = arElements.concat(elements);
				
				if (typeof elementsArray !== "undefined")
				{
					elementsArray = arElements;
					return elementsArray;
				}
				else
				{
					
					this.elements = arElements;
				}
			}
		}

		protected initiateElement($parent: JQuery, element: HTMLElement)
		{
			// Module should do it's own work
		}

		protected setElementAsInitialized(el: HTMLElement, i: Number)
		{
			if (typeof i === "number" && typeof el !== "undefined")
			{
				let strInitialized = $(el).data("initialized-scripts");
				let initialized = (typeof strInitialized === "undefined") ? [] : strInitialized.split(' ');
				initialized.push(this.moduleName);
				$(el).attr("data-initialized-scripts", initialized.join(" "));
			}
		}


		protected evaluateEvent(e: KeyboardEvent, options: ManagedModuleEvaluateEventOptions)
		{
			if (options.click && e.type === "click")
			{
				return true;
			}
			if (options.keydown && e.type === "keydown")
			{
				var ok = (options.enter && (e.keyCode === 0 || e.keyCode === 13));
				//console.log('ok && options.enter', ok && options.enter);
				//console.log('(e.keyCode === 0 || e.keyCode === 13)', (e.keyCode === 0 || e.keyCode === 13));
				//console.log('options.esc && (e.keyCode === 27)', options.esc, options.esc && (e.keyCode === 27));
				ok = (!ok && options.esc && (e.keyCode === 27));
				//console.log('ok',ok) 
				return ok;
				
			}
			return false;
		}
		protected getElData($el: JQuery, key : string)
		{
			let val = $el.data(key);
			return (typeof val === "undefined") ? "" : val;
		}
		protected getElAttr($el: JQuery, key: string)
		{
			let val: string | boolean = $el.attr(key);

			if (typeof val === "string" && (val === "true" || val === "false"))
			{
				val = (val === "true"); //We set the value to a boolean if it contains true or false
			}

			return (typeof val === "undefined") ? "" : val;
		}
	}
	interface ManagedModuleEvaluateEventOptions
	{
		click?: boolean;
		keydown?: boolean;
		enter?: boolean;
		esc?: boolean;
	}
}