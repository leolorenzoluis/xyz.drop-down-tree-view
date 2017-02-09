import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DropDownWithTreeView, HighlightPipe, TreeComponent, TreeNodeComponent } from '../index';

@NgModule({
    imports: [
        CommonModule,
        FormsModule
    ],

    declarations: [
        TreeComponent,
        TreeNodeComponent,
        DropDownWithTreeView,
        HighlightPipe
    ],

    exports: [
        TreeComponent,
        DropDownWithTreeView
    ]
})
export class XyzModule { 
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: XyzModule
        };
    }
}