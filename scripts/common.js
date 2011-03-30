/*
* Copyright 2011 Bazaarvoice
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied. See the License for the
* specific language governing permissions and limitations
* under the License.
*/

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
