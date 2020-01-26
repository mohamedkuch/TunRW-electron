// hide #back-top first
$("#back-top").hide();

$(window).scroll(function() {
    if ($(document).scrollTop() > 100) {
        $('.navbar').addClass('navbar-shrink');
        $('#back-top').fadeIn();
        $('#back-top').removeClass('hideButton');


        $('.navbar-brand').addClass('darkLogo');
        $('.navbar-brand').removeClass('lightLogo');

        
    }
    else {
        $('.navbar').removeClass('navbar-shrink');
        $('#back-top').fadeOut();
        $('#back-top').addClass('hideButton');


        $('.navbar-brand').addClass('lightLogo');
        $('.navbar-brand').removeClass('darkLogo');

    }
});




  // scroll body to 0px on click
  $('#back-top a').on("click", function(){
    console.log("zhhzz");

  	$('body,html').animate({
  		scrollTop: 0
  	}, 800);
  	return false;
  });

// Closes the Responsive Menu on Menu Item Click
$('.nav-item').on("click", function(){
  console.log("zhhzz");
    $('.navbar-toggle:visible').click();
});

