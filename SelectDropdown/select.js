(function ($) {
	var zIndex = 9999,
		defaults = {
			elements: {
				value: '.select-value',
				options: '.select-options',
				optionSelected: '.option-selected'
			},
			classes: {
				optionSelected: 'option-selected'
			}
		};

	function init(options) {
		options = $.extend(true, {}, defaults, options);

		var $this = this.eq(0),
			$value = $this.find(options.elements.value),
			$options = $this.find(options.elements.options),
			optionsShow = false,
			timerForOptionsShow,
			value = $value.attr('data-value');

		// TODO 实现控件外部的点击触发选项关闭，以避免同时打开多个控件的问题
		$value.click(function () {
			if (optionsShow) {
				$this.css('z-index', 0);
				$options.slideUp().hide();
				optionsShow = false;
			} else {
				$this.css('z-index', zIndex++);
				$options.show().slideDown();
				optionsShow = true;
			}
		});

		$options.on('click', 'li', function () {
			$options.slideUp().hide();
			optionsShow = false;

			var $option = $(this),
				val = $option.attr('data-value'),
				eleSelect = options.elements.optionSelected,
				clsSelect = options.classes.optionSelected;
			if (value !== val) {
				$options.find(eleSelect).removeClass(clsSelect);
				$option.addClass(clsSelect);
				$this.trigger('valueChange', {
					value: val,
					text: $option.text()
				})
			}
		});

		// 鼠标移开3秒后自动隐藏打开的选项列表
		$this.on('mouseleave', function () {
			if (optionsShow) {
				timerForOptionsShow = setTimeout(function () {
					$options.hide();
					timerForOptionsShow = null;
				}, 3000);
			}
		});

		$this.on('mouseenter', function () {
			if (optionsShow && timerForOptionsShow) {
				clearTimeout(timerForOptionsShow);
			}
		})

		$this.on('valueChange', function (e, data) {
			value = data.value;
			$this.data('value', data.value);
			$value.html(data.text);
		});

		return this;
	}

	$.fn.extend({
		xsmSelect: init
	});
})(jQuery);