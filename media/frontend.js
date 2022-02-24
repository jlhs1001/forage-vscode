"use strict";

const escapeHTML = str => str.replace(/[&<>'"]/g,
    tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt',
        "'": '&#39',
        '"': '&quot;',
    }[tag]));

// document.addEventListener("DOMContentLoaded", () => {
//     const vscode = acquireVsCodeApi();



//     window.addEventListener("message", (event) => {
//         switch (event.data.command) {
//             case 'results':
//                 console.log(event.data.results);
//         }
//     });
// });

const querySource = (query, source) => {
    if (query.length === 0) {
        resultPanel.innerHTML = escapeHTML(source);
        return false;
    }

    let result = [];

    // initialize the regex pattern, then lines from source.
    const re = new RegExp(query, 'g'),
        lines = source.split('\n');

    // cached lengths (for... negligible speedups...)
    const linesLength = lines.length;
    let formattedLine = "";
    let prevMatchIndex = 0;
    let matchEnd = 0;;

    // loop over ALL lines
    for (let i = 0; i < linesLength; i++) {
        let matches = [...lines[i].matchAll(re)];
        for (let n = 0; n < matches.length; n++) {
            let matchIndex = matches[n].index;
            matchEnd = matchIndex + matches[n][0].length;
            console.log(matchIndex);
            console.log(lines[i].substring(prevMatchIndex - 3, matchIndex));
            formattedLine +=
                lines[i].substring(prevMatchIndex, matchIndex) +
                '<span class="highlight" style="background-color: red; color: blue;">' +
                lines[i].substring(matchIndex, matchEnd) +
                '</span>';
            prevMatchIndex = matchIndex + matches[n][0].length;
        }
        result.push(formattedLine + lines[i].substring(matchEnd, lines[i].length));
        formattedLine = "";
        prevMatchIndex = 0;
    }

    return result;
};

const res = querySource("[0-9]+", "34\n2345fgg24\n542\ng245\ng42\n5n2yhn35n63\n45\n542\n55432432\n");
console.log(res);