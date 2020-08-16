//verify informations
$urlParam = function(name){
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    return results[1] || 0;
}
$("#name").text(decodeURIComponent($urlParam('name')));
$("#family").text(decodeURIComponent($urlParam('family')));
if (decodeURIComponent($urlParam('gender')) == "M" ) {
    $("#gender").text("مرد");
}else {
    $("#gender").text("زن");
}
$("#father_name").text(decodeURIComponent($urlParam('father_name')));
$("#code_meli").text(decodeURIComponent($urlParam('code_meli')));
$("#phone").text(decodeURIComponent($urlParam('phone')));
$("#address").text(decodeURIComponent($urlParam('address')));
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

$(document).on('click', '#back', function(e) {
    e.preventDefault();
    setTimeout(function() {
        window.location.href = "./index.html?loading=off"
    }, 1000)
});