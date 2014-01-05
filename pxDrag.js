/*
 * pxDrag (pixelly Dragging) version 2.0
 * https://github.com/altbdoor/pxDrag
 *
 * Copyright (C) 2014 altbdoor
 * Released under the MIT license
 * http://opensource.org/licenses/MIT
 */

var pxDrag = (function () {
	// polyfills
	var _preventDefault, _stopPropagation,
		_addEventListener, _removeEventListener,
		
		standardizeEvent = function (e) {
			return e || window.event;
		};
	
	// event.preventDefault
	if (Event.prototype.preventDefault) {
		_preventDefault = function (e) {
			e.preventDefault();
		}
	}
	else {
		_preventDefault = function (e) {
			e = standardizeEvent(e);
			e.returnValue = false;
		}
	}
	
	// event.stopPropagation
	if (Event.prototype.stopPropagation) {
		_stopPropagation = function (e) {
			e.stopPropagation();
		}
	}
	else {
		_stopPropagation = function (e) {
			e = standardizeEvent(e);
			e.cancelBubble = true;
		}
	}
	
	// event.addEventListener and event.removeEventListener
	if (Element.prototype.addEventListener) {
		_addEventListener = function (elem, type, listener) {
			elem.addEventListener(type, listener, false);
		}
		
		_removeEventListener = function (elem, type, listener) {
			elem.removeEventListener(type, listener, false);
		}
	}
	else {
		_addEventListener = function (elem, type, listener) {
			elem.attachEvent('on' + type, listener);
		};
		
		_removeEventListener = function (elem, type, listener) {
			elem.detachEvent('on' + type, listener);
		};
	}
	
	// the function
	return function (obj) {
		// get all elements ready, and calculate max boundary
		var _child = obj.child,
			_parent = ((obj.parent) ? obj.parent : _child.parentNode),
			
			maxBoundX = _parent.clientWidth - _child.offsetWidth,
			maxBoundY = _parent.clientHeight - _child.offsetHeight,
			
			toBind, _mode;
		
		// set object to bind
		if (obj.mode) {
			_mode = obj.mode;
			
			if (obj.mode === 'pan') {
				toBind = _parent;
			}
			else if (obj.mode === 'move') {
				toBind = _child;
			}
		}
		else {
			if (maxBoundX <= 0 && maxBoundY <= 0) {
				_mode = 'pan';
				toBind = _parent;
			}
			else {
				_mode = 'move';
				toBind = _child;
			}
		}
		
		// object click, ready to drag
		_addEventListener(toBind, 'mousedown', function (e) {
			var e = standardizeEvent(e),
				
				childX, childY,
				diffX, diffY;
			
			if (_child.style.marginLeft) {
				childX = +_child.style.marginLeft.replace('px', '');
			}
			else {
				childX = _child.getBoundingClientRect().left - _parent.getBoundingClientRect().left;
			}
			
			if (_child.style.marginTop) {
				childY = +_child.style.marginTop.replace('px', '');
			}
			else {
				childY = _child.getBoundingClientRect().top - _parent.getBoundingClientRect().top;
			}
			
			diffX = e.clientX - childX;
			diffY = e.clientY - childY;
			
			_stopPropagation(e);
			
			// prevent selection
			function elemSelectStart (e) {
				_preventDefault(e);
			}
			_addEventListener(document, 'selectstart', elemSelectStart);
			
			// move object
			function elemMouseMove (e) {
				var e = standardizeEvent(e),
					
					nextX = e.clientX - diffX,
					nextY = e.clientY - diffY;
				
				if (_mode === 'pan') {
					_child.style.marginLeft = Math.max(Math.min(0, nextX), maxBoundX) + 'px';
					_child.style.marginTop = Math.max(Math.min(0, nextY), maxBoundY) + 'px';
				}
				else if (_mode === 'move') {
					_child.style.marginLeft = Math.max(0, Math.min(maxBoundX, nextX)) + 'px';
					_child.style.marginTop = Math.max(0, Math.min(maxBoundY, nextY)) + 'px';
				}
			}
			_addEventListener(document, 'mousemove', elemMouseMove);
			
			// function to remove the events after finished dragging
			_addEventListener(document, 'mouseup', function () {
				_removeEventListener(document, 'selectstart', elemSelectStart);
				_removeEventListener(document, 'mousemove', elemMouseMove);
			});
			
			// prevent default browser action of dragging
			_addEventListener(_parent, 'dragstart', function (e) {
				_preventDefault(e);
			});
		});
	};
})();