---
title: JS Naming convention
componentid: js-naming-conventions
variantid: regular
guid: 672ee691-252c-48ef-b25e-a429cac2923f
----

JS should only target _js-_ prefixed classes. JS should never target styled classes.
JS may however check, add and remove state classes.

## nopreview Correct JS selectors:
```js
$('.js-openmenu').on('click', (btn) => { $(btn).addClass('is-open'); })
```

## nopreview Incorrect JS selectors:
```js
$('.menubutton').on(...)
```
