var TaskHelper = Backbone.Model.extend({
    //url: 'schedules/1070068/onduty/1070000'
    urlRoot: 'taskhelper'
});

var TaskHelpers = Backbone.Collection.extend({

    model: TaskHelper,
    //url: 'taskhelper',  // 'schedules/1070068/onduty/1070000',

    parse: function(resp, xhr) {
        return resp.apgroup[0].member;
    }
});



var PoolMember = Backbone.Model.extend();

var PoolMembers = Backbone.Collection.extend({

    model: PoolMember,

    url: 'task/30001/assignmentpool',


    parse: function(resp, xhr) {
        return resp.apgroup[0].member;
    }
});




var BaseEvent = Backbone.Model.extend();

var BaseEvents = Backbone.Collection.extend({

    model: BaseEvent,
});




var Event = Backbone.Model.extend();

var Events = Backbone.Collection.extend({

    model: Event,

    url: 'community/30001/event',
    //url: 'getevents.json',




    // **parse** converts a response into a list of models to be added to the
    // collection. The default implementation is just to pass it through.
    parse: function(resp, xhr) {



        function getAssignees(taskID, taskAssignees, numNeeded) {
            var names = "";
            var nameLen = 0;
            
            taskAssignees.forEach(function(name) {
                var curUser = gParticipants.where({
                  "id": name.userid
                }); 
                
                if (nameLen < 1 && name.username.length > 7) {
                    names += '<div style="float:left;   text-align: center;"><div><img src=".\\images\\' 
                        + name.username + '.png"  height="32" width="32"></div><div>' + name.username + '</div></div>';
                } else {
                    names += '<div style="float:left; margin-left:10px; text-align: center;"><div><img class="assigneeImg" src="' 
                    + name.userprofile + '"></div><div>' + name.username + '</div></div>';
                }
                nameLen = name.username.length;
            });

            for (var i=taskAssignees.length; i < numNeeded; i++) {
                names += '<div class="poolIcon" task-id="' + taskID * 1.0 
                    + '" style="float:left; margin-left:10px;text-align: center; color: lightgray;">' 
                    + '<div><img src=".\\images\\needed.png" height="32" width="32"></div><div>need</div></div>';
            }
            /*
            names += '<div class="poolIcon" task-id="' + taskID * 1.0 
            + '" style=" right: 3px; position: absolute; text-align: center; color: lightgray;">' 
            + '<div><img src=".\\images\\poolIcon.png" height="32" width="32"></div><div>pool</div></div>';
            */
            names += '<div style="clear:both"></div>';
            return names;
        }


        var evAry = [];
        var evsC = resp.event;
        
        this.add(evsC[30001][0]);
        this.add(evsC[30001][1]);

        var events = {
            events: [ // put the array in the `events` property
                {
                    title: 'event1',
                    start: '2015-05-02'
                }, {
                    title: 'event2',
                    start: '2015-05-02',
                    end: '2015-05-04'
                }, {
                    title: 'event3',
                    start: '2015-05-04T12:30:00',
                }
            ],
            color: 'black', // an option!
            textColor: 'yellow' // an option!
        };



        var eventsC = {
            events: [],
            color: 'white', // an option!
            textColor: 'black' // an option!
        };

        var eventID = 30001;
        var evsC = evsC[eventID];
        
        
        //parsing events to approximate collections(task assignees)
        
        var taskm, assignmentm, tasksC, assignmentC;
        gEvents = []; gTasks = []; gTaskAssignees = []; gTaskHelpers = [];

          _.each(evsC, function(event){
              gEvents.push(event);
              _.each(event.task, function(taskAttributes){
                  taskAttributes.eventid = event.eventid;
                  taskm = new Task(taskAttributes);
                  gTasks.push(taskm);
                  _.each(taskAttributes.taskhelper, function(assignmentAttr){
                      assignmentAttr.taskid = taskm.get('taskid');
                      assignmentAttr.eventid = event.eventid;
                      assignmentm = new TaskHelper(assignmentAttr);
                      gTaskAssignees.push(assignmentm);
                      
                      // taskm.assignees.push(assignmentm);
                   }); //end of assignees
                   // event.tasks.push(taskm);
              });//end of taks
          });//end of events


        
        var assignNames = "";

        
        for (var dayIdx = 0; dayIdx < evsC.length; dayIdx++) {

            assignNames = "";
            for (var taskIdx = 0; taskIdx < evsC[dayIdx].task.length; taskIdx++) {
                var taskID = evsC[dayIdx].task[taskIdx].taskid;
                var  numNeeded = evsC[dayIdx].task[taskIdx].assignallowed;
                assignNames += '<div class="taskAssignees" data-taskid="' + taskID
                                + '" style="margin-top:10px;">' 
                    + getAssignees(taskID, evsC[dayIdx].task[taskIdx].taskhelper, numNeeded) + '</div>';
            }

            var newEv = {
                title: assignNames, //'Group ' + getAssignees(evsC[dayIdx].task[0].assignment),
                start: evsC[dayIdx].startdatetime
            };
            eventsC.events.push(newEv);




            if ($(".addtaskbtn").length === 0) {
                var eventNm = evsC[dayIdx].eventname; //this.collection[0].eventname;
                var times = evsC[dayIdx].startdatetime.split(' ')[1].split(':');
                var eventTime = times[dayIdx] + ':' + times[1];

                var tasks = evsC[dayIdx].task;


                //WFB $('#event1_title').append('<div  contenteditable="true"  style="margin-top:10px;">' + eventNm + '  ' + eventTime + '</div>');
                $('#event1_title').append('<button class="addtaskbtn" data-eventid="' + eventID + '">+ task</button>');


                for (taskid = 0; taskid < tasks.length; taskid++) {
                    
                    if (taskid === 0)
                    $('#event1_title').append('<div id="event_task' + taskid + '" class="taskname" data-taskid="' + taskid + '" contenteditable="false">' + tasks[taskid].taskname 
                                              + '</div>');
                    else
                    $('#event1_title').append('<div class="taskname"  data-taskid="' + taskid + '" contenteditable="false">'  + tasks[taskid].taskname 
                                              + '<span style="margin-left:6px;" class="numcircle">' + taskid + '</span></div>');
                }
                $('.taskname').click( function(fcEvent, jsEvent, view) {
                    var helpersPoolView = new HelpersPoolView( {'poolID' : $(fcEvent.toElement).data('taskid')} );
                    helpersPoolView.render();
                });
            }

        }
        //$('#event1_title').   

        //Object {color: "black", textColor: "yellow", events: Array[1]}
        // eventsC.events[0]

        // Object {title: "300011", start: "2015-03-06 20:30:00"}



        //Object {events: Array[3], color: "black", textColor: "yellow"}
        //Object {title: "event1", start: "2015-05-02"}

        return eventsC; //[evAry[0]]  ;
        //return evsC; //[evAry[0]]  ;
    },
});


/*
$('#calendar').fullCalendar({
    eventSources: [
        // your event source
        {
            events: [ // put the array in the `events` property
                {
                    title  : 'event1',
                    start  : '2015-05-02'
                },
                {
                    title  : 'event2',
                    start  : '2015-05-02',
                    end    : '2015-05-04'
                },
                {
                    title  : 'event3',
                    start  : '2015-05-04T12:30:00',
                }
            ],
            color: 'black',     // an option!
            textColor: 'yellow' // an option!
        }
        // any other event sources...
    ]
});
*/




var HelpersPoolView = Backbone.View.extend({

    //el: "#floatDiv",
    //el: "#helperpool",
    collection: PoolMembers,

    initialize: function() {

        /*
        _.bindAll(this);
        this.helpersPoolView = new HelpersPoolView();
        */
    },

    events : {
        //'click #closeHelpers' : 'closeHelpersBox'
    },

    closeHelpersBox: function(ev) {
        var helpersDiv = $("#floatDiv").hide();
        helpersDiv.find(".helperPoolLI").remove();

    },

    render: function() {
        
      //$('#taskHelperLabel').html('Kitchen'); //WFB this.model.get('communityname'));
      //$('#helperpool').modal('show');
        
        
        
      
        
        // var poolID = $(jsEvent.toElement).closest(".poolIcon").attr('task-id');

        var pool = new PoolMembers();
        pool.fetch({ //EventList().fetch({
            /*
            data: {
              from: start.getTime(),
              to: end.getTime()
            },
            One important adjustment, I had to convert the moment object to a 
            Javascript date object to get the getTime() function to work.
            data: {
            from: start.toDate().getTime(),
            to: end.toDate().getTime()
            }, //data
            */
            success: function(eventList) {
                events = [];
                
                
                var helpers_overlay = $("<div id='helpers_pool' style='margin-top: 146px; width: 280px;'>");
                $("#eventView").append(helpers_overlay);
                
                var top_arrow = $("<div class='arrow-up' style='margin-left: 30px'></div>");
                $("#helpers_pool").append( top_arrow );

                var popup_helpers = $("<div id='helper_pool0' style='padding-top: 18px; padding-bottom: 8px; background: black;'>");
                $("#helpers_pool").append(popup_helpers);
                
                events = _.map(eventList.models, function(event) {
                    var title = event.attributes.username;
                    var pic = event.attributes.userprofile;
                    var id = event.attributes.userid;

                    var personDiv = $("<div data-id='" + id + "' class='helperPoolLI' style='display:inline-block; z-index:9000; margin-left:8px; margin-right:8px;'>");

                    personDiv.append("<img class='helperPoolImg' src='" + pic + "'>");
                    personDiv.append("<div style='color:white; text-align: center'>" + title);
                    if (title === 'Irene')
                        personDiv.append("<div style='color: goldenrod;'>after July");
                    personDiv.draggable();
                    //$("#floatDiv").append(personDiv);
                    //$("#helperpool").append(personDiv);
                    
                    $("#helper_pool0").append(personDiv);
                    
                    

                    //return newEv;
                    



/*
                  $('#helperpool').dialog({
                        draggable: true,
                        resizable: true,
                        show: 'fade',
                        hide: 'fade',
                        modal: false,
                        width:  400,
                        height: 150,
                      //overflow: 'visible',
                        title: 'Ride Service helpers',
                        //buttons: buttons,
                        //open: this.open
                    });
                    
                    $('.ui-dialog').css('overflow','visible');
*/                    
                });
                // WFB  $("#floatDiv").show();
            }
        });

        //this.eventView.model = this.collection.get(fcEvent.id);
        //this.eventView.render();
    }
});




var EventsView = Backbone.View.extend({

    //el: '#calendar',
    //collection: events,

    initialize: function() {
        //_.bindAll(this);

        this.collection.bind('reset', this.addAll);
        this.collection.bind('add', this.addOne);
        this.collection.bind('change', this.change);
        this.collection.bind('addToTask', this.addToTask);
        this.collection.bind('destroy', this.destroy);

        this.eventView = new EventView();
    },

    events : {
        'dragenter .droparea' : 'tellDrop',
            'dragenter .droparea' : 'highlightDropZone',
            'dragleave .droparea' : 'unhighlightDropZone',
        'click .numcircle' : 'viewMessaging',
        'click #eventName' : 'editEventName'
    },
    editEventName : function() {
        alert('hi');
    },

    viewMessaging : function() {
        
      this.chats = new CommunityChats();
      this.chats.fetch({
        success: function(chatlist) {
          var template4 = _.template($("#chats-template").html());
          $('#chat-content').html(template4({
            chats: chatlist.models
          }));

          $('#chat-content').html('.close-popup');
          $('#community-chat-popup').show();
        }
      });
    },
    
    
    tellDrop : function(){alert("DROPPED!")},

    highlightDropZone: function(e) {
        e.preventDefault();
        //$(e.currentTarget).addClass('item-drop-zone-highlight')
    },

    unhighlightDropZone: function(e) {
        //$(e.currentTarget).removeClass('item-drop-zone-highlight')
    },

    render: function() {
        $(this.el).fullCalendar({
            header: {
                left: 'prev,next,today',
                center: 'title',
                right: 'members' //WFB 'alldays,month,basicWeek,basicDay,members'
            },

            columnFormat: 'dddd MMM D',
            timeFormat: '',

            views: {
                alldays: {
                    type: 'month',
                    duration: {
                        days: 30
                    },
                    hiddenDays: [],
                    buttonText: 'calender',

                    aspectRatio: 1.2,
                    fixedWeekCount: true
                },
                members: {
                    type: 'month',
                    duration: {
                        days: 30
                    },
                    hiddenDays: [],
                    buttonText: '<Show all members',

                    aspectRatio: 1.2,
                    fixedWeekCount: true
                }
            },

            selectable:     true,
            selectHelper:   true,
            editable:       true,
            ignoreTimezone: false,

            select:      this.select,
            eventClick:  this.eventClick,
            eventDrop:   this.eventDropOrResize,
            eventResize: this.eventDropOrResize,

            hiddenDays:     [0, 1, 2, 3, 4, 5],
            aspectRatio:    4.1,
            fixedWeekCount: false,

            droppable: true,
            /*
            drop: function(date, jsEvent, ui ) {
                var droppedID = $(this).data('id');
                this.addToTask(date);
            },
            */



            eventSources: [ {// your event source
                color:     'white',
                textColor: 'black',

                events: function(start, end, timezone, callback) {
                    gFetchedEvents = new Events();
                    gFetchedEvents.fetch({ //EventList().fetch({
                        /*
                        data: {
                          from: start.getTime(),
                          to: end.getTime()
                        },
                        */
                        success: function(collection, response, options) {
                            events = []
                            events = _.map(collection.models[0].attributes.events, function(event) {
                                var newEv = {
                                    title: event.title, //get("title"),
                                    start: new Date(event.start),
                                    //end: new Date(event.get("end")),
                                    //url: event.get("url")
                                };
                                //newEv.title = event.attributes.events[0].title;
                                //newEv.start = event.attributes.events[0].start;
                                return newEv;
                            });

                            callback(events);

                            $('.numcircle').click( function(){
                                //alert(event)
                                gEventsView.viewMessaging();
                            } );

                            $(".taskAssignees").droppable({
                                  drop: function( event, ui ) {
                                      // this is the elem receiving the dropped ui.draggable elem
                                    var newHelperID = ui.draggable.data('id');
                                    var taskID =$(this).data('taskid');

                                var taskHelper = new TaskHelper({
                                    'taskhelperid' : 100013,
                                    'eventid': 30001,
                                    'ownerid': '3',
                                    'taskid': taskID,
                                    'userid': '125', //newHelperID
                                    'status': 'A'
                                                    //'add': [newHelperID]
                                });              

                                taskHelper.save();
                                }
                            });
                        }
                    })
                }
            }]  //eventSources
        });


        $(".taskAssignees").droppable({
              drop: function( event, ui ) {
                alert( "Dropped!" );
              }
        });
        

        /*
        renderCalendar: ->
              @.$("#calendar").fullCalendar({
                header: {
                  left: 'prev,next today'
                  center: 'title'
                  right: 'month,basicWeek,basicDay'
                }
                allDayDefault: false
                editable: false
                events: (start, end, callback) ->
                  new EventList().fetch({
                    data: {
                      from: start.getTime()
                      to: end.getTime()
                    }
                    success: (eventList) ->
                      events = []
                      events = _.map(eventList.models, (event) -> {
                        title: event.get("title")
                        start: new Date(event.get("start"))
                        end: new Date(event.get("end"))
                        url: event.get("url")
                      })
                      callback(events)
                  })
              })
        */



    },

    addAll: function() {
        //WFB this.el.fullCalendar('addEventSource', this.collection.toJSON())
        // CHANGED TO USE EVENT FUNCTION this.el.fullCalendar('addEventSource', this.collection.toJSON()[0]);
    },

    addOne: function(event) {
        this.el.fullCalendar('renderEvent', event.toJSON());
    },


    addToTask: function(eventDate) {
        var personID = (this).data('id');
        var taskHelpers = new TaskHelpers();
        var taskHelper = new TaskHelper({id: personID});
        taskHelpers.add(taskHelper);
        taskHelpers.save();
    },



/*
$url = 'http://apitest1.servicescheduler.net/schedules/1070068/onduty/1070000';    
$method = 'PUT';
    // Please change the data before executing it in the test1 environment
    // "add" ---- assign participants to the task
// "delete"   delete participants from the task
$data = json_encode(array(
    'ownerid'=> '107',
    'eventid' => '300011',
        'add' => array(235, 236),
    'delete' => array(234)
    )       
);
*/
    select: function(startDate, endDate) {
        this.eventView.collection = this.collection;
        this.eventView.model = new Event({
            start: startDate,
            end: endDate
        });
        this.eventView.render();
    },


    eventClick: function(fcEvent, jsEvent, view) {
        var helpersPoolView = new HelpersPoolView( {'poolID' : $(jsEvent.toElement).closest(".poolIcon").attr('task-id')} );
        helpersPoolView.render();
    },

    change: function(event) {
        // Look up the underlying event in the calendar and update its details from the model
        var fcEvent = this.el.fullCalendar('clientEvents', event.get('id'))[0];
        fcEvent.title = event.get('title');
        fcEvent.color = event.get('color');
        this.el.fullCalendar('updateEvent', fcEvent);
    },
    eventDropOrResize: function(fcEvent) {
        // Lookup the model that has the ID of the event and update its attributes
        this.collection.get(fcEvent.id).save({
            start: fcEvent.start,
            end: fcEvent.end
        });
    },
    destroy: function(event) {
        this.el.fullCalendar('removeEvents', event.id);
    }
});

//window.JST = {};

window.JST['eventView'] = _.template(
    "<span id='eventName' data-id='30002'><%= event.get('eventname') %></span>" + 
    "<span class='glyphicon glyphicon-time'></span>" + 
    "<span id='eventTime' data-id='30002'><%= event.get('startdatetime') %> to <%= event.get('enddatetime') %></span>" +
    "<span class='glyphicon glyphicon-retweet'></span>" + 
    "<span id='eventRepeat' data-id='30002'>Every Saturday</span>" + 
    "<span class='glyphicon glyphicon-map-marker'></span>" + 
    "<span id='eventLocation' data-id='30002'><%= event.get('location') %></span>" + 
    "<span class='glyphicon glyphicon-user'></span>" +
    "<span id='eventHost' data-id='30002'><%= event.get('host') %></span>"
);


var EventView = Backbone.View.extend({
    el: $('#eventView'),
    events : {
        'click #eventName' : 'editEventName',

        'click #eventTime' : 'editEventTime',
        'click #eventRepeat' : 'editEventRepeat',

        'click #eventLocation' : 'editEventLocation',
        'click #eventHost' : 'editEventHost'
    },

    editEventName : function(ev) {

        var buttons = {
            'Save': this.save,
            'Cancel': function () {
                $(this).dialog('close');
            }
        };

        $('#editEventName').dialog({
            resizable: false,
            modal: false,
            title: 'Edit Event Name',
            buttons: buttons,
            open: this.open
        });
    },


    editEventTime : function(ev) {
        // var eventId = ev.target.getAttribute('data-id');
        // this.event = communityEvents.where({
        //     "id": eventId
        // });

        var buttons = {
            'Save': this.save,
            'Cancel': function () {
                $(this).dialog('close');
            }
        };

        $( "#editEventStartDTFLD, #editEventEndDTFLD" ).datetimepicker({
            format: 'Y-m-d H:i',
            step: 30
        });


        $('#editEventTime').dialog({
            resizable: false,
            modal: false,
            title: 'Edit Event Time',
            buttons: buttons,
            open: this.open,
            width: 450
        });
    },

    editEventRepeat : function(ev) {
        // var eventId = ev.target.getAttribute('data-id');
        // this.event = communityEvents.where({
        //     "id": eventId
        // });

        var buttons = {
            'Save': this.save,
            'Cancel': function () {
                $(this).dialog('close');
            }
        };

        $( "#editEventRU" ).datepicker({
            changeMonth: true,
            changeYear: true
        });


        $('#editEventRepeat').dialog({
            resizable: false,
            modal: false,
            title: 'Edit Repeating Settings',
            buttons: buttons,
            open: this.open,
            width: 450
        });
    },

    editEventLocation : function(ev) {

        var buttons = {
            'Save': this.save,
            'Cancel': function () {
                $(this).dialog('close');
            }
        };

        $('#editEventLocation').dialog({
            resizable: false,
            modal: false,
            title: 'Edit Event Location',
            buttons: buttons,
            open: this.open,
            width: 400
        });
    },

    editEventHost : function(ev) {    

        var buttons = {
            'Save': this.save,
            'Cancel': function () {
                $(this).dialog('close');
            }
        };

        $('#editEventHost').dialog({
            resizable: false,
            modal: false,
            title: 'Edit Event Host',
            buttons: buttons,
            open: this.open
        });
        return this;
    },

    initialize: function() {
        _.bindAll(this, 'render');
    },

    render: function() {
        gFetchedEvents = new EventsC();
        gFetchedEvents.fetch({
          success: function(events) {
            // var template = _.template($('#eventView-template').html());
            // $("#eventView").html(template({event: events.models[0]}));
            var template = JST['eventView']({event: events.models[0]});
            // console.log(template);
            $("#eventView").html(template);
          }
        });
    },

    open: function() {
        $('#editEventNameFLD').val($('#eventName').html());
        $('#editEventLocationFLD').val($('#eventLocation').html());
        $('#editEventHostFLD').val($('#eventHost').html());
        $('#editEventStartDTFLD').val($('#eventTime').html().split('to')[0]);
        $('#editEventEndDTFLD').val($('#eventTime').html().split('to')[1]);
        // $('#editEventTzFLD').val(this.event.get('tzid'));
    },
    
    save: function(ev) {
        // var eventId = ev.target.parentNode.getAttribute('data-id');
        this.event = gFetchedEvents.findWhere({
            "eventid": '30002'
        });

        this.event.set({
            'id': '30002',
            'ownerid':gLoginUser.ownerid,
            'eventname': $('#editEventNameFLD').val(),
            'location': $('#editEventLocationFLD').val(),

            'host': $('#editEventHostFLD').val(),
            'startdatetime': $('#editEventStartDTFLD').val(),
            'enddatetime': $('#editEventEndDTFLD').val(),
            'tzid': "Pacific Time"
            // 'tzid': $('#editEventTzFLD').val()
            // 'color': this.$('#color').val()
        });

        this.event.save();
        // this.event.set({
        //     ownerid:gLoginUser.ownerid
        // });
        // var host = $("#editEventHostFLD").val();
        // this.event.save({'host': $('#editEventHostFLD').val(), 'ownerid':gLoginUser.ownerid}, {
        //     patch: true,
        //     // success: this.close
        // });
        // this.model.save({}, {
        //     patch: true,
        //     success: this.close
        // });
        // myModel.save(data, {patch:true}) 

    },
});

var editEventView = Backbone.View.extend({
    el: $('#eventDialog'),
    initialize: function() {
        //_.bindAll(this);
    },
    render: function() {
        var buttons = {
            'Ok': this.save
        };
        if (!this.model.isNew()) {
            _.extend(buttons, {
                'Delete': this.destroy
            });
        }
        _.extend(buttons, {
            'Cancel': this.close
        });

        this.el.dialog({
            modal: true,
            title: (this.model.isNew() ? 'New' : 'Edit') + ' Event',
            buttons: buttons,
            open: this.open
        });

        return this;
    },
    open: function() {
        this.$('#title').val(this.model.get('title'));
        this.$('#color').val(this.model.get('color'));
    },
    save: function() {
        this.model.set({
            'title': this.$('#title').val(),
            'color': this.$('#color').val()
        });

        if (this.model.isNew()) {
            this.collection.create(this.model, {
                success: this.close
            });
        } else {
            this.model.save({}, {
                success: this.close
            });
        }
    },
    close: function() {
        this.el.dialog('close');
    },
    destroy: function() {
        this.model.destroy({
            success: this.close
        });
    }
});