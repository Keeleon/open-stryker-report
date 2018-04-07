'use strict';
import * as vscode from 'vscode';
import { StatusBarAlignment } from 'vscode';
import open = require('open');
import * as path from 'path';
import * as fs from 'fs-extra';

const COMMAND_OPEN_STRYKER_REPORT: string = 'openStrykerReport';
const STATUS_BAR_ALIGNMENT: StatusBarAlignment = StatusBarAlignment.Left;
const STATUS_BAR_PRIORITY: number = 1;

export function activate(context: vscode.ExtensionContext) {
  console.log('"open-stryker-report" detected a stryker.conf.js file and has activated');
  displayStrykerStatusBarItem();
  const command = vscode.commands.registerCommand(COMMAND_OPEN_STRYKER_REPORT, openStrykerReport);
  context.subscriptions.push(command);
}

function displayStrykerStatusBarItem(): void {
  const openStrykerReportItem: vscode.StatusBarItem =
    vscode.window.createStatusBarItem(STATUS_BAR_ALIGNMENT, STATUS_BAR_PRIORITY);
  openStrykerReportItem.tooltip = 'Open Stryker HTML Report';
  openStrykerReportItem.command = COMMAND_OPEN_STRYKER_REPORT;
  openStrykerReportItem.text = 'Stryker';
  openStrykerReportItem.show();
}

async function openStrykerReport() {
  const strykerReportsExist = await strykerHtmlReportDirectoryExists();
  if (!strykerReportsExist) {
    informUser('Stryker HTML reports not found. Mutate your code.');
    return;
  }
  const strykerReportLocation = await getStrykerReportLocation();
  open(strykerReportLocation);
}

async function getStrykerReportLocation(): Promise<string> {
  const currentOpenFileName = getCurrentOpenFileName();
  const defaultStrykerReportLocation = getDefaultStrykerReportLocation();
  if (currentOpenFileName === '') {
    return defaultStrykerReportLocation;
  }
  const extension = path.extname(currentOpenFileName);
  const baseName = path.basename(currentOpenFileName, extension);
  const values = await vscode.workspace.findFiles(`reports/mutation/html/**/${baseName}${extension}.html`);
  if (values.length === 0) {
    return defaultStrykerReportLocation;
  }
  return values[0].fsPath;
}

function getDefaultStrykerReportLocation(): string {
  return `${vscode.workspace.rootPath}\\reports\\mutation\\html\\index.html`;
}

async function strykerHtmlReportDirectoryExists(): Promise<boolean> {
  try {
    await fs.stat(getDefaultStrykerReportLocation());
    return true;
  } catch (e) {
    return false;
  }
}

function getCurrentOpenFileName(): string {
  if (typeof vscode.window.activeTextEditor === 'undefined') {
    return '';
  }
  return vscode.window.activeTextEditor.document.fileName;
}

function informUser(message: string): void {
  vscode.window.showInformationMessage(message);
}

export function deactivate() {
}