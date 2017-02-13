# XYZ Angular Dropdown TreeView 

[![Greenkeeper badge](https://badges.greenkeeper.io/leolorenzoluis/xyz.drop-down-tree-view.svg)](https://greenkeeper.io/)

[![npm](https://img.shields.io/badge/awesome-∞-brightgreen.svg)](https://www.npmjs.com/package/@abc.xyz/drop-down-treeview) [![Build Status](https://travis-ci.org/leolorenzoluis/xyz.drop-down-treeview.svg?branch=master)](https://travis-ci.org/leolorenzoluis/xyz.drop-down-treeview)[![Dependency Status](https://www.versioneye.com/user/projects/589d5b886a7781003b24301e/badge.svg?style=flat-square)](https://www.versioneye.com/user/projects/589d5b886a7781003b24301e)


An awesome and beautiful Angular 2 dropdown treeview component.

You can customize CSS yourself to break down dependencies.

## Features

* Beautiful component
* Smart text filtering
* Unlimited tree levels
* Supports accessibility features

## Demo

### Plunker
https://plnkr.co/edit/63jvcJd3K3sz1v9rdxyN?p=preview

### Local
Run the sample application
```shell
cd dropdown-treeview 
npm install
npm run start
```

## Installation

After install the above dependencies, install `@abc.xyz/drop-down-treeview` via npm:
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
<dropdown-treeview [item-source]="items"
                  item-text="name"
                  min-length="0"
                  [(ngModel)]="item"
                  (change)="handleChange($event)"
                  placeholder="Placeholder Text">
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
