import { Component, Input } from '@angular/core';
import { TreeViewSelectedItemService, TreeViewFocusedItemService, TreeNode } from '../../index';

@Component({
	selector: 'node',
	templateUrl: 'tree-node.component.html'
})
export class TreeNodeComponent {

	@Input('query-value') queryValue: string;
	@Input() item: TreeNode;

	constructor(private treeViewSelectedItemService: TreeViewSelectedItemService, private treeViewFocusedItemService : TreeViewFocusedItemService) {

	}

	private onMouseOver = (): void => {
		this.treeViewFocusedItemService.changeFocus(this.item);
	}

	private onClick = (): void => {
		this.treeViewSelectedItemService.changeSelectedItem(this.item);
	}
}