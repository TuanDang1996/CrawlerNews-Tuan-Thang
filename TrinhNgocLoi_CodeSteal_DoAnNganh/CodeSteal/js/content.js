(function() {
    "use strict";

    var clickedEl = null, // Element is hovered
        isSelecting = false,  // Status select element or not
        elementHTML = null, // Html code to copy
        elementCSS = null, // Css code to copy
        displayHTMLCopyDiv = false,
        onclickBackup; // Backup onlick event


    /** Handle when background.js send message click to context menu **/
    chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
        if (request.action == "changeState") {
            if (isSelecting == false) {
                turnOnSelecting(); // Turn on status select element
            }
            else if(isSelecting == true) {
                turnOffSelecting(); // Turn Off status select element
            }
        }
        sendResponse({selectState: isSelecting});
    });

    /** Handle mouse event **/
    var ononmouseover = function (event) {
        clickedEl = event.target;
        classie.addClass(clickedEl, "highlight");
        return true;
    }
    var onmouseout = function (event) {
        clickedEl = event.target;
        classie.removeClass(clickedEl, "highlight");
        return true;
    }
    var onmouseclick = function (event) {

        /** If left mouse click **/
        if (event.button == 0) {
            turnOffSelecting();
            
            //elementCSS = readStyles([clickedEl]).join('\n');
            elementCSS = dumpCSS.dumpAllCSS(clickedEl);

            elementHTML = clickedEl.outerHTML;
            
            elementHTML = codeBeautify.HTMLBeautify(elementHTML);

            insertDivToDisplayCode(clickedEl, elementHTML, elementCSS);
            chrome.runtime.sendMessage(
                {
                    action:"clickedElement",
                    selectState: isSelecting
                }, 
                function(response) {
                    if(response.state == "displayDiv")
                        displayHTMLCopyDiv = true;
                }
            );

            clickedEl = null;
        }
        return false;
    }

    /** turn on event select element **/
    function turnOnSelecting() {
        if(displayHTMLCopyDiv){
            var result = document.getElementById('codeStealResult');
            document.body.removeChild(result);
            displayHTMLCopyDiv = false;
        }


        isSelecting = true;
        document.addEventListener("mouseover", ononmouseover, false);
        document.addEventListener("mouseout", onmouseout, false);

        /** Backup click event **/
        onclickBackup = document.body.onclick;
        document.body.onclick = onmouseclick;
    }

    /** turn off event select element **/
    function turnOffSelecting() {
        isSelecting = false;
        if (clickedEl){
            classie.removeClass(clickedEl, "highlight");
        }
        document.removeEventListener("mouseover", ononmouseover);
        document.removeEventListener("mouseout", onmouseout);
        document.body.onclick = onclickBackup;
    }

    // /** Get CSS of element**/
    // function getRules(element){
    //     var sheets = document.styleSheets;
    //     var result = "";
    //     element.matches = element.matches || element.webkitMatchesSelector || element.mozMatchesSelector || element.msMatchesSelector || element.oMatchesSelector;
    //     for (var i in sheets) {
    //         var rules = sheets[i].rules || sheets[i].cssRules;
    //         for(var r in rules) {
    //             if(element.matches(rules[r].selectorText)) {
    //                 var text = rules[r].cssText; 
    //                 // text = codeBeautify.CSSBeautify(text);
    //                 result += text;
    //             }
    //         }
    //     }
    //     return result;
    // }

    // /** throught all child **/
    // function readStyles(element){
    //     return element.reduce( function(styles, el) {
    //         styles.push(getRules(el));
    //         styles.push(readStyles(toArray(el.children)));
    //         return styles;
    //     }, []);
    // }

    // /**Convert child node to array**/
    // function toArray(object) {
    //     var arr = [];
    //     for( var i = 0; i < object.length; i++) {
    //         if(object[i]) {
    //             arr[i] = object[i];
    //         }
    //     }
    //     return arr;
    // }

    /** Calculating offsetleft with body**/
    function getOffsetLeft(element)
    {
        var offsetLeft = 0;
        do {
          if ( !isNaN( element.offsetLeft ) )
          {
              offsetLeft += element.offsetLeft;
          }
        } while( element = element.offsetParent );
        return offsetLeft;
    }

    /** Calculating offsettop with body**/
    function getOffsetTop(element)
    {
        var offsetTop = 0;
        do {
          if ( !isNaN( element.offsetTop ) )
          {
              offsetTop += element.offsetTop;
          }
        } while( element = element.offsetParent );
        return offsetTop;
    }

    /** Calculating position with body**/
    function calcPositionOfResult(clickedEl, result) {
        var offsetTop = getOffsetTop(clickedEl);
        var offsetLeft = getOffsetLeft(clickedEl);
        var widthClickedEl = parseInt(clickedEl.offsetWidth);
        var heightClickedEl = parseInt(clickedEl.offsetHeight);
        var offsetTopResult = offsetTop + heightClickedEl + 6;
        var offsetLeftResult = offsetLeft - (800 - widthClickedEl) / 2;

        if(offsetLeftResult < 5) {
            offsetLeftResult = 5;
        }

        result.style.left = offsetLeftResult + 'px';
        result.style.top = offsetTopResult + 'px';
    }

    /** insert element result to display result on body **/
    function insertDivToDisplayCode(clickedEl, htmlCode, cssCode) {
        var result = document.createElement( 'result' );

        result.innerHTML =      '<div id="codeSteal_HtmlCopyDiv">' + 
                                    '<form action="https://jsfiddle.net/api/post/library/pure/" method="POST" target="_blank">' +
                                        '<div class="code-steal-result-swap">' +
                                            '<div class="code-steal-result-content">' +
                                                '<div class="code-steal-label-swap">' +
                                                    '<label for="html">Html</label>' +
                                                    '<button type="button" class="code-steal-btn-copy" id="code-steal-btn-html">COPY</button>' +
                                                '</div>' +
                                                '<textarea id="codeSteal_Html" rows="15" cols="50" name="html"></textarea>'+
                                            '</div>' +
                                            '<div class="code-steal-result-content">' +
                                                '<div class="code-steal-label-swap">' +
                                                    '<label for="html">Css</label>' +
                                                    '<button type="button" class="code-steal-btn-copy" id="code-steal-btn-css">COPY</button>' +
                                                '</div>' +
                                                '<textarea id="codeSteal_Css" rows="15" cols="50" name="css"></textarea>'+
                                            '</div>' +
                                        '</div>' +
                                        '<div class="code-steal-jsfiddle-swap">' + 
                                            '<button type="submit" id="codeSteal_BtnToJsFiddle" class="code-steal-btn-jsfiddle">View On JsFiddle</button>' +
                                            '<button type="button" id="codeSteal_BtnClose" class="code-steal-btn-close">Close</button>' +
                                        '</div>' +
                                    '</form>'+ 
                                '</div>';

        result.id = 'codeStealResult';
        calcPositionOfResult(clickedEl, result);
        document.body.appendChild(result);
        document.getElementById("codeSteal_Html").innerHTML = htmlCode;
        document.getElementById("codeSteal_Css").innerHTML = cssCode;
    }    

    /** Handle event click when result element displayed **/
    document.addEventListener('click', function(el){
        if(displayHTMLCopyDiv) {

            /** Copy HTML **/
            var htmlCopybutton = document.getElementById('code-steal-btn-html');
            var isCopyHtml = htmlCopybutton.contains(el.target);
            if(isCopyHtml) {
                document.getElementById('codeSteal_Html').select();
                chrome.runtime.sendMessage(
                    {
                        action:"copyHtml",
                        html: elementHTML,
                    }, 
                    function(response) {}
                );
            }

            /** Copy CSS  **/
            var cssCopybutton = document.getElementById('code-steal-btn-css');
            var isCopyCss = cssCopybutton.contains(el.target);
            if(isCopyCss) {
                document.getElementById('codeSteal_Css').select();
                chrome.runtime.sendMessage(
                    {
                        action:"copyCss",
                        css: elementCSS,
                    }, 
                    function(response) {}
                );
            }

            /** Remove div result from document **/
            var closeBtn = document.getElementById('codeSteal_BtnClose');
            var result = document.getElementById('codeStealResult');
            var isClickInside = result.contains(el.target);
            var isClickBtnClose = closeBtn.contains(el.target);
            if(!isClickInside || isClickBtnClose) {
                document.body.removeChild(result);
                displayHTMLCopyDiv = false;
            }
        }
    });
})();