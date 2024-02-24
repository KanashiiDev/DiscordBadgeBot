const { SlashCommandBuilder } = require("discord.js");
const model = require("../models/example");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("bot")
    .setDescription("Banner Bot")
    .addSubcommand((cmd) =>
      cmd
        .setName("displayname")
        .setDescription("Set banner display Name")
        .addStringOption((option) =>
          option
            .setName("displayname")
            .setDescription("Display Name")
            .setRequired(true)
        )
    )
    .addSubcommand((cmd) =>
      cmd.setName("getbanner").setDescription("Get your banner")
    )
    .addSubcommand((cmd) =>
      cmd.setName("redirectlink").setDescription("Set redirect url")
        .addStringOption((option) =>
          option
            .setName("redirectlink")
            .setDescription("Redirect Link")
            .setRequired(true)
        )
    )
    .addSubcommand((cmd) =>
      cmd.setName("custombg").setDescription("Set custom background")
        .addStringOption((option) =>
          option
            .setName("custombg")
            .setDescription("Paste your custom background image url - max 2.5mb")
            .setRequired(true)
        )
    )
    .addSubcommand((cmd) =>
      cmd
        .setName("lastseen")
        .setDescription("Show/Hide your last seen info")
    )
    .addSubcommand((cmd) =>
      cmd.setName("help").setDescription("Learn banner parameters")
    )
    .addSubcommand((cmd) =>
      cmd
        .setName("removedisplayname")
        .setDescription("Remove custom display name")
    )
    .addSubcommand((cmd) =>
      cmd
        .setName("removecustombg")
        .setDescription("Remove custom background image")
    ),
  run: async (client, interaction, embed) => {
    if (interaction.options.getSubcommand() === "help") {
      await interaction.deferReply({ ephemeral: true });
      await interaction.editReply({
        content: `**Banner URL Parameters**\n\n**theme**\n Changes your banner theme. (0-2)\nExample: *theme=1*\n\n**hideoffline**\n Hides banner when you offline. \nExample: *hideoffline=1*\n\n**hideplaying**\n Hides playing text. \nExample: *hideplaying=1*\n\n**bg**\n Banner background color.\nExample: *bg=#fff*\n\n**fg**\n Banner foreground color.\nExample: *fg=#fff*\n\n**txtColor**\n Banner text color.\nExample: txt=#fff)\n\n**detailColor**\n Banner detail text color.\n(Example: detailColor=#fff)\n\n**border**\n Banner border.\n(Example: *border=1*\n\n**borderColor**\n Banner border color.\nExample: *borderColor=#fff*\n\n**borderRadius**\n Smooth banner corners.\nExample: *borderRadius=10*\n\n**hidebg**\n Hides your custom background image.\nExample: *hidebg=1*\n\n**bgm**\n (Theme 1)\n **bgm=1** adds background color to your background image, **bgm=2** removes foreground color.\n(Theme 2)\n **bgm=1** adds background color to your background image, **bgm=2** centers detailed section.\nExample: *bgm=1*\n\n**fgopacity**\n If you have custom background image, using with **bgm=1** changes opacity of foreground color, using with bgm=2 changes opacity of background color. (0.0-1.0)\nExample: *fgopacity=0.5*\n\n**bgposx - bgposy**\n Change position of your background image. \nExample: *bgposx=50&bgposy=50*\n\n**bgsizex - bgsizey (only theme 0)**\n Resize your background image. \nExample: *bgsizex=50&bgsizey=110*\n\n**logo (only theme 0)**\n Show discord logo.\nExample: *theme=0&logo=1*\n\n**wide (only theme 0)**\n Make banner always wide.\nExample: *theme=0&wide=1*\n\n**lgbg (only theme 0)**\n Make banner background gradient.(req. wide=1)\nExample: *theme=0&wide=1&lgbg=1*`,
        ephemeral: true,
      });
    }
    if (interaction.options.getSubcommand() === "custombg") {
      const custombg = interaction.options.getString("custombg");
      await interaction.deferReply({ ephemeral: true });
      const data = await model.findOne({ USERID: interaction.user.id, });
      if (data) {
        await model.updateOne({USERID: data.USERID}, {$set: { CUSTOMBG: interaction.options.getString("custombg")}});
        return await interaction.editReply({
          content: `Custom background updated!\n New custom background link: **${custombg}**`,
          ephemeral: true,
        });
      }
      if (!data) {
        new model({
          USERID: interaction.user.id,
          DISPLAYNAME: "",
          REDIRECT: "",
          CUSTOMBG: interaction.options.getString("custombg"),
          LASTSEEN: "",
          LASTSEENENABLE: "FALSE",
        })
          .save();
      }
    }
    if (interaction.options.getSubcommand() === "lastseen") {
      await interaction.deferReply({ ephemeral: true });
      const data = await model.findOne({ USERID: interaction.user.id, });
      if (data) {
        let dataactive = data.LASTSEENENABLE;
        let active = false;
        if (dataactive === "TRUE") { active = true }
        if (dataactive === "FALSE") { active = false }
        active = !active;
        if (active) {
          await model.updateOne({USERID: data.USERID}, {$set: {LASTSEENENABLE: "TRUE"}});
          return await interaction.editReply({
            content: `Last seen info enabled!`,
            ephemeral: true,
          });
        }
        if (!active) {
          await model.updateOne({USERID: data.USERID}, {$set: {LASTSEENENABLE: "FALSE"}});
          return await interaction.editReply({
            content: `Last seen info disabled!`,
            ephemeral: true,
          });
        }
      }
      if (!data) {
        new model({
          USERID: interaction.user.id,
          DISPLAYNAME: "",
          REDIRECT: "",
          CUSTOMBG: "",
          LASTSEEN: "",
          LASTSEENENABLE: "TRUE",
        })
          .save();
          return await interaction.editReply({
            content: `Last seen info enabled!`,
            ephemeral: true,
          });
      }
    }
    if (interaction.options.getSubcommand() === "redirectlink") {
      const redirectlink = interaction.options.getString("redirectlink");
      await interaction.deferReply({ ephemeral: true });
      const data = await model.findOne({ USERID: interaction.user.id, });
      if (data) {
        await model.updateOne({USERID: data.USERID}, {$set: {REDIRECT: interaction.options.getString("redirectlink")}});
        return await interaction.editReply({
          content: `Redirect link updated!\n New Redirect Link: **${redirectlink}**`,
          ephemeral: true,
        });
      }
      if (!data) {
        new model({
          USERID: interaction.user.id,
          DISPLAYNAME: "",
          REDIRECT: interaction.options.getString("redirectlink"),
          CUSTOMBG: "",
          LASTSEEN: "",
          LASTSEENENABLE: "FALSE",
        })
          .save();
        await interaction.editReply({
          content: `Redirect link updated!\n New Redirect Link: **${redirectlink}**`,
          ephemeral: true,
        });
      }
    }
    if (interaction.options.getSubcommand() === "displayname") {
      const displayname = interaction.options.getString("displayname");
      await interaction.deferReply({ ephemeral: true });
      const data = await model.findOne({ USERID: interaction.user.id, });
      if (data) {
        await model.updateOne({USERID: data.USERID}, {$set: {DISPLAYNAME: interaction.options.getString("displayname")}});
        await interaction.editReply({
          content: `Display Name updated!\n New Display name: **${displayname}**`,
          ephemeral: true,
        });
      }
      if (!data) {
        new model({
          USERID: interaction.user.id,
          DISPLAYNAME: interaction.options.getString("displayname"),
          REDIRECT: "",
          CUSTOMBG: "",
          LASTSEEN: "",
          LASTSEENENABLE: "FALSE",
        })
          .save();
        await interaction.editReply({
          content: `Banner name changed to your custom display name.\n Your display name: **${displayname}**`,
          ephemeral: true,
        });
      }
    }
    if (interaction.options.getSubcommand() === "getbanner") {
      await interaction.deferReply({ ephemeral: true });
      await interaction.editReply({
        content: `Your banner url: \n**(Transparent - White)**\nhttps://hachiman-discord-badge.vercel.app/api?id=${interaction.user.id}&txtColor=fff&detailColor=ededed\n**(Transparent - Black)**\nhttps://hachiman-discord-badge.vercel.app/api?id=${interaction.user.id}&txtColor=0b0b0b&detailColor=555\n**(Black)**\nhttps://hachiman-discord-badge.vercel.app/api?id=${interaction.user.id}&txtColor=fff&detailColor=ededed&bg=0b0b0b\n**(White)**\nhttps://hachiman-discord-badge.vercel.app/api?id=${interaction.user.id}&txtColor=0b0b0b&detailColor=555&bg=fff\n\nYou can learn url parameters and bot commands with **/bot help**\n\nYour banner Redirect link: https://hachiman-discord-badge.vercel.app/api?id=${interaction.user.id}&redirect=1\nPlese set your redirect link with **/bot redirectlink**`,
        ephemeral: true,
      });
    }
    if (interaction.options.getSubcommand() === "removedisplayname") {
      await interaction.deferReply({ ephemeral: true });
      const data = await model.findOne({ USERID: interaction.user.id, });
      if (!data) {
        return await interaction.editReply({
          content: `Data not found. Use */bot getbanner* command.`,
          ephemeral: true,
        });
      }
      if (data) {
        await model.updateOne({USERID: data.USERID}, {$set: {DISPLAYNAME: ""}});
        await interaction.editReply({
          content: `Custom Display name removed. Now banner displaying your user name.`,
          ephemeral: true,
        })
      }
      if (interaction.options.getSubcommand() === "removecustombg") {
        await interaction.deferReply({ ephemeral: true });
        const data = await model.findOne({ USERID: interaction.user.id, });
        if (!data) {
          return await interaction.editReply({
            content: `You don't have custom background image.`,
            ephemeral: true,
          });
        }
        if (data) {
          await model.updateOne({USERID: data.USERID}, {$set: {CUSTOMBG: ""}});
          await interaction.editReply({
            content: `Custom background removed.`,
            ephemeral: true,
          })
        }
      }
    }
  },
};