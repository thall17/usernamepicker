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
    var result =  $.ajax({
      url: `https://api.github.com/users/${username}`,
    });
    console.log(`result = ${JSON.stringify(result)}`);
    return result.login;
  }
  
}
 
ko.applyBindings(new ViewModel());