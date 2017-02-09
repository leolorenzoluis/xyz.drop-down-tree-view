import { Component, Input, OnDestroy } from '@angular/core';

import { TreeViewFocusedItemService, TreeViewSelectedItemService, Tree, TreeNode } from '../../index';

import { Subscription } from 'rxjs/Subscription';
@Component({
	selector: 'tree',
	templateUrl: 'tree.component.html',
	providers: [TreeViewFocusedItemService, TreeViewSelectedItemService]
})
export class TreeComponent implements OnDestroy {
	private _currentHighlightSubscription: Subscription;
	private _selectedItemSubscription: Subscription;
	private _selectedNode: TreeNode;

	@Input('item-source') itemsource: Tree;
	@Input('query-value') queryValue: string;


	constructor(public treeViewSelectedItemService: TreeViewSelectedItemService, private treeViewFocusedItemService: TreeViewFocusedItemService) {
		this._currentHighlightSubscription = treeViewFocusedItemService.observableCurrentFocus.subscribe(this.changeFocusedNodeOnMouseOver);
		this._selectedItemSubscription = treeViewSelectedItemService.observableSelectedItem.subscribe(this.changeSelectedItem);
	}

	private changeSelectedItem = (item: TreeNode) => {
		this._selectedNode = item;
	}

	public ngOnDestroy(): void {
		this._selectedItemSubscription.unsubscribe();
		this._currentHighlightSubscription.unsubscribe();
	}

	private changeFocusedNodeOnMouseOver = (item: TreeNode): void => {
		if (this.itemsource.getFocusedNode()) {
			this.itemsource.getFocusedNode().unfocus();
		}
		if (item) {
			this.itemsource.setFocusedNode(item.focus());
		}
	}

}