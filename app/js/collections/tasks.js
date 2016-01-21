var Tasks = Backbone.Collection.extend({
    url: 'community/30001/event',
    parse: function (data) {
    	this.page = data.page;
        return data;
    }
});