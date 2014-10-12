var map = { 
		$src: undefined,
		width: 0,
		$parent: undefined,	
		$anchor: undefined
};

var preventMapHiding = false;


function initMap(){
	
	map.$src = $('#popupMap');
	map.$link = $('#footer .location > a');
	map.width = map.$src.width();
	map.$parent = map.$src.parent();
	
	if(iPadMode) {
		
		$(document.body).on('touchstart',tryToHidePopupMap);
		map.$link.on('touchstart',locationLinkHover);
		map.$src.on('touchstart',popupMapHover);
		
	} else {
		map.$link.hover(locationLinkHover,tryToHidePopupMap);
		map.$src.hover(popupMapHover,tryToHidePopupMap);
	}		
}

function locationLinkHover(e){
	
	popupMapHover(e);
	map.$src.fadeIn();
	adjustMapPosition(e.target);
	
}

function popupMapHover(e){
	
	clearTimeout(map.$src.data('timeoutId'));
	
}


function tryToHidePopupMap(e){
	
	if(iPadMode){
		
		// Проследим за тем, является ли элемент, получивший клик, 
		// дочерним или совпадающим по отношению к ссылке, вызывающей карту
		if(e.target==map.$link[0] || 
		   map.$link.find($(e.target)).length>0){
			console.log('falseAlarm');
			return;
		}
		
		map.$src.fadeOut();
		
	} else {
		var timeoutId = setTimeout(function(){
			map.$src.fadeOut();
		}, 500);
		map.$src.data('timeoutId', timeoutId);
	} 
}


function adjustMapPosition(target) {

	// Срабатывает, если мы вошли на страницу из малого окна, увеличили окно и смотрим картуs
	
	map.$cLink = $(target);/*map.$link.filter(function (args) {
		var a = $(this).parents('.location').css('display');
		if(a=='none') return false;
		return true;
	});*/
	 
	if(map.width < 1){
		map.width = map.$src.width();
	}
	
	map.$src.css('left', map.$cLink.offset().left+ map.$cLink.innerWidth()/2-map.width/2);
	
	var fRight = $('#footer').offset().left + $('#footer').width(), 
		pRight = map.$src.offset().left + map.width;
		
	if (pRight > fRight) {
		map.$src.css('left', -(map.width - (fRight - map.$parent.offset().left)));
	}
}