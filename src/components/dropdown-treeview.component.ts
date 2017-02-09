import {
    Component,
    ElementRef,
    EventEmitter,
    AfterContentInit,
    forwardRef,
    ViewEncapsulation,
    Input,
    Output,
    OnDestroy
} from '@angular/core';

import {
    Tree, TreeNode, TreeOptions, TreeViewService,
    UP_ARROW,
    DOWN_ARROW,
    ENTER,
    ESCAPE,
    TAB
} from '../../index';

import { Subscription } from 'rxjs/Subscription';
import {
    NG_VALUE_ACCESSOR,
    ControlValueAccessor
} from '@angular/forms';

let nextId = 0;

export const TREEVIEW_DROPDOWN_AUTOCOMPLETE_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DropDownWithTreeView),
    multi: true
};

export class DropDownWithTreeViewAutoCompleteChange {
    source: DropDownWithTreeView;
    value: any;
}

@Component({
    selector: 'dropdown-treeview',
    templateUrl: './dropdown-treeview.html',
    styleUrls: ['dropdown-treeview.scss'],
    providers: [TREEVIEW_DROPDOWN_AUTOCOMPLETE_CONTROL_VALUE_ACCESSOR, TreeViewService],
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
export class DropDownWithTreeView implements AfterContentInit, ControlValueAccessor, OnDestroy {
    coerceBooleanProperty(value: any): boolean {
        return value != null && `${value}` !== 'false';
    }

    ngOnDestroy() {
        this.selectedItemSubscription.unsubscribe();
        this.currentHighlightSubscription.unsubscribe();
    }

    selectedItemSubscription: Subscription;
    currentHighlightSubscription: Subscription;

    constructor(private _element: ElementRef, private service: TreeViewService) {
        this.selectedItemSubscription = service.observableSelectedItem.subscribe(item => this.changeSelectedItem(item));
        this.currentHighlightSubscription = service.observableCurrentFocus.subscribe(item => this.changeFocusedNode(item));
    }

    changeFocusedNode(item) {
        if (this._filteredItems.getFocusedNode()) {
            this._filteredItems.getFocusedNode().unfocus();
        }
        if (item) {
            this._filteredItems.setFocusedNode(item.focus());
        }
    }

    ngAfterContentInit() { this._isInitialized = true; }

    @Output() change: EventEmitter<any> = new EventEmitter<any>();
    @Output() textChange = new EventEmitter();

    private _model: any = '';
    private _readonly: boolean = false;
    private _required: boolean = false;
    private _disabled: boolean = false;
    private _isInitialized: boolean = false;
    private _isDirty: boolean = false;
    private _filteredItems: Tree;
    private _itemSource: Tree;
    private selectedItem: any;
    private noBlur: boolean = false;
    private _focusedOption: number = -1;
    private _inputValue: string = '';
    private _showMenu: boolean = false;

    private _onChange = (val: any) => { };
    private _onTouched = () => { };

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

    @Input()
    set itemSource(value: any) {
        this._itemSource = new Tree(value, new TreeOptions(false));
        this.updateFilteredItems(this._itemSource);
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

    @Input()
    get value(): any { return this._model; }
    set value(value: any) {
        if (value !== this._model) {
            this._model = value;
            this._inputValue = '';
            if (value && this.selectedItem) {
                this.selectedItem.model = value;
            }
            if (!this._inputValue) { this._inputValue = ''; }
            if (this._isInitialized) {
                this._emitChangeEvent();
            }
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

    get isMenuVisible(): boolean {
        return (this._showMenu || this.noBlur) && !this.readonly ? true : false;
    }

    /**
     * update scroll of suggestion menu
     */
    private updateScroll() {
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
    _handleKeydown(event: KeyboardEvent) {
        if (this.disabled) { return; }
        this.textChange.emit(this._inputValue);
        switch (event.keyCode) {
            case TAB:
                this._handleMouseLeave();
                this.changeSelectedItem(this._filteredItems.selectFirstMatch(this._inputValue));
                break;
            case ESCAPE:
                event.stopPropagation();
                event.preventDefault();
                if (this._inputValue) {
                    this._onClear();
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
                this.changeFocus(DOWN_ARROW);
                break;
            case UP_ARROW:
                event.preventDefault();
                event.stopPropagation();
                this.changeFocus(UP_ARROW);
                break;
            default:
                setTimeout(() => {
                    this.updateFilteredItems(this._itemSource);
                }, 10);
        }
    }

    changeFocus(keyArrow: number) {
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
    changeSelectedItem(newSelectedItem: TreeNode) {
        if (newSelectedItem) {
            this.selectedItem = newSelectedItem.model;
            this._inputValue = newSelectedItem.name;
        }
        this.updateValue();
        this._handleMouseLeave();
        this._showMenu = false;
    }

    /**
     * clear selected suggestion
     */
    _onClear() {
        if (this.disabled) { return; }
        this._inputValue = '';
        this.selectedItem = null;
        this.updateFilteredItems(this._itemSource);
        if (this._filteredItems.getFocusedNode()) {
            this._filteredItems.getFocusedNode().unfocus();
        }
        this._model = this.selectedItem ? this.selectedItem.model : this.selectedItem;
        this.updateValue();
    }

    /**
     * update value
     */
    private updateValue() {
        this._model = this.selectedItem ? this.selectedItem.model : this.selectedItem;
        this._emitChangeEvent();
        this.onFocus();
    }

    /**
     * component focus listener
     */
    private onFocus() {
        if (this.disabled) { return; }
        this._element.nativeElement.querySelector('input').focus();
    }

    /**
     * input focus listener
     */
    _handleFocus() {
        this._showMenu = true;
        // Let the menu load first so the container is in the DOM.
        setTimeout(() => {
            this.updateScroll();
        }, 5);
    }

    /**
     * input blur listener
     */
    _handleBlur() {
        this._showMenu = false;
        this._onTouched();
    }

    /**
     * suggestion menu mouse enter listener
     */
    _handleMouseEnter() { this.noBlur = true; }

    /**
     * suggestion menu mouse leave listener
     */
    _handleMouseLeave() { this.noBlur = false; }


    _emitChangeEvent(): void {
        let event = new DropDownWithTreeViewAutoCompleteChange();
        event.source = this;
        event.value = this._model;
        this._onChange(event.value);
        this.change.emit(event);
    }

    registerOnChange(fn: (value: any) => void): void { this._onChange = fn; }

    registerOnTouched(fn: () => {}): void { this._onTouched = fn; }

    /**
     * This event gets called when something outside this class tries to set the value, such as at the template level.
     */
    writeValue(model: any): void {
        if (model !== this._model) {
            this._model = model;
            this._inputValue = '';
            if (model) {
                let selectedNode = this._itemSource.findNode(this._filteredItems.root, (item => item.id !== undefined && item.id === model.id));
                if (selectedNode)
                    selectedNode.focus();
                this.selectedItem = selectedNode;
                if (this.selectedItem) { this._inputValue = this.selectedItem.name; }
            }
            if (!this._inputValue) { this._inputValue = ''; }
        }
    }
}
