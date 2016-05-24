/**
 * Author: Nicholas
 * Date: 11/06/2015
 * Version: 1.0.0
 * Options:
 * Public Methods: widget, option
 * Usage Example: $('#search-form').labelStates({search_depth:3});
 * CSS Example:
	.labelstate-focused {
		color:purple;
	}
	.labelstate-active {
		color:orange;
	}
*/
(function (factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module depending on jQuery.
		define(['jquery'], factory);
	} else {
		// No AMD. Register plugin with global jQuery object.
		factory(jQuery);
	}
}(function ($) {
	"use strict";
	
	var LabelStatesObject = function (element, options) {
		this.$container = $(element);
		this.options = $.extend(true, {}, $.fn.labelStates.defaults, options);
		this._init();
	};	

	LabelStatesObject.prototype = {
		/**
		 * Start our app
		 * @private
		 */
		_init: function() {
			var $container = this.$container,
			focusClass = "labelstate-focused",
			activeClass = "labelstate-active",
			that = this;

			$container.on({
				keyup: function () {
					$(this).trigger("labelstatus");
				},
				change: function () {
					$(this).trigger("labelstatus");
				},
				input: function () {
					$(this).trigger("labelstatus");
				},
				focus: function () {
					var label = that._findTheLabel(this);
					var el_type = $(this).attr('type');
					if(el_type != 'radio' && el_type != 'checkbox'){
						label.addClass(focusClass);
					}
				},
				blur: function () {
					var label = that._findTheLabel(this);
					var el_type = $(this).attr('type');
					if(el_type != 'radio' && el_type != 'checkbox'){
						label.removeClass(focusClass);
					}
				},
				labelstatus: function () {
					var label = that._findTheLabel(this);
					var el_type = $(this).attr('type');

					if(el_type == 'checkbox'){
						if ($(this).prop('checked')) {
							label.addClass(activeClass);
						}else {
							label.removeClass(activeClass);
						}
					}else if (el_type == 'radio'){
						if ($(this).is(':checked')) {
							var samename = $(this).attr('name');
							var siblings = $("input[name=" + samename + "]");
							for (var i = 0; i < siblings.length; i++) {
								var templabel = that._findTheLabel($(siblings[i]));
								templabel.removeClass(activeClass);
							}
							label.addClass(activeClass);
						}else {
							label.removeClass(activeClass);
						}
					}else{			
						if (this.value !== "") {
							label.addClass(activeClass);
						}else {
							label.removeClass(activeClass);
						}
					}
				},
			}, 'radio:not(.labelstate-ignore), checkbox:not(.labelstate-ignore), input:not(.labelstate-ignore), select:not(.labelstate-ignore)');
			
			//Trigger the labelstatus function
			$container.find('radio:not(.labelstate-ignore), checkbox:not(.labelstate-ignore), input:not(.labelstate-ignore), select:not(.labelstate-ignore)').trigger("labelstatus");
		},

		_findTheLabel: function (that) {
			var label = $(that).prev("label");
			var labelclass = $(that).prev(".labelstate-label");
			var $ancestor = $(that);
			var search_depth = $(that).data('search-depth')!=null ? $(that).data('search-depth') : this.options.search_depth;

			while((label.length <= 0 && labelclass.length <= 0) && search_depth > 0){
				label = $ancestor.find("label");
				labelclass = $ancestor.find(".labelstate-label");
				if (label.length <= 0 && labelclass.length <= 0) $ancestor = $ancestor.parent();
				search_depth--;
			}

			if (labelclass.length > 0){
				return labelclass;
			}else{
				return label;
			}		
		},

		/**
		 * Sets multiple options on the plugin
		 * @private
		 * @return  {object} current instance of the plugin
		 */
		_setOptions: function (options) {
			var self = this;
			$.each(options, function (key, value) {
				self._setOption(key, value);
			});

			return this;
		},

		/**
		 * Sets an option on the plugin
		 * @private
		 * @return  {object} current instance of the plugin
		 */
		_setOption: function (key, value) {
			this.options[key] = value;
			
			return this;
		},

		/**
		 * Gets the plugin instance
		 * @public
		 * @return  {object} current instance of the plugin
		 */
		widget: function () {
			return this;
		},

		/**
		 * Gets/Sets an option for the plugin
		 * @public
		 * @return  {*} Either the value of the option or the current instance of the plugin
		 */
		option: function(key, value) {
			var options = key;
			if (arguments.length === 0) {
				// don't return a reference to the internal hash
				return $.extend( {}, this.options );
			}

			if (typeof key === "string") {
				if (value === undefined) {
					return this.options[key];
				}
				options = {};
				options[key] = value;
			}
			this._setOptions(options);

			return this;
		}
	};

	$.fn.labelStates = function (option) {
		var isMethodCall = typeof option === "string",
			args = Array.prototype.slice.call(arguments, 1),
			returnValue = this;
		// prevent calls to internal methods
		if (isMethodCall && option.charAt(0) === "_") {
			return returnValue;
		}

		// call internal method
		if (isMethodCall) {
			this.each(function() {
				var instance = $(this).data('labelStates'),
					methodValue = instance && $.isFunction(instance[option]) ? instance[ option ].apply(instance, args) : instance;
				if (instance && methodValue && methodValue !== undefined) {
					returnValue = methodValue;
					return false;
				}
				return false;
			});
		} 
		// instantiate plugin
		else {
			this.each(function () {
				var $this = $(this),
					data = $this.data('labelStates'),
					options = typeof option === 'object' && option;
				if (!data) {
					$this.data('labelStates', (data = new LabelStatesObject(this, options)));
				}
			});
		}

		return returnValue;
	};

	$.fn.labelStates.defaults = {
		search_depth: 3,
	};

	$.fn.labelStates.Constructor = LabelStatesObject;

}));