(function(window){
	'use strict';

	var idCounter = 1,
		getStylesOfChild,
		getAllStylesOfElements,
		getStylesWithoutDefaults,
		changeKeyOfStyleCorrect,
		keepOnlyShorthandProperties,
		sameStyleCombiner,
		compareStyles,
		getStringStyles,
		dumpAllCSS,

		shorthands = {
		"animation": ["animation-name", "animation-duration", "animation-timing-function", "animation-delay", "animation-iteration-count", "animation-direction", "animation-fill-mode", "animation-play-state"],
		"background": ["background-image", "bakcground-position", "background-position-x", "background-position-y", "background-size", "background-repeat", "background-repeat-x", "background-repeat-y", "background-attachment", "background-origin", "background-clip", "background-color"],
		"background-position": ["background-position-x", "background-position-y"],
		"background-repeat": ["background-repeat-x", "background-repeat-y"],
		"border": ["border-left", "border-right", "border-bottom", "border-top", "border-color", "border-style", "border-width", "border-top-color", "border-top-style", "border-top-width", "border-right-color", "border-right-style", "border-right-width", "border-bottom-color", "border-bottom-style", "border-bottom-width", "border-left-color", "border-left-style", "border-left-width"],
		"border-bottom": ["border-color", "border-style", "border-width", "border-bottom-width", "border-bottom-style", "border-bottom-color"],
		"border-color": ["border-top-color", "border-right-color", "border-bottom-color", "border-left-color"],
		"border-image": ["border-image-source", "border-image-slice", "border-image-width", "border-image-outset", "border-image-repeat"],
		"border-left": ["border-color", "border-style", "border-width", "border-left-width", "border-left-style", "border-left-color"],
		"border-radius": ["border-top-left-radius", "border-top-right-radius", "border-bottom-right-radius", "border-bottom-left-radius"],
		"border-right": ["border-color", "border-style", "border-width", "border-right-width", "border-right-style", "border-right-color"],
		"border-spacing": ["-webkit-border-horizontal-spacing", "-webkit-border-vertical-spacing"],
		"border-style": ["border-top-style", "border-right-style", "border-bottom-style", "border-left-style"],
		"border-top": ["border-color", "border-style", "border-width", "border-top-width", "border-top-style", "border-top-color"],
		"border-width": ["border-top-width", "border-right-width", "border-bottom-width", "border-left-width"],
		"flex": ["flex-grow", "flex-shrink", "flex-basis"],
		"flex-flow": ["flex-direction", "flex-wrap"],
		"font": ["font-family", "font-size", "font-style", "font-variant", "font-weight", "line-height"],
		"grid-area": ["grid-row-start", "grid-column-start", "grid-row-end", "grid-column-end"],
		"grid-column": ["grid-column-start", "grid-column-end"],
		"grid-row": ["grid-row-start", "grid-row-end"],
		"height": ["min-height", "max-height"],
		"list-style": ["list-style-type", "list-style-position", "list-style-image"],
		"margin": ["margin-top", "margin-right", "margin-bottom", "margin-left"],
		"marker": ["marker-start", "marker-mid", "marker-end"],
		"outline": ["outline-color", "outline-style", "outline-width"],
		"overflow": ["overflow-x", "overflow-y"],
		"padding": ["padding-top", "padding-right", "padding-bottom", "padding-left"],
		"text-decoration": ["text-decoration-line", "text-decoration-style", "text-decoration-color"],
		"transition": ["transition-property", "transition-duration", "transition-timing-function", "transition-delay"],
		"-webkit-animation": ["-webkit-animation-name", "-webkit-animation-duration", "-webkit-animation-timing-function", "-webkit-animation-delay", "-webkit-animation-iteration-count", "-webkit-animation-direction", "-webkit-animation-fill-mode", "-webkit-animation-play-state"],
		"-webkit-border-after": ["-webkit-border-after-width", "-webkit-border-after-style", "-webkit-border-after-color"],
		"-webkit-border-before": ["-webkit-border-before-width", "-webkit-border-before-style", "-webkit-border-before-color"],
		"-webkit-border-end": ["-webkit-border-end-width", "-webkit-border-end-style", "-webkit-border-end-color"],
		"-webkit-border-start": ["-webkit-border-start-width", "-webkit-border-start-style", "-webkit-border-start-color"],
		"-webkit-border-radius": ["border-top-left-radius", "border-top-right-radius", "border-bottom-right-radius", "border-bottom-left-radius"],
		"-webkit-columns": ["-webkit-column-width", "-webkit-column-count"],
		"-webkit-column-rule": ["-webkit-column-rule-width", "-webkit-column-rule-style", "-webkit-column-rule-color"],
		"-webkit-margin-collapse": ["-webkit-margin-before-collapse", "-webkit-margin-after-collapse"],
		"-webkit-mask": ["-webkit-mask-image", "-webkit-mask-position-x", "-webkit-mask-position-y", "-webkit-mask-size", "-webkit-mask-repeat-x", "-webkit-mask-repeat-y", "-webkit-mask-origin", "-webkit-mask-clip"],
		"-webkit-mask-position": ["-webkit-mask-position-x", "-webkit-mask-position-y"],
		"-webkit-mask-repeat": ["-webkit-mask-repeat-x", "-webkit-mask-repeat-y"],
		"-webkit-text-emphasis": ["-webkit-text-emphasis-style", "-webkit-text-emphasis-color"],
		"-webkit-text-stroke": ["-webkit-text-stroke-width", "-webkit-text-stroke-color"],
		"-webkit-transition": ["-webkit-transition-property", "-webkit-transition-duration", "-webkit-transition-timing-function", "-webkit-transition-delay"],
		"-webkit-transform-origin": ["-webkit-transform-origin-x", "-webkit-transform-origin-y", "-webkit-transform-origin-z"],
	};

	/** 
	 ** Filter Shorthand properties 
	 ** Remove shorthand if don't use
	 **/
	keepOnlyShorthandProperties = function(style) {
		var property,
			output = [],
			longhands,
			removelist = [];

		for (var shorthand in shorthands) {

			if (style.hasOwnProperty(shorthand) && style[shorthand]) {
				longhands = shorthands[shorthand];

				for (var i = 0; i < longhands.length; i++) {
					removelist[longhands[i]] = true;
				}
			} else if (!style[shorthand]) {
				removelist[shorthand] = true;
			}
		}

		for (property in style) {
			if (style.hasOwnProperty(property) && !removelist.hasOwnProperty(property)) {
				output[property] = style[property];
			}
		}

		return output;
	}

	/** Change default key of styles: textAlign -> text-align **/
	changeKeyOfStyleCorrect = function(style) {
		var regex = /[A-Z]/g,
			match,
			output = [];
		for(var key in style) {
		  	var lowercase = key.replace(regex, function(match) {
			    return '-' + match.toLowerCase();
			});

			lowercase = lowercase.replace('webkit', '-webkit');

			output[lowercase] = style[key];
        }
        return output;
	}

    /**
     ** Get Styles throught all children element
     ** Remove default value
     ** Convert to string
     **/

    /** Get styles of one child element **/
    getStylesWithoutDefaults = function(element) {

    	// creating an empty tempEl object
		var tagName = element.tagName.toLowerCase();
	  	var tempEl = document.createElement(tagName);
	  	document.body.appendChild(tempEl);

	  	// getting computed styles for both elements
	  	var defaultStyles = window.getComputedStyle(tempEl);
	  	var elementStyles = window.getComputedStyle(element);

	  	// calculating the difference
	  	var output = [];
	  	for( var key in elementStyles ) {
	  		var avalue = elementStyles[key];
	  		var bvalue = defaultStyles[key];
	 		if(!elementStyles.hasOwnProperty(key) || avalue === bvalue) {
	      		continue;
	    	}
	    	output[key] = avalue;
	  	}

	  // clear dom
	  document.body.removeChild(tempEl);

	  return output;
	}

    /** Create object JSON CSS **/
    getStylesOfChild = function(element){
        var output = {},
        	property = '',
            idElement = element.tagName + '_' + idCounter,
            style = getStylesWithoutDefaults(element);

        style = changeKeyOfStyleCorrect(style);
        style = keepOnlyShorthandProperties(style);

        for(var key in style) {
        	if(!style[key] || !key || !style.hasOwnProperty(key)) continue;
        	property += '   ' + key + ':' + style[key] + '; \n';
        }

        element.id = idElement;

        /** Add id and properties to styles **/
        output.id = '#' + idElement;
        output.property = property;

        // output = '#' + idElement + '{ \n' + output + '} \n';

        idCounter++;
        return output;
    }

    /** Throught all child element **/
    getAllStylesOfElements = function(element) {
        var allstyles = [],
        	output = [],	
        	childElement;

        allstyles.push(getStylesOfChild(element));

        output = output.concat(allstyles);

        childElement = element.children;
        
        for(var i = 0; i < childElement.length; i++) {
            output = output.concat(getAllStylesOfElements(childElement[i]));
        }
       
        return output;
    }

    /**  **/
    compareStyles = function(propertyA, propertyB) {
    	return propertyA === propertyB;
    }

    /** Combiner same style **/
    sameStyleCombiner = function(styles) {
		var i, j,
			stylesA, stylesB,
			ids,
			output = [];

		for (i = 0; i < styles.length; i++) {
			stylesA = styles[i];
			ids = stylesA.id;

			for (j = i + 1; j < styles.length; j++) {
				stylesB = styles[j];

				if (compareStyles(stylesA.property, stylesB.property)) {
					ids += ', ' + stylesB.id;
					styles.splice(j, 1);
				}
			}

			output.push({
				id: ids,
				property: stylesA.property,
			});
		}

		return output;
    }

    /** Get string styles **/
    getStringStyles = function(styles) {
    	var output = '';
    	for(var i = 0; i < styles.length; i++) {
    		output += styles[i].id + '{ \n' + styles[i].property + '} \n';
    	}

    	return output;
    }

	dumpAllCSS = function(styles){
		var output,
			allStyles,
			lastStyles;

		idCounter = 1;

		allStyles = getAllStylesOfElements(styles);
		lastStyles = sameStyleCombiner(allStyles);
		output = getStringStyles(lastStyles);

		return output;
	}

	var dumpCSS = {
	  	getStylesOfChild: getStylesOfChild,
	  	getStylesWithoutDefaults: getStylesWithoutDefaults,
	  	getAllStylesOfElements: getAllStylesOfElements,
	  	getStringStyles: getStringStyles,
	  	dumpAllCSS: dumpAllCSS,
	};

	// transport
	if ( typeof define === 'function' && define.amd ) {
	  	// AMD
	  	define( dumpCSS );
	} else {
	  	// browser global
	  	window.dumpCSS = dumpCSS;
	}

})(window);