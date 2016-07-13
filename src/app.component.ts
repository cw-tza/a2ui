import * as ng from "@angular/core";
import {bootstrap} from "@angular/platform-browser-dynamic";

import {OnInitDirective} from "./on-init/on-init.directive";
import * as cb from "./clipboard/clipbard"
import {WatchDirective} from "./watch/watch.directive";

@ng.Component({
    selector   : "a2ui-app",
    templateUrl: "src/app.component.html"
})
class AppComponent {
    copy = cb.copy;
    cut = cb.cut;
}

bootstrap(AppComponent, [
    {provide: ng.PLATFORM_DIRECTIVES, useValue: OnInitDirective, multi: true},
    {provide: ng.PLATFORM_DIRECTIVES, useValue: WatchDirective, multi: true},
]);
