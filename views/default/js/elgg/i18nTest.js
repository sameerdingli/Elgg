require(['elgg/i18n'], function(i18n) {
	var Test = TestCase("elgg/i18nTest");

	Test.prototype.setUp = function() {
		this.ajax = $.ajax;
		
		//Immediately execute some dummy "returned" javascript instead of sending
		//an actual ajax request
//		$.ajax = function(settings) {
//			var lang = settings.data.js.split('/')[1];
//			i18n.translations_[lang] = {'language':lang};
//		};
	};
	
	Test.prototype.tearDown = function() {
		$.ajax = this.ajax;
		
		//clear translations
		i18n.translations_['en'] = undefined;
		i18n.translations_['aa'] = undefined;
	};
	
	Test.prototype.testLoadTranslations = function() {
//		assertUndefined(elgg.config.translations['en']);
//		assertUndefined(elgg.config.translations['aa']);
//		
//		elgg.reload_all_translations();
//		elgg.reload_all_translations('aa');
//		
//		assertNotUndefined(elgg.config.translations['en']['language']);
//		assertNotUndefined(elgg.config.translations['aa']['language']);
	};
	
//	Test.prototype.testElggEchoTranslates = function() {
//		elgg.reloadAllTranslations('en');
//		elgg.reloadAllTranslations('aa');
//		
//		assertEquals('en', elgg.echo('language'));
//		assertEquals('aa', elgg.echo('language', 'aa'));
//	};
	
//	Test.prototype.testElggEchoFallsBackToDefaultLanguage = function() {
//		elgg.i18n.reloadAllTranslations('en');
//		assertEquals('en', i18n.echo('language', 'aa'));
//	};
});

