(function(window){
	'use strict';

	var createTab, CSSBeautify, HTMLBeautify;

	createTab = function(deep) {
        var space = '';
        for(var i = 0; i < deep; i++) {
            space += '   ';
        }
        return space;
    }

	CSSBeautify = function(rule) {
        var ruleBeautify = rule,
            deep = 0,
            str = '';

        ruleBeautify.trim();
        
        ruleBeautify =  ruleBeautify.replace(/\{/g,"{~::~")
                                    .replace(/\}/g,"}~::~")
                                    .replace(/\;/g,";~::~")
                                    .split('~::~');

        for(var i = 0; i < ruleBeautify.length; i++) {
            ruleBeautify[i].trim();
            if( /\{/.exec(ruleBeautify[i]))  {
                str += createTab(deep++) + ruleBeautify[i] + '\n';
            } else
            if( /\}/.exec(ruleBeautify[i]))  {
                str += createTab(--deep) + ruleBeautify[i];
            }
            else {
                str += createTab(deep) + ruleBeautify[i] + '\n';
            }
        }

        return str;
    } 

    HTMLBeautify = function (html){
        var htmlBeautify = html,
            str = '',
            deep = 0;

        htmlBeautify.trim();

        htmlBeautify =  htmlBeautify.replace(/\</g, "~::~<")
                                    .split('~::~');

        for(var i = 0; i < htmlBeautify.length; i++) {
            // <elm></elm> //
            if( /^<\w/.exec(htmlBeautify[i-1]) && /^<\/\w/.exec(htmlBeautify[i]) &&
                /^<[\w:\-\.\,]+/.exec(htmlBeautify[i-1]) == /^<\/[\w:\-\.\,]+/.exec(htmlBeautify[i])[0].replace('/','')) {
                str += htmlBeautify[i];
                deep--;
            } else
             // <elm> //
            if(htmlBeautify[i].search(/<\w/) > -1 && htmlBeautify[i].search(/<\//) == -1 && htmlBeautify[i].search(/\/>/) == -1 ) {
                str += '\n' + createTab(deep++) + htmlBeautify[i];
            } else
            // </elm> //
            if(htmlBeautify[i].search(/<\//) > -1) {
                str += '\n' + createTab(--deep) + htmlBeautify[i];
            }
            else {
                if(htmlBeautify[i] != '') 
                    str += '\n' + htmlBeautify[i];
            }
        }

        return str.trim(); 
    }

    var codeBeautify = {
	  	createTab: createTab,
	  	HTMLBeautify: HTMLBeautify,
	  	CSSBeautify: CSSBeautify,
	};

	// transport
	if ( typeof define === 'function' && define.amd ) {
	  	// AMD
	  	define( codeBeautify );
	} else {
	  	// browser global
	  	window.codeBeautify = codeBeautify;
	}
})(window);