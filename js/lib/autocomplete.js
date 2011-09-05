/**
 * 
 */
elgg.provide('elgg.autocomplete');

elgg.autocomplete.init = function() {
	$('.elgg-input-autocomplete').autocomplete({
		source: elgg.autocomplete.url, //gets set by input/autocomplete
		minLength: 1,
		width: 'auto',
		select: function(event, ui) {
			var item = ui.item;
			$(this).val(item.name);
	
			var hidden = $(this).next();
			hidden.val(item.guid);
		}
	})
	
	//@todo This seems convoluted
	.data("autocomplete")._renderItem = function(ul, item) {
		console.log(item);
		
		var img = item.icon ? '<img src="' + item.icon + '" />' : '';
		var r = '<div class="elgg-image-block">';
		r += '<div class="elgg-image">' + img + '</div>';
		r += '<div class="elgg-body">' + item.name + ' - ' + item.desc + '</div>';
		r += '</div>';
		
		return $('<li></li>')
			.data("item.autocomplete", item)
			.html(r)
			.appendTo(ul);
	};
};

elgg.register_hook_handler('init', 'system', elgg.autocomplete.init);