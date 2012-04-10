/*
 * location unit tests
 */

(function ($) {

    $.mobile.defaultTransition = "none";

    module("Location");

    asyncTest("Constructor sets values", function () {
        var pageId = '#location-constructor-sets-values';

        $.testHelper.pageSequence([

            function () {
                $.testHelper.openPage( pageId );
            },

            function () {
                var latLong = {
                    "latitude": "12.345",
                    "longitude": "23.456"
                };
                locationFactory.getLocation = function( address ) {
                    return latLong;
                };
                var success = function( location ) {
                    equal(station.latitude, latLong.latitude, "latitude ok");
                    equal(station.longitude, latLong.longitude, "longitude ok");

                    start();
                };

                var failure = function() {
                };

                var station = locationFactory.newLocation( "Station", "Central Railway Station, Helsinki", success, failure );

            }
        ]);
    });

})(jQuery);
