var eventDialogView = Backbone.View.extend({
    el: $('#eventDialogView'),
    events : {
        'click #createBtn' : 'eventCreateDialog'
    },

    eventCreateDialog : function(event) {
        // console.log("hi");
        var buttons = {
             "save" : {
              text: 'Save as Draft',
              class: 'save-btn',
              click: this.draft
            },
            "back" : {
              text: 'Previous',
              class: 'back-btn',
              click: this.back
            },
            "next" : {
              text: 'Next',
              class: 'next-btn',
              click: this.next
            },

            "publish" : {
              text: 'Publish',
              class: 'publish-btn',
              click: this.save
            }
        };

        $('#createEventDialog').dialog({
            draggable: true,
            resizable: true,
            show: 'fade',
            hide: 'fade',
            modal: false,
            width: 930,
            height: 600,
            title: 'Create an Event',
            buttons: buttons,
            open: this.open,
            close: this.reset
        });

        $('.back-btn').hide();
        $('.publish-btn').hide();
        

        $( "#createOneEventStartDTFLD, #createOneEventEndDTFLD, #createReEventStartDTFLD, #createReEventEndDTFLD" )
        .datetimepicker({
            format: 'Y-m-d H:i',
            step: 30
        });

        $( "#createEventRS" ).datepicker({
            changeMonth: true,
            changeYear: true
        });
    },

    initialize: function() {
        _.bindAll(this, 'render');
        
    },
    render: function() {
        //save the sever settings into global variable gServerSetting
        gSeverSetting = new serverSetting();
        $.when(gSeverSetting).done(function() {
            gSeverSetting.fetch({
                success: function(settings) {
                    var tzSettings = settings.attributes.timezones;
                    var alertSettings = settings.attributes.alerts;
                    $.each(tzSettings, function (i, tz) {
                        $('#timezone-one, #timezone-re, #editEventTzFLD').append($('<option>', { 
                            value: tz.id,
                            text : tz.displayname 
                        }));
                    });
                    $.each(alertSettings, function (i, alert) {
                        $('#alert-one, #alert-re').append($('<option>', { 
                            value: alert.id,
                            text : alert.aname 
                        }));
                    });
                }
            });
        });
        

        $(document).ready(function() {
            $('a[data-id=tab-1]').click(function() {
                $('.back-btn').hide();
                $('.publish-btn').hide();
            });

            $('.createEventTab').on('click', function() {
                $('.back-btn').show();

            });

            $('.radio-btn-one').click(function() {
                $('.radio-btn-re').prop('checked', false);
                $('#createEventOneTime').removeClass('dialog-hide');
                $('#createEventRepeat').addClass('dialog-hide');
            });

            $('.radio-btn-re').click(function() {
                $('.radio-btn-one').prop('checked', false);
                $('#createEventRepeat').removeClass('dialog-hide');
                $('#createEventOneTime').addClass('dialog-hide');
            });

            $('#addNewTask').click(function() {
                console.log('under development');
            });
        });
    },
    open: function() {
        $( "#tabs-create" ).tabs().addClass( "ui-tabs-vertical ui-helper-clearfix" );
        $( "#tabs-create li" ).removeClass( "ui-corner-top" ).addClass( "ui-corner-left" );
    },
    back: function() {
        // alert('back');
        var preTabNo = parseInt($('#create-tab-list').children('.ui-state-active').children().attr('data-id').split('-')[1]) - 1;
        $('a[data-id=tab-' + preTabNo + ']').children('.glyphicon-ok').remove();
        $('a[data-id=tab-' + preTabNo + ']').css("background-color","silver");
        $('a[data-id=tab-' + (preTabNo+1) + ']').css("background-color","transparent");
        $('a[data-id=tab-' + preTabNo + ']').trigger('click');
        $('.next-btn').css('display', 'inline');
        $('.publish-btn').hide();
    },
    next: function() {
        // alert('next');
        var currTabNo = parseInt($('#create-tab-list').children('.ui-state-active').children().attr('data-id').split('-')[1]);
        var nextTabNo = currTabNo + 1;
        if(currTabNo < 4) {
             $('a[data-id=tab-' + (nextTabNo -1) + ']').css("background-color","transparent");
            $('a[data-id=tab-' + (nextTabNo) + ']').css("background-color","silver");
            $('a[data-id=tab-' + (nextTabNo - 1) + ']').prepend('');
            $('a[data-id=tab-' + nextTabNo + ']').trigger('click');
        }       
        if(currTabNo == 3) {
            $('.next-btn').css('display', 'none');
            $('.publish-btn').show();
        }

    },
    reset: function() {
        $('a[data-id=tab-1]').trigger('click');
        $( "#create-tab-list a" ).children('.glyphicon-ok').remove();
    },

    save: function() {
        var param = {
            "ownerid": gLoginUser.ownerid,
            "communityid": 30001,
            "eventid": getNextObjectId(gLoginUser.ownerid, gLatestEventId),
            "eventname": $('#createEventNameFLD').val(),
            "desp": $('#createEventDescripFLD').val(),
            "startdatetime": $('#createOneEventStartDTFLD').val(),
            "enddatetime": $('#createOneEventEndDTFLD').val(),
            "tzid": parseInt($('#timezone-one').find(':selected').attr('value')),
            "alert": parseInt($('#alert-one').find(':selected').attr('value')),
            "location": $('#createEventLocFLD').val(),
            "host": $('#createEventHostFLD').val(),
            "beventid": "0"
        };

        var newEvent = new EventM(param);
        newEvent.save({}, {
            success: function() {
                           
            },
            error: function() {
                gLatestEventId = param.eventid;
                var tmp = JSON.parse(localStorage.login_user);
                tmp.eventid = param.eventid;
                localStorage.login_user = JSON.stringify(tmp);
                alert('Publish succeeds');
            }
        });

        
    }

});