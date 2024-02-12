'use strict';

var app = app || {};

app.log = function(name) {
	console.log('pubLog: ' + '%c' + name + '%c is init.', 'color:tomato;', 'color:black');
};

app.tabs = {
	init: function() {
		this.createSelector();
		this.addEvents();
	},

	createSelector: function() {
		this.wrapName = '[data-ui=tabs]';
		this.ctrlName = '.tabs_head a';
		this.contName = '.tabs_cont > div';
		this.$wrap = $(this.wrapName);
		this.$ctrl = this.$wrap.find(this.ctrlName);

		this.activeClassName = 'active';
		this.activeIndexAttrName = 'data-active-index';
	},

	addEvents: function() {
		this.handleInit();
		this.$ctrl.on('click.tabs', this.handleClick.bind(this));
	},

	handleInit: function() {
		var that = this;
		this.$wrap.each(function() {
			var activeIndex = $(this).attr(that.activeIndexAttrName);
			var hasAttr = $(this).is('[' + that.activeIndexAttrName + ']');
			var hasIndex = $(this).find(that.ctrlName).eq(activeIndex).length;

			if (hasAttr && hasIndex) {
				$(this).find(that.ctrlName).removeClass(that.activeClassName);
				$(this).find(that.ctrlName).eq(activeIndex).addClass(that.activeClassName);
				$(this).find(that.contName).eq(activeIndex).show().siblings().hide();
			} else {
				$(this).find(that.ctrlName).removeClass(that.activeClassName);
				$(this).find(that.ctrlName).eq(0).addClass(that.activeClassName);
				$(this).find(that.contName).eq(0).show().siblings().hide();
			}
		});
	},

	handleClick: function(e) {
		e.preventDefault();

		var $target = $(e.currentTarget);
		var targetID = $target.attr('href');

		$target.addClass(this.activeClassName).siblings().removeClass(this.activeClassName);
		$(targetID).show().siblings().hide();
	},
}

app.accordion = {
	init: function() {
		this.createSelector();
		this.addEvent();
	},
	createSelector: function() {
		this.$wrap = $('[data-ui=accordion]');
		this.$sec = this.$wrap.find('> .acc_sec');
		this.$ctrl = this.$sec.find('> .acc_head button');
	},
	addEvent: function() {
		this.$sec.each(function(idx, el) {
			var hasActivce = $(this).hasClass('active');
			if (hasActivce) {
				$(this).find('> .acc_cont').show();
			}
		});
		this.$ctrl.on('click', this.handleClick);
	},
	handleClick: function() {
		var $sec = $(this).closest('.acc_sec');
		var hasActive = $sec.hasClass('active');
		var isOnlyOne = $(this).closest('[data-ui=accordion]').is('[data-only-one]');

		if (hasActive) {
			$sec.removeClass('active');
			$sec.find('.acc_cont').slideUp();
		} else {
			$sec.addClass('active');
			$sec.find('> .acc_cont').slideDown();
			if (isOnlyOne) {
				$sec.siblings().removeClass('active');
				$sec.siblings().find('> .acc_cont').slideUp();
			}
		}
	},
};

app.popup = {
	init: function() {
		this.createSelector();
		this.addEvent();
	},

	createSelector: function() {
		this.$ctrlOpen = $('[data-pop-open]');
		this.$ctrlClose = $('[data-pop-close]');
		this.$dim = $('.pop_wrap[data-backdrop] .dim');

		this.prevFocus = null;
		this.currentPop = null;
	},

	addEvent: function() {
		this.$ctrlOpen.on('click', this.handleClickOpen.bind(this));
		this.$ctrlClose.on('click', this.handleClickClose.bind(this));
		this.$dim.on('click', this.handleClickClose.bind(this));
	},

	handleClickOpen: function(e) {
		e.preventDefault();

		var popId = $(e.currentTarget).attr('href');
		this.open(popId);
		this.prevFocus = $(e.currentTarget);
	},

	handleClickClose: function(e) {
		e.preventDefault();

		var popId = $(e.currentTarget).closest('.pop_wrap').attr('id');
		this.close('#'+popId);
	},

	open: function(el) {
		var $popup = $(el);
		$popup.show(0, function() {
			$(this).addClass('active');
		});
		$popup.find('.pop_cont').focus();

		this.currentPop = $popup;
	},

	close: function(el) {
		var $popup = $(el);
		$popup.removeClass('active');
		setTimeout(function() {
			$popup.hide(0);
		}, 300);

		this.prevFocus && this.prevFocus.focus();
	},
}

app.ui = (function() {
	function hasObject(el) {
		return $(el).length > 0;
	}

	return {
		init: function() {
			if (hasObject('[data-ui=tabs]')) app.tabs.init();
			if (hasObject('[data-ui=accordion]')) app.accordion.init();
			if (hasObject('[data-ui=popup]')) app.popup.init();
		},
	}
})();

$(function() {
	app.ui.init();
});
