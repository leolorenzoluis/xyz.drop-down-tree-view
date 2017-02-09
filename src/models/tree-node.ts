export class TreeNode {
    selectable: boolean = true;
    isExpanded: boolean = true;
    isHighlighted: boolean;
    id: any;
    model: any;
    level: number;
    name: string;
    children: Array<TreeNode>;

    constructor(item: any, public parent: TreeNode) {
        this.model = item;
        this.name = item.name;
        this.children = item.children ? item.children.map(x => new TreeNode(x, this)) : [];
        this.level = this.parent ? this.parent.level + 1 : 0;
        this.id = item.id || Math.floor(Math.random() * 10000000000000);
        if (item.selectable !== undefined) {
            this.selectable = item.selectable;
        }
        if (item.isExpanded !== undefined) {
            this.isExpanded = item.isExpanded;
        }
    }

    get hasChildren(): boolean {
        return this.children && this.children.length > 0;
    }

    get isLeaf(): boolean { return !this.hasChildren }

    findAdjacentSibling(steps): TreeNode {
        const index = this.getIndexInParent();
        return this.getParentsChildren()[index + steps];
    }

    findNextSibling(): TreeNode {
        return this.findAdjacentSibling(+1);
    }

    findPreviousSibling(): TreeNode {
        return this.findAdjacentSibling(-1);
    }

    getIndexInParent(): number {
        return this.getParentsChildren().findIndex(child => child.id === this.id);
    }

    getFirstChild() {
        return this.children[0];
    }

    getLastChild(): TreeNode {
        return this.children[this.children.length - 1];
    }

    private getParentsChildren(): TreeNode[] {
        const children = this.parent && this.parent.children;
        return children || [];
    }

    findNextNode(goInside): TreeNode {
        this.unfocus();
        return goInside && this.getFirstChild() || this.findNextSibling() || this.parent && this.parent.findNextNode(false);
    }

    findPreviousNode(): TreeNode {
        this.unfocus();
        let previousSibling = this.findPreviousSibling();
        if (!previousSibling) {
            return this.parent;
        }
        return previousSibling.getLastOpenDescendant();
    }

    getLastOpenDescendant(): TreeNode {
        const lastChild = this.getLastChild();
        return !lastChild ? this : lastChild.getLastOpenDescendant();
    }

    isDescendantOf(node: TreeNode): boolean {
        if (this === node) return true;
        else return this.parent && this.parent.isDescendantOf(node);
    }

    unfocus() {
        this.isHighlighted = false;
        return this;
    }

    focus() {
        this.isHighlighted = true;
        return this;
    }
}