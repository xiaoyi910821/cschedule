var TaskHelpers = Backbone.Collection.extend({
    url: 'community/30001/taskhelper',
    parse: function (data) {
    	this.page = data.page;
        return data;
    }
});