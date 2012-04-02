var Location = Backbone.Model.extend({
    defaults: function() {
        return {
            name: "",
            address: "",
            latitude: null,
            longitude: null
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
        /*$.get(url, function(text) {
            console.log("text:"+text);
        });*/
        $.ajax({
            url:        url,
            dataType:   "jsonp",
            converters: {
                "text jsonp": function( text ) {
                    return jquery.parseJSON(text);
                }
            },
            success:    function(data){
                $("#results").text(json);
            }
        });
    },

    geocodeAddressUsingWorker: function() {
                                   var worker = new Worker('geocoder.js');

                                   worker.addEventListener('message', function(e) {
                                       var noOptions = e.data.length;
                                       if ( noOptions === 1 ) {
                                           this.set("latitude", e.data[0].latitude);
                                           this.set("longitude", e.data[0].longitude);
                                       } else {
                                           // trigger UI to have user choose correct address
                                       }
                                   }, false);

                                   worker.postMessage({'cmd': 'start', 'address': address });
                               }

});
