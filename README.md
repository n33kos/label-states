# label-states
**LabelStates** targets all form field elements within the specified container then watches for changes, adding classes to the label when the input is focused or filled out. This allows for custom label styling or effects which reflect the status of the input. This plugin works for text, radio, checkbox, select, and multiselect fields.

**LabelStates** traverses upward through the DOM for each field, searching for the first **label** or element with a class of **.labelstate-label** to act as the field's label. This upward traversal is limited by the **search_depth** variable to allow for irregular nesting and form arrangement. If a field is focused its label will be given the **.labelstate-focused** class, if the field value is not empty it will also be given the **.labelstate-active** class.

## usage
1. Include `jquery.labelStates.min.js`
```
<script src="/jquery.labelStates.min.js"></script>
```

2. Call the function `jQuery('form').labelStates();`
```
jQuery('form').labelStates({
	search_depth:3
});
```

## options
**search_depth** - integer - `search_depth: 4`
- Default is set to *4*
- This is the number of elements to traverse when searching for a label. (global)
- If you want to change the **search_depth** of an individual element, apply the *data-search-depth="3"* attribute to the form field.

## data attributes
**data-search-depth="#"**
- Sets the search_depth variabe for an individual element.

## classes
**.labelstate-label**
- Apply this class to any element which should act as a label, this takes precedence over the *label* attribute.

**.labelstate-ignore**
- Apply this class to a form field to make the plugin ignore the element completely.

**.labelstate-focused**
- This class is automatically applied to the label of any element that has *focus*

**labelstate-active**
- This class is automatically applied to the label of any element whose *value* attribute is not empty.

## tips
If you encounter form fields which incorrectly effect the labels of other form fields, try lowering the **data-search-depth** value of the element or adding the **.labelstate-ignore** class.