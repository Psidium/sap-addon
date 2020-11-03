let usePromisesForAsync = false;
if (typeof browser !== "undefined") {
    usePromisesForAsync = true;
} else {
    window.browser = chrome;
}
function execAsync (asyncFunction, args, callback) {
    if (!Array.isArray(args)) args = [args];
    if (usePromisesForAsync) {
        asyncFunction(...args).then(callback);
    } else {
        asyncFunction(...args, callback);
    }
}
let url = new URL(window.location.href);

let idService = {
    focus2FAPasscodeInput: {
        optionName: "id-service-focus-2fa-passcode-input",
        inputQuery: "form#secondFactorForm div.ids-input-area fieldset.ids-fieldset input#j_otpcode",
    },
};

idService.focus2FAPasscodeInput.focus = function () {
    executeFunctionAfterPageLoaded(function () {
        const input = document.querySelector(idService.focus2FAPasscodeInput.inputQuery);
        if (input && input.focus) {
            input.focus();
        }
    });
};

let executeFunctionAfterPageLoaded = function (func, args=[]) {
    window.addEventListener("load", (e) => {
        func(...args);
    });
    if (document.readyState === "complete") {
        func(...args);
    }
};

let options = {};
let loadOptionsFromStorage = async function () {
    return new Promise(async function (resolve, reject) {
        execAsync(browser.storage.local.get.bind(browser.storage.local), "options", (res) => {
            options = res.options || {};
            resolve();
        });
    });
};

let isEnabled = function (optionName) {
    return !options || options[optionName] !== false; // enabled per default
};

async function main () {
    await loadOptionsFromStorage();

    if (isEnabled(idService.focus2FAPasscodeInput.optionName)) {
        idService.focus2FAPasscodeInput.focus();
    }
};
main();
browser.runtime.onConnect.addListener(() => {
    main();
});
