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
define(["require", "exports", "./ManagedModuleBase"], function (require, exports, MMB) {
    "use strict";
    var ManagedInitiation = /** @class */ (function (_super) {
        __extends(ManagedInitiation, _super);
        function ManagedInitiation() {
            var _this = _super.call(this) || this;
            _this.moduleName = 'ManagedInitiation';
            _this.elementselector = '[data-managedinitiation-trigger]';
            _this.queue = [];
            _this.approachSections = [];
            _this.allApproachSections = [];
            _this.initiateElements_local();
            return _this;
        }
        ManagedInitiation.prototype.initiateElements_local = function () {
            var _this = this;
            var elements = $(this.elementselector).not('[data-initialized-scripts~="' + this.moduleName + '"]').get();
            elements.map(function (el, i) {
                _this.evaluateElements(el, i);
                _this.setElementAsInitialized(el, i);
            });
            this.elements = this.elements.concat(elements);
            if (this.approachSections.length !== 0) {
                this.initiateApproachBehavior();
            }
            this.processQueue();
            //this.checkApproachSectionsPosition();
        };
        ManagedInitiation.prototype.initiateApproachBehavior = function () {
            this.$w.on('scroll', this.checkApproachSectionsPosition.bind(this));
        };
        ManagedInitiation.prototype.checkApproachSectionsPosition = function () {
            var _this = this;
            if (this.approachSections.length) {
                var viewport_1 = {
                    height: (window.innerHeight || document.documentElement.clientHeight || 0),
                    width: (window.innerWidth || document.documentElement.clientWidth || 0),
                    top: (window.pageYOffset || document["scrollTop"] || 0) - (document["clientTop"] || 0),
                    bottom: 0
                };
                viewport_1.bottom = viewport_1.top + viewport_1.height;
                var elementsToRemove_1 = [];
                this.approachSections.forEach(function (el, i) {
                    var scrolledTo = el.dataset["scrolltosectionmanagerScrolledto"] + "", threshhold = parseInt(el.dataset["managedinitiationApproachthreshhold"], 10);
                    if (scrolledTo === "false" || scrolledTo === "undefined") {
                        threshhold = (threshhold > 0) ? threshhold : 200;
                        var rect = el.getBoundingClientRect(), pixelsFromViewportBottom = (rect.top - viewport_1.height);
                        if (pixelsFromViewportBottom < threshhold) {
                            $(el).trigger(_this.moduleName + 'trigger-load');
                            elementsToRemove_1.push(i);
                        }
                    }
                });
                if (elementsToRemove_1.length > 0) {
                    elementsToRemove_1.forEach(function (val, i) {
                        _this.approachSections.splice(val, 1);
                    });
                }
            }
            else {
                this.$w.off('scroll', this.checkApproachSectionsPosition.bind(this));
            }
        };
        ManagedInitiation.prototype.filterManagedElements = function (el) {
            //We want it to remove items that is going to be managed by us
            return $(el).parents(this.elementselector).length === 0;
        };
        ManagedInitiation.prototype.evaluateElements = function (el, i) {
            var options = this.getElementOptions(el);
            switch (options.trigger) {
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
        };
        ManagedInitiation.prototype.processQueue = function () {
            if (this.queue.length > 0) {
                $(this.queue[0]).trigger(this.moduleName + 'trigger-load');
            }
        };
        ManagedInitiation.prototype.triggerElement = function (e) {
            var $el = $(e.target);
            $el.attr('data-' + this.moduleName + '-triggeredtime', (new Date()).toISOString());
            this.$w.trigger(this.Helper.GlobalTriggerEvent, $el);
        };
        ManagedInitiation.prototype.triggerCompletedElement = function (e) {
            var _this = this;
            var $el = $(e.target);
            if (this.queue.length > 0) {
                this.queue.map(function (el, i) {
                    if (el === $el.get(0)) {
                        _this.queue.splice(i, 1);
                    }
                });
                if (this.queue.length > 0) {
                    this.processQueue();
                }
                else {
                    $el.attr(this.moduleName + 'triggered', "true");
                }
            }
        };
        ManagedInitiation.prototype.getElementOptions = function (el) {
            var $el = $(el), trigger = this.getElData($el, 'managedinitiation-trigger'), approachthreshhold = this.getElData($el, 'managedinitiation-approachthreshhold'), options = {
                trigger: trigger,
                approachthreshhold: approachthreshhold
            };
            return options;
        };
        return ManagedInitiation;
    }(MMB.ManagedModule.Base));
    return new ManagedInitiation();
});
