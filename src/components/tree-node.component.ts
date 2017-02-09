import { Component, Input } from '@angular/core';
import { TreeViewService, TreeNode } from '../../index';

@Component({
	selector: 'node',
	templateUrl: 'tree-node.component.html'
})
export class TreeNodeComponent {

	@Input('query-value') queryValue: string;
	@Input() item: TreeNode;

	constructor(private service: TreeViewService) {

	}

	private onMouseOver = (): void => {
		this.service.changeFocus(this.item);
	}

	private onClick = (event: Event, item: any): void => {
		this.service.changeSelectedItem(item);
		event.stopPropagation();
	}
}