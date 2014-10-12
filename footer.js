// JQuery + IE9 + скрипт стоит в последней части body :
// Коллбэк вида $(document).on('ready', c) 
// не срабатывает
$(function() {

	if (tdLib.deviceDescription.type != tdLib.DEVICE_TYPES.desktop 
		&& tdLib.deviceDescription.touchCapable) {
		
		/*$('#footer .languageSwitch .a').addClass('hover');*/
		
		$('#footer .languageSwitch .a').on('touchstart', function(args) {
			$(this).toggleClass('hover');
		});
		
	} else {
		$('#footer .languageSwitch .a').hover(function(args) {
			var $this = $(this).addClass('hover');
		}, function(args) {
			var $this = $(this).removeClass('hover');
		});
	}

	if (tdLib.debu) {
		$('#box-list').remove();

		/*$('#footer a').on('touchstart',function(){
		 tdLib.debLog('touched');
		 $(this).on('click');
		 }).on('click',function(){
		 tdLib.debLog('clicked');
		 });*/

	} else {
		initMap();
	}

});
