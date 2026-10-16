export {};

const canvas = document.querySelector<HTMLCanvasElement>("#rover-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>("#rover-readout")!;
const queueList = document.querySelector<HTMLOListElement>("#rover-pending")!;
const status = document.querySelector<HTMLParagraphElement>(
  "#rover-queue-status",
)!;
const runButton = document.querySelector<HTMLButtonElement>("#rover-run")!;
const clearButton = document.querySelector<HTMLButtonElement>("#rover-clear")!;

const directions = [
  { name: "North", _x: 0, _y: -1 },
  { name: "East", _x: 1, _y: 0 },
  { name: "South", _x: 0, _y: 1 },
  { name: "West", _x: -1, _y: 0 },
];
let x = 2;
let y = 2;
let direction = 0;

function drawRover() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#718881";
  for (let row = 0; row < 5; row++) {
    for (let column = 0; column < 5; column++) {
      ctx.strokeRect(10 + column * 56, 10 + row * 56, 56, 56);
    }
  }
  ctx.save();
  ctx.translate(38 + x * 56, 38 + y * 56);
  ctx.rotate(direction * Math.PI / 2);
  ctx.fillStyle = "#27766b";
  ctx.beginPath();
  ctx.moveTo(0, -20);
  ctx.lineTo(17, 16);
  ctx.lineTo(-17, 16);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
  readout.textContent = `Position: (${x}, ${y}) · Facing: ${
    directions[direction].name
  }`;
}

//Command Type
type Command = {
  label: string;
  execute: () => void;
};

//List to hold Commands
const commandQueue: Command[] = [];

//Invoker
function runCommand(command: Command) {
  command.execute();
}

const forward: Command = {
  label: "Forward",
  execute: () => {
    const current = directions[direction];
    x = Math.max(0, Math.min(4, x + current._x));
    y = Math.max(0, Math.min(4, y + current._y));
    drawRover();
  },
};

const right: Command = {
  label: "Right",
  execute: () => {
    direction = (direction + 1) % 4;
    drawRover();
  },
};

function generateQueue() {
  queueList.replaceChildren();

  for (const command of commandQueue) {
    const item = document.createElement("li");
    item.textContent = command.label;
    queueList.appendChild(item);
  }
  status.textContent = commandQueue.length === 0
    ? "No Pending Commands"
    : `${commandQueue.length} pending command`;

  runButton.disabled = commandQueue.length === 0;
  clearButton.disabled = commandQueue.length === 0;
}

document.querySelector<HTMLButtonElement>("#rover-forward")!.onclick = () => {
  commandQueue.push(forward);
  generateQueue();
};
document.querySelector<HTMLButtonElement>("#rover-right")!.onclick = () => {
  commandQueue.push(right);
  generateQueue();
};
document.querySelector<HTMLButtonElement>("#rover-reset")!.onclick = () => {
  x = 2;
  y = 2;
  direction = 0;

  commandQueue.length = 0;
  generateQueue();
  drawRover();
};

runButton.onclick = () => {
  while (commandQueue.length > 0) {
    const command = commandQueue.shift()!;
    runCommand(command);
  }
  generateQueue();
};

clearButton.onclick = () => {
  commandQueue.length = 0;
  generateQueue();
};
generateQueue();
drawRover();
