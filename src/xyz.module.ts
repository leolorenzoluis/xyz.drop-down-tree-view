import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TreeComponent } from './components/tree.component';
import { DropDownWithTreeViewComponent } from './components/dropdown-treeview.component';
import { TreeNodeComponent } from './components/tree-node.component';
import { HighlightPipe } from './shared/highlight-pipe';

@NgModule({
    imports: [
        CommonModule,
        FormsModule
    ],

    declarations: [
        HighlightPipe,
        TreeComponent,
        TreeNodeComponent,
        DropDownWithTreeViewComponent
    ],

    exports: [
        TreeComponent,
        DropDownWithTreeViewComponent
    ]
})

export class XyzModule { 
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: XyzModule
        };
    }
}
