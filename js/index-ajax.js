'use strict';
var user = {
  id: null,
  token: null
};

var api = {

  url: 'http://localhost:3000',

  ajax: function(config, cb) {
    $.ajax(config).done(function(data, textStatus, jqxhr) {
      cb(null, data);
    }).fail(function(jqxhr, status, error) {
      cb({jqxhr: jqxhr, status: status, error: error});
    });
  },

  register: function register(credentials, callback) {
    this.ajax({
      method: 'POST',
      url: this.url + '/register',
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify(credentials),
      dataType: 'json'
    }, callback);
  },

  login: function login(credentials, callback) {
    this.ajax({
      method: 'POST',
      url: this.url + '/login',
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify(credentials),
      dataType: 'json'
    }, callback);
  },

  logout: function logout(id, token, callback) {
    this.ajax({
      method: 'DELETE',
      url: this.url + '/logout/' + id,
      headers: {
        Authorization:'Token token=' + token
      },
      dataType: 'json'
    }, callback);
  },


//Authenticated api actions
  listEvents: function list(event, token, callback) {
    this.ajax({
      method: 'GET',
      url: this.url + '/events',
      headers: {
        Authorization: 'Token token=' + token
      },
      dataType: 'json'
    }, callback);
  },

  createEvent: function create(event, token, callback) {
    this.ajax({
      method: 'POST',
      url: this.url + '/events/',
      headers: {
        Authorization: 'Token token=' + token
      },
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify({event}),
      dataType: 'json',
    }, callback);
  },

};
  // showEvent: function show(id, token, callback) {
  //   this.ajax({
  //     method: 'GET',
  //     url: this.url + '/events/' + id,
  //     headers: {
  //       Authorization: 'Token token=' + token
  //     },
  //     dataType: 'json'
  //   }, callback);
  // },

// $(document).ready(...
$(function() {
  var form2object = function(form) {
    var data = {};
    $(form).children().each(function(index, element) {
      var type = $(this).attr('type');
      if ($(this).attr('name') && type !== 'submit' && type !== 'hidden') {
        data[$(this).attr('name')] = $(this).val();
      }
    });
    return data;
  };

  var wrap = function wrap(root, formData) {
    var wrapper = {};
    wrapper[root] = formData;
    return wrapper;
  };

  var callback = function callback(error, data) {
    if (error) {
      console.error(error);
      $('#result').val('status: ' + error.status + ', error: ' +error.error);
      return;
    }
    $('#result').val(JSON.stringify(data, null, 4));
  };

  $('#register').on('submit', function(e) {
    var credentials = wrap('credentials', form2object(this));
    api.register(credentials, callback);
    e.preventDefault();
  });

  $('#login').on('submit', function(e) {
    var credentials = wrap('credentials', form2object(this));
    var cb = function cb(error, data) {
      if (error) {
        callback(error);
        return;
      }
      callback(null, data);
      user.id = data.user.id; // stores value of user.id
      user.token = data.user.token; // stores value of user.token
      console.log(user);
      $('.token').val(data.user.token);
    };
    e.preventDefault();
    api.login(credentials, cb);
  });

  $('#logout').on('submit', function(e) {
    var token = $('.token').val();
     // user.token;
    var id = user.id;
    e.preventDefault();
    api.logout(id, token, callback);
  });

$('#list-events').on('submit', function(e) {
    var token = $('.token').val();
    // var id = event.id;
    e.preventDefault();
    api.listEvents(event, token, callback);
  });

  var createEventCB = function createEventCB(err, data) {
    if(err) {
      callback(err);
      return;
    }

    $('#eventId').val(data.event.id);
    callback(null, data);
  };

  $('#create-event').on('submit', function(e) {
    var event = {
      // event: {
      business_kind: $('#business_kind').val(),
      name: $('#name').val(),
      website: $('#website').val(),
      phone_number: $('#phone_number').val(),
      event_date: $('#event_date').val(),
      group_size: $('#group_size').val(),
      location_id: $('#location_id').val(),
      user_id: $('#user_id').val()
      }
    // }
    var token = $('.token').val();
    var id = event.id;
    e.preventDefault();
    api.createEvent(event, token, createEventCB);

    });

    });
  // $('#show-event').on('submit', function(e) {
  //   var token = $(this).children('[name="token"]').val();
  //   var id = $('#show-id').val();
  //   e.preventDefault();
  //   api.showEvent(id, token, callback);
  // });
// End of what I think works now.

// });








