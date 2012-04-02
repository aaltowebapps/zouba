self.addEventListener('message', function(e) {

    var geocodeAddress = function() {
	    var baseUrl: "http://api.reittiopas.fi/hsl/prod/?";
        var coordSystem = "wgs84";
        var parameters = [
            "request=geocode",
            "user=zouba",
            "pass=caf9r3ee",
            "wgs84",
            "epsg_in="+coordSystem,
            "epsg_out="+coordSystem,
            "format=json"
        ];

        var addr = baseUrl+join("&", parameters);
        $.get(addr, function(data) {
            console.log("got data:"+data);
        });
    }

    var data = e.data;
    switch (data.cmd) {
    case 'start':
        self.postMessage('WORKER STARTED: ' + data.msg);
        break;
    case 'stop':
        self.postMessage('WORKER STOPPED: ' + data.msg + '. (buttons will no longer work)');
        self.close(); // Terminates the worker.
        break;
    default:
        self.postMessage('Unknown command: ' + data.msg);
    };

}, false);
