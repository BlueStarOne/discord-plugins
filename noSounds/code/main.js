module.exports = class {
  start() {
    const orig = globalThis.playSound || globalThis.__playSound;
    if (!orig) return;
    this.orig = orig;
    const block = () => null;
    globalThis.playSound = block;
    globalThis.__playSound = block;
    console.log("UI SOUNDS MUTED");
  }
  stop() {
    if (this.orig) {
      globalThis.playSound = this.orig;
      globalThis.__playSound = this.orig;
    }
    console.log("UI SOUNDS BACK");
  }
};
