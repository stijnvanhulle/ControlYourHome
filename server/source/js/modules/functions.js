/**
 * Created by stijnvanhulle on 24/09/15.
 */

function showMessage(title,msg){
    $('#overlay.message aside').empty();
    $('#overlay.message').css('display','block');
    $('#overlay').removeClass('message');

    $('#overlay').addClass('message');

    $('#overlay.message').css('animation','fadeInUp .4s ease-in-out both');
    if(msg==null){
        msg="";
    }
    $('#overlay.message aside').html("<h1>" + title +"</h1><div>" + msg +"</div> ");

    $('#overlay.message').css('animation-direction','normal');

    setTimeout(function(){
        $('#overlay.message').css('animation','fadeInUp_R .4s ease-in-out both');

        setTimeout(function(){
            $('#overlay.message').css('animation','none');
            $('#overlay.message').css('display','none');
        }, 200);
    }, 2400);

}

function countAnimation(item){
    $('#count').empty();
    $('#count').css('display','block');
    $('#count').css('animation','scaleUpCenter .4s ease-in-out both');
    $('#count').html(item);

    setTimeout(function(){
        $('#count').css('animation','none');
        $('#count').css('display','none');
    }, 400);
}

function flashAnimation(){
    $('.flash').css('display','block');
    $('.flash').css('animation','flash .4s ease-in-out both');

    setTimeout(function(){
        $('.flash').css('animation','none');
        $('.flash').css('display','none');
    }, 400);
}


function setupRadial(){
    var radial=d3.select(document.getElementById('radialChartTemperatures'));

    var rp1 = radialProgress(document.getElementById('radialChartTemperatures'))
        .label("RADIAL test")
        .diameter(150)
        .value(78)
        .render();
}

function getDataUri(url, callback) {
    var image = new Image();

    image.onload = function () {
        var canvas = document.createElement('canvas');
        canvas.width = this.naturalWidth; // or 'width' if you want a special/scaled size
        canvas.height = this.naturalHeight; // or 'height' if you want a special/scaled size

        canvas.getContext('2d').drawImage(this, 0, 0);

        // ... or get as Data URI
        callback(canvas.toDataURL("image/jpeg", 1.0));
    };

    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
}
function loginError(isError){
    var element= $("body#login section.frame");
    $section = $(element);

    if(isError==true){
        $section.addClass('error');
        setTimeout(function(){
            $section.removeClass('error');
            //$section.css("animation", "none");
        }, 300);
    }else{
        $section.removeClass('error');
    }
}

function menu(){
    if($('#menu').hasClass('hidden')){
        $('#menu').removeClass('hidden');
        $('#menu').addClass('mobile');
    }else{
        $('#menu').addClass('hidden');
        $('#menu').removeClass('mobile');
    }
}

function resize(width){
    var height= $(window).height() -  60;

    if(width >=1500){
        $('#mobile').addClass('hidden');
        $('#menu').removeClass('hidden');
    }else if(width <1500 && width >=960){
        $('#mobile').addClass('hidden');
        $('#menu').removeClass('hidden');
    }else if(width <960 && width >=768){
        $('#menu').addClass('hidden');
        $('#mobile').removeClass('hidden');
    }else{
        $('#menu').addClass('hidden');
        $('#mobile').removeClass('hidden');
    }
}

function load(){
    $('.frame').css('animation','bounceIn 1000ms linear both');

    setTimeout(function(){
        $('.frame').css('animation','');
    }, 2000);
}

function isMobile(){
    var width=$(window).width();
    if(width <960 ){
        return true;
    }else{
        return false;
    }
}


$(document).ready(function() {
    console.log( "document loaded" );
    load();

    resize($(window).width());

    $(window).resize(function() {
        resize($(window).width());
    });

    $('#mobile').click(function(){
        menu();
    });
});
