---
title: Do's and don'ts
componentid: accessibility-dosdonts
variantid: regular
guid: 42fcb1a8-4885-4b43-9909-a82d42d247ce
----

Follow these simple examples to improve your products accessibility

## Do use doctype and lang attribute
If the doctype is not specified the browser will have a problem to properly parse the page. 
And if there is no lang attribute search engines and screen readers will have a problem to interpret the content

```html
<!DOCTYPE html>
<html lang="en">
```


## Do use alt tags
The use of alt tags is very important for SEO and users with visual disabilities

```html
<img alt="Cute cat" src="/catimage.jpg">
```

## nopreview Don't
```html
<img src="/catimage.jpg">
```

## Do use labels correctly
Labels play an important role for how a user can interact with a form

```html
<label for="usernameinput">Username</label>
<input type="text" id="usernameinput" name="username">
```

## nopreview Don't
```html
<label>Username: <input type="text" id="usernameinput" name="username"></label>
<div>Username: <input type="text" name="username"></div>
```


## Do use buttons instead of links 
Using a link that doesn't go anywhere is bad practice and confusing. Use a regular button instead

```html
<button class="closemodal" aria-label="Close the modal">X</button>
```

## nopreview Don't
```html
<a href="#" onclick="...">X</a>
```

## nopreview Do use title attribute on icon button/links
If a button only contains a icon (such as on a share link or a close button) we need to indicate what the button actually does.

```html
<button class="share-facebook" aria-label="Share this page on facebook">(Facebook icon)</button>
```

## nopreview Do preserve active state
Make sure selectable elements have a indication for when a user has navigated to a link/button using the keyboard

```css
button:hover,
button:focus,
button:active
{
	border:2px solid #666;
}
```

## nopreview Don't remove outline
If you have not made a specific visual indication you should not remove outline
```css
button
{
	outline:0;
}
```
