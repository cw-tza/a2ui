import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {FormsModule} from "@angular/forms";
import {AppComponent} from "./app.component";
import {HttpModule} from "@angular/http";
import {A2uiModule} from "./a2ui.module";
import {MyModalComponent} from "./examples/MyModal.component";

@NgModule({
    imports: [BrowserModule, FormsModule, HttpModule, A2uiModule],
    declarations: [AppComponent, MyModalComponent],
    entryComponents: [MyModalComponent],
    bootstrap: [AppComponent]
})
export class AppModule {
}
