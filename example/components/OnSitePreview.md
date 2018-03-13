---
title:  On Site Preview
componentid: component-buttons-another
guid: 4ae9a305-c42d-4d4c-bfd8-ce076f5a7fad
----

"On Site Preview" is a set of features that allows you to preview components in this project but within another context such as another locally hosted website.

To use this feature; this project need to be run in "dev" mode. This feature is not available in the built website version of the project.

You can preview this feature on this [page](/example/components/OnSitePreview.html) (This will only work if in development mode).

## nopreview Configuration
Below is an example config snippet for On Site Preview.

The "onsitepreview" object should be at the root level of the configuration tree, preferrably in the user config file (user-conf.json).

Make sure the "hook" setting corresponds to the correct path where you want to inject the component

```js
"onsitepreview":
{
    "components":
    [
        {
            "guid": "31495b40-9492-40e4-86e3-1e06bfc40171", // Required. GUID of the compontent
            "hook": "#SomeElement > div > p", // Required. Selector at which the component will be injected
            "state": 0, // Optional. State index. 0 will be the first state that is defined. Defaults to 0.
            "inject_pos": "after", // Optional. Specifies where it will be injected in relation to the selector. Before, after, append or prepend. Defaults to after.
            "wrapper": "<p class='preview'></p>", // Optional. The component will be wrapped in this tag if specified.
            "extra_css": ".preview .some-component { position: absolute; width: 100%; }" // Optional. This CSS will be injected in the page in addition to the component.
        }
    ]
}
```

## 1. Start the project in development mode

```shell
npm run dev
```

## nopreview 2. Add the script for On Site Preview in your other project
The port is dependant on the port you set in the configuration.

```html
<script src="http://localhost:9001/ospClient.js"></script>
```
