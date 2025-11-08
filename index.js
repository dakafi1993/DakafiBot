require("dotenv").config();
const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Partials } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});

// Uvítací zpráva
client.on("guildMemberAdd", (member) => {
  const channel = member.guild.channels.cache.get(process.env.WELCOME_CHANNEL);
  if (!channel) return;

  const embed = new EmbedBuilder()
    .setColor("Green")
    .setTitle("👋 Vítej na serveru!")
    .setDescription(`Ahoj ${member}, užij si pobyt!\n\n📜 Mrkni do **#rules**\n🎮 Vyber si hry v **#roles**`)
    .setTimestamp();

  channel.send({ embeds: [embed] });
});

// Tlačítkové role
client.on("messageCreate", (msg) => {
  if (msg.content === "!setroles") {
    if (msg.channel.id !== process.env.ROLE_CHANNEL) return msg.reply("Použij to ve správném kanálu.");

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId("cs2").setLabel("CS2 💀").setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId("lol").setLabel("LoL ⚔️").setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId("fn").setLabel("Fortnite 🔥").setStyle(ButtonStyle.Primary)
    );

    const embed = new EmbedBuilder()
      .setTitle("🎮 Vyber si herní role")
      .setDescription("Klikni na tlačítko podle hry, kterou hraješ.");

    msg.channel.send({ embeds: [embed], components: [row] });
  }
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isButton()) return;

  let roleID = process.env[`ROLE_${interaction.customId.toUpperCase()}`];
  if (!roleID) return;

  const role = interaction.guild.roles.cache.get(roleID);

  if (interaction.member.roles.cache.has(roleID)) {
    await interaction.member.roles.remove(role);
    interaction.reply({ content: `❌ Role **${role.name}** odebrána.`, ephemeral: true });
  } else {
    await interaction.member.roles.add(role);
    interaction.reply({ content: `✅ Role **${role.name}** přidána.`, ephemeral: true });
  }
});

// LOGIN
client.on("ready", () => console.log(`✅ Bot je online jako ${client.user.tag}`));
client.login(process.env.TOKEN);
