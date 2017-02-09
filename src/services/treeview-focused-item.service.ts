import { Injectable } from '@angular/core';
import { TreeNode } from '../../index';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class TreeViewFocusedItemService {
    // Observable string sources
    private _currentFocus = new Subject<TreeNode>();
    // Observable string streams
    public observableCurrentFocus = this._currentFocus.asObservable();

    public changeFocus = (item: TreeNode) => {
        if(item.selectable)
            this._currentFocus.next(item);
    }
}