---
title: ARIA Button manager
guid: e2fdcfd8-d001-4854-9a15-91d9c41da495
private: true
requirejs: jquery,modules/ariabuttonmanager/ARIAButtonManager, modules/ariabuttonmanager/ARIAButtonManagerAdditionalBehavior, modules/managedinitiation/ManagedModuleBase
----

Since we're writing semantinc markup we want to use existing attributes that help screenreaders instead of custom classes that mean the same thing.

Using the attribute aria-hidden="true" should hide the actual content.

Tabs
--
With the combination of the attributes aria-selected, role="tabs" and aria-controls we can say that a button should have a tabbed behavior.

Toggle buttons
--
With the combination of the attributes aria-pressed and aria-controls we can say that a button should have a toggling behavior.

Close buttons
--
If a button only has the attribute aria-controls it will default to be a close button that sets aria-hidden to true when pressed

Additional features
--


### data-triggerevent="buttontype[parentobject|triggername]"
This property will take a button type (toggle, close, tab) and toggle-isvisible, toggle-ishidden.
It will trigger an event on the object with the name specified.
toggle[window|ManagedInitiation-Triggered]

### data-runmodules="modulename1,modulename2"
This attribute will load in additional modules through require and run their init method with the button as the first parameter

### data-behavior="behavior1, behavior2"
This attribute will see if this script support any of the behaviors specified in this attribute. Is so an additional script will be loaded that will add the extra functionality


## Simple toggle button
```html
<div>
<button aria-controls="examplediv" class="button">Click to show div</button>
<div id="examplediv" aria-hidden="true">I'm hidden by default</div>
</div>
```

