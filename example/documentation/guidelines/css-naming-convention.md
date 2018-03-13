---
title: CSS Naming convention
componentid: css-naming-convention
variantid: regular
guid: a0810990-04c6-4539-95c5-554fe3cd480f
----

We use a BEM inspired convention that is simplified and without as many rules.
Try to use as shallow selectors as possible. In the best case an element should only have a one class selector on it.
Children of a specific component should be prefixed with the parents classname.

## nopreview Don't use long selectors
Long selectors will make the styling unflexible and should only be used sparingly during exceptions.

```css
.extracontent .linklist .linkitem {}
```

## nopreview Do use very specific selectors
This will ensure that your styling only affects a very specific element.

```css
.linklist-linkitem {}
```

## nopreview Correct state classes:
Interactivity through JavaScript or business logic dictates that an element can be shown in different ways. 

Therefor we should use state classes to indicate what should be changed in an element in terms of styling.

State classes should be prefixed with _is-_ or _has-_

```css
.menu-menuitem
{
	&.has-children { }
	&.has-nochildren { }
	&.is-expanded, &.is-visible { }
}
```

## nopreview Incorrect state classes:
```css
.menuitem.nochildren {}
```
