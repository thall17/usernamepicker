// Here's my data model
var ViewModel = function(username) {
    this.username = ko.observable(username);
 
    // this.fullName = ko.pureComputed(function() {
    //     // Knockout tracks dependencies automatically. It knows that fullName depends on firstName and lastName, because these get called when evaluating fullName.
    //     return this.firstName() + " " + this.lastName();
    // }, this);
};
 
ko.applyBindings(new ViewModel("Username")); // This makes Knockout get to work