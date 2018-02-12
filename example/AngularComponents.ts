declare var require: any;

// Imports required by angular
import 'zone.js/dist/zone';

import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

// Import example components
import { AngularExampleComponent } from './components/Angular Components/AngularExample.component';

// Declare components here
@NgModule(
{
	declarations: [
		AngularExampleComponent
	],
	imports: [BrowserModule],
	providers: [],
	bootstrap: [
		AngularExampleComponent
	]
})
export class AppModule { }

const appRenderEl =  document.getElementById('showcase__render');
let showcaseMarkupIsInserted = false;
if(appRenderEl)
{
	window.addEventListener('message', (message) =>
	{
		if(typeof message.data === "string" && message.data.indexOf('render-angular') === 0 && showcaseMarkupIsInserted === false)
		{
			initializeComponents();
		}
	}, false);
}

function initializeComponents()
{
	showcaseMarkupIsInserted = true;

	platformBrowserDynamic()
		.bootstrapModule(AppModule)
		.catch(err => console.error('angular error',err));
}
