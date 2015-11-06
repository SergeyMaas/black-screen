import Terminal from "./Terminal";
import * as i from "./Interfaces";
import * as _ from 'lodash';
const IPC = require('ipc');

export default class Application {
    private static _instance: Application;
    private _terminals: Terminal[] = [];
    private _contentSize: i.Size;
    private _charSize: i.Size;
    private _activeTerminalIndex: number;

    constructor() {
        if (Application._instance) {
            throw new Error('Use Application.getInstance() instead.');
        }
    }

    static getInstance(): Application {
        if (!Application._instance) {
            Application._instance = new Application();
        }
        return Application._instance;
    }

    get terminals() {
        return this._terminals;
    }

    get activeTerminal(): Terminal {
        return this.terminals[this._activeTerminalIndex];
    }

    addTerminal(): Terminal {
        let terminal = new Terminal(this.contentDimensions);
        this.terminals.push(terminal);

        return terminal;
    }

    removeTerminal(terminal: Terminal): Application {
        _.pull(this.terminals, terminal);

        if (_.isEmpty(this.terminals)) {
            IPC.send('quit');
        }

        return this;
    }

    activateTerminal(terminal: Terminal): void {
        this._activeTerminalIndex = this.terminals.indexOf(terminal);
    }

    set contentSize(newSize) {
        this._contentSize = newSize;

        this.terminals.forEach((terminal: Terminal) => terminal.dimensions = this.contentDimensions)
    }

    get contentSize(): i.Size {
        return this._contentSize;
    }

    get charSize() {
        return this._charSize
    }

    set charSize(size: i.Size) {
        this._charSize = size;
    }

    get contentDimensions(): i.Dimensions {
        return {
            columns: Math.floor(this.contentSize.width / this.charSize.width),
            rows: Math.floor(this.contentSize.height / this.charSize.height),
        };
    }
}
