var headerHeight = 0;
var footerHeight = 0;

$(document).ready(function() {
    resizeScreen();

    $(window).resize(function() {
        resizeScreen();
    });

});

function resizeScreen() {
    docHeight = $(window).height();
    docWidth = $(window).width();

    if (docHeight > docWidth) {
        $('#head').css('height', (docWidth * .14) + 'px');
        $('#foot').css('height', (docWidth * .14) + 'px');
        $('#content').css('top', (docWidth * .14) + 'px');
        $('#content').css('height', (docHeight - (docWidth * .14) - (docWidth * .14)) + 'px');
    } else {
        $('#head').css('height', '14%');
        $('#foot').css('height', '14%');
        $('#content').css('top', '14%');
        $('#content').css('height', '72%');
    }

    headerHeight = $('#head').outerHeight();
    footerHeight = $('#foot').outerHeight();

    $('body').css('font-size', (headerHeight / 4) + 'px');

    $('#head h1').css('margin-top', ((headerHeight / 2) - ($('#head h1').outerHeight() / 2)));
    $('#foot h1').css('margin-top', ((footerHeight / 2) - ($('#foot h1').outerHeight() / 2)));
}
