var bgfixed = $('#bg-fixed');
var menu = $('#menu');
var menuButtons = $('#menu ul.nav li');
var menuCollapsible = $('.navbar-collapse');
var content = $('#content');
var ghost = $('#bg-ghost-area');
var logo = $('#bg-logo-container img');

/*
var map = L.mapbox.map('map', 'tarraschk.gm6bpp19', {
    scrollWheelZoom: false,
    shareControl: true
})
    .setView([45.7762, 4.8615], 13)
    .addControl(L.mapbox.geocoderControl('tarraschk.gm6bpp19'));
*/

/* Canvas Prototype */
	CanvasRenderingContext2D.prototype.clear = function() {
		this.clearRect(0, 0,10000,10000);// this.canvas.clientWidth, this.canvas.clientHeight);
	};
	
	CanvasRenderingContext2D.prototype.makeBlop= function(xs,ys,L,h,a){	
		var r=h/2*a,
			alpha1= Math.acos((L/2)/Math.sqrt(h*h/4+L*L/4)),
			alpha2= Math.acos((L/4)/Math.sqrt(h*h/4+L*L/16));
			
		this.beginPath();
		this.arc(xs+L/2,ys,r,Math.PI-alpha1,alpha2,true);
		this.arc(xs+3*L/4,ys+h/2,Math.sqrt(h*h/4+L*L/16)-r,Math.PI+alpha2,Math.PI-alpha2);
		this.arc(xs+L/2,ys+h,r,-alpha2,Math.PI+alpha1,true);
		this.arc(xs,ys+h/2,Math.sqrt(h*h+L*L)/2-r,alpha1,2*Math.PI-alpha1);
		//this.stroke();
		this.fill();
	}
	
	CanvasRenderingContext2D.prototype.makeLink= function(a,b,h,coef){	

		var aposY =  $("#arpeople ."+a).offset().top - $("#equipe").offset().top+$("#arpeople ."+a).width()/2;//100;
		var aposX =  $("#arpeople ."+a).offset().left +$("#arpeople ."+a).width()/2;//100;
		var bposY = $("#arpeople ."+b).offset().top - $("#equipe").offset().top+$("#arpeople ."+b).width()/2;//100;
		var bposX = $("#arpeople ."+b).offset().left +$("#arpeople ."+b).width()/2;//100;
		
		L=Math.sqrt(Math.pow(aposX-bposX,2)+Math.pow(aposY-bposY,2))*4/3;
		alpha= Math.acos(-(aposX-bposX)/(L*3/4));
		
		this.translate(aposX, aposY);
		this.rotate(alpha);
		this.makeBlop(0,-h/2,L,h,coef);
		this.rotate(-alpha);
		this.translate(-aposX,-aposY);
	}

		
	CanvasRenderingContext2D.prototype.makePattern= function(){
		//create inclined lines on background
		var w = this.canvas.clientWidth,
			h = this.canvas.clientHeight,
			a = 5;
			
		this.lineWidth=0.5;
		this.strokeStyle="rgb(230,230,230)";
		
		for(var i=0;i<Math.floor(w/a)+Math.floor(h/a);i++){
			this.beginPath();
			this.moveTo(a*i, 0);
			this.lineTo(0,a*i);
			this.stroke();
		}
	}
	
	CanvasRenderingContext2D.prototype.createTeamMask = function(){
		
		var w = this.canvas.clientWidth,
			h = this.canvas.clientHeight,
			cx = w/2,
			cy = (h-40)/2;
	
		this.lineJoin="round";
		this.lineCap="round";
	
		var grd=this.createRadialGradient(cx,cy,$('#bg-logo-container img').width()/2+5,cx,cy,1000);
		grd.addColorStop(0,"rgb(200,200,200)");
		grd.addColorStop(1,"white");
		
		this.save();

		this.fillStyle = grd;
		this.fillRect(0,0,w,h);
		
/* 		this.makePattern() */
		
		this.beginPath();	
		this.arc(cx,cy,$('#bg-logo-container img').width()/2+5,0,2*Math.PI);
		this.closePath();
		this.strokeStyle="rgb(210,210,210)";
		this.lineWidth=30;
		this.stroke();

		this.strokeStyle="rgb(255,255,255)";

		this.lineWidth=15;
 		
		/*  link between bubble only if desktop  */
 		if($(window).width()>992){//1233){
 			this.fillStyle="rgb(156,156,156)";
			this.makeLink("ar-gauthier-blin","ar-florian-wininger",250,0.5);   
			this.fillStyle="rgb(200,200,200)";
			this.makeLink("ar-florian-wininger","ar-antoine-fond" ,720,0.9);   
			this.fillStyle="rgb(200,200,200)";
			this.makeLink("ar-maxime-alay-eddine","ar-arthur-feral",590,0.8);   		
			this.fillStyle="rgb(120,120,120)";
			this.makeLink("ar-maxime-alay-eddine","ar-raphael-sfeir",260,0.7);   

 		}
 		
		this.globalCompositeOperation = "destination-out";
		this.beginPath();
		this.arc(cx,cy,$('#bg-logo-container img').width()/2+5,0,2*Math.PI);
		this.fill();
		this.restore();
		this.globalCompositeOperation = "source-over";

	}
	
/* End of Canvas Prototype */


$(document).load(function() {
});
$(document).ready(function() {


//TODO A MODIFIER CEST HACK!!!!!
$('#bg-fixed').height($(window).height());
$('#equipe').height($(window).height()-50);
$('#equipe article ').height($(window).height()-50);

$('#arpeople').height($(window).height()-50-$('#equipe-header').height());

////////////
function teamSetting(callback){
	$('.ar-grid').css('top',$('#arpeople').position().top);
	var R =	$('#bg-logo-container img').width()/2+5, /* rayon du trou central */
		w = $(window).width(),
		wa=w/2-R,
		h = $('.ar-grid').height();
		
	if(w>992){
		var rb = Math.min(wa/2,h/3),
			mg = 0.15*rb;
		$(".ar-grid li ").css('width',rb).css('height',rb);
		
		$(".ar-column-1.ar-row-1").css('left',eval(wa-rb-mg)).css('top',eval(mg));;
		$(".ar-column-2.ar-row-1").css('left',eval(wa+2*R+mg)).css('top',eval(mg));;
		$(".ar-column-1.ar-row-2").css('left',eval(mg)).css('top',eval(rb));
		$(".ar-column-2.ar-row-2").css('left',eval(w-rb-mg)).css('top',eval(rb));
		$(".ar-column-1.ar-row-3").css('left',eval(wa-rb+2*mg)).css('top',eval(2*rb-mg));
		$(".ar-column-2.ar-row-3").css('left',eval(wa+2*R-2*mg)).css('top',eval(2*rb-mg));
	
	}else{
		
		if(2*R>eval(w/3)){
			var	wb=0.3*w,
				mgw=w*0.1,
				hb= 0.22*h,
				mgh=0.08*h;
		}else{
			var wb=wa*0.75,
				hb= 0.22*h,
				mgw = wa*0.125,//(wa-rb)/2,
				mgh = 0.1*h;
		}
	
		$(".ar-grid li ").css('width',wb).css('height',hb);
		$(".ar-column-1").css('left', mgw);
		$(".ar-column-2").css('left', eval(w-mgw-wb));
		$(".ar-row-1").css('top', mgh);
		$(".ar-row-2").css('top', eval(2*mgh+hb));
		$(".ar-row-3").css('top', eval(3*mgh+2*hb));
	}
	setTimeout(function(){callback()},500);
}	
	
	var canvas = document.getElementById('team-mask');
	var ctx = canvas.getContext('2d');

	function resizeCanvas(){
		canvas.width = $('#equipe').width();
		canvas.height = $('#equipe').height();
		teamSetting(function(){
		ctx.createTeamMask();});
	}

    window.addEventListener('resize', resizeCanvas, false);

	resizeCanvas()
	
/* follow useless */
   /*
 $(window).bind('mousewheel', function(event, delta) {
        if (event.originalEvent.wheelDelta < 0) {
      //    $("#content").css("top", parseInt($("#content").css("top"), 10) + event.originalEvent.wheelDelta + "px");
          console.log(event.originalEvent.wheelDelta);
        }
       else {
        //$("body").css("top", parseInt($("body").css("top"), 10) + 5 + "px");   
        console.log("hh");    
       }
    });        
*/
//});
  
    $(window).scroll(function() {
         if ($(window).scrollTop() > $(window).height() - 50) {
            menu.addClass('top');
            if(menuButtons.parent().find(".active").size() === 0)
                menuButtons.first().addClass('active');
         }
         else {
            menu.removeClass('top');
            menuButtons.removeClass('active');
         }
    });
    menuCollapsible.on('show.bs.collapse', function () {
        if ($(window).scrollTop() < $(window).height() - 50) {
            $('html, body').animate({
                scrollTop: $("#presentation").offset().top - 50
            }, 800);
        }
    });
    menu.find('a').click(function(){
        if(menuCollapsible.hasClass('in'))
            menuCollapsible.collapse('hide');
        $('html, body').animate({
            scrollTop: $( $.attr(this, 'href') ).offset().top - 45
        }, 800);
        return false;
    });
/*     Scroll to top when click on footer logo */
    $('#footer-logo').click(function(){
    	 $('html, body').animate({scrollTop:0 }, 800);
    	return false;
    });

	window.addEventListener('resize',function(){
		if($(window).width()>991){
			$(' .worklist > li ').each( function() { $(this).hoverdir(); } );
		}else{
			destroyHoverDirPlugin ($('.worklist > li'));
		}
		}, false);

	if($(window).width()>991){$(' .worklist > li ').each( function() { $(this).hoverdir(); } );}

 
/*  Popover #mention, placement improvement*/
    $('#mention').popover({html:"true",container: 'body',placement:'left'});
	$('#mention').on('shown.bs.popover', function () {
		/*
console.log($('.popover').position().top);

		console.log($('.popover').width());
		console.log($('.popover-content').height());
		
		var w=$(window).width()*0.90,
			h=$(window).height()-$('.popover-content').height();
		$('.popover').css('width',w);
		$('.popover').css('top',h);
 		console.log($('.popover').position().top);
*/

 
 /*
 
 $('.popover').css('top', parseInt($('.popover').css('top'))-parseInt($('.popover').css('height'))+'px');//   -($(window).height()-parseInt($('.popover').css('height'))  )+ 'px');
  $('.popover').css('left', $(window).width()-parseInt($('.popover').css('width'))-5+'px');

*/
})

/*     change the content of contact section depending on device */
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
		$("#QRCode").hide();
		$("#vcard").show();
	}else{
		$("#QRCode").show();
		$("#vcard").hide();
	}
   
/*    HACK :go back to page top on refresh  */ /* AMODFIFIER */
/* 		$('html, body').animate({scrollTop:0}, 'fast'); 		 */

 /*AJOUTER CONDITION POUR ONLY DESKTOP DEVICE AND NO SPLASCHSCRENN ANIMATION IF NOT AT TOP*/
   (new TimelineLite({onComplete:initScrollAnimations}))				
				.append([
					//TweenMax.from($('#bgfixed'),4,{ css:{autoAlpha:0}, ease:Back.easeOut}),			
					TweenMax.from($('#grad'),4,{delay: 1, css:{autoAlpha:0}, ease:Quad.easeOut}),
					TweenMax.from($('#bg-logo-01'),4,{ delay: 1,css:{autoAlpha:0,rotation:-60,scale:0.3}, ease:Elastic.easeOut}),
					TweenMax.from($('#bg-logo-03'),1,{ delay:2,css:{autoAlpha:0,scale:0.8}, ease:Quad.easeOut,immediateRender:!0}),
					TweenMax.from($('#bg-logo-02'),2,{delay:3, css:{autoAlpha:0,rotation:-10,scale:0.9}, ease:Elastic.easeOut})

				])
				.append([
					TweenMax.from($('#bg-logo-04'),1,{ css:{autoAlpha:0,scaleY:0.1}, ease:Quad.easeOut,immediateRender:!0})
				])
				.from( $('#menu'), 2, {css:{opacity:'0'}, ease:Back.easeOut})
				.from( $('#scrollteaser'), 0.4, { css:{autoAlpha:0}, ease:Back.easeOut});
			
	
	 function initScrollTeaser(scrolloramacontroller){
	 	var $scrollteaser=$("#scrollteaser"),
	 		controller=scrolloramacontroller;
	 	(new TimelineLite).append([TweenMax.to($scrollteaser,.5,{css:{bottom:75},repeat:-1,yoyo:!0,immediateRender:!0})]);
	 	controller.addTween(0,TweenMax.to($scrollteaser,1,{css:{autoAlpha:0},immediateRender:!0}),200,100)
	 }
	 /*
$(window).resize(function () {
		controller.triggerCheckAnim();
	});
*/
	function initScrollAnimations() {
		var controller = $.superscrollorama(/* {triggerAtCenter: false} */);
		
		initScrollTeaser(controller);
		
		
		var $height= $(window).height(),
			$presHead=$('#presentation-header'),
			$presSubHead=$('#presentation-subheader'),
			$panel1=$('#presentation #panel1'),
			$panel2=$('#presentation #panel2'),
			$panel3=$('#presentation #panel3');
		
		
			
		controller.addTween($presHead, TweenMax.from($presHead, .5,{css:{left:"-1000px",autoAlpha:0},ease:Quad.easeOut,immediateRender:!0}) ,$height/2,-0.45*$height);
		controller.addTween($presSubHead, TweenMax.from($presSubHead, .75, {css:{right: "-1000px",autoAlpha:0}, ease:Quad.easeOut,immediateRender:!0}),200,-0.45*$height);
		controller.addTween($presHead, TweenMax.from($panel1,0.5,{css:{left: "-1000px",bottom:"-1000px",autoAlpha:0}, ease:Quad.easeOut,immediateRender:!0}),$height*0.95-50,-0.45*$height);
		controller.addTween($presHead, TweenMax.from($panel2,0.5,{css:{bottom:"-1000px",autoAlpha:0}, ease:Quad.easeOut,immediateRender:!0}),$height*0.95-50,-0.45*$height);
		controller.addTween($presHead, TweenMax.from($panel3,0.5,{css:{right: "-1000px",bottom:"-1000px",autoAlpha:0}, ease:Quad.easeOut,immediateRender:!0}),$height*0.95-50,-0.45*$height);
		
		var $portfolio = $('#portfolio'),
			$portfolioH = $('#portfolio').height(),
			$refHead= $('#header-portfolio h1'),
			$refSubHead= $('#header-portfolio h3'),
			$worklist= $('#worklist'),
			$work1= $('#work-1'),
			$work2= $('#work-2'),
			$work3= $('#work-3'),
			$work4= $('#work-4'),
			$work5= $('#work-5'),
			$work6= $('#work-6'),
			$work7= $('#work-7'),
			$work8= $('#work-8'),
			$work9= $('#work-9'),
			$work10= $('#work-10'),
			$work11= $('#work-11'),
			$work12= $('#work-12');
		
		
		controller.addTween($refHead, TweenMax.from($refHead, .5,{css:{left:"-1000px",autoAlpha:0},ease:Quad.easeOut,immediateRender:!0}) ,$height/2,-0.45*$height);
		controller.addTween($refSubHead, TweenMax.from($refSubHead, .5,{css:{left:"-1000px",bottom:"-20px",scale:0.5,autoAlpha:0},ease:Quad.easeOut,immediateRender:!0}) ,$height/2,-0.45*$height);

		controller.addTween($portfolio ,(new TimelineLite).append([
			TweenMax.from($work1,.6,{css:{autoAlpha:0,left:"-500px", skewX:'30deg'},immediateRender:!0,ease:Quad.easeOut,delay:0.35}),
			TweenMax.from($work2,.5,{css:{autoAlpha:0,left:"-500px", skewX:'30deg'},immediateRender:!0,ease:Quad.easeOut,delay:.2}),
			TweenMax.from($work3,.5,{css:{autoAlpha:0,right:"-500px", skewX:'-30deg'},immediateRender:!0,ease:Quad.easeOut,delay:.1}),
			TweenMax.from($work4,.6,{css:{autoAlpha:0,right:"-500px", skewX:'-30deg'},immediateRender:!0,ease:Quad.easeOut,delay:.25}),
			TweenMax.from($work5,.5,{css:{autoAlpha:0,left:"-500px", skewX:'30deg'},immediateRender:!0,ease:Quad.easeOut,delay:.5}),
			TweenMax.from($work6,.5,{css:{autoAlpha:0,left:"-500px", skewX:'30deg'},immediateRender:!0,ease:Quad.easeOut,delay:.4}),
			TweenMax.from($work7,.5,{css:{autoAlpha:0,right:"-500px", skewX:'-30deg'},immediateRender:!0,ease:Quad.easeOut,delay:.4}),
			TweenMax.from($work8,.5,{css:{autoAlpha:0,right:"-500px", skewX:'-30deg'},immediateRender:!0,ease:Quad.easeOut,delay:.5}),
			TweenMax.from($work9,.5,{css:{autoAlpha:0,left:"-500px", skewX:'30deg'},immediateRender:!0,ease:Quad.easeOut,delay:.75}),
			TweenMax.from($work10,.5,{css:{autoAlpha:0,left:"-500px", skewX:'30deg'},immediateRender:!0,ease:Quad.easeOut,delay:.65}),
			TweenMax.from($work11,.5,{css:{autoAlpha:0,right:"-500px", skewX:'-30deg'},immediateRender:!0,ease:Quad.easeOut,delay:.65}),
			TweenMax.from($work12,.5,{css:{autoAlpha:0,right:"-500px", skewX:'-30deg'},immediateRender:!0,ease:Quad.easeOut,delay:.85})
		]),(0.85*$height-50)*0.75,-0.25*$height);
		
		
		
		var $formule=$('#formules'),
			$forHead= $('#header-formules h1'),
			$forSubHead= $('#header-formules h3'),
			$forpanel1=$('#formules #panel-1'),
			$forpanel2=$('#formules #panel-2'),
			$forpanel3=$('#formules #panel-3');
		
		controller.addTween($formule, TweenMax.fromTo($forHead, .5,{css:{autoAlpha:0,'letter-spacing':'100px'},ease:Quad.easeOut,immediateRender:!0},{css:{autoAlpha:1,'letter-spacing':'1px'}, ease:Quad.easeInOut}) ,$height/2,-0.45*$height);
		controller.addTween($formule, TweenMax.from($forSubHead, .5,{css:{left:"100px",skewX:"-40deg",autoAlpha:0},ease:Quad.easeOut,immediateRender:!0}) ,$height/2,-0.45*$height);

		controller.addTween($formule ,(new TimelineLite).append([
			TweenMax.from($forpanel1,.6,{css:{autoAlpha:0,rotation:90,transformOrigin:"left bottom"},immediateRender:!0,ease:Quad.easeOut,delay:0.35}),
			TweenMax.from($forpanel2,.6,{css:{autoAlpha:0,rotation:90,transformOrigin:"left bottom"},immediateRender:!0,ease:Quad.easeOut,delay:0.65}),
			TweenMax.from($forpanel3,.6,{css:{autoAlpha:0,rotation:90,transformOrigin:"left bottom"},immediateRender:!0,ease:Quad.easeOut,delay:0.75})
		]), (0.85*$height-50)*0.75,-0.25*$height);
		
		
		var $contact=$('#contact'),
			$contactlogo=$('#contact-logo img'),
			$angle= -900/(Math.PI*$contactlogo.height()),
			$contactcoord=$('#contact-coord'),
			$contactform=$('#contact-contact'),
			$contactRecr=$('#contact-recrutement'),
			$contactqrc=$('#QRCode');
				

			controller.addTween($contact ,(new TimelineLite)
					.from($contactlogo,1,{css:{/*autoAlpha:0, */left:"-900px",rotation:$angle+"rad"},immediateRender:!0,ease:Linear.easeNone})
					.from($contactcoord,1,{css:{autoAlpha:0,skewY:"90deg",transformOrigin:"left bottom"}, ease:Quad.easeOut})
					.from($contactRecr,1,{css:{autoAlpha:0,skewX:"90deg",transformOrigin:"left top"}, ease:Quad.easeOut})
					.from($contactform,1,{css:{autoAlpha:0,skewY:"-90deg",transformOrigin:"right bottom"}, ease:Quad.easeOut})
					.from($contactqrc,1,{css:{autoAlpha:0,skewY:"90deg",transformOrigin:"left bottom"}, ease:Quad.easeOut})					
,($height*0.8-70+$contactlogo.height()-$contactcoord.height()),-0.20*$height);



    }
    






    
/*
	map.markerLayer.on('ready', function(e) {
	    map.markerLayer.eachLayer(function(marker) {
	        // you can replace this test for anything else, to choose the right
	        // marker on which to open a popup. by default, popups are exclusive
	        // so opening a new one will close all of the others.
	        if (marker.feature.properties.title === 'S.A.S. ARGAUS') {
	            marker.openPopup();
	        }
	    });
	});
*/
		
	
		/*==========DEV FUNCTION DELETE BEFORE PROD++++++++++*/

window.addEventListener('resize', screenSize, false);
		
		function screenSize(){
			console.log("hh");
			
			$("#screensize").text($(window).width() + " x "+$(window).height());
			$('#screensize').show();
			setInterval(function(){$('#screensize').fadeOut(1000)}, 1000);

		}
/* +++++++++++++++++++++++++++++++++++  END DEV FUNCTION+++++++++++++ */
	
	




 $("input,textarea").jqBootstrapValidation({
     preventSubmit: true,
     submitError: function($form, event, errors) {
     
     },
     submitSuccess: function($form, event) {
      event.preventDefault(); // prevent default submit behaviour
       // get values from FORM
       var name = $("input#name").val();  
       var email = $("input#email").val(); 
       var number = $("input#number").val(); 
       var message = $("textarea#message").val();
        var firstName = name; 
           // Check for white space in name for Success/Fail message
        if (firstName.indexOf(' ') >= 0) {
	   firstName = name.split(' ').slice(0, -1).join(' ');
         }     
	 $.ajax({
				url: "js/traitement.php",
                type: "POST",
            	cache: false,
            	data: {name: name, email: email, number: number, message: message},
            	success: function() {  
            	// Success message
	            	  $('#success').html("<div class='alert alert-success'>");
	            	  $('#success > .alert-success').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;").append( "</button>");
	            	  $('#success > .alert-success').append("<strong>Votre message a bien été envoyée. </strong>");
					  $('#success > .alert-success').append('</div>');		    
					  //clear all fields
					  $('#contactForm').trigger("reset");
				},
				error: function() {		
				// Fail message
 		 			$('#success').html("<div class='alert alert-danger'>");
 		 			$('#success > .alert-danger').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;").append( "</button>");
 		 			$('#success > .alert-danger').append("<strong>Sorry "+name+", it seems that my mail server is not responding...</strong> Could you please email me directly to <a href='mailto:contact@argaus.fr?Subject=Contact;>contact@argaus.fr</a> ? Sorry for the inconvenience!");
 		 			$('#success > .alert-danger').append('</div>');
 		 		//clear all fields
 		 			$('#contactForm').trigger("reset");
 		 		}
           })
         },
         filter: function() {
                   return $(this).is(":visible");
         },
   });
 

/*When clicking on Full hide fail/success boxes */ 
$('#name').focus(function() {
     $('#success').html('');
  });

});
