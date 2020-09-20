//variable def
var gotcourse = false;
var connect = true;
//dwtoast
function dwtoast(txt) {
  var $toast = jQuery("#dwtoast");

  $toast.html(txt);
  $toast.addClass("show");

  // After X seconds, remove the show class from DIV
  setTimeout(function () {
    $toast.removeClass("show");
  }, 12000);
}
//get size of window
function getBootstrapDeviceSize() {
  return $("#users-device-size").find("div:visible").first().attr("id");
}
//////
////// LOADING consult-form
//////
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
if ($urlParam("loading") == "off") {
  setTimeout(function () {
    $("#loading").fadeOut("fast");
    $("body").removeClass("body-on-loading");
  }, 0);
} else {
  setTimeout(function () {
    $("#loading").fadeOut("slow");
    $("body").removeClass("body-on-loading");
  }, 4000);
}
//end loading
//check for connection with server function
function checkconnection() {
  $.ajax({
    url: "https://academyfarda.com/hi",
    method: "POST",
    crossDomain: true,
    success: function (res) {
      if (res.ans == "hi") {
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
        //if its first connect get courses
        if (gotcourse == false) {
          getcourses();
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
//get all courses function
function getcourses() {
  $.ajax({
    url: "https://academyfarda.com/payments/getcourses",
    method: "POST",
    crossDomain: true,
    success: function (res) {
      console.log(res);
      var trHTML = "";
      $.each(res.course, function (i, item) {
        if (item.active == true) {
          trHTML += "<tr><td>";
        } else {
          trHTML += '<tr class="inactive"><td>';
        }
        if (item.time == 912) {
          trHTML += "۹ تا ۱۲";
        } else if (item.time == 1316) {
          trHTML += "۱۳ تا ۱۶";
        } else if (item.time == 1720) {
          trHTML += "۱۷ تا ۲۰";
        } else {
          trHTML += "نا مشخص";
        }
        trHTML += "</td><td>";
        if (item.day == "STW") {
          trHTML += "شنبه تا چهار‌شنبه";
        } else if (item.day == "STT") {
          trHTML += "شنبه تا پنج‌شنبه ";
        } else if (item.day == "O") {
          trHTML += "فرد";
        } else if (item.day == "E") {
          trHTML += "زوج";
        } else {
          trHTML += "نا مشخص";
        }
        trHTML += "</td><td>";
        if (item.type == "I") {
          trHTML += "فشرده";
        } else if (item.type == "R") {
          trHTML += "عادی";
        } else {
          trHTML += "نا مشخص";
        }
        trHTML += "</td><td>";
        if (item.type == "I") {
          trHTML += "یک ماه و یک هفته";
        } else if (item.type == "R") {
          trHTML += "دو ماه";
        } else {
          trHTML += "نا مشخص";
        }
      });
      $("#tbody-courses").append(trHTML);
      trHTML = "";
      $.each(res.course, function (i, item) {
        if (item.active == true) {
          trHTML += "<option value=" + item.id + ">" + item.name + "</option>";
        } else {
          trHTML +=
            "<option value=" + item.id + " disabled>" + item.name + "</option>";
        }
      });
      $("#class_time1").append(trHTML);
      $("#class_time2").append(trHTML);
      gotcourse = true;
    },
    error: function (error) {
      console.log(error);
      setTimeout(function () {
        $("#serverconnectionerror").removeClass("hide").addClass("show");
      }, 1);
    },
  });
}
//end get courses
(function ($) {
  /**
   * "Scroll to" links
   */
  $("a.scroll_link").click(function (e) {
    e.preventDefault();
    var target = $(this).data("target") || $(this).attr("href");

    $("html, body").animate(
      {
        scrollTop: $(target).offset().top + "px",
      },
      {
        duration: 500,
        easing: "swing",
      }
    );

    return false;
  });
})(jQuery);
//this is for send lead
function send_leads(element){
  var $form = element;
  var data = $form.serializeArray();

  data.push({
    name: "token",
    value: "OcfLGIGkoex3SDI1o2AeHTBdpwWA1usEuxf04JbiNy9uZHlbzLd6sFaI1U6Qemiy",
  });

  $.ajax({
    url: "https://academyfarda.com/leads/api/submitnew/",
    method: "POST",
    data: data,
    crossDomain: true,
    success: function (res) {
      console.log(res);

      if (res.status == "submited") {
        dwtoast($form.find(".success-message").html());

        setTimeout(function () {
          window.location.href = "./thanks.html";
        }, 2000);
      } else if (res.status == "registeration_error") {
        dwtoast($form.find(".error-registeration").html());
      } else if (res.status == "phone_number_needed") {
        dwtoast($form.find(".error-phone-number-needed").html());
      } else if (res.status == "repetitive_ phone_number") {
        dwtoast($form.find(".error-repeated-phone").html());
      } else if (res.status == "name_needed") {
        dwtoast($form.find(".error-name_needed").html());
      } else if (res.status == "unknown_error") {
        dwtoast($form.find(".error-server").html());
      } else {
        dwtoast($form.find(".error-message").html());
      }
    },
    error: function (e, v) {
      dwtoast($form.find(".error-message").html());
    },
  });
}
$("#consult-form").submit(function (e) {
  e.preventDefault();
  send_leads($(this));
});
$("#consult-form2").submit(function (e) {
  e.preventDefault();
  send_leads($(this));
});
// this is for buy course href function
function href_verify(formid) {
  var $form = $(formid);
  var url = "./verify.html?" + $form.serialize();
  console.log(url);
  window.location.href = url;
}
//prevent form default submit register forms
$("#register_form2").submit(function(e){
  e.preventDefault();
});
$("#register_form3").submit(function(e){
  e.preventDefault();
});
// validation check
$(function () {
  $("#register_form2")
    .parsley()
    .on("form:submit", function () {
      href_verify("#register_form2");
    });
});
$(function () {
  $("#register_form3")
    .parsley()
    .on("form:submit", function () {
      href_verify("#register_form3");
    });
});
//
$(window)
  .on("ready resize", function () {
    var swiper = new Swiper("#license_slide", {
      grabCursor: true,
      centeredSlides: false,
      slidesPerView: "auto",
      direction: "vertical",
      effect: "coverflow",
      coverflowEffect: {
        rotate: 0,
        stretch: 250,
        depth: 150,
        modifier: 2,
        slideShadows: true,
      },
      pagination: {
        el: ".license-slide-pagination",
        clickable: true,
      },
      breakpoints: {
        991: {
          coverflowEffect: {
            rotate: 0,
            stretch: 189,
            depth: 150,
            modifier: 2,
            slideShadows: true,
          },
        },
      },
    });

    if ($(window).width() < 560) {
      swiper.destroy();
      var swiper = new Swiper("#license_slide", {
        slidesPerView: 1,
        initialSlide: 3,
        spaceBetween: 0,
        centeredSlides: false,
        freeMode: false,
        pagination: {
          el: ".license-slide-pagination",
          clickable: true,
        },
        breakpoints: {
          991: {
            coverflowEffect: {
              rotate: 0,
              stretch: 189,
              depth: 150,
              modifier: 2,
              slideShadows: true,
            },
          },
          380: {
            coverflowEffect: {
              rotate: 0,
              stretch: 186,
            },
          },
          372: {
            coverflowEffect: {
              rotate: 0,
              stretch: 182,
            },
          },

          365: {
            coverflowEffect: {
              stretch: 180,
              depth: 150,
            },
          },
          350: {
            coverflowEffect: {
              stretch: 175,
              depth: 150,
            },
          },
          348: {
            coverflowEffect: {
              stretch: 170,
            },
          },
          333: {
            coverflowEffect: {
              stretch: 175,
            },
          },

          320: {
            direction: "horizontal",
            spaceBetween: 0,
            centeredSlides: true,
            freeMode: true,

            coverflowEffect: {},
          },
          200: {
            direction: "horizontal",
            spaceBetween: 0,
            centeredSlides: true,
            freeMode: true,

            coverflowEffect: {},
          },
        },
      });
    }
  })
  .resize();

var swiper2 = new Swiper("#picture_slide", {
  slidesPerView: 3,
  initialSlide: 3,
  spaceBetween: 0,
  centeredSlides: false,
  freeMode: false,
  loop: true,
  autoplay: {
    delay: 4000,
    disableOnIntraction: false,
  },

  navigation: {
    nextEl: ".swiper-buttons-next",
    prevEl: ".swiper-buttons-prev",
  },
  pagination: {
    el: ".pic-slide-pagination",
    clickable: true,
  },
  on: {
    init: function () {
      var $wrapper = this.$wrapperEl;

      var transform = $wrapper[0].style.transform
        .replace("translate3d", "")
        .replace("(", "")
        .replace(")", "")
        .replace(/px/g, "")
        .split(", ");

      transform[0] -= $(this.$wrapperEl).find(".swiper-slide").width() * 0.4;

      transform[0] += "px";
      transform[1] += "px";
      transform[2] += "px";

      transform = "translate3d(" + transform.join(", ") + ")";

      setTimeout(function () {
        $wrapper[0].style.transform = transform;
      }, 50);
    },
  },
  breakpoints: {
    991: {
      slidesPerView: 3,
      initialSlide: 2,
    },
    767: {
      slidesPerView: 2,
      initialSlide: 1,
    },
    520: {
      slidesPerView: 1,
      freeMode: false,
      initialSlide: 1,
    },
    200: {
      slidesPerView: 1,
      freeMode: false,
      initialSlide: 1,
    },
  },
});
var swiper3 = new Swiper("#picture_slide2", {
  slidesPerView: 3,
  initialSlide: 3,
  spaceBetween: 0,
  centeredSlides: false,
  freeMode: false,
  loop: true,
  autoplay: {
    delay: 4000,
    disableOnIntraction: false,
  },

  navigation: {
    nextEl: ".swiper-buttons-next2",
    prevEl: ".swiper-buttons-prev2",
  },
  pagination: {
    el: ".pic-slide-pagination2",
    clickable: true,
  },
  on: {
    init: function () {
      var $wrapper = this.$wrapperEl;

      var transform = $wrapper[0].style.transform
        .replace("translate3d", "")
        .replace("(", "")
        .replace(")", "")
        .replace(/px/g, "")
        .split(", ");

      transform[0] -= $(this.$wrapperEl).find(".swiper-slide").width() * 0.4;

      transform[0] += "px";
      transform[1] += "px";
      transform[2] += "px";

      transform = "translate3d(" + transform.join(", ") + ")";

      setTimeout(function () {
        $wrapper[0].style.transform = transform;
      }, 50);
    },
  },
  breakpoints: {
    991: {
      slidesPerView: 3,
      initialSlide: 2,
    },
    767: {
      slidesPerView: 2,
      initialSlide: 1,
    },
    520: {
      slidesPerView: 1,
      freeMode: false,
      initialSlide: 1,
    },
    200: {
      slidesPerView: 1,
      freeMode: false,
      initialSlide: 1,
    },
  },
});
//
// Main list tracker and activator
//
window.addEventListener("DOMContentLoaded", () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const id = entry.target.getAttribute("id");
      if (entry.intersectionRatio > 0) {
        document
          .querySelector("li a[href='#" + id + "']")
          .parentElement.classList.add("active");
      } else {
        document
          .querySelector("li a[href='#" + id + "']")
          .parentElement.classList.remove("active");
      }
    });
  });
  // Track all sections that have an `id` applied
  document.querySelectorAll("section[id]").forEach((section) => {
    observer.observe(section);
  });
});
//
//collapse icon + and - (toggle)
//
$(".accordion .card-header").on("click", function () {
  $(this).find(".collapse-icon-plus").collapse("toggle");
  $(this).find(".collapse-icon-minus").collapse("toggle");
});
//
//slide register form
//
$(document).on("click", "#img-btn", function (e) {
  e.preventDefault();
  $(this).parents("#register-form-wrap").toggleClass("s-signup");
});
$(document).on("click", ".go-to-consult-form", function (e) {
  $("#register-form-wrap").addClass("s-signup");
});
$(document).on("click", ".go-to-register-form", function (e) {
  $("#register-form-wrap").removeClass("s-signup");
});
$(document).on("click", ".go-to-consult-form-1fs", function (e) {
  $("#register-form-wrap").addClass("s-signup");
  $("#question").val(
    "می‌خواهم یک جلسه رایگان به عنوان مهمان در کلاس شرکت کنم."
  );
  $("#question").removeClass("highlight001");
  setTimeout(function () {
    $("#question").addClass("highlight001");
  }, 100);
});
//
//modal close by click on link
//
$(document).on("click", ".close-modal", function (e) {
  $("#exampleModal001").modal("hide");
});
//modal open on click on link
if (
  getBootstrapDeviceSize() == "xs" ||
  getBootstrapDeviceSize() == "sm" ||
  getBootstrapDeviceSize() == "md"
) {
  $(document).on("click", ".go-to-register-form", function (e) {
    $("#exampleModal002").modal("show");
  });
  $(document).on("click", ".go-to-consult-form-1fs", function (e) {
    $("#question2").val(
      "می‌خواهم یک جلسه رایگان به عنوان مهمان در کلاس شرکت کنم."
    );
    $("#question2").removeClass("highlight001");
    $("#exampleModal003").modal("show");
    setTimeout(function () {
      $("#question2").addClass("highlight001");
    }, 100);
  });
  $(document).on("click", ".go-to-consult-form", function (e) {
    $("#exampleModal003").modal("show");
  });
}
