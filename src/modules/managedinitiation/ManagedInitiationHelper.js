/// <reference path="managedinitiation.d.ts" />
define(["require", "exports"], function (require, exports) {
    "use strict";
    //import MMB = require("./ManagedModuleBase");
    var ManagedInitiationHelper // extends MMB.ManagedModule.Base 
     = /** @class */ (function () {
        function ManagedInitiationHelper() {
            //super();
            var _this = this;
            this.moduleName = 'ManagedInitiationHelper';
            this.elementselector = '[data-managedinitiation-trigger]';
            this.GlobalTriggerEvent = 'ManagedInitiation-Triggered';
            this.initiationFunctions = [];
            this.PromoAreaFinishedEvent = 'promoarea-finished';
            this.promoareaHasFinishedLoading = false;
            this.promoAreaFunctions = [];
            this.$w = $(window);
            this.$body = $('body');
            this.$w.on(this.GlobalTriggerEvent, function (e, managedElement) {
                if (_this.initiationFunctions.length > 0) {
                    _this.initiationFunctions.map(function (fn) {
                        fn($(managedElement));
                    });
                }
                $(managedElement).trigger(_this.moduleName + 'trigger-completed');
            });
            this.$w.on(this.PromoAreaFinishedEvent, function () {
                //Promoarea has run, process queue
                _this.promoareaHasFinishedLoading = true;
                _this.promoAreaFunctions.forEach(function (fn) {
                    fn();
                });
            });
        }
        ManagedInitiationHelper.prototype.InitiateArea = function (element) {
            this.$w.trigger(this.GlobalTriggerEvent, element);
            this.$w.trigger('loadoptionalcomponents');
        };
        // Should be the same function as in ManagedModuleBase
        ManagedInitiationHelper.prototype.filterManagedElements = function (el, $parent) {
            //We want it to remove items that are not owned directly by the parent
            var $parents = $(el).parents(this.elementselector).eq(0);
            /* jshint ignore:start */
            return $parents.length === 0 || $parents.get(0) == $parent.get(0) || typeof $parents.attr('data-managedinitiation-triggeredtime') === 'string';
            /* jshint ignore:end */
        };
        ManagedInitiationHelper.prototype.RunAfterPromoArea = function (fn) {
            if (this.promoareaHasFinishedLoading) {
                fn();
            }
            else {
                this.promoAreaFunctions.push(fn);
            }
        };
        ManagedInitiationHelper.prototype.RunOnSectionInitiation = function (fn) {
            if (typeof fn === "function") {
                this.initiationFunctions.push(fn);
            }
        };
        return ManagedInitiationHelper;
    }());
    return new ManagedInitiationHelper();
});
