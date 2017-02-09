# xyz Angular Dropdown TreeView

An awesome and beautiful Angular 2 dropdown treeview component.

You can customize CSS yourself to break down dependencies.

## Features

* Unlimited tree levels
* Smart text filtering

## Installation

After install the above dependencies, install `ng2-dropdown-treeview` via:
```shell
npm i @abc.xyz/drop-down-treeview --save
```
Once installed you need to import our main module in your application module:
```js
import {XyzModule} from '@abc.xyz/drop-down-treeview';

@NgModule({
  declarations: [AppComponent, ...],
  imports: [XyzModule.forRoot(), ...],  
  bootstrap: [AppComponent]
})
export class AppModule {
}
```

## Usage

Here is the example template:
```html
<dropdown-treeview [itemSource]="items"
                  item-text="name"
                  min-length="0"
                  [(ngModel)]="item"
                  (change)="handleChange($event)"
                  placeholder="Placeholder Text"
                  ngDefaultControl>
</dropdown-treeview>
```

 `config` is optional. This is the default configuration:
 ```js
 {
    showRoot: false,
    searchOptions = {
        shouldSort: true,
        threshold: 0.6,
        location: 0,
        distance: 100,
        maxPatternLength: 32,
        minMatchCharLength: 1,
        keys: [
            "name"
        ]
    };
}
```
## Contributing

Submit your ideas, proposals and found bugs which you can leave in github issues. 