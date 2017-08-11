// Here's my data model
var ViewModel = function() {
    var self = this;

    self.username = ko.observable("");
    self.personName = ko.observable();
    // self.github = ko.observable("");

    // var t = testAjax('github', 'timjhall');
    // console.log("testAjax:");
    // console.log(t);


    // self.result = testAjax('github', 'timjhall');
    // console.log(self.result);

    self.result = ko.computed(function() {
        return testAjax('github', self.username());
    }, self);


 
    // this.fullName = ko.pureComputed(function() {
    //     // Knockout tracks dependencies automatically. It knows that fullName depends on firstName and lastName, because these get called when evaluating fullName.
    //     return this.firstName() + " " + this.lastName();
    // }, this);
};



function testAjax(site, username) {
  if (username == "") {
    return "";
  }
  if (site == 'github') {
    return $.ajax({
      url: `https://api.github.com/users/${username}`
    });
  }
  
}
 
ko.applyBindings(new ViewModel());