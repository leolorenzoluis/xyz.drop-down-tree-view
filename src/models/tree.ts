import { TreeNode } from './tree-node';
import { TreeOptions } from './tree-options';

export class Tree {
    name: string;
    children: Array<TreeNode>;
    root: TreeNode;
    focusedNode: TreeNode;
    options: TreeOptions;

    constructor(item: any, options: TreeOptions) {
        this.options = options;
        if (!item.children) {
            throw new Error("Expecting children to create a tree");
        }
        this.root = new TreeNode(item, null);
        this.name = item.name;
        this.children = this.root.children;
    }

    getFocusedNode(): TreeNode {
        return this.focusedNode;
    }

    setFocusedNode(node) {
        this.focusedNode = node;
    }

    focusPreviousNode(): void {
        let previousNode = this.getFocusedNode();
        let nextNode = previousNode ? previousNode.findPreviousNode() : this.getLastRoot().getLastOpenDescendant();
        if (nextNode !== null && nextNode.selectable) {
            this.focusedNode = nextNode.focus();
        }
        else {
            this.focusedNode = nextNode;
            this.focusPreviousNode();
        }
    }

    focusNextNode(): void {
        let previousNode = this.getFocusedNode();
        let nextNode = previousNode ? previousNode.findNextNode(true) : this.getFirstRoot();
        if (nextNode !== null && nextNode.selectable) {
            this.focusedNode = nextNode.focus();
        }
        else {
            this.focusedNode = nextNode;
            this.focusNextNode();
        }
    }

    getFirstRoot() {
        return this.children[0];
    }

    getLastRoot() {
        return this.children[this.children.length - 1];
    }

    findNode = (node: TreeNode, filterFunction: Function): TreeNode => {
        if (filterFunction(node)) {
            return node;
        }

        let result = null;
        if (node.children) {
            for (let index = 0; index < node.children.length; index++) {
                result = this.findNode(node.children[index], filterFunction);
                if (result) {
                    return result;
                }
            }
            return result;
        }
    };

    selectFirstMatch(searchText: string, filterFunction?: Function) {
        return filterFunction ? this.findNode(this.root, filterFunction) : this.findNode(this.root, (node => this.options.defaultSearch(node, searchText)));
    }

    filter(searchText: string, filterFunction?: Function): Tree {
        let filteredItems = filterFunction ? this.filterTree(this.root, searchText, filterFunction) : this.filterTree(this.root, searchText, this.options.defaultSearch);
        return new Tree(filteredItems, new TreeOptions());
    }

    private filterNode = (node, searchText, filterFunction: Function) => {
        return this.options.defaultSearch(node, searchText) || // i match
            (node.children && // or i have decendents and one of them match
                node.children.length &&
                !!node.children.find(child => this.filterNode(child, searchText, filterFunction)));
    };

    private filterTree = (node, searchText, filterFunction: Function) => {
        // If im an exact match then all my children get to stay
        if (filterFunction(node, searchText) || !node.children) { return node; }
        // If not then only keep the ones that match or have matching descendants
        const filtered = node.children
            .filter(child => this.filterNode(child, searchText, filterFunction))
            .map(child => this.filterTree(child, searchText, filterFunction));
        return Object.assign({}, node, { children: filtered });
    };
}