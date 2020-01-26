import { NgModule } from "@angular/core";

import { MatProgressSpinnerModule , MatInputModule, MatPaginatorModule, MatDialogModule} from '@angular/material';

@NgModule({
    exports : [
        MatProgressSpinnerModule,
        MatInputModule,
        MatProgressSpinnerModule,
        MatPaginatorModule,
        MatDialogModule
    ]
})

export class AngularMaterialModule {

}