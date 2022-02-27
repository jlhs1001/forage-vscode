// "use strict";
// // Constants (html elements)
// let sourceCode;

// const escapeHtml = (unsafe) => {
//     return unsafe.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
// };

// window.onmessage = (event) => {
//     const message = event.data;
//     switch (message.command) {
//         case 'find':
//             sourceCode = message.source[0];
//             console.log(message.source[1]);
//             break;
//     }
// };

// const queryResult = document.getElementById("queryResult");
// const queries = document.getElementsByClassName("queries");

// let queryIndex = 0;
// let queryResults = [];

// const queryTemplate = document.getElementsByClassName("queryTemplate")[0];
// const queryContainer = document.getElementById("queryContainer");
// queryMakeFunctional(queryTemplate, queryContainer);
// queryContainer?.appendChild(queryTemplate);

// function queryMakeFunctional(queryTemplate, queryContainer) {
//     let queryId = queryIndex;
//     queryIndex += 2;
//     // false is equivalent to | with & being true
//     let queryLogicSelectState = false;
//     let queryInput = queryTemplate.children[0];
//     let newQueryButton = queryTemplate.children[1];
//     let deleteQueryButton = queryTemplate.children[2];
//     let queryLogicSelect = queryTemplate.children[3];
//     queryInput.oninput = (ev) => {
//         queryResults[queryId] = ev.target.value;
//         queryResults[queryId + 1] = queryLogicSelectState;
//         applyQueries();
//     };
//     newQueryButton.onclick = (ev) => {
//         let newQuery = queryTemplate.cloneNode(true);
//         newQuery.children[0].value = "";
//         queryMakeFunctional(newQuery, queryContainer);
//         queryContainer?.appendChild(newQuery);
//     };
//     deleteQueryButton.onclick = (ev) => {
//         queryTemplate.remove();
//         queryResults[queryId] = "";
//         queryResults[queryId + 1] = false;
//         queryResults[queryId + 2] && queryResults[queryId + 2]
//             .slice(1, queryResults[queryId + 2].length)[1];
//         applyQueries();
//     };
//     let orButton = queryLogicSelect.children[1];
//     let andButton = queryLogicSelect.children[0];
//     orButton.style.backgroundColor = "#6a7cb1";
//     andButton.style.backgroundColor = "";
//     orButton.onclick = () => {
//         orButton.style.backgroundColor = "#6a7cb1";
//         andButton.style.backgroundColor = "";
//         queryResults[queryId + 1] = queryLogicSelectState = false;
//         applyQueries();
//     };
//     andButton.onclick = () => {
//         andButton.style.backgroundColor = "#6a7cb1";
//         orButton.style.backgroundColor = "";
//         queryResults[queryId + 1] = queryLogicSelectState = true;
//         applyQueries();
//     };
// }
// function applyQueries() {
//     if (!queryResult || !sourceCode)
//         return;
//     let builtQuery = "";
//     // Generate the final regex patten
//     builtQuery += queryResults[0];
//     for (let i = 2; i < queryResults.length; i += 2) {
//         builtQuery += queryResults[i + 1]
//             ? "(?=" + queryResults[i] + ")"
//             : "|" + queryResults[i];
//     }
//     let result = "1: " + sourceCode;
//     let lineno = 1;
//     const re = new RegExp(builtQuery, 'g');
//     (result = "1: " + escapeHtml(sourceCode).replaceAll(re, (a) => `<span class="highlight">${a}</span>`));
//     result.split('\n');
//     result = result.replaceAll('\n', () => `\n&nbsp;${++lineno}:`);
//     queryResult.innerHTML = result;
// }
// // old version
// // result = line.match(RegExp(`.*(${builtQuery}).*`, 'g'));
// //         if (result !== null && builtQuery !== '') {
// //             for (let i = index - 3; i < index + 3; i++) {
// //                 if (lines) {
// //                     if (i === index) {
// //                         for (let match of [...line.matchAll(RegExp(builtQuery, 'g'))]) {
// //                             lines[i] = lines[i].replace(`<span class="highlight">${match[0]}</span>`, match[0]);
// //                             lines[i] = lines[i].replace(match[0], `<span class="highlight">${match[0]}</span>`);
// //                         }
// //                         queryResult.innerHTML += `    -> ${i}: ${lines[i]}`;
// //                         continue;
// //                     } else if (lines[i]) {
// //                         queryResult.innerHTML += `       ${i}: ${lines[i]}`;
// //                     }
// //                 }
// //                 queryResult.innerHTML += '\n\n';
// //             }
// //         }
// //# sourceMappingURL=Index.js.map

const delimSearch = (delimiter, source) => {
    let result = [];
    const sourceLength = source.length;
    const delimiterLength = delimiter.length;
    for (let i = 0; i < sourceLength; i++) {
        if (source[i] === delimiter[0]
            && source[i + delimiterLength - 1] === delimiter[delimiterLength - 1]) {
            if (source.substring(i, i + delimiterLength) === delimiter) {
                result.push(i);
            }
        }
    }
    return result;
};

for (let i = 0; i < 15; i++) {
    delimSearch("hello", "hello hello hhworld\n;97hello93hellofj world");
}