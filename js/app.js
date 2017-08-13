// Here's my data model
var ViewModel = function() {
    var self = this;

    self.username = ko.observable("");
   
    self.github = ko.computed(function() {
        return testAjax('github', self.username());
    }, self);

};

function testAjax(site, username) {
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
    // console.log('result', result);
    return result;

  }
  
}
 
ko.applyBindings(new ViewModel());