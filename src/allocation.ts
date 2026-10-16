export {};

const canvas = document.querySelector<HTMLCanvasElement>("#allocation-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>(
  "#allocation-readout",
)!;
let producers = 2;
let production = producers * 3;
let consumption = 6;
let balance = production - consumption;

function _update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < 6; i++) {
    ctx.fillStyle = i < producers ? "#27766b" : "#c9d2c9";
    ctx.fillRect(18 + i * 45, 16, 36, 36);
    ctx.fillStyle = i < producers ? "#ffffff" : "#233e43";
    ctx.font = "16px system-ui";
    ctx.fillText(String(i + 1), 31 + i * 45, 40);
  }
  ctx.fillStyle = "#233e43";
  ctx.font = "14px system-ui";
  ctx.fillText(`Producers: ${producers} / 6`, 18, 76);

  ctx.fillText(`Production: ${production}`, 18, 102);
  ctx.fillStyle = "#27766b";
  ctx.fillRect(18, 110, production * 14, 20);
  ctx.fillStyle = "#233e43";
  ctx.fillText(`Consumption: ${consumption}`, 18, 154);
  ctx.fillStyle = "#a44d23";
  ctx.fillRect(18, 162, consumption * 14, 20);
  readout.textContent =
    `Assigned: ${producers}/6 · Production: ${production} · Consumption: ${consumption} · Balance: ${
      balance > 0 ? "+" : ""
    }${balance}`;
}

function newupdate() {
  //clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  //draw producers display
  for (let i = 0; i < 6; i++) {
    ctx.fillStyle = i < producers ? "#27766b" : "#c9d2c9";
    ctx.fillRect(18 + i * 45, 16, 36, 36);
    ctx.fillStyle = i < producers ? "#ffffff" : "#233e43";
    ctx.font = "16px system-ui";
    ctx.fillText(String(i + 1), 31 + i * 45, 40);
  }
  //draw producers number
  ctx.fillStyle = "#233e43";
  ctx.font = "14px system-ui";
  ctx.fillText(`Producers: ${producers} / 6`, 18, 76);

  //draw production and consumption graphs
  const stats = [
    {
      label: "Production",
      value: production,
      color: "#27766b",
    },
    {
      label: "Consumption",
      value: consumption,
      color: "#a44d23",
    },
  ];
  for (let i = 0; i < stats.length; i++) {
    const stat = stats[i];
    const j = 102 + i * 52;
    ctx.fillStyle = "#233e43";
    ctx.fillText(`${stat.label}: ${stat.value}`, 18, j);
    ctx.fillStyle = stat.color;
    ctx.fillRect(18, j + 8, stat.value * 14, 20);
  }
}

function calculate() {
  production = producers * 3;
  consumption = 6;
  balance = production - consumption;
}

document.querySelector<HTMLButtonElement>("#allocation-less")!.onclick = () => {
  producers = Math.max(0, producers - 1);
  calculate();
  newupdate();
};
document.querySelector<HTMLButtonElement>("#allocation-more")!.onclick = () => {
  producers = Math.min(6, producers + 1);
  calculate();
  newupdate();
};
document.querySelector<HTMLButtonElement>("#allocation-reset")!.onclick =
  () => {
    producers = 2;
    calculate();
    newupdate();
  };
newupdate();
