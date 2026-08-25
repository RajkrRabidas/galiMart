export const createNotificationPlayer = (source) => {
  const audio = new Audio(source);
  audio.preload = "auto";
  audio.setAttribute("playsinline", "true");

  const unlock = () => {
    audio.muted = true;
    audio.currentTime = 0;
    const promise = audio.play();

    promise
      ?.then(() => {
        audio.pause();
        audio.currentTime = 0;
        audio.muted = false;
      })
      .catch(() => {
        // The browser will retry unlocking on the next user gesture.
      });
  };

  const play = () => {
    audio.muted = false;
    audio.currentTime = 0;
    audio.volume = 0.8;
    audio.play().catch(() => {
      // Autoplay can only be enabled after a user gesture.
    });
  };

  const destroy = () => {
    audio.pause();
    audio.removeAttribute("src");
    audio.load();
  };

  return { unlock, play, destroy };
};
