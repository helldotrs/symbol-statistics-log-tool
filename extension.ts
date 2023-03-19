import * as vscode from 'vscode';
import * as fs from 'fs';

const symbolsToTrack = "`~!@#$%^&*()-_+=[ ]{};:'\",.<>/?|¤±§½åÅäÄöÖ";
const logFilePath = './symbol-logs.txt';
let symbolCounts = new Map<string, number>();

export function activate(context: vscode.ExtensionContext) {
  if (!fs.existsSync(logFilePath)) {
    fs.writeFileSync(logFilePath, '');
  }

  vscode.workspace.onDidChangeTextDocument(event => {
    for (const change of event.contentChanges) {
      const addedText = change.text;
      for (let i = 0; i < addedText.length; i++) {
        const symbol = addedText[i];
        if (symbolsToTrack.includes(symbol)) {
          const count = symbolCounts.get(symbol) ?? 0;
          symbolCounts.set(symbol, count + 1);
        }
      }
    }

    const logText = Array.from(symbolCounts.entries())
      .map(([symbol, count]) => `${symbol}: ${count}`)
      .join('\n');
    fs.writeFileSync(logFilePath, logText);
  });
}
