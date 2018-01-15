---
title: Front-end Code Guidelines
componentid: frontend-code-guidelines
variantid: regular
guid: 57717e42-5f83-41e8-9b90-934baf1806a8
----

# Frontend Code Guidelines

CSS naming convention
--
We use a BEM inspired convention that is simplified and without as many rules.

The principles are as follows:

### CSS naming
Try to use as shallow selectors as possible. In the best case an element should only have a one class selector on it.
Children of a specific component should be prefixed with the parents classname.
    
##### Incorrect:
```css
.extracontent .linklist .linkitem {}
``` 

##### Correct:
```css
.linklist-linkitem {}
``` 
     
### JS classes (separation of purpose)
JS should only target _js-_ prefixed classes. JS should never target styled classes.

JS may however check, add and remove state classes.
    
##### Incorrect:
```js
$('.menubutton').on(...)
``` 
##### Correct:
```js
$('.js-openmenu').on('click', (btn) => { $(btn).addClass('is-open'); })
``` 

### State classes
Interactivity through JavaScript or business logic dictates that an element can be shown in different ways. 

Therefor we should use state classes to indicate what should be changed in an element in terms of styling.

State classes should be prefixed with _is-_ or _has-_

##### Incorrect:
```css
.menuitem.nochildren {}
``` 
##### Correct:
```css
.menu-menuitem
{
    &.has-children { }
    &.has-nochildren { }
    &.is-expanded, &.is-visible { }
}
``` 
