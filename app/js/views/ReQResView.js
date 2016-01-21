  var ReQResView = Backbone.View.extend({
    el: '.community-show',

    currentConversation: null,

    events: {
      "click .chatbutton": "popupChat",
      "click #message-btn": "chatMessage",
      "click #send_btn": "send_message"
    },

    initialize: function() {
      this.render();
    },

    send_message: function() {
      var that= this,sendmsg = $('textarea#message-text').val();
      sendMessage(this.currentConversation.url, sendmsg, "text/plain")
         .done(function() {
          that.displayConversations();
         })
      $('textarea#message-text').val("");
    },

    chatMessage: function(ev) {
      $('#modalLabel').html(this.model.get('communityname'));
      $('#myModal').modal('show');
      this.displayConversations();
    },

    displayConversations: function() {
      var that = this;
      var c;
      var participantIds = ["id_1", "id_2"];
      getConversations() 
        .done(function(conversations) {
          c = conversations;
          //conservations from different communties 100 -10(c90045)

          if (checkConExist(conversations, "C90045")) { //true
            communityConversations = _.filter(conversations, function(conversation) {
              return conversation.metadata.CId === "C90045";
            });
            that.currentConversation = conversations[0];
            getMessages(that.currentConversation.url)
              .done(function(messages) {
                var template5 = _.template($("#message-template").html());
                  $('#chat-messages').html(template5({
                    msgs: messages
                  }));
              });
          } else {
            console.log("conversations" + conversations);
            createConversation(participantIds)
              .done(function(conversation) {
                console.log("conversations" + conversations);
                debugger;
                setConversationMetadata(c[0].url, name, "C" + 90045)
               
                  .done(function(arguments) {
                    that.displayConversations();
                  });
              });

          }

        });

    },

    popupChat: function() {
      $('#community-chat-popup').show();
    },

    render: function() {
      var that = this;
        
      this.chats = new CommunityChats();
      this.chats.fetch({
        success: function(chatlist) {
          var template4 = _.template($("#chats-template").html());
          $('#chat-content').html(template4({
            chats: chatlist.models
          }));

          $('#chat-content').html('.close-popup');
        }
      });
        
    }

  });