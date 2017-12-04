/// <reference path="managedinitiation.d.ts" />
define(["require", "exports", "./ManagedInitiationHelper"], function (require, exports, _Helper) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ManagedModule;
    (function (ManagedModule) {
        var Base = /** @class */ (function () {
            function Base() {
                this.moduleName = '';
                this.elementselector = '';
                this.Helper = _Helper;
                this.$w = $(window);
                this.$body = $('body');
                this.elements = [];
                if (this.moduleName.length < 2) {
                    var newName = this.constructor.toString().match(/\w+/g)[1];
                    this.moduleName = (typeof newName === "string" && newName.length > 1) ? newName : this.moduleName;
                }
            }
            Base.prototype.getUniqueId = function () {
                return Math.random().toString(36).slice(-12);
            };
            Base.prototype.initiateElements = function ($parent, elementselector, elementsArray) {
                var _this = this;
                var selector = (typeof elementselector === "string") ? elementselector : this.elementselector;
                var arElements = (typeof elementsArray !== "undefined") ? elementsArray : this.elements;
                var elements = $parent.find(selector).not('[data-initialized-scripts~="' + this.moduleName + '"]').get();
                elements = elements.filter(function (el) { return _this.Helper.filterManagedElements(el, $parent); });
                if (elements.length) {
                    elements.map(this.initiateElement.bind(this, $parent));
                    elements.map(this.setElementAsInitialized.bind(this));
                    arElements = arElements.concat(elements);
                    if (typeof elementsArray !== "undefined") {
                        elementsArray = arElements;
                        return elementsArray;
                    }
                    else {
                        this.elements = arElements;
                    }
                }
            };
            Base.prototype.initiateElement = function ($parent, element) {
                // Module should do it's own work
            };
            Base.prototype.setElementAsInitialized = function (el, i) {
                if (typeof i === "number" && typeof el !== "undefined") {
                    var strInitialized = $(el).data("initialized-scripts");
                    var initialized = (typeof strInitialized === "undefined") ? [] : strInitialized.split(' ');
                    initialized.push(this.moduleName);
                    $(el).attr("data-initialized-scripts", initialized.join(" "));
                }
            };
            Base.prototype.evaluateEvent = function (e, options) {
                if (options.click && e.type === "click") {
                    return true;
                }
                if (options.keydown && e.type === "keydown") {
                    var ok = (options.enter && (e.keyCode === 0 || e.keyCode === 13));
                    //console.log('ok && options.enter', ok && options.enter);
                    //console.log('(e.keyCode === 0 || e.keyCode === 13)', (e.keyCode === 0 || e.keyCode === 13));
                    //console.log('options.esc && (e.keyCode === 27)', options.esc, options.esc && (e.keyCode === 27));
                    ok = (!ok && options.esc && (e.keyCode === 27));
                    //console.log('ok',ok) 
                    return ok;
                }
                return false;
            };
            Base.prototype.getElData = function ($el, key) {
                var val = $el.data(key);
                return (typeof val === "undefined") ? "" : val;
            };
            Base.prototype.getElAttr = function ($el, key) {
                var val = $el.attr(key);
                if (typeof val === "string" && (val === "true" || val === "false")) {
                    val = (val === "true"); //We set the value to a boolean if it contains true or false
                }
                return (typeof val === "undefined") ? "" : val;
            };
            return Base;
        }());
        ManagedModule.Base = Base;
    })(ManagedModule = exports.ManagedModule || (exports.ManagedModule = {}));
});
