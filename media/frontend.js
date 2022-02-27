"use strict";

document.addEventListener("DOMContentLoaded", () => {
    /* initialize; acquire vscode api handle */
    const vscode = acquireVsCodeApi();
    let regexpMode = false;

    vscode.postMessage({
        command: "fetchProjectData",
    });

    /* initialize search bar */
    const searchBar = document.getElementsByClassName("searchBar")[0];
    searchBar.oninput = () => {
        vscode.postMessage({
            command: "search",
            "query": searchBar.value,
            "activeButtons": buttons.active,
            "regexp": regexpMode,
        });
    };

    /* initialize buttons */
    const buttons = {
        folder: document.getElementById("folderButton"),
        invert: document.getElementById("invertButton"),
        regexp: document.getElementById("regexpButton"),
        // track active buttons
        active: [],
    };
    buttons.buttons = [buttons.folder, buttons.invert, buttons.regexp];
    for (const button of buttons.buttons) {
        button.onclick = (ev) => {
            if (buttons.active.includes(button.id)) {
                // turn off button
                button.style.backgroundColor = "#233023";
                buttons.active.splice(
                    buttons.active.indexOf(button.id), 1
                );
                if (ev.target.id === "regexpButton") {
                    regexpMode = false;
                }
            } else {
                // turn on button
                button.style.backgroundColor = "#324432";
                buttons.active.push(button.id);
                if (ev.target.id === "regexpButton") {
                    regexpMode = true;
                }
            }
        };
    }

    // temp
    const contextWindowSize = 2;

    /* wait for messages from extension */
    window.addEventListener("message", (event) => {
        switch (event.data.command) {
            case 'result':
                const resultContainer = document.getElementById("resultContainer");
                resultContainer.innerHTML = "";

                const contextWindow = document.createElement('div');
                contextWindow.style.backgroundColor = "rgb(38, 53, 38)";
                contextWindow.style.border = "solid 1px #597c65";
                contextWindow.style.marginLeft = "30px";
                contextWindow.style.marginTop = "20px";
                const matches = Object.values(event.data)[1];
                for (let i = 0; i < matches.length; i++) {
                    if (matches[i][1]) {
                        // place lines just before match
                        for (let n = (i - contextWindowSize); n < i; n++) {
                            if (matches[n]) {
                                contextWindow.innerHTML += matches[n][0];
                            }
                        }

                        // populate context window
                        for (let n = i; n < (i + contextWindowSize); n++) {
                            if (matches[n] && matches[n][1]) {
                                contextWindow.innerHTML += matches[n][0];
                                i = n + 1;
                            }
                        }

                        // place lines just after match.
                        for (let n = i; n < (i + contextWindowSize); n++) {
                            if (matches[n]) {
                                contextWindow.innerHTML += matches[n][0];
                            }
                        }
                    }

                    if (contextWindow.innerHTML !== "") {
                        resultContainer.appendChild(contextWindow.cloneNode(true));
                        contextWindow.innerHTML = "";
                    }
                }
                console.log("matches: ", matches[0][1]);
                break;
        }
    });
});