(function ($) {

	var defaults = {
			min: 0,
			max: 100,
			innerHTML: '<div class="slider-bar-total"></div>' +
				'<div class="slider-bar-current"></div>' +
				'<div class="slider-left"></div>' +
				'<div class="slider-right"></div>',
			events: {
				valueChange: 'valueChange'
			}
		};

	function init(options) {
		options = $.extend(true, {}, defaults, options);
		var $this = this.eq(0),
			totalW = $this.width(),
			min = $this.data('min') || options.min, // HTML 标签属性优先于配置
			max = $this.data('max') || options.max,
			left = $this.data('left') || min,
			right = $this.data('right') || max;

		$this.html(options.innerHTML);

		var $currentBar = $this.find('.slider-bar-current'),
			$left = $this.find('.slider-left'),
			$right = $this.find('.slider-right');

		// 根据配置设置初始值
		var leftDist = left / max * totalW,
			rightDist = right / max * totalW;

		function reset() {
			$currentBar.css({
				left: leftDist,
				width: rightDist - leftDist
			});

			$left.css('left', leftDist);
			$right.css('left', rightDist);

			left = leftDist * (max - min) / totalW >> 0;
			right = rightDist * (max - min) / totalW >> 0;

			$this.data('left', left);
			$this.data('right', right);

			delayTrigger(options.events.valueChange, {
				left: left,
				right: right
			});
		}

		reset();

		var leftMove = false,
			rightMove = false;

		// 初始化事件
		$left.mousedown(function () {
			leftMove = true;
		});
		$right.mousedown(function () {
			rightMove = true;
		});
		$this.on('mouseup mouseleave', function () {
			leftMove = rightMove = false;
		});
		
		$this.on('mousemove', function (e) {
			if (leftMove || rightMove) {
				var offset = $this.offset(),
					dist = e.pageX - offset.left,
					changed = false;
				if (leftMove) {
					if (dist < 0) {
						dist = 0;
					}
					if (dist <= rightDist) {
						changed = true;
						leftDist = dist;
					}
				} else if (rightMove) {
					if (dist > totalW) {
						dist = totalW;
					}
					if (dist >= leftDist) {
						changed = true;
						rightDist = dist;
					}
				}
				if (changed) {
					reset();
				}
			}
		});

		function delayTrigger(eventName, data) {
			var t;
			if (t) {
				clearTimeout(t);
			}
			t = setTimeout(function () {
				$this.trigger(eventName, data);
				t = null;
			}, 200);
		}

		return this;
	}

	$.fn.extend({
		xsmSlider: init
	});
})(jQuery);