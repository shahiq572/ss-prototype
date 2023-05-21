jQuery(document).ready(function($){
	var $timeline_block = $('.cd-timeline-block');

	//hide timeline blocks which are outside the viewport
	$timeline_block.each(function(){
		if($(this).offset().top > $(window).scrollTop()+$(window).height()*0.75) {
			$(this).find('.cd-timeline-img, .cd-timeline-content').addClass('is-hidden');
		}
	});

	//on scolling, show/animate timeline blocks when enter the viewport
	$(window).on('scroll', function(){
		$timeline_block.each(function(){
			if( $(this).offset().top <= $(window).scrollTop()+$(window).height()*0.75 && $(this).find('.cd-timeline-img').hasClass('is-hidden') ) {
				$(this).find('.cd-timeline-img, .cd-timeline-content').removeClass('is-hidden').addClass('bounce-in');
			}
		});
	});
});


//Text Expension
jQuery(function(){

    var minimized_elements = $('p.minimize');
    
    minimized_elements.each(function(){    
		var t = $(this).text();
		var definedLength = $(this).attr('textLength');

        if(t.length < definedLength) return;
        
        $(this).html(
            t.slice(0,definedLength)+'<span>... </span><a href="#" class="more">More</a>'+
            '<span style="display:none;">'+ t.slice(definedLength,t.length)+' <a href="#" class="less">Less</a></span>'
        );
        
    }); 
    
    $('a.more', minimized_elements).click(function(event){
        event.preventDefault();
        $(this).hide().prev().hide();
        $(this).next().show();        
    });
    
    $('a.less', minimized_elements).click(function(event){
        event.preventDefault();
        $(this).parent().hide().prev().show().prev().show();    
    });

});




function validateReq() {

    var searchBoxVal = $('#social_search_bar').val();
    console.log( 'OPTION SELECTED: ', isPlatformSelected()=== 'yes' );
    console.log('SEARCH VAL: ', (searchBoxVal != ''))
    console.log('OVERALL', )
    
    if( searchBoxVal != '' ) {
      if( isPlatformSelected()=== 'yes' ) {
        showSpinner(5);
      } else {
        alert('Please Select atleast one platform')
        return false;
      }
    }  
  }
  
  function isPlatformSelected() {
    var isChecked = 'no';
    if( $('#twitter_option').is(":checked") ) isChecked = 'yes';
    else if( $('#youtube_option').is(":checked") ) isChecked = 'yes';
    else if( $('#flickr_option').is(":checked") ) isChecked = 'yes';
    else if( $('#tumblr_option').is(":checked") ) isChecked = 'yes';
    else if( $('#vimeo_option').is(":checked") ) isChecked = 'yes';
    else if( $('#googleplus_option').is(":checked") ) isChecked = 'yes';
    return isChecked;
  }
  
  
  function showSpinner(sec) {
    $('.myspinner').show();
    setTimeout(() => {
      $('.myspinner').hide();
      return false;
    }, sec*1000);
    
  }
  
  
  function update_block(type, cb_instance ) {
    var block = $('#'+type+'_more');
    // var tab = $('#'+type+'_tab');
    if(cb_instance.is(':checked')) {
      $(block).attr("hidden", false);
      // $(tab).removeClass("disabled");
    } else {
      $(block).attr("hidden", true);
      // $(tab).addClass("disabled");
    }
  }
  
  jQuery(document).ready(function($)
  {
    
    $("#platform_wrap_toggle").click(function()
    {
      
      $("#platform_wrap").slideToggle( "slow");
      
        // if ($("#platform_wrap_toggle").text() == "Expand Author Details")
      //   {			
      //     $("#author_bio_wrap_toggle").html("Hide Author Details")
      //   }
        // else 
      //   {		
      //     $("#author_bio_wrap_toggle").text("Expand Author Details")
      //   }
      
    });  
    
  });