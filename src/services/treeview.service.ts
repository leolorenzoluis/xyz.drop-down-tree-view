import { Injectable } from '@angular/core';
import { TreeNode } from '../../index';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class TreeViewService {
    // Observable string sources
    private _selectedItemSource = new Subject<TreeNode>();
    private _currentFocus = new Subject<TreeNode>();
    // Observable string streams
    public observableSelectedItem = this._selectedItemSource.asObservable();
    public observableCurrentFocus = this._currentFocus.asObservable();

    // Service message commands
    public changeSelectedItem = (item: TreeNode) => {
        if(item.selectable)
            this._selectedItemSource.next(item);
    }

    public changeFocus = (item: TreeNode) => {
        if(item.selectable)
            this._currentFocus.next(item);
    }
}