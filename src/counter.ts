export {};

const canvas = document.querySelector<HTMLCanvasElement>("#counter-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>(
  "#counter-readout",
)!;
const host = document.querySelector<HTMLDivElement>("#counter-panel-host")!;
const diagnostic = document.querySelector<HTMLParagraphElement>(
  "#counter-diagnostic",
)!;

//shield object
type shieldsnapshot = {
  charge: number;
  capacity: number;
  missing: number;
};

let count = 0;
let panel: HTMLParagraphElement | null = null;
let panelUpdates = 0;
const shieldevents = new EventTarget();

function updateInspector() {
  panelUpdates++;
  diagnostic.textContent = `Inspector Deliveries ${panelUpdates}`;
  renderStats();
}

function getsheildsnapshot(): shieldsnapshot {
  return {
    charge: count,
    capacity: 10,
    missing: 10 - count,
  };
}

function drawMeter() {
  const shield = getsheildsnapshot();

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < shield.capacity; i++) {
    ctx.fillStyle = i < shield.charge ? "#27766b" : "#c9d2c9";
    ctx.fillRect(12 + i * 28, 24, 24, 48);
  }
  ctx.fillStyle = "#233e43";
  ctx.font = "16px system-ui";
  ctx.fillText(`${shield.charge} / ${shield.capacity} shield`, 12, 100);
}

shieldevents.addEventListener("shield_change", () => {
  drawMeter();
  const shield = getsheildsnapshot();
  readout.textContent = `Shield charge: ${shield.charge} / ${shield.capacity}`;
});

function renderStats() {
  if (!panel) return;

  const shield = getsheildsnapshot();
  panel.textContent =
    `Shield charge: ${shield.charge} · Missing charge: ${shield.missing}`;
}

function setCount(next: number) {
  const bounded = Math.max(0, Math.min(10, next));
  if (bounded === count) return;
  count = bounded;
  shieldevents.dispatchEvent(new Event("shield_change"));
}

document.querySelector<HTMLButtonElement>("#counter-less")!.onclick = () => {
  setCount(count - 1);
};
document.querySelector<HTMLButtonElement>("#counter-more")!.onclick = () => {
  setCount(count + 1);
};
document.querySelector<HTMLButtonElement>("#counter-reset")!.onclick = () => {
  setCount(0);
};
document.querySelector<HTMLButtonElement>("#counter-open")!.onclick = () => {
  if (panel) return;
  panel = document.createElement("p");
  host.append(panel);
  renderStats();
  shieldevents.addEventListener("shield_change", updateInspector);
};
document.querySelector<HTMLButtonElement>("#counter-close")!.onclick = () => {
  if (!panel) return;

  shieldevents.removeEventListener("shield_change", updateInspector);
  panel.remove();
  panel = null;
};
drawMeter();
