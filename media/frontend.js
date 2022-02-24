"use strict";

/*
digit as ([0-9])
number as (digit+)

mult as '*'
plus as "+"

expression as (expression) (mult|plus) (expression)
    
handle expression {

}
*/

// global search information

// contains all of the elements necessary for a search bar.
// it is duplicated per search bar.
let queryStarted = false;
const queryTemplate = document.getElementsByClassName("queryTemplate")[0];
let source = String.raw``;

// escape helper function
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
    result: "",
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
        
        search.queryExists = true;
    }

    // initialize new query
    const newTemplate = query;
    search.container.appendChild(newTemplate);
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