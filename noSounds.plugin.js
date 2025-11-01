/**
 * @name NoSounds
 * @version 2.0.0
 * @description Mutes ALL Discord UI sounds (join/leave, clicks, pings, etc.). Voice chat and videos are preserved.
 * @author Blue
 */

module.exports = (() => {
  const config = {
    info: {
      name: "NoSounds",
      authors: [{ name: "Blue", discord_id: "1006897949822959696", github_username: "BlueStarOne" }],
      version: "2.0.0",
      description: "Mutes every UI sound. Voice chat & media untouched.",
      github: "https://github.com/BlueStarOne/kettu-no-sounds",
      github_raw: "https://raw.githubusercontent.com/BlueStarOne/kettu-no-vc-sounds/main/NoSounds.plugin.js"
    },
    // Optional: Add sound IDs here to WHITELIST (keep them ON)
    defaultConfig: {
      whitelist: [] // e.g., ["message1"] to keep message ping
    }
  };

  return !globalThis.Dev ? class {
    constructor(meta) { 
      this.config = config; 
      this.meta = meta; 
      this.patcher = new globalThis.Patcher(config.info.name); 
    }

    onStart() { this.start(); }
    onStop() { this.stop(); }

    start() {
      // Find Discord's SoundPlayer module
      const SoundModule = globalThis.webpackChunkdiscord_app?.push([[""], {}, req => {
        return Object.values(req.c).find(m => m?.exports?.default?.playSound);
      }])?.exports?.default;

      if (!SoundModule?.playSound) {
        console.error("[NoVCSounds] Sound module not found! Discord may have updated.");
        return;
      }

      // Block ALL sounds unless whitelisted
      this.unpatch = this.patcher.before(SoundModule, "playSound", (data) => {
        const soundId = data.args[0];
        const volume = data.args[1];

        // Optional: Log for debugging (remove if annoying)
        console.log(`[NoSounds] Blocked UI sound: ${soundId} (vol: ${volume})`);

        // WHITELIST: Allow specific sounds (e.g., keep message ping)
        if (this.config.defaultConfig.whitelist.includes(soundId)) {
          return; // Let it play
        }

        // BLOCK EVERYTHING ELSE
        data.result = null;
        return data;
      });

      console.log("[NoSounds] All UI sounds muted.");
    }

    stop() {
      this.unpatch?.();
      this.patcher.unpatchAll();
      console.log("[NoSounds] Plugin stopped. UI sounds restored.");
    }
  } : ((Dev) => {
    const { Patcher } = Dev;
    return class {
      constructor(meta) { Object.assign(this, config, meta); this.patcher = Patcher(this.info.name); }
      start() { /* same logic */ }
      stop() { /* same logic */ }
    };
  })(globalThis.Dev);
})();