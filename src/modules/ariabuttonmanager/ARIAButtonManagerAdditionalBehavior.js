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
define(["require", "exports"], function (require, exports) {
    "use strict";
    var ARIAButtonManagerAdditionalBehaviors = /** @class */ (function () {
        function ARIAButtonManagerAdditionalBehaviors() {
            var _this = this;
            this.$html = $('html');
            this.$body = $('body');
            this.ARIAButtonManager = null;
            this.buttonsToProcess = [];
            this.bodyClickButtonTargets = [];
            require(["./ARIAButtonManager"], function (ARIAButtonManager) {
                _this.ARIAButtonManager = ARIAButtonManager;
                _this.Behaviors = _this.ARIAButtonManager.Behaviors;
                _this.processQueue();
            });
            this.$body.on('click', this.onBodyClick.bind(this));
            this.$body.on('keydown', this.onKeyDown.bind(this));
        }
        ARIAButtonManagerAdditionalBehaviors.prototype.processQueue = function () {
            var _this = this;
            this.buttonsToProcess.map(function (obj) {
                if (!obj.processed) {
                    _this.addBehaviors(obj.$button, obj.$target);
                    obj.processed = true;
                }
            });
        };
        ARIAButtonManagerAdditionalBehaviors.prototype.addBehaviors = function ($button, $target) {
            var _this = this;
            if (this.ARIAButtonManager === null) {
                this.buttonsToProcess.push({ $button: $button, $target: $target, processed: false });
            }
            else {
                var btnoptions = this.ARIAButtonManager.getButtonOptions($button);
                // ## Close target on body click
                if (this.isBehavior(btnoptions, this.Behaviors.CloseOnBodyClick)) {
                    this.bodyClickButtonTargets.push(btnoptions.buttontarget);
                }
                // ## Focus closest input when target is shown
                if (this.isBehavior(btnoptions, this.Behaviors.FocusInput)) {
                    var $target_1 = $(btnoptions.targetselector);
                    $target_1.on(this.ARIAButtonManager.Events.ShowTarget, function (e) {
                        $target_1.find('input[type=search], input[type=text]').eq(0).trigger('focus');
                    });
                }
                // ## Close on mobile load
                if (this.isBehavior(btnoptions, this.Behaviors.CloseOnLoadMobile)) {
                    try {
                        if (window.matchMedia("(max-width:48em)").matches) {
                            $target.trigger(this.ARIAButtonManager.Events.HideTarget);
                        }
                    }
                    catch (e) { }
                }
                // ## Add to global state
                if (this.isBehavior(btnoptions, this.Behaviors.AddToGlobalState)) {
                    var initialoptions = this.ARIAButtonManager.getTargetOptions($target);
                    this.$html.attr('data-targetvisibility-' + initialoptions.id, (initialoptions.hidden !== false) ? "hidden" : "visible");
                    $target.on(this.ARIAButtonManager.Events.ChangeState, function (e) {
                        var options = _this.ARIAButtonManager.getTargetOptions($target);
                        _this.$html.attr('data-targetvisibility-' + options.id, (options.hidden !== false) ? "hidden" : "visible");
                    });
                }
            }
        };
        ARIAButtonManagerAdditionalBehaviors.prototype.isBehavior = function (option, type) {
            return ((option.behavior + '').indexOf(type) !== -1);
        };
        ARIAButtonManagerAdditionalBehaviors.prototype.onBodyClick = function (e) {
            var _this = this;
            if (this.ARIAButtonManager.evaluateEvent(e, { click: true, keydown: true, esc: true })) {
                var $eventtarget_1 = $(e.target);
                this.bodyClickButtonTargets.map(function (selector) {
                    if ((e.type === "keydown") ||
                        ((e.type === "click") &&
                            ($eventtarget_1.attr('id') !== selector) &&
                            ($eventtarget_1.attr('aria-controls') !== selector) &&
                            ($eventtarget_1.parents('#' + selector).length === 0))) {
                        var $target = $('#' + selector);
                        if ($target.length > 0) {
                            var targetoptions = _this.ARIAButtonManager.getTargetOptions($target);
                            if ($eventtarget_1.parents("[aria-controls='" + targetoptions.id + "']").length === 0) {
                                if (!targetoptions.hidden) {
                                    $target.trigger(_this.ARIAButtonManager.moduleName + '-hide');
                                }
                            }
                        }
                    }
                });
            }
        };
        ARIAButtonManagerAdditionalBehaviors.prototype.onKeyDown = function (e) {
            this.onBodyClick(e);
        };
        return ARIAButtonManagerAdditionalBehaviors;
    }());
    return new ARIAButtonManagerAdditionalBehaviors();
});
