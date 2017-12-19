---
title: Do's and don'ts
componentid: accessibility-dosdonts
variantid: regular
guid: 42fcb1a8-4885-4b43-9909-a82d42d247ce
----

Follow these simple examples to improve your products accessibility

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


## Do user buttons instead of links 
Using a link that doesn't go anywhere is bad practice and confusing. Use a regular button instead

```html
<button class="closemodal" aria-label="Close the modal">X</button>
```

## nopreview Don't
```html
<a href="#" onclick="...">X</a>
```
