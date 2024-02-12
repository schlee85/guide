'use strict';

var guideApp = guideApp || {};

// 진행률
guideApp.progress = {
	init: function() {
		this.createSelector();
		this.addEvents();
	},
	createSelector: function() {
		this.$listItem = $('.guide_menu [data-progress]');
		this.$listDoneItem = $('.guide_menu [data-progress=done]');
		this.$statusPages = $('.guide_status .pages');
		this.$statusPercent = $('.guide_status .percent');
	},
	addEvents: function() {
		this.setStatus();
	},
	setStatus: function() {
		var doneLen = this.$listDoneItem.length;
		var totalLen = this.$listItem.length;
		var pageText = doneLen + '/' + totalLen;
		var percentText = ((doneLen * 100) / totalLen).toFixed(1);

		this.$statusPages.text(pageText);
		this.$statusPercent.text(percentText);
	},
}

// 새창열기
guideApp.newWin = {
	init: function() {
		this.createSelector();
		this.addEvents();
	},
	createSelector: function() {
		this.$wrap = $('.guide_list > li');
	},
	addEvents: function() {
		this.setDom();
	},
	setDom: function() {
		this.$wrap.each(function(idx, el) {
			var clone = $(el).find('a').clone();
			clone.attr({
				'target': '_blank',
				'title': '새창열기',
				'class': 'newwin',
			});
			$(el).append(clone);
		});
	},
}

// 검색폼
guideApp.search = {
	init: function() {
		this.createSelector();
		this.addEvents();
	},
	createSelector: function() {
		this.$wrap = $('.guide_search');
		this.$input = this.$wrap.find('input');
		this.$search = this.$wrap.find('.check');
		this.$reset = this.$wrap.find('.reset');
	},
	addEvents: function() {
		this.$input.on('keyup', this.handleKeyup.bind(this));
		this.$search.on('click', this.handleSearch.bind(this));
		this.$reset.on('click', this.handleReset.bind(this));
	},
	handleKeyup: function(e) {
		if(e.keyCode == 13) {
			this.handleSearch();
		}
	},
	handleSearch: function(e) {
		var inputValue = this.$input.val().trim();
		if (!inputValue) {
			this.handleReset();
			return;
		};

		$('.guide_list a').each(function() {
			var regex = new RegExp(inputValue, 'gi');
			$(this).html($(this).text().replace(regex, '<mark>' + inputValue + '</mark>'))
		});
	},
	handleReset: function() {
		this.$input.val('').focus();
		$('.guide_list a mark').each(function() {
			$(this).parent().html($(this).parent().text());
		})
	},
}

// 메뉴
guideApp.lnb = {
	init: function() {
		this.createSelector();
		this.addEvents();
	},
	createSelector: function() {
		this.$wrap = $('.guide_menu .guide_list li');
		this.$ctrl = this.$wrap.find('a');
		this.$cont = $('.guide_content');
	},
	addEvents: function() {
		this.handleClick = this.handleClick.bind(this);
		this.$ctrl.on('click.guideLnb', this.handleClick);
	},
	handleClick: function(e) {
		if (!$(e.currentTarget).hasClass('newwin')) {
			e.preventDefault();
		};

		this.$wrap.removeClass('active');
		var $parent = $(e.currentTarget).closest('li');
		$parent.addClass('active');

		var src = $(e.currentTarget).attr('href');
		if (src.indexOf('.html') > -1) {
			var hasIframe = this.$cont.find('iframe').attr('src') === src;
			if (hasIframe) return;
			var iframe = '<iframe src=' + src + ' frameborder="0" name="guideCont" class="guide_iframe"></iframe>';
			this.$cont.html(iframe);
		} else {
			var empty = '<div class="dummy">Page not found</div>'
			this.$cont.html(empty);
		}
	},
}

// function hasObject(el) {
// 	return $(el).length > 0;
// }

$(function() {
	guideApp.progress.init();
	guideApp.newWin.init();
	guideApp.search.init();
	guideApp.lnb.init();
});
