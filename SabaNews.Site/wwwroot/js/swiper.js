$(document).ready(function () {
	if ($(window).innerWidth() <= 500) {
		var Swipes = new Swiper('.swiper-container', {
			loop: true,
			slidesPerView: 1,
			spaceBetween: 0,
			navigation: {
				nextEl: '.swiper-button-next',
				prevEl: '.swiper-button-prev',
			},
			pagination: {
				el: '.swiper-pagination',
				clickable: true,
			},
		});
	}
	

	
	if ($(window).innerWidth() >= 500) {
		var homeSwiper = new Swiper('.swiper-guess', {
			slidesPerView: 3,
			spaceBetween: 20,
			loop: true,
			slidesPerGroup:3,
			navigation: {
				nextEl: '.swiper-button-next',
				prevEl: '.swiper-button-prev',
			},
			pagination: {
				el: '.swiper-pagination',
				clickable: true,
			}
		});
	}
})