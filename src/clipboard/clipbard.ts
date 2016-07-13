export interface ClipboardResult {
    clearSelection?: () => void;
    error?: any;
    success?: boolean;
    text?: string;
}

export function copy (contentHolder: HTMLElement | string, clearTimeout: number = -1): ClipboardResult {
    return executeAction(contentHolder, "copy");
}

export function cut (contentHolder: HTMLElement | string, clearTimeout: number = -1): ClipboardResult {
    return executeAction(contentHolder, "cut");
}

function executeAction (contentHolder: HTMLElement | string, action: "copy"|"cut"): ClipboardResult {
    let element: HTMLElement = <HTMLElement>contentHolder;
    if (typeof contentHolder === "string") {
        element = createInvisibleTextInput(contentHolder);
    }

    const selectedText: string = select(element);
    const result: boolean = execCommand(action);
    if (result === true) {
        return {
            clearSelection: () => { clearSelection(element); },
            success       : true,
            text          : selectedText
        };
    }
    return {
        clearSelection: () => { clearSelection(element); },
        error         : result || true, text: selectedText
    };
}

function createInvisibleTextInput (value: string): HTMLTextAreaElement {
    const rlt: boolean = document.documentElement.getAttribute("dir") === "rtl";

    const area: HTMLTextAreaElement = document.createElement("textarea");
    // Prevent zooming on iOS
    area.style.fontSize = "12pt";

    area.style.border = "0";
    area.style.padding = "0";
    area.style.margin = "0";

    area.style.position = "absolute";
    area.style[rlt ? "right" : "left"] = "-9999px";

    area.style.top = (window.pageYOffset || document.documentElement.scrollTop) + "px";
    area.setAttribute("readonly", "");
    area.value = value;

    document.body.appendChild(area);

    const removeCallback: () => void = () => {
        document.body.removeChild(area);
        document.body.removeEventListener("click", removeCallback);
    };

    document.body.addEventListener("click", removeCallback);

    return area;
}

function select (element: HTMLElement): string {
    if (element.nodeName === "INPUT" || element.nodeName === "TEXTAREA") {
        const input: HTMLInputElement = <HTMLInputElement>element;
        input.focus();
        input.setSelectionRange(0, input.value.length);
        return input.value;
    }

    if (element.hasAttribute("contenteditable")) {
        element.focus();
    }

    const selection: Selection = window.getSelection();
    const range: Range = document.createRange();
    range.selectNodeContents(element);
    selection.removeAllRanges();
    selection.addRange(range);
    return selection.toString();
}

function clearSelection (element: HTMLElement): void {
    element.blur();
    window.getSelection().removeAllRanges();
}

function execCommand (command: "copy"|"cut"): boolean {
    try {
        return document.execCommand(command);
    } catch (err) {
        return err || false;
    }
}
