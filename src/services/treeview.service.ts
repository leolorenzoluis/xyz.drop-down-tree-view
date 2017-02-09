import { Injectable } from '@angular/core';

import { Subject } from 'rxjs/Subject';

@Injectable()
export class TreeViewService {
    // Observable string sources
    private selectedItemSource = new Subject<any>();
    private currentFocus = new Subject<any>();
    // Observable string streams
    observableSelectedItem = this.selectedItemSource.asObservable();
    observableCurrentFocus = this.currentFocus.asObservable();

    // Service message commands
    changeSelectedItem(item) {
        this.selectedItemSource.next(item);
    }

    changeFocus(item) {
        this.currentFocus.next(item);
    }
}