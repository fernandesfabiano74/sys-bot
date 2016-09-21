var restify = require('restify');
var builder = require('botbuilder');

//=========================================================
// Bot Setup
//=========================================================

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
  
// Create chat bot
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

//=========================================================
// Bots Dialogs
//=========================================================

var recognizer = new builder.LuisRecognizer('https://api.projectoxford.ai/luis/v1/application?id=020c509c-6ced-467f-912f-58588cc0868f&subscription-key=6d400f5eb32d4c7b8cfabfb4d17a9892');
var intents = new builder.IntentDialog({ recognizers: [recognizer] });
bot.dialog('/', intents); 

intents.matches('Start', [
    function (session, args, next) {
        var task = builder.EntityRecognizer.findEntity(args.entities, 'Command');
        if (!task) {
            builder.Prompts.text(session, "Do would you like to send a command?");
        } else {
            next({ response: task.entity });
        }
    },
    function (session, results) {
        if (results.response) {
            // ... save task
            session.send("Ok... '%s' command sent.", results.response);
        } else {
            session.send("Ok");
        }
    }
]);