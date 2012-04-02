(function() {
    $(document).ready(function () {
        var locations = new LocationsModel();

        var locationsView = new LocationsView({collection: locations});

        locations.create({
            "name": "work",
            "address": "westeninkatu 7, espoo"
        }, {at: 0});
    });
}());

