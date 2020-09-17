//get url parameters
$urlParam = function (name) {
  var results = new RegExp("[?&]" + name + "=([^&#]*)").exec(
    window.location.href
  );
  if (results != null) {
    return results[1] || 0;
  } else {
    return null;
  }
};
//global var
var discount_code = "NULL";
var timeLeft = 0;
var sent = false;
var verify_id = 0;
var course_id = decodeURIComponent($urlParam("class_time"));
var token1 = "";
var token2 = "";
var connect = true;
var total = false;
//function check connection
function checkconnection(){
  $.ajax({
    url: "https://academyfarda.com/hi",
    method: "POST",
    crossDomain: true,
    success: function (res) {
      if (res.ans == "hi") {
        if(total == false){
          get_total(false);
          total = true;
        }
        setTimeout(function () {
          $("#serverconnectionerror").removeClass("show").addClass("hide");
        }, 1);
        if (connect == false) {
          setTimeout(function () {
            $("#serverconnectionreconnect")
              .removeClass("hide")
              .addClass("show");
          }, 1);
          setTimeout(function () {
            $("#serverconnectionreconnect")
              .removeClass("show")
              .addClass("hide");
          }, 5000);
          connect = true;
        }
      } else {
        setTimeout(function () {
          $("#serverconnectionerror").removeClass("hide").addClass("show");
        }, 1);
        connect = false;
      }
    },
    error: function (error) {
      console.log(error);
      setTimeout(function () {
        $("#serverconnectionerror").removeClass("hide").addClass("show");
      }, 1);
      connect = false;
    },
  });
}
//check for connection with server
checkconnection();
setInterval(function () {
  checkconnection();
  
}, 10000);
//end check for server connection
//put data to table
$("#name").text(decodeURIComponent($urlParam("name")));
$("#family").text(decodeURIComponent($urlParam("family")));
if (decodeURIComponent($urlParam("gender")) == "M") {
  $("#gender").text("مرد");
} else {
  $("#gender").text("زن");
}
$("#father_name").text(decodeURIComponent($urlParam("father_name")));
$("#code_meli").text(
  $.persianNumbers(decodeURIComponent($urlParam("code_meli")))
);
$("#phone").text($.persianNumbers(decodeURIComponent($urlParam("phone"))));
$("#address").text($.persianNumbers(decodeURIComponent($urlParam("address"))));
if (decodeURIComponent($urlParam("class_time")) == "1") {
  $("#class_time").text("کلاس فشرده شنبه تا چهارشنبه ساعت ۹ تا ۱۲");
} else if (decodeURIComponent($urlParam("class_time")) == "2") {
  $("#class_time").text("کلاس فشرده شنبه تا چهارشنبه ساعت ۱۳ تا ۱۶");
} else if (decodeURIComponent($urlParam("class_time")) == "3") {
  $("#class_time").text("کلاس عادی زوج ساعت ۱۷ تا ۲۰");
} else if (decodeURIComponent($urlParam("class_time")) == "4") {
  $("#class_time").text("کلاس عادی فرد ساعت ۱۷ تا ۲۰");
} else {
  $("#class_time").text("کلاس مورد نظز پیدا نشد.");
}
if (decodeURIComponent($urlParam("payment_type")) == "option1") {
  $("#payment_type").text("نقدی");
} else {
  $("#payment_type").text("اقساط");
}
//back to landing page with loading off
$("#back").click(function (e) {
  e.preventDefault();
  var url = "./index.html?loading=off";
  var data = "";
  $.ajax({
    url: url,
    method: "GET",
    data: data,
    crossDomain: true,
    success: function (res) {
      console.log(res);
      setTimeout(function () {
        window.location.href = url;
      }, 1000);
    },
    error: function (e, v) {
      console.log(res);
    },
  });
});
// Mobile Verification input
$(function () {
  "use strict";

  var body = $("#wrapper");
  var flag_last = false;

  function goToPreviousInput(e) {
    $("#num1")[0].focus();
    badsmsinputremover();
  }

  function goToNextInput(e) {
    var key = e.which,
      t = $(e.target),
      sib = t.next("input");
    if (t.hasClass("last")) {
      flag_last = true;
      loadingadd();
      if (
        check_course_validation() == true &&
        check_data_validation() == true
      ) {
        gettokens();
        submit();
      } else {
        loadingremove();
        alert(
          "اطلاعات وارد شده را بررسی کنید و یا با پشتیبانی تماس حاصل کنید."
        );
      }
    } else {
      flag_last = false;
    }
    if (key < 48 || (key > 57 && key < 96) || key > 105) {
      e.preventDefault();
      return false;
    }
    if (key === 9) {
      return true;
    }

    setTimeout(() => {
      if (t[0].value.length > 1) {
        t[0].value = t[0].value[0];
      }
      if (flag_last === true) {
        return false;
      }
      if (t[0].value.length !== 0) {
        sib.select().focus();
      }
    }, 50);
  }
  function onKeyDown(e) {
    var key = e.which,
      t = $(e.target);
    if (t[0].value.length == 1) {
      goToNextInput(e);
    }
    if (key === 8) {
      goToPreviousInput(e);
    }
    if (
      (key === 9 || (key >= 48 && key <= 57) || (key >= 96 && key <= 105)) &&
      (flag_last === false || $(e.target)[0].value.length === 0)
    ) {
      return true;
    }
    e.preventDefault();
    return false;
  }
  function onFocus(e) {
    $(e.target).select();
    badsmsinputremover();
  }

  body.on("keyup", "input", goToNextInput);
  body.on("keydown", "input", onKeyDown);
  body.on("click", "input", onFocus);
});
//function sms send
function sendsms() {
  var phone = fixNumbers($urlParam("phone"));
  var data = "phone=" + phone;
  var url = "https://academyfarda.com/SMS/lookup";
  $.ajax({
    url: url,
    type: "POST",
    data: data,
    crossDomain: true,
    success: function (res) {
      if (res.status == 200) {
        verify_id = res.id;
        console.log(res);
        $("#exampleModal001").modal("show");
        setTimeout(() => {
          $("#num1")[0].focus();
        }, 1000);
        sent = true;
        loadingremove();
      } else {
        alert("پیام ارسال نشد. " + res.status_message);
        loadingremove();
      }
    },
    error: function (error) {
      alert("اشکال در ارسال اس ام اس");
      loadingremove();
      console.log(error);
    },
  });
}
//send validation sms
$("#send_sms_validator").click(function (e) {
  e.preventDefault();
  loadingadd();
  if (sent == false) {
    sendsms();
    timeLeft = 61;
  } else {
    $("#exampleModal001").modal("show");
    setTimeout(() => {
      $("#num1")[0].focus();
    }, 1000);
    lock = false;
  }
});
//verify data for validation functions
function check_course_validation() {
  var data = "course_id=" + course_id;
  var url = "https://academyfarda.com/payments/checkcourse";
  var aj = $.ajax({
    url: url,
    type: "POST",
    data: data,
    async: false,
    crossDomain: true,
    success: function (res) {
      console.log(res);
    },
    error: function (error) {
      console.log("دوره انتخاب شده فعال نیست و یا اصلا وجود ندارد.");
    },
  });
  if (aj.status == 200) {
    return true;
  } else {
    return false;
  }
}
function get_total(discount) {
  var course_id = $urlParam("class_time");
  var data = "course_id=" + course_id;
  if(discount == true){
    var discount_c = $("#input-discount").val();
    data += "&" + "discount_code=" + discount_c 
  }
  var url = "https://academyfarda.com/payments/getcoursetotal";
  $.ajax({
    url: url,
    type: "POST",
    data: data,
    crossDomain: true,
    success: function (res) {
      console.log(res);
      if(discount == true){
        discount_code = discount_c;
        setTimeout(() => {
          $("#discount_total").removeClass("hide");
          $("#course_total").addClass("linethrough");
          $("#discount-code").html(discount_code);
          $("#discount-ans-g").removeClass("hide");
          $("#discount-ans-b").addClass("hide");
          $("#discount-ans-r").addClass("hide");
          $("#remove_discount").removeClass("force-hide");
          $("#total2").html($.persianNumbers(res.total));
        }, 100);
      }else{
        setTimeout(() => {
          $("#total").html($.persianNumbers(res.total));
        }, 100);
      }
      return true;
    },
    error: function (error) {
      console.log(error);
      if(discount == true){
        discount_code = "NULL";
        setTimeout(() => {
          $("#discount_total").addClass("hide");
          $("#course_total").removeClass("linethrough");
          $("#discount-code").html(discount_code);
          $("#total2").html($.persianNumbers(""));
          $("#discount-ans-g").addClass("hide");
          $("#discount-ans-b").removeClass("hide");
          $("#discount-ans-r").addClass("hide");
        }, 100);
      }
      return false;
    },
  });
}
function check_data_validation() {
  var regex_failed = false;
  var regex_names = RegExp("^.{3,200}$");
  if (regex_names.test(decodeURIComponent($urlParam("name"))) == false) {
    console.log(
      "نام شما کمتر از سه حرف یا بیشتر از مقدار در نظر گرفته شده می‌باشد."
    );
    regex_failed = true;
  }
  if (regex_names.test(decodeURIComponent($urlParam("family"))) == false) {
    console.log(
      "نام خانوادگی شما کمتر از سه حرف یا بیشتر از مقدار در نظر گرفته شده می‌باشد."
    );
    regex_failed = true;
  }
  if (regex_names.test(decodeURIComponent($urlParam("father_name"))) == false) {
    console.log(
      "نام پدر شما کمتر از سه حرف یا بیشتر از مقدار در نظر گرفته شده می‌باشد."
    );
    regex_failed = true;
  }
  var regex_gender = RegExp("^[M,F]$");
  if (regex_gender.test(decodeURIComponent($urlParam("gender"))) == false) {
    console.log(
      "نام خانوادگی شما کمتر از سه حرف یا بیشتر از مقدار در نظر گرفته شده می‌باشد."
    );
    regex_failed = true;
  }
  var regex_meli = RegExp("^[0-9]{10}$");
  if (regex_meli.test(fixNumbers(decodeURIComponent($urlParam("code_meli")))) == false) {
    console.log("کد ملی باید شامل 10 رقم باشد.");
    regex_failed = true;
  }
  var regex_phone = RegExp("^09[0-9]{9}$");
  if (regex_phone.test(fixNumbers(decodeURIComponent($urlParam("phone")))) == false) {
    console.log("شماره موبایل باید با 09 شروع و 9 رقم ادامه داشته باشد.");
    regex_failed = true;
  }
  var regex_address = RegExp("^.{10,2000}$");
  if (regex_address.test(decodeURIComponent($urlParam("address"))) == false) {
    console.log("آدرس شما بسیار کوتاه و یا بسیار طولانی است.");
    regex_failed = true;
  }
  var regex_payment_type = RegExp("^option[1-2]$");
  if (
    regex_payment_type.test(decodeURIComponent($urlParam("payment_type"))) ==
    false
  ) {
    console.log("نوع پرداخت باید یکی از دو حالت قسطی و یا نقدی باشد.");
    regex_failed = true;
  }
  if (regex_failed == false) {
    return true;
  } else {
    return false;
  }
}
//checking discount on click
$("#check_discount").click(function (e) {
  e.preventDefault();
  discount_code = get_total(true);
});
//sms code input and loading functions
function badsmsinputremover() {
  $("#num1").val("");
  $("#num2").val("");
  $("#num3").val("");
  $("#num4").val("");
  $("#num5").val("");
  $("#num6").val("");
  $("#num1").removeClass("bad");
  $("#num2").removeClass("bad");
  $("#num3").removeClass("bad");
  $("#num4").removeClass("bad");
  $("#num5").removeClass("bad");
  $("#num6").removeClass("bad");
  $("#num1")[0].focus();
  $("#wrong-code").addClass("hide");
}
function badsmsinput() {
  $("#num1").addClass("bad");
  $("#num2").addClass("bad");
  $("#num3").addClass("bad");
  $("#num4").addClass("bad");
  $("#num5").addClass("bad");
  $("#num6").addClass("bad");
  $("#wrong-code").removeClass("hide");
}
function clearsmsinput() {
  $("#num1").val("");
  $("#num2").val("");
  $("#num3").val("");
  $("#num4").val("");
  $("#num5").val("");
  $("#num6").val("");
  $("#num1")[0].focus();
}
function loadingadd() {
  $("body").addClass("body-on-loading");
  $("#loading2").removeClass("force-hide");
}
function loadingremove() {
  $("body").removeClass("body-on-loading");
  $("#loading2").addClass("force-hide");
}
//submit all data and get payment url function
function submit() {
  var url = "https://academyfarda.com/payments/cartcoursecreate";
  var data =
    "course_id=" +
    course_id +
    "&" +
    "verify_id=" +
    verify_id +
    "&" +
    "token1=" +
    token1 +
    "&" +
    "token2=" +
    token2 +
    "&";
  data =
    data +
    "name=" +
    decodeURIComponent($urlParam("name")) +
    "&" +
    "family=" +
    decodeURIComponent($urlParam("family")) +
    "&";
  data =
    data +
    "gender=" +
    decodeURIComponent($urlParam("gender")) +
    "&" +
    "father_name=" +
    decodeURIComponent($urlParam("father_name")) +
    "&";
  data =
    data +
    "code_meli=" +
    decodeURIComponent(fixNumbers($urlParam("code_meli"))) +
    "&" +
    "address=" +
    decodeURIComponent($urlParam("address")) +
    "&";
  data = data + "payment_type=" + decodeURIComponent($urlParam("payment_type"));
  if (discount_code != "NULL") {
    data = data + "&discount_code=" + discount_code;
  }
  console.log(data);
  $.ajax({
    url: url,
    type: "POST",
    data: data,
    crossDomain: true,
    success: function (res) {
      setTimeout(function () {
        window.location.href = res.url;
      }, 1000);
    },
    error: function (e) {
      console.log(e);
      loadingremove();
      badsmsinput();
    },
  });
}
//count down
function countDown() {
  timeLeft = timeLeft - 1;
  return timeLeft;
}
setInterval(function () {
  var time = countDown(timeLeft);
  if (time > 0) {
    $("#timeleft").html($.persianNumbers(time));
    $("#timer").removeClass("hide");
    $("#resend-btn").addClass("hide");
  } else {
    $("#timer").addClass("hide");
    $("#resend-btn").removeClass("hide");
  }
}, 1000);
//resend sms after 60 sec
$("#resend-btn").click(function (e) {
  e.preventDefault();
  sendsms();
  timeLeft = 61;
});
//get 2 tokens from inputs
function gettokens() {
  token1 =
    $("#num1").val().toString() +
    $("#num2").val().toString() +
    $("#num3").val().toString();
  token2 =
    $("#num4").val().toString() +
    $("#num5").val().toString() +
    $("#num6").val().toString();
}
//remove discount 
$("#remove_discount").click(function(e){
  e.preventDefault();
  discount_code = "NULL";
  $("#discount_total").addClass("hide");
  $("#course_total").removeClass("linethrough");
  $("#discount-code").html(discount_code);
  $("#total2").html($.persianNumbers(""));
  $("#discount-ans-g").addClass("hide");
  $("#discount-ans-b").addClass("hide");
  $("#discount-ans-r").removeClass("hide");
  $("#remove_discount").addClass("force-hide");
});
//this function will change numbers to english
var
persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g],
arabicNumbers  = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g],
fixNumbers = function (str)
{
  if(typeof str === 'string')
  {
    for(var i=0; i<10; i++)
    {
      str = str.replace(persianNumbers[i], i).replace(arabicNumbers[i], i);
    }
  }
  return str;
};