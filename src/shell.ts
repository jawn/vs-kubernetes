'use strict';

import * as vscode from 'vscode';
import * as shelljs from 'shelljs';

const WINDOWS : string = 'win32';

export type ShellHandler = (code : number, stdout : string, stderr : string) => void;

export function isWindows() : boolean {
    return (process.platform === WINDOWS);
}

export function isUnix() : boolean {
    return !isWindows();
}

export function home() {
    const homeVar = isWindows() ? 'USERPROFILE' : 'HOME';
    return process.env[homeVar];
}

export function combinePath(basePath : string, relativePath : string) {
    let separator = '/';
    if (isWindows()) {
        relativePath = relativePath.replace(/\//g, '\\');
        separator = '\\';
    }
    return basePath + separator + relativePath;
}

export function execOpts() : any {
    let env = process.env;
    if (isWindows()) {
        env = Object.assign({ }, env, { HOME: home() });
    }
    const opts = {
        cwd: vscode.workspace.rootPath,
        env: env,
        async: true
    };
    return opts;
}

export function exec(cmd : string, handler : ShellHandler) {
    try {
        execCore(cmd, execOpts(), handler);
    } catch (ex) {
        vscode.window.showErrorMessage(ex);
    }
}

export function execCore(cmd : string, opts : any, handler : ShellHandler) {
    shelljs.exec(cmd, opts, handler);
}
