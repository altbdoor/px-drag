pxDrag (pixelly Dragging)
=========================

Version 1.0   
Last updated 25 September 2013   

About
-----

pxDrag is a small JavaScript for object panning or "drag and drop" within a boundary. It was made after a number of frustrated attempts in using image panning plugins.


Detailed Usage
--------------
`var obj = new pxDrag( child [, parent, mode ]);`

pxDrag accepts three arguments, which are `child`, `parent` and `mode`. Before defining them further, here are a few examples of using them.

> ### Example 1
> ##### HTML
>     <div id="foo">
>       <div id="bar"></div>
>     </div>
>
> ##### CSS
>     #foo {width:400px; height:300px}
>     #bar {width:10px; height:10px; display:inline-block}
>
> ##### JavaScript
>     var bar = document.getElementById('bar');
>     var obj = new pxDrag(bar);
> ---
> `#bar` will be dragged around, within the constraints of `#foo`.
---
> ### Example 2
> ##### HTML
>     <div id="foo">
>       <img id="bar" src="..." width="800" height="600">
>     </div>
>
> ##### CSS
>     #foo {width:400px; height:300px}
>     #bar {width:800px; height:600px}
>
> ##### JavaScript
>     var bar = document.getElementById('bar');
>     var obj = new pxDrag(bar);
> ---
> `#bar` will be panned around, within the constraints of `#foo`.

### `child`
The target element that is to be dragged. It can be any element (`div` or `img`) as long as it is pushable via the `margin` CSS attribute.

### `parent` (Optional)
The parent of the target element, which basically forms the constraints around the target element. If undefined, the script assumes that it is the immediate parent to the target element.

In *Example 1* and *Example 2*, the parent is automatically assumed to be `#foo`.

### `mode` (Optional)
There are two modes, which are `"pan"` and `"move"`. If undefined, the script assumes the mode via the following rules:

- If size of child is **larger** than parent, then its `"pan"`.
- If size of child is **smaller** than parent, then its `"move"`.

##### `"pan"` mode
The listener is attached to the parent element, therefore dragging the parent element would move the child element as well. An example would be image panning.

##### `"move"` mode
The listener is attached to the child element, therefore dragging the parent element does not move the child element. Instead, only dragging the child element would move it. An example would be drag and drop operation.


Browser Support
---------------
- Internet Explorer 8+
- Firefox 22.0+
- Chrome 22.0+
- Safari 5.1+
- Opera 16.0+

Please note that the browser support is rather demanding, as it uses `getComputedStyle` to determine the initial margin values of the target element. To support older browsers, you could define the margin values immediately with the style attribute, although it is not recommended.