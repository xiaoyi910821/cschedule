var CommunityChats = Backbone.Collection.extend({
    url: 'chats.json',
    parse: function (data) {
    	this.page = data.page;
        return data;
    }
});