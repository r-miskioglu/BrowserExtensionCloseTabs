let tabPorts = {};
const TIMEOUT = 5*60000; // 5 minutes in milliseconds

//tab state 0 means, no timer and showModal, 1 means timer and hideModal, 2 means no timer and hideModal
//when the question for the tab arises for the first time the state is 0

function connected(port) {

    const tabId = port.sender.tab.id;

    port.onDisconnect.addListener((port) => {
        const tabId = port.sender.tab.id;
        delete tabPorts[tabId]
    });

    if(!(tabId in tabPorts)){
        tabPorts[tabId] = {port: port, state: "unsure"}
        tabPorts[tabId].port.postMessage({action: "showModal"});
    }
    // tabPorts[tabId].port.postMessage({action: "checkReady"});
    tabPorts[tabId].port.onMessage.addListener((m) => {
        if(m.action === "enableAutoClose"){
            tabPorts[tabId].state = "useAutoClose";
            resetTabTimeout(tabId);
        };
        if(m.action === "cancelAutoClose"){
            tabPorts[tabId].state = "dontUseAutoClose";
        };
        if(m.action === "inputDetected"){
            resetTabTimeout(tabId);
        }
    });
}

browser.runtime.onConnect.addListener(connected);

function closeTab(tabId) {
    chrome.tabs.remove(tabId);
}

function resetTabTimeout(tabId) {
    //check for tab state
    if(tabId in tabPorts){
        if(tabPorts[tabId].state === "useAutoClose"){
            tabPorts[tabId].timeout = setTimeout(() => closeTab(tabId), TIMEOUT);
        }
    }
}

browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
        resetTabTimeout(tabId);
    }
});

browser.tabs.onActivated.addListener((activeInfo) => {
    resetTabTimeout(activeInfo.tabId);
});

browser.tabs.onRemoved.addListener((tabId) => {
    if (tabPorts[tabId].timeout) {
        clearTimeout(tabPorts[tabId].timeout);
        delete tabPorts[tabId];
    }
});