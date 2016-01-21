var Communities = Backbone.Collection.extend({
    url: 'community',
    parse: function (data) {
    	this.page = data.page;
        return data;
    }
});