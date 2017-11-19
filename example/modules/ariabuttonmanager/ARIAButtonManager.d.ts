interface ARIAButtonManagerButtonOptions
{
	buttontarget: string;
	targetselector: string;
	pressed: boolean;
	role: string;
	expanded: boolean;
	behavior: string;
	triggerevents?: string;
	runmodules?: string;
	eventtype: string;
}
interface ARIAButtonManagerTargetOptions
{
	hidden: boolean;
	id: string;
}

interface ARIAButtonManagerButtonCollection
{
	$button: JQuery;
	options: ARIAButtonManagerButtonOptions;
}

interface ARIAButtonManagerModule
{
	moduleName: string;
	evaluateEvent(e: any, obj: Object): boolean;
	getButtonOptions(elm: JQuery): ARIAButtonManagerButtonOptions;
	getTargetOptions(elm: JQuery): ARIAButtonManagerTargetOptions;
	parseEventType(options: ARIAButtonManagerButtonOptions, $el: JQuery): string;
	ButtonTypes: ARIAButtonManagerButtonTypes;
	Events: ARIAButtonManagerEvents;
	Behaviors: ARIAButtonManagerBehaviors;
}

interface ARIAButtonManagerAdditionalBehaviorsModule
{
	addBehaviors($button: JQuery, $target: JQuery): void;
}

interface ARIAButtonManagerAdditionalBehaviorsModuleProcessQueueObj
{
	$button: JQuery;
	$target: JQuery;
	processed: boolean;
}

interface ARIAButtonManagerButtonTypes
{
	Toggle: string;
	Close: string;
	Tab: string;
}


interface ARIAButtonManagerEvents
{
	ShowTarget: string;
	HideTarget: string;
	ChangeState: string;
}

interface ARIAButtonManagerBehaviors
{
	AccordionTabs: string;
	CloseOnBodyClick: string; 
	PreventDefault: string;
	FocusInput: string;
	CloseOnLoadMobile: string;
	AddToGlobalState: string;
}