import { Component, Input } from '@angular/core';

import { TreeViewService } from '../services/treeview.service';

@Component({
	selector: 'tree',
	templateUrl: 'tree.component.html'
})
export class TreeComponent {
	_queryValue : string;
	@Input() itemsource: any;
	@Input()
	set queryValue(name: string) {
		this._queryValue = name;
	}

	selectOption(item: any) {
		if (item.selectable) {
			this.service.changeSelectedItem(item);
			event.stopPropagation();
		}
	}

	constructor(private service: TreeViewService) {
		console.log(this.queryValue);
	}

}