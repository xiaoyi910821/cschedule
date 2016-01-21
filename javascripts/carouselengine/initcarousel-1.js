jQuery(document).ready(function(){
    var scripts = document.getElementsByTagName("script");
    var jsFolder = "";
    for (var i= 0; i< scripts.length; i++)
    {
        if( scripts[i].src && scripts[i].src.match(/initcarousel-1\.js/i))
            jsFolder = scripts[i].src.substr(0, scripts[i].src.lastIndexOf("/") + 1);
    }
    if ( typeof html5Lightbox === "undefined" )
    {
        html5Lightbox = jQuery(".html5lightbox").html5lightbox({
            skinsfoldername:"",
            jsfolder:jsFolder,
            barheight:64,
            showtitle:false,
            showdescription:false,
            shownavigation:false,
            thumbwidth:80,
            thumbheight:60,
            thumbtopmargin:12,
            thumbbottommargin:8,
            titlebottomcss:'{color:#333; font-size:14px; font-family:Armata,sans-serif,Arial; overflow:hidden; text-align:left;}',
            descriptionbottomcss:'{color:#333; font-size:12px; font-family:Arial,Helvetica,sans-serif; overflow:hidden; text-align:left; margin:4px 0px 0px; padding: 0px;}'
        });
    }
    jQuery("#amazingcarousel-1").amazingcarousel({
        jsfolder:jsFolder,
        width:300,
        height:400,
        skinsfoldername:"",
        interval:2000,
        itembottomshadowimagetop:100,
        donotcrop:false,
        random:false,
        showhoveroverlay:true,
        rownumber:1,
        height:400,
        arrowheight:60,
        showbottomshadow:true,
        itembackgroundimagewidth:100,
        imageheight:400,
        skin:"Simplicity",
        responsive:true,
        lightboxtitlebottomcss:"{color:#333; font-size:14px; font-family:Armata,sans-serif,Arial; overflow:hidden; text-align:left;}",
        enabletouchswipe:true,
        navstyle:"bullets",
        backgroundimagetop:-40,
        arrowstyle:"mouseover",
        bottomshadowimagetop:100,
        transitionduration:2000,
        continuous:false,
        itembackgroundimagetop:0,
        hoveroverlayimage:"hoveroverlay-64-64-9.png",
        itembottomshadowimage:"itembottomshadow-100-100-5.png",
        lightboxshowdescription:false,
        width:300,
        navswitchonmouseover:false,
        showhoveroverlayalways:false,
        transitioneasing:"easeOutExpo",
        lightboxshownavigation:false,
        showitembackgroundimage:false,
        itembackgroundimage:"",
        playvideoimagepos:"center",
        circular:true,
        arrowimage:"arrows-42-60-0.png",
        scrollitems:1,
        direction:"horizontal",
        lightboxdescriptionbottomcss:"{color:#333; font-size:12px; font-family:Arial,Helvetica,sans-serif; overflow:hidden; text-align:left; margin:4px 0px 0px; padding: 0px;}",
        supportiframe:false,
        navimage:"bullet-12-12-0.png",
        backgroundimagewidth:110,
        showbackgroundimage:false,
        lightboxbarheight:64,
        showplayvideo:true,
        spacing:1,
        lightboxthumbwidth:80,
        navdirection:"horizontal",
        itembottomshadowimagewidth:100,
        backgroundimage:"",
        lightboxthumbtopmargin:12,
        autoplay:true,
        arrowwidth:42,
        transparent:false,
        continuousduration:2500,
        bottomshadowimage:"bottomshadow-110-100-5.png",
        scrollmode:"page",
        navmode:"page",
        lightboxshowtitle:false,
        lightboxthumbbottommargin:8,
        arrowhideonmouseleave:4000,
        showitembottomshadow:false,
        lightboxthumbheight:60,
        navspacing:8,
        pauseonmouseover:true,
        imagefillcolor:"FFFFFF",
        playvideoimage:"playvideo-64-64-0.png",
        visibleitems:4,
        imagewidth:300,
        usescreenquery:false,
        bottomshadowimagewidth:110,
        screenquery:{
	tablet: {
		screenwidth: 900,
		visibleitems: 2
	},
	mobile: {
		screenwidth: 600,
		visibleitems: 1
	}
},
        navwidth:12,
        loop:0,
        navheight:12
    });
});