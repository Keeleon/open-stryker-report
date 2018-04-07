'use strict';
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  console.log('"open-stryker-report" detected a stryker.conf.js file and has activated');
  const disposable = vscode.window.onDidChangeActiveTextEditor(displayOpenStrykerReportButton);
  context.subscriptions.push(disposable);
}

function displayOpenStrykerReportButton(textEditor: vscode.TextEditor | undefined) {
  if (typeof textEditor === 'undefined') {
    return;
  }
  console.log(textEditor.document.fileName);
}

export function deactivate() {
}