/*
	Alpha by Pixelarity
	pixelarity.com @pixelarity
	License: pixelarity.com/license
*/



(function($) {

	// Dynamically calculate the base path for CSS files
	// This handles GitHub Pages subdirectories and language folders
	// Examples:
	//   index.php.html -> css/ (same level as js/ folder)
	//   fr/index.php.html -> ../css/ (one level up)
	//   en/talk/xxx.php.html -> ../../css/ (two levels up)
	var getBasePath = function() {
		// Find the path to this script (init.js) using getAttribute to get the original relative path
		var scripts = document.getElementsByTagName('script');
		var initScriptPath = '';

		for (var i = 0; i < scripts.length; i++) {
			// Use getAttribute to get the path as written in HTML (relative), not the resolved absolute URL
			var src = scripts[i].getAttribute('src');
			if (src && src.indexOf('init.js') !== -1) {
				// Extract the directory path
				// "js/init.js" -> "js/"
				// "../js/init.js" -> "../js/"
				// "../../js/init.js" -> "../../js/"
				var lastSlash = src.lastIndexOf('/');
				if (lastSlash !== -1) {
					initScriptPath = src.substring(0, lastSlash + 1);
					// Replace 'js/' with 'css/'
					initScriptPath = initScriptPath.replace(/js\/$/, 'css/');
				}
				break;
			}
		}

		// Fallback: calculate based on current page depth
		if (!initScriptPath) {
			var path = window.location.pathname;
			// Remove filename
			var dir = path.substring(0, path.lastIndexOf('/'));
			// Count slashes to determine depth
			var depth = (dir.match(/\//g) || []).length;

			// We need to account for GitHub Pages subdirectory
			// Subtract 1 for the repo name itself
			if (depth > 1) {
				depth = depth - 1;
			}

			if (depth === 0 || depth === 1) {
				return 'css/';
			}

			var prefix = '';
			for (var j = 0; j < depth - 1; j++) {
				prefix += '../';
			}
			return prefix + 'css/';
		}

		return initScriptPath;
	};

	var cssBasePath = getBasePath();

	// Debug: log the detected path (remove this line after testing)
	if (window.console && console.log) {
		console.log('CSS Base Path detected:', cssBasePath);
		console.log('Current page:', window.location.pathname);
	}

	// Fix favicon path for GitHub Pages subdirectory
	// The browser requests /favicon.ico, but we need /2024.foss4g.be/favicon.ico
	var fixFavicon = function() {
		var existingIcon = document.querySelector('link[rel~="icon"]');
		if (!existingIcon) {
			var link = document.createElement('link');
			link.rel = 'icon';
			link.type = 'image/x-icon';
			// Use the same logic as CSS path: replace js/ with empty string for root
			var faviconPath = cssBasePath.replace(/css\/$/, 'favicon.ico');
			link.href = faviconPath;
			document.head.appendChild(link);
		}
	};
	fixFavicon();

	skel.init({
		reset: 'full',
		breakpoints: {
			global:		{ range: '*', href: cssBasePath + 'style.css', containers: '60em', grid: { gutters: { vertical: '2em', horizontal: 0 } } },
			wide:		{ range: '-1680', href: cssBasePath + 'style-wide.css' },
			normal:		{ range: '-1280', href: cssBasePath + 'style-normal.css', grid: { gutters: { vertical: '1.5em' } }, viewport: { scalable: false } },
			narrow:		{ range: '-980', href: cssBasePath + 'style-narrow.css', containers: '90%' },
			narrower:	{ range: '-840', href: cssBasePath + 'style-narrower.css', grid: { collapse: 1 } },
			mobile:		{ range: '-640', href: cssBasePath + 'style-mobile.css', containers: '100%', grid: { gutters: { vertical: '1em' } } },
			mobilep:	{ range: '-480', href: cssBasePath + 'style-mobilep.css', grid: { collapse: 2 } }
		}
	}, {
		layers: {
			transformTest: function() { return skel.vars.isMobile; },
			layers: {

				// Navigation Panel.
					navPanel: {
						animation: 'pushX',
						breakpoints: 'narrower',
						clickToClose: true,
						height: '100%',
						hidden: true,
						html: '<div data-action="navList" data-args="nav"></div>',
						orientation: 'vertical',
						position: 'top-left',
						side: 'left',
						width: 250
					},

				// Navigation Button.
					navButton: {
						breakpoints: 'narrower',
						height: '4em',
						html: '<span class="toggle" data-action="toggleLayer" data-args="navPanel"></span>',
						position: 'top-left',
						side: 'top',
						width: '6em'
					}

			}
		}
	});

	$(function() {

		var	$window = $(window),
			$body = $('body'),
			$header = $('#header'),
			$banner = $('#banner');

		// Forms (IE<10).
			var $form = $('form');
			if ($form.length > 0) {

				$form.find('.form-button-submit')
					.on('click', function() {
						$(this).parents('form').submit();
						return false;
					});

				if (skel.vars.IEVersion < 10) {
					$.fn.n33_formerize=function(){var _fakes=new Array(),_form = $(this);_form.find('input[type=text],textarea').each(function() { var e = $(this); if (e.val() == '' || e.val() == e.attr('placeholder')) { e.addClass('formerize-placeholder'); e.val(e.attr('placeholder')); } }).blur(function() { var e = $(this); if (e.attr('name').match(/_fakeformerizefield$/)) return; if (e.val() == '') { e.addClass('formerize-placeholder'); e.val(e.attr('placeholder')); } }).focus(function() { var e = $(this); if (e.attr('name').match(/_fakeformerizefield$/)) return; if (e.val() == e.attr('placeholder')) { e.removeClass('formerize-placeholder'); e.val(''); } }); _form.find('input[type=password]').each(function() { var e = $(this); var x = $($('<div>').append(e.clone()).remove().html().replace(/type="password"/i, 'type="text"').replace(/type=password/i, 'type=text')); if (e.attr('id') != '') x.attr('id', e.attr('id') + '_fakeformerizefield'); if (e.attr('name') != '') x.attr('name', e.attr('name') + '_fakeformerizefield'); x.addClass('formerize-placeholder').val(x.attr('placeholder')).insertAfter(e); if (e.val() == '') e.hide(); else x.hide(); e.blur(function(event) { event.preventDefault(); var e = $(this); var x = e.parent().find('input[name=' + e.attr('name') + '_fakeformerizefield]'); if (e.val() == '') { e.hide(); x.show(); } }); x.focus(function(event) { event.preventDefault(); var x = $(this); var e = x.parent().find('input[name=' + x.attr('name').replace('_fakeformerizefield', '') + ']'); x.hide(); e.show().focus(); }); x.keypress(function(event) { event.preventDefault(); x.val(''); }); });  _form.submit(function() { $(this).find('input[type=text],input[type=password],textarea').each(function(event) { var e = $(this); if (e.attr('name').match(/_fakeformerizefield$/)) e.attr('name', ''); if (e.val() == e.attr('placeholder')) { e.removeClass('formerize-placeholder'); e.val(''); } }); }).bind("reset", function(event) { event.preventDefault(); $(this).find('select').val($('option:first').val()); $(this).find('input,textarea').each(function() { var e = $(this); var x; e.removeClass('formerize-placeholder'); switch (this.type) { case 'submit': case 'reset': break; case 'password': e.val(e.attr('defaultValue')); x = e.parent().find('input[name=' + e.attr('name') + '_fakeformerizefield]'); if (e.val() == '') { e.hide(); x.show(); } else { e.show(); x.hide(); } break; case 'checkbox': case 'radio': e.attr('checked', e.attr('defaultValue')); break; case 'text': case 'textarea': e.val(e.attr('defaultValue')); if (e.val() == '') { e.addClass('formerize-placeholder'); e.val(e.attr('placeholder')); } break; default: e.val(e.attr('defaultValue')); break; } }); window.setTimeout(function() { for (x in _fakes) _fakes[x].trigger('formerize_sync'); }, 10); }); return _form; };
					$form.n33_formerize();
				}

			}

		// Dropdowns.
			$('#nav > ul').dropotron({
				alignment: 'right'
			});

		// Header.
		// If the header is using "alt" styling and #banner is present, use scrollwatch
		// to revert it back to normal styling once the user scrolls past the banner.
		// Note: This is disabled on mobile devices.
			if (!skel.vars.isMobile
			&&	$header.hasClass('alt')
			&&	$banner.length > 0) {

				$window.on('load', function() {

					$banner.scrollwatch({
						delay:		0,
						range:		0.5,
						anchor:		'top',
						on:			function() { $header.addClass('alt reveal'); },
						off:		function() { $header.removeClass('alt'); }
					});

				});

			}

	});

})(jQuery);
