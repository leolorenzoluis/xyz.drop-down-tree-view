import { Component, Input } from '@angular/core';

import { TreeViewService, Tree } from '../../index';

@Component({
	selector: 'tree',
	templateUrl: 'tree.component.html'
})
export class TreeComponent {
	@Input('item-source') itemsource: Tree;
	@Input('query-value') queryValue: string;

	selectOption(item: any) {
		this.service.changeSelectedItem(item);
		event.stopPropagation();
	}

	constructor(private service: TreeViewService) {
		console.log(this.queryValue);
	}

}