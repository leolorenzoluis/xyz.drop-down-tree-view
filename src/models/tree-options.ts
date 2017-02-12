import * as Fuse from 'fuse.js';

export class TreeOptions {
    showRoot = false;

    searchOptions = {
        shouldSort: true,
        threshold: 0.6,
        location: 0,
        distance: 100,
        maxPatternLength: 32,
        minMatchCharLength: 1,
        keys: [
            "name"
        ]
    };

    constructor(showRoot?: boolean) {
        if (showRoot)
            this.showRoot = showRoot;
    }

    defaultSearch = (node, searchText) => {
        if (node && node.selectable) {
            let fuse = new Fuse([node], this.searchOptions);
            let result = fuse.search(searchText)[0];
            return result !== undefined;
        }
    }

}
