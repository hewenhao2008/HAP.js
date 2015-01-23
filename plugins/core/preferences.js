var self = module.exports = function(fs, log, path, saveTimeout, watcher, util) {
    saveTimeout = saveTimeout || 500;
    path = path || "preferences.json";
    
    log.v("Using preference file: " + path);
    
    var load = function () {
        try {
            var data = fs.readFileSync(path);
            var obj = JSON.parse(data);
            for (var k in obj) {
                this[k] = obj[k];
            }
            log.v("Preferences loaded");
        }
        catch (e) {
            log.e("Could not load preferences", e);
        }
    }.bind(this);

    var save = function() {
        var data = JSON.stringify(this, null, 4);
        fs.writeFile(path, data, function (e) {
            if (e) {
                log.e("Could not save preferences", e);
            } else {
                log.v("Preferences saved");
            }
        });
    }.bind(this);
    
    load();
    
    watcher.create(this, util.throttle(saveTimeout, save));
};
self.__meta = {
    imports: ["fs", "log", "?preferencesPath", "?preferencesSaveTimeout", "watcher", "util"],
    exports: "preferences"
};