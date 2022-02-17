const fs = require('fs');

// escape helper function
const escapeHtml = (unsafe) => {
    return unsafe.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
};

const querySource = (query, source) => {
    if (query.length === 0) {
        resultPanel.innerHTML = escapeHtml(source);
        return false;
    }

    let result = [];

    // initialize the regex pattern, then lines from source.
    const re = new RegExp(query, 'g'),
        lines = source.split('\n');

    // cached lengths (for... negligible speedups...)
    let linesLength = lines.length;
    let formattedLine = "";

    let prevMatchIndex = 0;

    // loop over ALL lines
    for (let i = 0; i < linesLength; i++) {
        let matches = [...lines[i].matchAll(re)];
        for (let n = 0; n < matches.length; n++) {
            let matchIndex = matches[n].index;
            formattedLine +=
                escapeHtml(lines[i].substring(prevMatchIndex, matchIndex)) +
                '<span class="highlight>' +
                escapeHtml(lines[i].substring(matchIndex, (prevMatchIndex += matchIndex + matches[n][0].length))) +
                '</span>';
        }
        result.push(formattedLine);
        formattedLine = "";
        prevMatchIndex = 0;
    }

    return result;
};

fs.readFile(String.raw`F:\dev\vscode_extensions\forage\forage-0.1\forage\package-lock.json`, 'utf8' , (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log(querySource("[0-9]+", data));
});