$(document).on('click', '[data-modal]', function(e) {
    e.preventDefault();

    var $target = $( $(this).data('modal') );

    if ($target.length) {
        window.globalmodal.setContent($target.html());
        $(document).trigger('modal_content_loaded');
        window.globalmodal.open();
    }
});