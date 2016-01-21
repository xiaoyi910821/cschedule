

// http://myapp.com/javascripts/jst.js
//var window;

window.JST = {};

window.JST['person/contact'] = _.template(
    "<div class='contact'><%= name %> ..."
);

window.JST['person/edit'] = _.template(
    "<form method='post'><input type..."
);


window.JST['community/list'] = _.template(
      '<% _.each(communities, function(community) { %>'
    + '			<div class="community" data-id="<%=community.get("id")%>"> '
    + '				<div id="community-name" contenteditable="true">'
    + '                 <%=  htmlEncode(community.get("communityname")) %> </div>'
    + '			</div>'
    + '		<% }); %>'
);


/*


		<script type="text/template" id="community-dropdown-template">
			<% _.each(communities, function(community) { %>
				<li><a href="#">"<%= htmlEncode(community.get('communityname')) %>" </a></li>
				<% }); %>
			<button  class="create-community-dropdown-btn" type="button" > + Create New Community</button>
		</script> 
*/



var CommunityListView = Backbone.View.extend({

      el: '.community-list-view',

      events: {
        "dblclick .community": 'deleteCommunity',
        "click .community": 'viewCommunity',
        "click .community-name": 'onEditCommunity',
        //"blur .community-name": 
        "click .create-btn": 'showCreateCommunity',
        "click .btn-create": 'createNewCommunity',
        "click .btn-edit-cancel": "hideEditCommunity",
        "click .cancel-create": "hideCreate",
         "click .page": "showPage",
      },

      initialize: function() {
        // _.bindAll(this);
        this.render();
      },
      showPage: function() {
        $('.page').show();

      },

    
      deleteCommunity: function(ev) {
        var that = this;
        alert("Are you sure you want to deleteCommunity");

        var communityId = ev.target.getAttribute('data-id');  // ev.target.data('id')
        communities = that.collection.where({
          "id": communityId
        });
        console.info(that.collection.toJSON());
        communities[0].destroy({
          success: function() {
            alert("you have  deleted community");

          },
          error: function(model, response) {

            alert("Error in deleting Community " + response.statusText);
          }

        });
        var deletedcommunity = that.collection.remove(communities[0]);

        console.info(this.collection.toJSON());
        alert('you have deleted ' + name);
        this.render();

      },



      viewCommunity: function(ev) {
        var communityView,
          communityId = ev.target.getAttribute('data-id'),
          communities = this.collection.where({
            "id": communityId
          });

        communityView = new CommunityView({
          model: communities[0]
        });

        communityView.render();

        // var eventView =  new EventsView();

        // eventView.render();
        


        //Test code for Events parsing
        var eventsC = new EventsC();
        eventsC.fetch({
          success: function(events) {
              var taskm, assignmentm, tasksC, assignmentC;
              //parsing events to approximate collections(taks assignees)
              
              _.each(events.models, function(event){
                  event.tasks = [];
                  _.each(event.get("task"), function(taskAttributes){
                      taskm = new Task(taskAttributes);
                      taskm.set("event-id",event.get("eventid"));
                      taskm.assignees = [];
                      _.each(taskAttributes.assignment, function(assignmentAttr){
                          // assignmentm = new AssignesM(assignmentAttr);
                          // assignmentm.set("task-id", taskm.get("taskid"));
                          // taskm.assignees.push(assignmentm);
                       }); //end of assignees
                       event.tasks.push(taskm);
                  });//end of taks
              });//end of events

            
            //code to be used in view
            
          }
        });

        //Test code for Events parsing
        
      },

      createNewCommunity: function() {
          
          //WFB
        var communitynamesArray = this.collection.pluck("communityname"),
         
          communityName = $('#input').val(),
          community;

        if ( _.contains(communitynamesArray, communityName)) {
          alert("Enter valid community name,Community name already Exists");
        } else {
          community = new Community({
            ownerid: gLoginUser.ownerid, // same as login user id
            communityname: $('#input').val(),

            desp: "test communityname",
            communityid: 90045

          });

          community.save({}, {
            success: function() {
              alert("you have successfully created community");
              $('.createCommunity').hide();
            },
            error: function(model, response) {

              alert("Error in creatiing Community " + response.statusText);
            }
          });
        }
        $('.createCommunity').hide();
      },
      hideCreate: function() {
        $('.createCommunity').hide();
        $('.create-btn').show();

      },

      showCreateCommunity: function(ev) {

        $('.createCommunity').show();
        $('.create-btn').hide();
      },

      onEditCommunity: function(ev) {

        ev.stopPropagation();
        // var communitynamesArray = this.collection.pluck("communityname");
        // var communityId = ev.target.parentElement.getAttribute('data-id');
        // communities = this.collection.where({
        //   "id": communityId
        // });

        // var communityEditView = new CommunityEditView({
        //   model: communities[0]
        // });

        // communityEditView.render(communitynamesArray);
        
      },
      
      hideEditCommunity: function() {
        $('.editCommunity').hide();

      },

      render: function() {

        var that = this;
        this.chats = new CommunityChats();
        this.chats.fetch({

          success: function(chatlist) {
            var template4 = _.template($("#chats-template").html());
            $('.popup').html(template4({
              chats: chatlist.models
            }));
          }


        });

        this.users = new loggedInUsers();
        this.users.fetch({
          success: function(users) {
            
            $("#gUser-diplay").append("Cyndi"); //= gLoginUserName;
            var template3 = _.template($("#users-dropdown-template").html());
            $("#users-drop-down").html(template3({
              loggedInUsers: users.models
            }));
          }
        });

          
          
        this.collection = new Communities();

        this.collection.fetch({

          data: $.param({
            ownerid: gLoginUser.ownerid   //user id 
          }),
          success: function(communityList) {

            //var template1 = _.template($('#community-list-template').html());
            //var template2 = _.template($("#community-dropdown-template").html());

              
//var html = JST['person/edit']();

//var dict = { name: "Jason", email: "j.smith@gmail.com" };
              var template1 = JST['community/list']; //(dict);
              
              
            $(".nav-body").html(template1({
              communities: that.collection.models
            }));
              /* WFB
            $("#community-drop-down").html(template2({
              communities: that.collection.models
            }));
            */
          }
        })
        
      },


    });