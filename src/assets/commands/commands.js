/*
 * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

/* global global, Office, self, window */

Office.onReady(() => {
    // If needed, Office.js is ready to be called
});

/**
 * Shows a notification when the add-in command is executed.
 * @param event
 */

let count = 0

function action(event) {
    // Your code goes here

    count++
    Office.addin.showAsTaskpane()
    console.log("Displaying Addin " + count)

    // Be sure to indicate when the add-in command function is complete
    event.completed();
}

function getGlobal() {
    return typeof self !== "undefined"
        ? self
        : typeof window !== "undefined"
            ? window
            : typeof global !== "undefined"
                ? global
                : undefined;
}

const g = getGlobal();

// the add-in command functions need to be available in global scope
g.action = action;
