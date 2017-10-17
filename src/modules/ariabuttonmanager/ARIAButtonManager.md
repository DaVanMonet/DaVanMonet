---
title: ARIA Button manager
guid: e2fdcfd8-d001-4854-9a15-91d9c41da495
requirejs: jquery,modules/ariabuttonmanager/ARIAButtonManager, modules/ariabuttonmanager/ARIAButtonManagerAdditionalBehavior, modules/managedinitiation/ManagedModuleBase
----
# ARIA Button manager

## Simple toggle button
```html
<div>
<button aria-controls="examplediv" class="button">Click to show div</button>
<div id="examplediv" aria-hidden="true">I'm hidden by default</div>
</div>
```

