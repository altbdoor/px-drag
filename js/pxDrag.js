/*
 * pixelly dragging (pxDrag) version 1.0
 * http://googledrive.com/host/0B5pMzfAiZLn4Q2ZFZnZZdWU4OGs/pxDrag.html
 *
 * Copyright (C) 2013 Ng Han Seng (altbdoor)
 * Released under the MIT license
 * http://opensource.org/licenses/MIT
 */

var pxDrag = function (child, parent, mode) {
	/*
		preventDefault, addEventListener and removeEventListener polyfill for IE 8 and 9
		Edited and condensed from http://developer.mozilla.org/en-US/docs/Web/API/EventTarget.addEventListener
	*/
	(function () {
		if (!Event.prototype.preventDefault) {
			Event.prototype.preventDefault = function () {
				this.returnValue=false;
			};
		}
		
		if (!Event.prototype.stopPropagation) {
			Event.prototype.stopPropagation = function () {
				this.cancelBubble=true;
			};
		}
		
		if (!Element.prototype.addEventListener) {
			var eventListeners = [];
			
			var addEventListener = function (type, listener) {
				var self = this,
					wrapper = function (e) {
						e.target = e.srcElement;
						e.currentTarget = self;
						if (listener.handleEvent) {
							listener.handleEvent(e);
						} else {
							listener.call(self,e);
						}
					};
				
				this.attachEvent("on"+type, wrapper);
				eventListeners.push({object:this,type:type,listener:listener,wrapper:wrapper});
			}
			
			var removeEventListener = function (type, listener) {
				for (var counter=0; counter<eventListeners.length; counter++) {
					var eventListener = eventListeners[counter];
					if (eventListener.object==this && eventListener.type==type && eventListener.listener==listener) {
						this.detachEvent("on"+type, eventListener.wrapper);
						break;
					}
				}
			}
			
			Element.prototype.addEventListener = addEventListener;
			Element.prototype.removeEventListener = removeEventListener;
			
			if (HTMLDocument) {
				HTMLDocument.prototype.addEventListener = addEventListener;
				HTMLDocument.prototype.removeEventListener = removeEventListener;
			}
			if (Window) {
				Window.prototype.addEventListener = addEventListener;
				Window.prototype.removeEventListener = removeEventListener;
			}
		}
	})();
	
	// get all elements ready, and calculate max boundary
	var _child = child,
		_parent = ((parent) ? parent : _child.parentNode),
		
		maxBoundX = _parent.clientWidth - _child.offsetWidth,
		maxBoundY = _parent.clientHeight - _child.offsetHeight,
		
		mode = ((mode) ? mode : ((maxBoundX <= 0 || maxBoundY <= 0) ? 'pan' : 'move'));
	
	// set the object to bind
	if (mode == 'pan') {
		toBind = _parent;
	}
	else if (mode == 'move') {
		toBind = _child;
	}
	
	// object clicked, ready to drag
	toBind.addEventListener('mousedown', function (e) {
		// get the event, mouse position and initial margin values
		var e = e || window.event,
		
			posX = e.clientX,
			posY = e.clientY;
			
		e.stopPropagation();
		
		if (document.all && document.querySelector) {
			var childX = (_child.style.marginLeft || _child.currentStyle.marginLeft).replace('px', ''),
				childY = (_child.style.marginTop || _child.currentStyle.marginTop).replace('px', '');
		}
		else {
			var childX = (_child.style.marginLeft || window.getComputedStyle(_child).marginLeft).replace('px', ''),
				childY = (_child.style.marginTop || window.getComputedStyle(_child).marginTop).replace('px', '');
		}
			
		var diffX = posX - childX,
			diffY = posY - childY;
		
		// function for document when object is being dragged
		function docMouseMove (e) {
			var e = e || window.event,
		
				nextPosX = e.clientX,
				nextPosY = e.clientY,
				
				nextChildX = nextPosX - diffX,
				nextChildY = nextPosY - diffY;
				
			document.body.style.cursor = 'move';
			
			if (maxBoundX <= 0 || maxBoundY <= 0) {
				_child.style.marginLeft = Math.max(Math.min(0, nextChildX), maxBoundX) + 'px';
				_child.style.marginTop = Math.max(Math.min(0, nextChildY), maxBoundY) + 'px';
			}
			else {
				_child.style.marginLeft = Math.max(0, Math.min(maxBoundX, nextChildX)) + 'px';
				_child.style.marginTop = Math.max(0, Math.min(maxBoundY, nextChildY)) + 'px';
			}
		}
		
		// function for document to prevent selection while dragging
		function docSelectStart (e) {
			e.preventDefault();
		}
		
		// bind function to objects
		document.addEventListener('mousemove', docMouseMove, false);
		document.addEventListener('selectstart', docSelectStart, false);
		
		// function to remove the events after finished dragging
		document.addEventListener('mouseup', function (e) {
			document.body.style.cursor = '';
			document.removeEventListener('mousemove', docMouseMove, false);
			document.removeEventListener('selectstart', docSelectStart, false);
		});
		
		// prevent default browser action of dragging
		_parent.addEventListener('dragstart', function (e) {
			e.preventDefault();
		}, false);
	}, false);
}