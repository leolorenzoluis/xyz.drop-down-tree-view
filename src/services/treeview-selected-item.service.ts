import { Injectable } from '@angular/core';
import { TreeNode } from '../../index';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class TreeViewSelectedItemService {
    // Observable string sources
    private _selectedItemSource = new Subject<TreeNode>();
    // Observable string streams
    public observableSelectedItem = this._selectedItemSource.asObservable();

    // Service message commands
    public changeSelectedItem = (item: TreeNode) => {
        if(item.selectable)
            this._selectedItemSource.next(item);
    }
}