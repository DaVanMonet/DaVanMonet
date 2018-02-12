declare var require: any;
import { Component } from "@angular/core";

@Component({
  selector: 'angular-example-component',
  templateUrl: './AngularExample.component.html',
  //styleUrls: ['./AngularExample.component.css']
})

export class AngularExampleComponent {
  title = 'This was rendered with angular';
}
