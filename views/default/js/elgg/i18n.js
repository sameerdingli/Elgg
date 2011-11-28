/**
 * Provides language-related functionality
 * @param require
 * @return {elgg.i18n}
 */
define('elgg/i18n', function(require) {
	var elgg = require('elgg');
	var ajax = require('elgg/ajax');
	
	var i18n = elgg.provide('elgg.i18n');
	
	// TODO(ewinslow): Grab this from some kind of config variable
	i18n.LOCALE = 'en';

	i18n.translations_ = {};

	i18n.translations_[i18n.LOCALE] = {};
	
	/**
	 * Analagous to the php version.  Merges translations for a
	 * given language into the current translations map.
	 * 
	 * @param {String} locale
	 * @param {Object} translations
	 */
	i18n.addTranslation = function(locale, translations) {
		elgg.extend(i18n.translations_[locale], translations);
	};

	/**
	 * Load the translations for the given language.
	 *
	 * If no language is specified, the default language is used.
	 * @param {String} lang
	 * @return {XMLHttpRequest}
	 */
	i18n.reloadAllTranslations = function(lang) {
		lang = lang || i18n.LOCALE;

		return ajax.getJSON('ajax/view/js/languages', {
			data: {
				language: lang
			},
			success: function(json) {
				i18n.addTranslation(lang, json);
				elgg.config.languageReady = true;
				elgg.initWhenReady();
			}
		});
	};

	
	/**
	 * Translates a string
	 *
	 * @param {String} key      The string to translate
	 * @param {Array}  argv     vsprintf support
	 * @param {String} language The language to display it in
	 *
	 * @return {String} The translation
	 */
	i18n.echo = function(key, argv, language) {
		//elgg.echo('str', 'en')
		if (elgg.isString(argv)) {
			language = argv;
			argv = [];
		}

		//elgg.echo('str', [...], 'en')
		var translations = i18n.translations_,
			dlang = i18n.LOCALE,
			map;

		language = language || dlang;
		argv = argv || [];

		map = translations[language] || translations[dlang];
		if (map && map[key]) {
			return vsprintf(map[key], argv);
		}

		return key;
	};

	elgg.register_hook_handler('boot', 'system', i18n.reloadAllTranslations);

	elgg.echo = i18n.echo;
	elgg.get_language = function() { return i18n.LOCALE; };
	elgg.reload_all_translations = i18n.reloadAllTranslations;
	elgg.add_translation = i18n.addTranslation;
	
	return i18n;
});

