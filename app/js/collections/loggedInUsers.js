var loggedInUsers = Backbone.Collection.extend({
    url:  'persons.json',
    parse: function (data) {
    	this.page = data.page;
        return data;
    }
});