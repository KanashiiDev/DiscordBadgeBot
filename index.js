const { Client, Partials, GatewayIntentBits, Collection } = require("discord.js");
const model = require("./models/example");
const client = new Client({
  intents: Object.values(GatewayIntentBits).filter(
    (x) => typeof x === "string"
  ),
  partials: [
    Partials.GuildMembers,
    Partials.Message,
    Partials.Channel,
    Partials.Reaction,
    Partials.User,
  ],
});

require("./utils/event.js")(client);
require("./utils/mongoose.js");
global.config = require("./config.json");
global.client = client;
client.commands = new Collection();
client
  .login(global.config.TOKEN)
  .then(() => console.log(`${client.user.username} Active!`))
  .catch((err) => console.error(`An error occurred! \n${err}`));

  client.on('presenceUpdate', async (oldPresence, newPresence) => {
    let member = newPresence.member;
        if (oldPresence && oldPresence.status && newPresence.status && oldPresence.status !== newPresence.status) {
            if (newPresence.status === "online") {
            } else if (newPresence.status === "offline" || newPresence.status === "") {
                const dbdata = await model.findOne({ USERID: member.user.id, });
            if (dbdata) {
              let ls = new Date().toISOString();
              await model.updateOne({USERID: dbdata.USERID}, {$set: {LASTSEEN: ls}});}
        }
      }
  });