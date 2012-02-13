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

(function() {
    var cache = {};

    // javascript micro templating function - see http://ejohn.org/blog/javascript-micro-templating/
    this.tmpl = function tmpl(str, data) {
        // Figure out if we're getting a template, or if we need to
        // load the template - and be sure to cache the result.
        var fn = !/\W/.test(str) ?
                cache[str] = cache[str] ||
                        tmpl(document.getElementById(str).innerHTML) :

            // Generate a reusable function that will serve as a template
            // generator (and which will be cached).
                new Function("obj",
                        "var p=[],print=function(){p.push.apply(p,arguments);};" +

                            // Introduce the data as local variables using with(){}
                                "with(obj){p.push('" +

                            // Convert the template into pure JavaScript
                                str
                                        .replace(/[\r\t\n]/g, " ")
                                        .split("<%").join("\t")
                                        .replace(/((^|%>)[^\t]*)'/g, "$1\r")
                                        .replace(/\t=(.*?)%>/g, "',$1,'")
                                        .split("\t").join("');")
                                        .split("%>").join("p.push('")
                                        .split("\r").join("\\'")
                                + "');}return p.join('');");

        // Provide some basic currying to the user
        return data ? fn(data) : fn;
    };
})();

var ER = function() {
    return {
        review_data : [],
        placemarks : [],
        ge : null,
        interval : null,
        cur_review : 0,
        template_fn : null,
        fullScreenState : false,
        noFullScreenIcon : null,
        fullScreenIcon : null,

        initialize : function() {
            ER.template_fn = tmpl("review_template");

            google.earth.createInstance('content', ER.initialize_map, ER.initialize_failure);
        },

        initialize_map : function(instance) {
            ER.ge = instance;
            ER.ge.getOptions().setStatusBarVisibility(false);
            ER.ge.getOptions().setOverviewMapVisibility(false);
            ER.ge.getWindow().setVisibility(true);
            ER.ge.getSun().setVisibility(false);
            ER.ge.getOptions().setMouseNavigationEnabled(false);
            ER.ge.getLayerRoot().enableLayerById(ER.ge.LAYER_BORDERS, true);
            ER.ge.getLayerRoot().enableLayerById(ER.ge.LAYER_ROADS, true);

            google.earth.addEventListener(ER.ge.getWindow(), "click", ER.handleMouseClick);

            ER.load_data(true);
        },

        handleMouseClick : function(event) {
            var INSET_PIXELS_X = document.getElementById("content").offsetWidth - event.getClientX();
            var INSET_PIXELS_Y = event.getClientY();
            if (INSET_PIXELS_X < 32) {
                if (INSET_PIXELS_Y < 32) {
                    ER.toggleFullScreen();
                }
            }
        },

        toggleFullScreen : function() {
            if (ER.fullScreenState === true) {
                ER.makeNormalScreen();
            } else {
                ER.makeFullScreen();
            }
        },

        makeFullScreen : function() {
            var samplecontainer = document.getElementById('fullscreencontainer');
            var container = document.getElementById('content');
            var optsize = Math.min(samplecontainer.offsetWidth, samplecontainer.offsetHeight);
            container.style.left = (samplecontainer.offsetWidth - optsize) / 2;
            container.style.top = (samplecontainer.offsetHeight - optsize) / 2;
            container.style.width = optsize + 'px';
            container.style.height = optsize + 'px';
            ER.fullScreenState = true;
            ER.noFullScreenIcon.setVisibility(ER.fullScreenState);
            ER.fullScreenIcon.setVisibility(!ER.fullScreenState);
        },

        makeNormalScreen : function() {
            var samplecontainer = document.getElementById('sizecontainer');
            var container = document.getElementById('content');
            container.style.left = samplecontainer.style.left;
            container.style.top = samplecontainer.style.top;
            container.style.width = samplecontainer.offsetWidth + 'px';
            container.style.height = samplecontainer.offsetHeight + 'px';
            ER.fullScreenState = false;
            ER.noFullScreenIcon.setVisibility(ER.fullScreenState);
            ER.fullScreenIcon.setVisibility(!ER.fullScreenState);
        },

        initialize_failure : function(errorCode) {
            alert("could not initialize map " + errorCode);
        },

        zoom_to_review : function(review, index) {
            ER.ge.getOptions().setFlyToSpeed(0.1);
            if (!review || !review.location) {
                return;
            }
            var lat = parseFloat(review.location.Latitude);
            var lon = parseFloat(review.location.Longitude);
            var lookAt = ER.ge.createLookAt('');
            var altitude = 8000000;
            if (Math.random() <= 0.10) {
                // small chance to zoom in
                altitude = 200;
                ER.ge.getOptions().setFlyToSpeed(0.35);
                // ER.interval = setInterval(ER.cycle_review_display, 30000);
            }
            lookAt.set(lat, lon, 10, ER.ge.ALTITUDE_RELATIVE_TO_GROUND, 0, 10, altitude);
            ER.ge.getView().setAbstractView(lookAt);

            if (review.Title) {
                review.Title = review.Title.substring(0, 100);
            } else {
                review.Title = 'N/A';
            }

            if (review.ReviewText) {
                review.ReviewText = review.ReviewText.substring(0, 100);
            } else {
                review.ReviewText = 'N/A';
            }

            if (!review.author) {
                review.author = "Anonymous"
            }

            if (!review.location.City) {
                review.location.City = 'Unknown city';
            }

            var bubbleHTML;
            var wsize = Math.min(window.innerWidth, window.innerHeight) * .4;
            review.width = wsize;
            bubbleHTML = ER.template_fn(review);

            var b = ER.ge.createHtmlStringBalloon('');
            b.setCloseButtonEnabled(false);
            b.setBackgroundColor('#111111');
            b.setForegroundColor('#ffffff');
            b.setFeature(ER.placemarks[index]);
            b.setContentString(bubbleHTML);
            ER.ge.setBalloon(b);
        },

        cycle_review_display : function () {
            ER.zoom_to_review(ER.review_data[ER.cur_review], ER.cur_review);
            if ((ER.cur_review + 1) == ER.review_data.length) {
                ER.clear_data();
                ER.load_data(false);
                ER.cur_review = 0;
            }
            else {
                ER.cur_review = (ER.cur_review + 1) % ER.review_data.length;
            }
        },

        display_on_map : function(data) {
            ER.review_data = data;
            $.each(data, function(i, val) {
                
                if (!this.location) {
                    return;
                }
                
                // Create the placemark
                var placemark = ER.ge.createPlacemark('');
                placemark.setName(this.location.FormattedAddress);
                var reviewtext = this.ReviewText;
                if (reviewtext) {
                    reviewtext = reviewtext.substring(0, 100);
                } else {
                    reviewtext = '';
                }

                // Set the placemark's location.
                var point = ER.ge.createPoint('');
                var lat = parseFloat(this.location.Latitude);
                var lon = parseFloat(this.location.Longitude);
                point.setLatitude(lat);
                point.setLongitude(lon);
                placemark.setGeometry(point);

                var icon = ER.ge.createIcon('');
                icon.setHref('https://s3.amazonaws.com/bv_earth/star' + this.Rating + '.png');
                var style = ER.ge.createStyle('');
                style.getIconStyle().setIcon(icon);
                style.getIconStyle().setScale(4);
                placemark.setStyleSelector(style);

                // Add the placemark to Earth.
                ER.ge.getFeatures().appendChild(placemark);
                ER.placemarks[i] = placemark;

                this.placemark = placemark;
            });
        },

        clear_data : function() {
            var firstChild;

            while (ER.ge.getFeatures().getChildNodes().getLength() > 100) {

                firstChild = ER.ge.getFeatures().getFirstChild();

                if (firstChild !== null) {
                    ER.ge.getFeatures().removeChild(firstChild);
                }
            }
        },

        get_location : function(review) {
            // gets geolocation data by IP address using Infochimps API
            $.getJSON(
                    'http://api.infochimps.com/web/an/de/geo.json?callback=?', {
                        ip: review.IPAddress,
                        apikey: 'YOUR_INFOCHIMPS_API_KEY'
                    },
                    function(response) {
                        var addy = (response.city ? response.city + ', ' : '');
                        addy += (response.region ? response.region + ' ' : '');
                        addy += (response.country ? response.country : '');

                        review.location = {
                            FormattedAddress: addy,
                            Latitude: response.lat,
                            Longitude: response.longitude  
                        };
                    }); 
        },

        load_data : function(firstLoad) {
            // load recent reviews using Bazaarvoice API
            $.getJSON('http://YOUR_BAZAARVOICE_HOSTNAME/data/reviews.json?callback=?', {
                        apiversion: '5.1',
                        passkey: 'YOUR_BAZAARVOICE_API_KEY',
                        sort: 'submissiontime:desc',
                        include: 'products,authors',
                        limit: '25'                        
                    },
                    function(response) {
                        reviews = [];
                        for (var i = 0; i < response.Results.length; i++) {
                            var review = response.Results[i];
                            if (response.Includes.Authors) {
                                review.author = response.Includes.Authors[review.AuthorId];
                            }
                            review.product = response.Includes.Products[review.ProductId];
                            review.date = new Date(review.SubmissionTime).toTimeString();

                            // get reviewer location only if there is some geocodable attribute
                            if (review.IPAddress) {
                                
                                ER.get_location(review)
                                reviews.push(review);

                            }
                            
                        }

                        setTimeout('ER.display_on_map(reviews)', 5000);

                        if (firstLoad) {
                            ER.interval = setInterval(ER.cycle_review_display, 15000);
                        }
                    }
                );
        }
    };
}();
