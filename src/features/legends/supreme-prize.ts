export const SUPREME_BADGE = 'supreme-legends';

/** Account badges come from the server; guest badges last only for this visit. */
export function supremePrizeState(badges: readonly string[], enabled = true) {
  const unlocked = badges.includes(SUPREME_BADGE);
  return { unlocked, equipped: unlocked && enabled };
}

export function renderSupremePrize(root: HTMLElement, badges: readonly string[], account: boolean, enabled = true) {
  const { unlocked, equipped } = supremePrizeState(badges, enabled);
  root.classList.toggle('supreme-equipped', equipped);
  const title = root.querySelector<HTMLElement>('[data-lg="player-title"]');
  const status = root.querySelector<HTMLElement>('[data-lg="prize-status"]');
  const button = root.querySelector<HTMLButtonElement>('[data-lg="prize-equip"]');
  if (title) title.hidden = !unlocked;
  if (status) status.textContent = unlocked
    ? account ? 'EARNED · SAVED TO YOUR ACCOUNT' : 'EARNED IN GUEST DEMO · THIS VISIT ONLY'
    : 'LOCKED · WIN SUPREME LEGENDARY';
  if (button) {
    button.disabled = !unlocked;
    button.setAttribute('aria-pressed', String(equipped));
    button.textContent = !unlocked ? 'LOCKED' : equipped ? 'GOLD CABINET EQUIPPED' : 'EQUIP GOLD CABINET';
  }
}