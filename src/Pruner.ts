// @ts-ignore
const escapeHTML = str => str.replace(/[&<>'"]/g,
    // @ts-ignore
    tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;',
    }[tag]));

// @ts-ignore
const tagOffset = str => str.match(/[&<>'"]/g,
    // @ts-ignore
    tag => ({
        '&': 5,
        '<': 4,
        '>': 3,
        "'": 4
    }[tag]));

export const querySource = (query: string, line: string): number[][] => {
    const matches = [...line.matchAll(new RegExp(query, 'g'))];
    let result = [];
    for (let i = 0; i < matches.length; i++) {
        // @ts-ignore
        result.push([matches[i].index, matches[i][0].length]);
    }
    // @ts-ignore
    return result;
};

export const delimSearch = (delimiter: string, line: string): number[] => {
    let result: number[] = [];
    for (let i = 0; i < line.length; i++) {
        if (line[i] === delimiter[0]
            && line.substring(i, i + delimiter.length) === delimiter) {
            result.push(i);
            i += (delimiter.length - 1);
        }
    }

    return result;
};

export const highlight = (matches: number[], delimiter: string, line: string) => {
    // returns a string with highlighted matches.
    // If there are no matches, it simply returns the original string.
    let result: string = "";
    let previousMatchEnd: number = 0;
    for (let i = 0; i < matches.length; i++) {
        result += escapeHTML(line.substring(previousMatchEnd, matches[i])) +
        '<span class="highlight">' + escapeHTML(delimiter) + '</span>';
        previousMatchEnd = matches[i] + (delimiter.length);
    }
    return [result + escapeHTML(line.substring(previousMatchEnd, line.length)), matches.length !== 0];
};

export const highlightRegex = (query: string, line: string) => {
    const matches = querySource(query, line);
    let result: string = "";
    let previousMatchEnd: number = 0;
    for (let i = 0; i < matches.length; i++) {
        result += escapeHTML(line.substring(previousMatchEnd, matches[i][0])) +
        '<span class="highlight">' + escapeHTML(line.substring(matches[i][0], matches[i][0] + matches[i][1])) + '</span>';
        previousMatchEnd = matches[i][0] + matches[i][1];
    }
    return [result + escapeHTML(line.substring(previousMatchEnd, line.length)), matches.length !== 0];
};