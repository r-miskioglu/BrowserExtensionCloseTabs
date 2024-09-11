const TIME = 1; //in minutes
const DEFAULTAUTOCLOSE = false;

//storing data with tabId as Key and {useAutoClose:boolean, showModal:boolean}
function storeData(tabId, data) {
    return new Promise((resolve, reject) => {
        const dataToStore = {};
        dataToStore[tabId.toString()] = JSON.stringify(data);
        
        browser.storage.local.set(dataToStore, function() {
            if (browser.runtime.lastError) {
                reject(browser.runtime.lastError);
            } else {
                resolve();
            }
        });
    });
}

function getData(tabId) {
    return new Promise((resolve, reject) => {
        browser.storage.local.get(String(tabId), function(result) {
            if (browser.runtime.lastError) {
                reject(browser.runtime.lastError);
            } else {
                const data = result[String(tabId)];
                if (data) {
                    resolve(JSON.parse(data));
                } else {
                    resolve(null);
                }
            }
        });
    });
}

function removeData(tabId){
    browser.storage.local.remove(tabId, function() {
        if (browser.runtime.lastError) {
            console.error(browser.runtime.lastError);
        }});
}

async function initContentScript(tabId) {
    try {
        let data = await getData(tabId);
        
        if (!data) {
            // Create data
            data = {
                useAutoClose: false,
                showModal: true,
            };
            await storeData(tabId, data);
        }

        return data;
    } catch (error) {
        console.error("Error initializing content script:", error);
        return null;
    }
}

browser.runtime.onConnect.addListener(function(port) {

    const tabId = port.sender.tab.id;

    port.onMessage.addListener(async function(msg) {

        if(msg.action === "init content script"){
            try{
                const result = await initContentScript(tabId);
                port.postMessage({action: "init content script", showModal:result.showModal});
            }
            catch(err){console.error(err)}
        }

        if(msg.action === "cancelAutoClose"){
            try{
                const data = await getData(tabId);
            
                await browser.alarms.clear(tabId.toString())

                data.showModal = false;
                data.useAutoClose = false;
                await storeData(tabId, data);

            }catch(err){console.error(err)}
        }
        if(msg.action === "enableAutoClose"){
            try{            
                const data = await getData(tabId);
                
                await browser.alarms.create(tabId.toString(), {delayInMinutes:TIME})

                data.showModal = false;
                data.useAutoClose = true;
                await storeData(tabId, data);
            }catch(err){console.error(err)}

        }
        if(msg.action === "inputDetected"){
            try{            
                const data = await getData(tabId);
                if(data.useAutoClose){
                    await browser.alarms.create(tabId.toString(), {delayInMinutes:TIME})
                }            
            }catch(err){console.error(err)}
            
        }
    });
});

//actually deleting the browser when chosen
function closeTab(tabId) {
    browser.tabs.remove(parseInt(tabId));
}

browser.alarms.onAlarm.addListener((alarm) => {
    closeTab(alarm.name)
});
