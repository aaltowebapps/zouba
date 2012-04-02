var Location = Backbone.Model.extend({
    defaults: function() {
        return {
            name: "",
            address: "",
            coords: null
        };
    },

    initialize: function() {
        this.bind("change:address", function() {
            this.geocodeAddress();
        } );
    },

    geocodeAddress: function() {
        var baseUrl = "http://api.reittiopas.fi/hsl/prod/?";
        var coordSystem = "wgs84";
        var encodedURI = encodeURI( this.get("address") );
        var parameters = [
            "request=geocode",
            "user=zouba",
            "pass=caf9r3ee",
            "wgs84",
            "epsg_in="+coordSystem,
            "epsg_out="+coordSystem,
            "format=json",
            "key="+encodedURI
        ];

        var url = baseUrl+parameters.join("&");

        console.log("url:"+url);
        // works with chrome --disable-web-security, but how to make work regularly
        // replaced url with local json file to avoid unnecessary requests to server during development
        $.getJSON("../js/response.json", function(json) {
            this.set("coords", json[0].coords);
        });

        /* other attempts to work around the 
           $.get(url, function(json) {
            console.log("json:"+json);
        });
        $.ajax({
            url:        url,
            dataType:   "json",
            converters: {
                "text jsonp": function( json ) {
                    return jquery.parseJSON(json);
                }
            },
            success:    function(json){
                $("#results").text(json);
            }
        });
         */
    },

    /*
    geocodeAddressUsingWorker: function() {
                                   var worker = new Worker('geocoder.js');

                                   worker.addEventListener('message', function(e) {
                                       var noOptions = e.data.length;
                                       if ( noOptions === 1 ) {
                                           this.set("coords", e.data[0].coords);
                                       } else {
                                           // trigger UI to have user choose correct address
                                       }
                                   }, false);

                                   worker.postMessage({'cmd': 'start', 'address': address });
                               }
                               */

});
