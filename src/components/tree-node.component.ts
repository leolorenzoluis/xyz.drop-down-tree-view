import { Component, Input } from '@angular/core';
import { TreeViewService } from '../services/treeview.service';

@Component({
	selector: 'node',
	templateUrl: 'tree-node.component.html'
})
export class TreeNodeComponent {
	_queryValue: string;
	@Input()
	set queryValue(name: string) {
		this._queryValue = name;
	}

	onMouseOver(): void {
		if (this.item.selectable) {
			this.service.changeFocus(this.item);
		}
	}

	selectOption(event: Event, item: any) {
		if (this.item.selectable) {
			this.service.changeSelectedItem(item);
			event.stopPropagation();
		}
	}
	constructor(private service: TreeViewService) {
	}
	@Input() item: any;
	IsExpanded: boolean = false;
}