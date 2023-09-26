var Tempel = require('./TempelServer.js');

console.log("Starting Tempel Server...");
var tempel = new Tempel();

tempel.listen((err) => {
    if(err) {
        console.error(err);
        process.exit(1);
    } else {
        console.log("Tempel Server listening on port", tempel.port);
        tempel.database.initialize();
    }
});