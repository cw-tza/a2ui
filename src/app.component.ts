import {bootstrap} from "@angular/platform-browser-dynamic";
import {Component} from "@angular/core";
import {ProgressBarComponent} from "./progress-bar.component";

@Component({
    directives: [ProgressBarComponent],
    selector: "a2ui-app",
    templateUrl: "src/app.component.html"
})
class AppComponent {
}

bootstrap(AppComponent);
