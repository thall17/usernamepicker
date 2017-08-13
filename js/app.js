// Here's my data model
var ViewModel = function() {
    var self = this;

    self.username = ko.observable("");
   
    self.github = ko.computed(function() {
        return checkUsername('github', self.username());
    }, self);

    self.linkedin = ko.computed(function() {
        return checkUsername('linkedin', self.username());
    }, self);

};

function checkUsername(site, username) {
  if (username == "") {
    return false;
  }
  if (site == 'github') {
    var result = false;
    $.ajax({
      url: `https://api.github.com/users/${username}`,
      async: false,
      success: function(data) {
        // console.log('success', data);
        result = false;
      },
      error: function(data) {
        // console.log('failure', data);
        result = true;
      }
    });
  }
  if (site == 'linkedin') {
    result = true;
  }
  return result;
}
 
ko.applyBindings(new ViewModel());