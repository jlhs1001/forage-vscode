"use strict";

// global search information

// contains all of the elements necessary for a search bar.
// it is duplicated per search bar.
let queryStarted = false;
const queryTemplate = document.getElementsByClassName("queryTemplate")[0];
let source = String.raw``;

String.prototype.insert = function(index, string) {
    if (index > 0) {
        return this.substring(0, index) + string + this.substring(index);
    }

    return string + this;
};

const escapeHtml = (unsafe) => {
    return unsafe.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
};

const template = {
    input: queryTemplate.children[0],
    new: queryTemplate.children[1],
    delete: queryTemplate.children[2],
    logic: {
        or: queryTemplate.children[3].children[0],
        and: queryTemplate.children[3].children[1],
    },
};

const search = {
    resultPanel: document.getElementById("queryResult"),
    queries: document.getElementsByClassName("queries"),
    container: document.getElementById("queryContainer"),
    results: [],
    index: 0,
    queryExists: false,
};

window.addEventListener("message", (event) => {
    // listen for messages from the extension
    const message = event.data;
    switch (message.command) {
        case 'beginSearch':
            queryStarted
                ? search.container.children[0].focus()
                : setupQuery(queryTemplate);
            source = String.raw`${message.source}`;
    }
});

const setupQuery = (query) => {
    let searchID = search.index++;
    let logicState = {
        invert: false,
        // apply '|' when false
        and: false,
    };

    if (!search.queryExists) {
        template.input.oninput = (ev) => {
            search.results[searchID] = {
                search: ev.target.value,
                logic: logicState, 
            };
            querySource();
        };

        template.new.onclick = () => {
            const newTemplate = query.cloneNode(true);
            newTemplate.children[template.input].value = "";
            setupQuery();
        };

        template.delete.onclick = () => {
            search.results.splice(searchID, 1);
            query.remove();
        };
        console.log(query.children[3]);
        // initialize logic buttons
        query.children[3].children[0].style.backgroundColor = "";
        query.children[3].children[1].style.backgroundColor = "#6a7cb1";

        // or ('|') button
        template.logic.or.onclick = () => {
            query.children[3].children[0].style.backgroundColor = "#6a7cb1";
            query.children[3].children[1].style.backgroundColor = "";
            logicState.and = false;
            querySource();
        };

        // and ('&') button
        template.logic.and.onclick = () => {
            query.children[3].children[0].style.backgroundColor = "";
            query.children[3].children[1].style.backgroundColor = "#6a7cb1";
            logicState.and = true;
            querySource();
        };

        
        search.queryExists = true;
    }

    // initialize new query
    const newTemplate = query;
    search.container.appendChild(newTemplate);
};

const querySource = () => {
    if (search.results[0].search.length === 0) {
        search.resultPanel.innerHTML = escapeHtml(source);
        return;
    }

    // kind of hacky, but necessary for the white-space patch.

    let builtQuery = search.results[0].search;
    for (let i = 1; i < search.results.length; i++) {
        builtQuery += search.results[i].logic.and
            ? `(?=${search.results[i].search})`
            : `|${search.results[i]}`;
    }

    let result = [];
    let lineHasMatch = false;
    
    let currentLine = "";

    let htmlEncodedChars = {
        '&': 4,
        '<': 3,
        '>': 3,
        '"': 5,
        "'": 5,
    };
    let re = new RegExp(builtQuery, 'g');
    let lines = source.split('\n');
    lines.forEach((line, index) => {
        let fmtdLine = escapeHtml(line);
        let lineHasMatch = false;
        let updatedIndex = 0;
        for (let match of [...line.matchAll(re)]) {
            let htmlEncodedLenSum = 0;
            for (let char of line.substring(0, match.index)) {
                console.log(htmlEncodedChars[char]);
                if (htmlEncodedChars[char]) {
                    htmlEncodedLenSum += htmlEncodedChars[char];
                }
            }
            fmtdLine = fmtdLine.insert(match.index + (updatedIndex + htmlEncodedLenSum), '<span class="highlight">');
            updatedIndex += 24;

            for (let char of match[0]) {
                if (htmlEncodedChars[char]) {
                    htmlEncodedLenSum += htmlEncodedChars[char];
                }
            }

            fmtdLine = fmtdLine.insert((match.index + (updatedIndex + htmlEncodedLenSum)) + match[0].length, '</span>');
            updatedIndex += 7;
            lineHasMatch = true;
        }
        if (lineHasMatch) {
            result.push(`<div class="matchBox">`);
            for (let i = index - 2; i < index + 2; i++) {
                if (lines[i]) {
                    i === index 
                        ? result.push(`<div class="lineNumber">${index + 1}:</div><div class="line">${fmtdLine}</div>`)
                        : result.push(`<div class="lineNumber">${i + 1}:</div><div class="line">${lines[i]}</div>`);
                }
            }
            result.push("</div>");
        }
    });
    search.resultPanel.innerHTML = result.join("\n");
};