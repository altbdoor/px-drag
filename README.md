pxDrag (pixelly Dragging)
===

Version 2.0


Last updated 5 January 2014   


About
---
pxDrag is a small JavaScript for object panning or "drag and drop" within a boundary. It was made after a number of frustrated attempts in using image panning plugins.


Usage
--
```
pxDrag({
  child: element_in_effect,
  parent: parent_of_element_in_effect,
  mode: "pan" || "move"
});
```

`child` is basically the element in effect, which is to be panned or dragged around a boundary. `child` is compulsory and must be defined.

This boundary is set from the `parent` element, which can be specified, or automatically assumed to be the `child`'s immediate parent node. `parent` is optional and can be left undefined.

The `mode` takes in a string, of either "pan" or "move". This allows the `mode` to be overridden. If undefined, the mode will be automatically assumed. If the `child`'s dimensions are larger than its `parent`, it will be "pan". Otherwise, "move". `mode` is optional and can be left undefined.


Browser Support
---
No thorough testing were made, but it was written to cover the widest base possible (with my limited skills), including IE8.


License
---
MIT