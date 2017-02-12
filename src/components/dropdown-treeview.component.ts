import {
    Component,
    ElementRef,
    EventEmitter,
    AfterContentInit,
    AfterViewInit,
    forwardRef,
    ViewEncapsulation,
    Input,
    Output,
    ViewChildren,
    QueryList,
    OnDestroy
} from '@angular/core';

import {
    UP_ARROW,
    DOWN_ARROW,
    ENTER,
    ESCAPE,
    TAB
} from '../shared/keycode';

import {
    Tree, TreeNode, TreeOptions,
} from '../models';

import { TreeComponent } from './tree.component';

import { Subscription } from 'rxjs/Subscription';
import {
    NG_VALUE_ACCESSOR,
    ControlValueAccessor
} from '@angular/forms';

let nextId = 0;

export const TREEVIEW_DROPDOWN_AUTOCOMPLETE_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DropDownWithTreeViewComponent),
    multi: true
};

export class DropDownWithTreeViewAutoCompleteChange {
    source: DropDownWithTreeViewComponent;
    value: any;
}

@Component({
    selector: 'dropdown-treeview',
    templateUrl: './dropdown-treeview.component.html',
    styleUrls: ['dropdown-treeview.scss'],
    providers: [TREEVIEW_DROPDOWN_AUTOCOMPLETE_CONTROL_VALUE_ACCESSOR],
    host: {
        'role': 'autocomplete',
        '[id]': 'id',
        '[attr.aria-label]': 'placeholder',
        '[attr.aria-required]': 'required.toString()',
        '[attr.aria-disabled]': 'disabled.toString()',
        '[class.dropdown-treeview-disabled-disabled]': 'disabled',
    },
    encapsulation: ViewEncapsulation.None
})
export class DropDownWithTreeViewComponent implements AfterContentInit, AfterViewInit, ControlValueAccessor, OnDestroy {

    // Apparently have to use ViewChildren if using ngIf http://stackoverflow.com/questions/34947154/angular-2-viewchild-annotation-returns-undefined
    @ViewChildren(TreeComponent) tree: QueryList<TreeComponent>;

    constructor(private _element: ElementRef) {

    }

    private _selectedItemSubscription: Subscription;
    private _model: any;
    private _readonly: boolean = false;
    private _required: boolean = false;
    private _disabled: boolean = false;
    private _isInitialized: boolean = false;
    private _isDirty: boolean = false;
    private _filteredItems: Tree;
    private _itemSource: Tree;
    private _selectedItem: any;
    private _noBlur: boolean = false;
    private _inputValue: string = '';
    private _showMenu: boolean = false;

    private _onChange = (val: any): void => { };
    private _onTouched = (): void => { };
    public ngAfterContentInit(): void { this._isInitialized = true; }

    public ngAfterViewInit(): void {
        this.tree.changes.subscribe((comps: QueryList<TreeComponent>) => {
            let treeComponent = comps.first;
            if (treeComponent) {
                this._selectedItemSubscription = treeComponent.treeViewSelectedItemService.observableSelectedItem.subscribe(this.changeSelectedItem);
            }
        });
    }

    @Output() change: EventEmitter<DropDownWithTreeViewAutoCompleteChange> = new EventEmitter<DropDownWithTreeViewAutoCompleteChange>();
    @Output() textChange: EventEmitter<string> = new EventEmitter<string>();
    @Input() id: string = 'dropdown-treeview' + (++nextId);
    @Input() tabindex: number = 0;
    @Input() placeholder: string = '';
    @Input('item-text') textKey: string = 'text';
    @Input('item-value') valueKey: string = null;
    @Input('min-length') minLength: number = 1;

    @Input()
    get readonly(): boolean { return this._readonly; }
    set readonly(value) { this._readonly = this.coerceBooleanProperty(value); }

    @Input()
    get required(): boolean { return this._required; }
    set required(value) { this._required = this.coerceBooleanProperty(value); }

    @Input()
    get disabled(): boolean { return this._disabled; }
    set disabled(value) { this._disabled = this.coerceBooleanProperty(value); }

    @Input('item-source')
    set itemSource(value: any) {
        this._itemSource = new Tree(value, new TreeOptions());
        this.updateFilteredItems(this._itemSource);
    }

    @Input()
    get value(): any { return this._model; }
    set value(value: any) {
        if (value !== this._model) {
            this._model = value;
            this._inputValue = '';
            if (value && this._selectedItem) {
                this._selectedItem.model = value;
            }
            if (!this._inputValue) { this._inputValue = ''; }
            if (this._isInitialized) {
                this.emitChangeEvent();
            }
        }
    }

    private coerceBooleanProperty = (value: any): boolean => {
        return value != null && `${value}` !== 'false';
    }

    public ngOnDestroy(): void {
        this._selectedItemSubscription.unsubscribe();
    }

    /**
    * Update suggestion to filter the query
    */
    private updateFilteredItems(tree: Tree) {
        if (this._inputValue.length < this.minLength || this._inputValue === '') {
            this._filteredItems = tree;
        }
        else {
            this._isDirty = true;
            this._filteredItems = this._itemSource.filter(this._inputValue);
        }
        if (this._isDirty) {
            this._showMenu = true;
        }
    }

    /**
     * Compare two vars or objects
     * @param o1 compare first object
     * @param o2 compare second object
     * @return boolean comparation result
     */
    private equals(o1: any, o2: any) {
        if (o1 === o2) { return true; }
        if (o1 === null || o2 === null) { return false; }
        if (o1 !== o1 && o2 !== o2) { return true; }
        let t1 = typeof o1, t2 = typeof o2, key: any, keySet: any;
        if (t1 === t2 && t1 === 'object') {
            keySet = Object.create(null);
            for (key in o1) {
                if (!this.equals(o1[key], o2[key])) { return false; }
                keySet[key] = true;
            }
            for (key in o2) {
                if (!(key in keySet) && key.charAt(0) !== '$' && o2[key]) { return false; }
            }
            return true;
        }
        return false;
    }

    public get isMenuVisible(): boolean {
        return (this._showMenu || this._noBlur) && !this.readonly ? true : false;
    }

    /**
     * update scroll of suggestion menu
     */
    private updateScroll = (): void => {
        let menuContainer = this._element.nativeElement.querySelector('.dropdown-treeview-menu');
        if (!menuContainer) { return; }

        let choices = menuContainer.querySelectorAll('.tree-node-selected');
        if (choices.length < 1) { return; }

        let highlighted: any = choices[0];
        if (!highlighted) { return; }

        let top: number = highlighted.offsetTop + highlighted.clientHeight - menuContainer.scrollTop;
        let height: number = menuContainer.offsetHeight;

        if (top > height) {
            menuContainer.scrollTop += top - height;
        } else if (top < highlighted.clientHeight) {
            menuContainer.scrollTop -= highlighted.clientHeight - top;
        }
    }

    /**
     * input event listner
     * @param event
     */
    private handleKeydown = (event: KeyboardEvent): void => {
        if (this.disabled) { return; }
        this.textChange.emit(this._inputValue);
        switch (event.keyCode) {
            case TAB:
                this.handleMouseLeave();
                this.changeSelectedItem(this._filteredItems.selectFirstMatch(this._inputValue));
                break;
            case ESCAPE:
                event.stopPropagation();
                event.preventDefault();
                if (this._inputValue) {
                    this.onClear();
                }
                break;
            case ENTER:
                event.preventDefault();
                event.stopPropagation();
                if (this.isMenuVisible) {
                    // Prioritize selecting starts with before going to fuzzy result
                    let startsWithMatch = this._filteredItems.findNode(this._filteredItems.root, (item => item.name !== undefined && item.name.startsWith(this._inputValue)));
                    this.changeSelectedItem(startsWithMatch);
                    if (startsWithMatch) {
                        this.changeSelectedItem(startsWithMatch);
                    }
                    else {
                        this.changeSelectedItem(this._filteredItems.selectFirstMatch(this._inputValue));
                    }
                }
                break;
            case DOWN_ARROW:
                event.preventDefault();
                event.stopPropagation();
                this.changeFocusOnKeyDown(DOWN_ARROW);
                break;
            case UP_ARROW:
                event.preventDefault();
                event.stopPropagation();
                this.changeFocusOnKeyDown(UP_ARROW);
                break;
            default:
                setTimeout(() => {
                    this.updateFilteredItems(this._itemSource);
                }, 10);
        }
    }

    /**
     * Change the focus node based on key press
     */
    private changeFocusOnKeyDown = (keyArrow: number): void => {
        if (this.isMenuVisible) {
            if (keyArrow === UP_ARROW) {
                this._filteredItems.focusPreviousNode();
            }
            else if (keyArrow === DOWN_ARROW) {
                this._filteredItems.focusNextNode();
            }
            this._inputValue = this._filteredItems.getFocusedNode().name;
            setTimeout(() => {
                this.updateScroll();
            }, 10);
        }
    }

    /**
     * select option
     * @param event
     * @param index of selected item
     */
    private changeSelectedItem = (newSelectedItem: TreeNode): void => {
        if (newSelectedItem) {
            this._selectedItem = newSelectedItem.model;
            this._inputValue = newSelectedItem.name;
        }
        this.updateValue();
        this.handleMouseLeave();
        this._showMenu = false;
    }

    /**
     * clear selected suggestion
     */
    private onClear = (): void => {
        if (this.disabled) { return; }
        this._inputValue = '';
        this._selectedItem = null;
        this.updateFilteredItems(this._itemSource);
        if (this._filteredItems.getFocusedNode()) {
            this._filteredItems.getFocusedNode().unfocus();
        }
        this._model = this._selectedItem ? this._selectedItem.model : this._selectedItem;
        this.updateValue();
    }

    /**
     * update value
     */
    private updateValue = (): void => {
        this._model = this._selectedItem ? this._selectedItem.model : this._selectedItem;
        this.emitChangeEvent();
        if (this.disabled) { return; }
        this._element.nativeElement.querySelector('input').focus();
    }

    /**
     * input focus listener
     */
    private handleFocus = (): void => {
        this._showMenu = true;
        // Let the menu load first so the container is in the DOM.
        setTimeout(() => {
            this.updateScroll();
        }, 5);
    }

    /**
     * input blur listener
     */
    private handleBlur = (): void => {
        this._showMenu = false;
        this._onTouched();
    }

    /**
     * suggestion menu mouse enter listener
     */
    private handleMouseEnter = (): void => { this._noBlur = true; }

    /**
     * suggestion menu mouse leave listener
     */
    private handleMouseLeave = (): void => { this._noBlur = false; }


    private emitChangeEvent = (): void => {
        let event = new DropDownWithTreeViewAutoCompleteChange();
        event.source = this;
        event.value = this._model;
        this._onChange(event.value);
        this.change.emit(event);
    }

    public registerOnChange(fn: (value: any) => void): void { this._onChange = fn; }

    public registerOnTouched(fn: () => {}): void { this._onTouched = fn; }

    /**
     * This event gets called when something outside this class tries to set the value, such as at the template level.
     */
    public writeValue = (model: any): void => {
        if (model !== this._model) {
            this._model = model;
            this._inputValue = '';
            if (model) {
                let selectedNode = this._itemSource.findNode(this._filteredItems.root, (item => item.id !== undefined && item.id === model.id));
                if (selectedNode)
                    selectedNode.focus();
                this._selectedItem = selectedNode;
                if (this._selectedItem) { this._inputValue = this._selectedItem.name; }
            }
            if (!this._inputValue) { this._inputValue = ''; }
        }
    }
}
