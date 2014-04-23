/*
 hFakeSelect v0.4
 (c) 2014 Hoelle Development e.U. - hoelle.net
 license: http://www.opensource.org/licenses/mit-license.php
 */

(function ($) {
	var hFakeSelectNamespace = 'hFakeSelect',
		methods = {
			init: function (options) {
				var settings = $.extend({
						// place default settings here
						barWidth: 20,
						barBackground: '#000000',
						handleBackground: '#888888',
						barPosition: 'right',
						initialScroll: 0,
						clickScrollDuration: 200
					}, options),
					inputCss = {
						display: 'inline-block',
						position: 'relative',
						width: '100%'
					},
					selectCss = {
						display: 'block',
						position: 'absolute',
						width: '100%',
						height: '100%',
						left: 0,
						top: 0,
						opacity: 0,
						cursor: 'pointer',
						border: 0,
						outline: 0,
						zIndex: 5
					};

				return this.each(function () {
					var $this = $(this),
						data = $this.data(hFakeSelectNamespace);

					// If the plugin hasn't been initialized yet
					if (!data) {
						/*
						 Do more setup stuff here
						 */

						var $container = $('<div class="fake-select" />'),
							$select = $this.clone().removeClass('fake-select'),
							$preselectedOption = $select.find('option[selected]').eq(0),
							$inputDisplay = $('<input />', {
								type: 'text',
								name: $select.attr('name') + '_display',
								class: 'display',
								placeholder: $select.attr('placeholder')
							}).prop('readonly', true).css(inputCss),
							$inputHidden = $('<input />', {
								type: 'hidden',
								name: $select.attr('name'),
							}).prop('readonly', true).css(inputCss);

						$container.addClass($select.attr('class'));
						$select.addClass('origin').removeAttr('name').css(selectCss);
						$container.append($inputDisplay, $inputHidden, $select);
						$this.replaceWith($container);

						$select.change(function (e) {
							var $selectedOption = $(this).find('option:selected').eq(0);

							$inputDisplay.val($selectedOption.text());
							$inputHidden.val($selectedOption.attr('value'));
						});

						if ($preselectedOption.size() === 1) {
							window.setTimeout(function() {
								$select.change();
							}, 200);
						}

						$this.data(hFakeSelectNamespace, $.extend(settings, {
							target: $this,
							container: $container,
							inputDisplay: $inputDisplay,
							inputHidden: $inputHidden,
							select: $select,
							preselectedOption: $preselectedOption
						}));
						data = $this.data(hFakeSelectNamespace);
					}

				});
			},

			destroy: function () {
				return this.each(function () {
					var $this = $(this),
						data = $this.data(hFakeSelectNamespace);

					// Namespacing FTW
					$(window).unbind('.' + hFakeSelectNamespace);
					data.inputDisplay.remove();
					data.inputHidden.remove();
					data.container.replaceWith(data.select.removeClass('origin'));
					$this.removeData(hFakeSelectNamespace);
				});
			},
		};

	$.fn.hFakeSelect = function (method) {
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method ' + method + ' does not exist on jQuery.hFakeSelect');
		}
	};

})(jQuery);