---
title: Accessibility testing
componentid: accessibility-testing
variantid: regular
guid: 764b1496-243d-43f3-88c1-81fab6d732fb
----

## Ensure your markup is valid
Paste your markup into the [W3C Validator](https://validator.w3.org/#validate_by_input) and make sure it is valid.
Invalid markup is extra problematic for screen reader software.

## Run an audit in chrome
This test also works on locally hosted websites (event localhost).

1. Navigate to the website you want to test in Chrome
2. Open up Developer Tools (Ctrl + Shift + I or F12)
3. Open the Audit tab
4. Click on the "Perform an audit..." button
5. Select only "Accessibility"
6. Click the Run audit button

Check each item that did not pass. Most issues have a read more link that will take to you a in depth description of the problem and how to progress with the issue.

## Additional tests and tools
* [Section 508 Checklist](https://www.hhs.gov/web/section-508/making-files-accessible/checklist/html/index.html)
* [W3C Accessbility Evaluation Tools List](https://www.w3.org/WAI/ER/tools/)

