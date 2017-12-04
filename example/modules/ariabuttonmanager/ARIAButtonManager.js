/// <reference path="ariabuttonmanager.d.ts" />
define(["require", "exports", "tslib", "../managedinitiation/ManagedModuleBase"], function (require, exports, tslib_1, MMB) {
    "use strict";
    var ARIAButtonManager = /** @class */ (function (_super) {
        tslib_1.__extends(ARIAButtonManager, _super);
        function ARIAButtonManager() {
            var _this = _super.call(this) || this;
            _this.moduleName = 'ARIAButtonManager';
            _this.elementselector = 'a[aria-controls],button[aria-controls],button[data-runmodules],label[aria-controls],div[role="button"][aria-controls]';
            _this.tabbuttonSelector = '[role=tab]';
            _this.transitionTime = 200;
            _this.ButtonTypes = {
                Toggle: "Toggle",
                Close: "Close",
                Tab: "Tab"
            };
            _this.Behaviors = {
                AccordionTabs: "accordiontabs",
                CloseOnBodyClick: "closeonbodyclick",
                PreventDefault: "preventdefault",
                FocusInput: "focusinput",
                CloseOnLoadMobile: "closeonloadmobile",
                AddToGlobalState: "addtoglobalstate"
            };
            _this.Events = {
                ShowTarget: _this.moduleName + '-show',
                HideTarget: _this.moduleName + '-hide',
                ChangeState: _this.moduleName + '-changestate',
            };
            _this.addGlobalEvents();
            _this.initiateElements(_this.$body);
            return _this;
        }
        ARIAButtonManager.prototype.initiateElement = function ($parent, element) {
            this.addEventsToElements(element);
        };
        ARIAButtonManager.prototype.addGlobalEvents = function () {
            this.$w.on('ARIAButtonManager-initialize', this.initiateElements.bind(this, $('body')));
            //  this.$w.on('hashchange', this.onHashChange.bind(this));
            this.Helper.RunOnSectionInitiation(this.initiateElements.bind(this));
        };
        ARIAButtonManager.prototype.addEventsToElements = function (element) {
            var $element = $(element), options = this.getButtonOptions($element), $target = $(options.targetselector);
            $element.on('click keydown', this.onButtonInteraction.bind(this, $element)); //touchstart
            $element.on(this.Events.ChangeState, this.changeButtonState.bind(this));
            if ($target.length > 0 && typeof $target.attr('data-' + this.moduleName + "-hasevents") !== "string") {
                //$target.on(this.moduleName + '-show', this.setTargetState.bind(this, this.VisibleStates.Show));
                //$target.on(this.moduleName + '-hide', this.setTargetState.bind(this, this.VisibleStates.Hide));
                $target.on(this.Events.ShowTarget, this.targetShow.bind(this));
                $target.on(this.Events.HideTarget, this.targetHide.bind(this));
                $target.attr('data-' + this.moduleName + "-hasevents", "true");
            }
            if (options.behavior.length > 0) {
                require(["./ARIAButtonManagerAdditionalBehavior"], function (ARIAButtonManagerAdditionalBehavior) {
                    ARIAButtonManagerAdditionalBehavior.addBehaviors($element, $target);
                });
            }
        };
        ARIAButtonManager.prototype.isBehavior = function (option, type) {
            return ((option.behavior + '').indexOf(type) !== -1);
        };
        ARIAButtonManager.prototype.onButtonInteraction = function ($button, e) {
            if (this.evaluateEvent(e, { click: true, keydown: true, enter: true })) {
                var button = $button.get(0), options_1 = this.getButtonOptions(button), localMethodName = "on" + options_1.eventtype;
                if (typeof this[localMethodName] === "function") {
                    this[localMethodName].call(this, $button, options_1, e);
                }
                else {
                    //console.log(localMethodName + ' is not a local function')
                }
                if (this.isBehavior(options_1, this.Behaviors.PreventDefault)) {
                    e.preventDefault();
                }
                if (typeof options_1.runmodules === "string" && options_1.runmodules.length > 0) {
                    var modules = options_1.runmodules.split(",");
                    if (modules.length > 0) {
                        require(modules, function () {
                            var args = [];
                            for (var _i = 0; _i < arguments.length; _i++) {
                                args[_i] = arguments[_i];
                            }
                            args.map(function (module) {
                                if (typeof module === "object") {
                                    if (typeof module.init === "function") {
                                        module.init($button, options_1);
                                    }
                                    if (typeof module.onButtonInteraction === "function") {
                                        module.ButtonInteraction($button, options_1);
                                    }
                                }
                            });
                        });
                    }
                }
            }
        };
        ARIAButtonManager.prototype.onToggle = function ($button, options, e) {
            var $target = $(options.targetselector), ishidden = this.getElAttr($target, "aria-hidden"), eventType = (ishidden) ? this.Events.ShowTarget : this.Events.HideTarget;
            //We trigger the show or hide event on the target
            $target.trigger(eventType, [$button, options, e]);
        };
        ARIAButtonManager.prototype.onClose = function ($button, options, e) {
            var $target = $(options.targetselector);
            //We trigger the hide event on the target
            $target.trigger(this.Events.HideTarget, [$button, options, e]);
        };
        ARIAButtonManager.prototype.onTab = function ($button, options, e) {
            var _this = this;
            var $target = $(options.targetselector), $siblings = this.traverseResolve($button, this.tabbuttonSelector), // $button.siblings(this.tabbuttonSelector)
            ishidden = this.getElAttr($target, "aria-hidden");
            e.preventDefault();
            // If a tab is already active we don't want to hide it
            if (ishidden) {
                $siblings.each(function (i, sibling) {
                    var $sibling = $(sibling), siblingoptions = _this.getButtonOptions($sibling), $siblingtarget = $(siblingoptions.targetselector);
                    $siblingtarget.trigger(_this.moduleName + "-hide", [$sibling, siblingoptions, e]);
                });
                //We trigger the show event on the target
                $target.trigger(this.Events.ShowTarget, [$button, options, e]);
            }
            else {
                if (this.isBehavior(options, this.Behaviors.AccordionTabs)) {
                    //Accordions may all be closed.
                    $target.trigger(this.Events.HideTarget, [$button, options, e]);
                }
            }
        };
        ARIAButtonManager.prototype.targetShow = function (currentEvent, $button, buttonOptions, originalEvent) {
            var $target = $(currentEvent.target), targetoptions = this.getTargetOptions($target), $buttons = $('[aria-controls=' + targetoptions.id + ']');
            $target.attr('aria-hidden', "false");
            $buttons.trigger(this.Events.ChangeState, [$target, originalEvent]);
        };
        ARIAButtonManager.prototype.targetHide = function (currentEvent, $button, buttonOptions, originalEvent) {
            var $target = $(currentEvent.target), targetoptions = this.getTargetOptions($target), $buttons = $('[aria-controls=' + targetoptions.id + ']');
            $target.attr('aria-hidden', "true");
            $buttons.trigger(this.Events.ChangeState, [$target, originalEvent]);
        };
        ARIAButtonManager.prototype.changeButtonState = function (e, $target, originalEvent) {
            var $button = $(e.target), options = this.getButtonOptions(e.target), targetoptions = this.getTargetOptions($target);
            switch (options.eventtype) {
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
        };
        ARIAButtonManager.prototype.triggerEvents = function ($button) {
            var options = this.getButtonOptions($button);
            if (options.triggerevents !== "") {
                //Triggers look like this "toggle[window|ManagedInitiation-Triggered]". "buttontype[parentobject|triggername]".
                var triggers = options.triggerevents.split(" ");
                triggers.map(function (trigger) {
                    //Check if the trigger is relevant to the buttons action
                    var runevent = (trigger.indexOf(options.eventtype) === 0);
                    //Check if there are any additional methods regarding the trigger (-isvisible -ishidden)
                    if (trigger.indexOf('-isvisible[') !== -1 || trigger.indexOf('-ishidden[') !== -1) {
                        runevent = false;
                        runevent = (trigger.indexOf('-isvisible') !== -1 && options.expanded === true) ? true : runevent;
                        runevent = (trigger.indexOf('-ishidden') !== -1 && options.expanded === false) ? true : runevent;
                    }
                    if (runevent) {
                        var parameterIndex = trigger.indexOf('['), actionnamestart = trigger.indexOf('|') + 1, action = trigger.substr(actionnamestart, (parameterIndex !== -1) ? (parameterIndex - actionnamestart) : trigger.length), parameters = (parameterIndex !== -1) ? trigger.substr(parameterIndex + 1, (trigger.length - parameterIndex - 2)).split("|") : [];
                        if (parameters.length !== 0) {
                            var selector = parameters[0], $buttontarget = $(options.targetselector), eventparameters = [];
                            selector = (selector === 'window') ? window : selector;
                            var $element = $(selector), eventname = parameters[1];
                            if ($element.length === 0) {
                                $element = (selector === 'buttonparent') ? $button.parent() : null;
                                $element = (selector === 'parent') ? $buttontarget.parent() : null;
                            }
                            if ($element.length !== 0) {
                                eventparameters.push($buttontarget, $button);
                                eventparameters = eventparameters.concat(parameters.slice(2));
                                $element.trigger(eventname, eventparameters);
                            }
                        }
                    }
                });
            }
        };
        ARIAButtonManager.prototype.getButtonOptions = function (el) {
            var $el = $(el), buttontarget = this.getElAttr($el, 'aria-controls') + '', expanded = this.getElAttr($el, 'aria-expanded'), pressed = this.getElAttr($el, 'aria-pressed'), role = this.getElAttr($el, 'role'), behavior = (this.getElData($el, 'behavior') + '').toLowerCase(), triggerevents = this.getElData($el, 'triggerevent'), runmodules = this.getElData($el, 'runmodules'), options = {
                buttontarget: buttontarget,
                targetselector: ((buttontarget.indexOf('#') === -1 && buttontarget.length > 0) ? '#' : '') + buttontarget,
                pressed: pressed,
                role: role,
                expanded: expanded,
                behavior: behavior,
                runmodules: runmodules,
                eventtype: null
            };
            options.eventtype = this.parseEventType(options, $el);
            return options;
        };
        // This function will try to find siblings, and if unsuccessful look for similar items in the parents hierarchy
        ARIAButtonManager.prototype.traverseResolve = function ($el, selector) {
            var $targets = $el.siblings(selector);
            if ($targets.length === 0) {
                var $parent = $el.parent(), maxIterations = 5;
                for (var i = 0; i < maxIterations; i++) {
                    $targets = $parent.find(selector);
                    if ($targets.length <= 1) {
                        $parent = $parent.parent();
                    }
                    else {
                        break;
                    }
                }
            }
            return $targets;
        };
        ARIAButtonManager.prototype.getTargetOptions = function ($el) {
            var hidden = this.getElAttr($el, 'aria-hidden'), id = this.getElAttr($el, 'id'), options = {
                hidden: hidden,
                id: id
            };
            return options;
        };
        ARIAButtonManager.prototype.parseEventType = function (options, $el) {
            var type = null;
            if (typeof options.role === "string" && options.role.length > 0) {
                if (options.role === "tab") {
                    type = this.ButtonTypes.Tab;
                }
                else {
                    type = options.role;
                }
            }
            else {
                if ($el.attr('aria-pressed') === null && $el.attr('aria-expanded') === null) {
                    type = this.ButtonTypes.Close;
                }
                else {
                    type = this.ButtonTypes.Toggle;
                }
            }
            return type;
        };
        return ARIAButtonManager;
    }(MMB.ManagedModule.Base));
    return new ARIAButtonManager();
});
