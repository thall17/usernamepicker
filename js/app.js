// Here's my data model
var ViewModel = function(username) {
    var self = this;

    self.username = ko.observable(username);

    var t = testAjax('github', 'timjhall');
    console.log("testAjax:");
    console.log(t);


    // self.result = testAjax('github', 'timjhall');

    // self.result = ko.computed(function() {
    //     return testAjax('github', self.username);
    // }, self);


 
    // this.fullName = ko.pureComputed(function() {
    //     // Knockout tracks dependencies automatically. It knows that fullName depends on firstName and lastName, because these get called when evaluating fullName.
    //     return this.firstName() + " " + this.lastName();
    // }, this);
};



function testAjax(site, username) {
  if (site == 'github') {
    return $.ajax({
      url: `https://api.github.com/users/${username}`
    });
  }
  
}
 
ko.applyBindings(new ViewModel("Username")); // This makes Knockout get to work