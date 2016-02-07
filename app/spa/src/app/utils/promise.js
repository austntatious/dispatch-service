var _promise = {
  resolved: function(item){
    var deferred = RSVP.defer()
    deferred.resolve(item);
    return deferred.promise;
  },
  logOne: function(promise, prefix) {
    prefix = prefix || '';
    promise.then(function(item){
      console.info(prefix, item);
    });
  },
  logMany: function (promises, prefix) {
    prefix = prefix || '';
    RSVP.all(promises).then(function(items) {
      console.info(prefix, items);
    })
  }
}

module.exports = _promise;
