//verify informations
$urlParam = function(name){
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results != null){
        return results[1] || 0;
    }else {
        return null;
    }
}
$("#name").text(decodeURIComponent($urlParam('name')));
$("#family").text(decodeURIComponent($urlParam('family')));
if (decodeURIComponent($urlParam('gender')) == "M" ) {
    $("#gender").text("مرد");
}else {
    $("#gender").text("زن");
}
$("#father_name").text(decodeURIComponent($urlParam('father_name')));
$("#code_meli").text($.persianNumbers(decodeURIComponent($urlParam('code_meli'))));
$("#phone").text($.persianNumbers(decodeURIComponent($urlParam('phone'))));
$("#address").text($.persianNumbers(decodeURIComponent($urlParam('address'))));
if (decodeURIComponent($urlParam('class_time')) == "912" ) {
    $("#class_time").text("کلاس فشرده شنبه تا چهارشنبه ساعت ۹ تا ۱۲");
}else if(decodeURIComponent($urlParam('class_time')) == "1316" ) {
    $("#class_time").text("کلاس فشرده شنبه تا چهارشنبه ساعت ۱۳ تا ۱۶");
}else if(decodeURIComponent($urlParam('class_time')) == "1720Z" ) {
    $("#class_time").text("کلاس عادی زوج ساعت ۱۷ تا ۲۰");
}else {
    $("#class_time").text("کلاس عادی فرد ساعت ۱۷ تا ۲۰");
}
if (decodeURIComponent($urlParam('payment_type')) == "option1" ) {
    $("#payment_type").text("نقدی");
}else{
    $("#payment_type").text("اقساط");
}

//
// Mobile Verification
//
$(function() {
    'use strict';

    var body = $('#wrapper');
    var flag_last = false;

    
    function goToPreviousInput(e){
        var t = $(e.target),
        sib = t.prev('input');

        t[0].value = "";
        sib.select().focus();    
    }

    function goToNextInput(e) {
        var key = e.which,
        t = $(e.target),
        sib = t.next('input');

        
        if (t.hasClass("last")){
            flag_last = true;
        }else{
            flag_last = false;
        }
        if ((key < 48 || (key > 57 && key < 96) || key > 105 )) {
            e.preventDefault();
            return false;
        }
        if (key === 9) {
            return true;
        }
        
        setTimeout(() => {
            if (t[0].value.length > 1){
                t[0].value = t[0].value[0];
            }
            if (flag_last === true) {
                return false;
            }
            if (t[0].value.length !== 0){
                sib.select().focus();
            }
            
        }, 50);  
    }
    function onKeyDown(e) {
        var key = e.which;
        if (key === 8){
            goToPreviousInput(e);
        }
        if ( (key === 9 || (key >= 48 && key <= 57 ) || (key >= 96 && key <= 105 )) && (flag_last === false || $(e.target)[0].value.length === 0) ) {
            return true;
        }
        e.preventDefault();
        return false;
    }
    function onFocus(e) {
        $(e.target).select();
    }

    body.on('keyup', 'input', goToNextInput);
    body.on('keydown', 'input', onKeyDown);
    body.on('click', 'input', onFocus);

});



$(document).on('click', '#verify', function(e) {
    e.preventDefault();
    var ip = "";
    $.ajax({
        url: "https://api.ipify.org",
        method: 'GET',
        crossDomain: true,
        success: function(res) {
            ip = res;
        },
        error: function(e, v) {
            alert("آدرس ip شما مشخص نیست");
        }
    });
    var phone  = $urlParam('phone');
    var url = "https://academyfarda.com/SMS/lookup"
    $.ajax({
        url: url,
        method: 'POST',
        data: phone,
        crossDomain: true,
        success: function(res) {
          alert("sms sent");
        },
        error: function(e, v) {
          dwtoast($form.find('.error-message').html())
        }
    });

    setTimeout(() => {
        $('#num1')[0].focus();
    }, 500)
});
    