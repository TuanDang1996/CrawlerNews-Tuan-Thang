/** variable to save data **/
var elementHTML = null;
var elementCSS = null;
var showingElement;

/** Add item to context menu **/
var pageContext = chrome.contextMenus.create({
        "id": "select_element",
        "title": "Start Select Element",
        "contexts": ["all"]
    }
);

/** Handle event when click to ContextMenu **/
chrome.contextMenus.onClicked.addListener(
    function (info, tab) {
        chrome.tabs.sendMessage(tab.id, {action: "changeState"}, function (response) {
            updateContextMenu(response.selectState);
        });
    }
);

/** Update ContextMenu **/
var updateContextMenu = function (selectState) {
    if (selectState == true) {
        chrome.contextMenus.update(pageContext, {
            "title": "Cancel Select Element"
        });
    }
    else if (selectState == false) {
        chrome.contextMenus.update(pageContext, {
            "title": "Start Select Element"
        });
    }
}

//xử lý message từ contextScript
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action == "clickedElement") {
        updateContextMenu(request.selectState);
        // elementHTML = request.htmlCode;
        // elementCSS = request.cssCode;
        showingElement = true;
    }
    sendResponse({state: "displayDiv"});

    if(request.action == 'copyHtml') {
        copyToClipboard(request.html);
    } 

    if(request.action == 'copyCss') {
        copyToClipboard(request.css);
    } 
    
});

// //xử lý message từ contextScript
// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//     if (request.action == "click") {
//         alert('def');
//     }
//     sendResponse({state: 'end'});
// });

function copyToClipboard(codeSteal) {
    const input = document.createElement("input");
    input.style.position = "fixed";
    input.style.opacity = 0;
    input.value = codeSteal;
    document.body.appendChild(input);
    input.select();
    document.execCommand("Copy");
    document.body.removeChild(input);
};