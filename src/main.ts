import "./style.css";
import data from "./config";

class Pos {
  x: number;
  y: number;
  w: number;
  h: number;

  constructor(x: number, y: number, w: number, h: number) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  shift(dx: number, dy: number) {
    return new Pos(this.x + dx, this.y + dy, this.w, this.h);
  }

  getGridArea() {
    return `${this.y + 1} / ${this.x + 1} / ${this.y + this.h + 1} / ${this.x + this.w + 1}`;
  }
}

class Lesson {
  title: string;
  pos: Pos;
  color: string;

  constructor(title: string, pos: Pos, color: string) {
    this.title = title;
    this.pos = pos.shift(0, pos.y < 4 ? 1 : 2);
    this.color = color; 
  }
}

const container = document.querySelector<HTMLDivElement>(".container")!;

function addToContainer({ title, pos, color }: Lesson) {
  let el = document.createElement("div");

  el.setAttribute("data-info", JSON.stringify({ title, pos, color }));

  el.textContent = title;
  el.style.gridArea = pos.getGridArea();
  el.style.borderColor = color;

  container.appendChild(el);
  return el;
}

function parseChunks(x: number, list: string) {
  let results: Lesson[] = [];

  for (let y = 0; y < list.length;) {
    let char = list[y];

    let title = data.courses.find(cour => cour.id === char)!.name;
    let color = data.colors.find(col => col.match.includes(char))!.color;

    let dy = 1, duration = dy;
    while (y + dy < list.length && list[y + dy] === char)
      duration = ++dy;

    let pos = new Pos(x, y, 1, duration);

    results.push(new Lesson(title, pos, color));

    y += dy;
  }

  return results;
}

addToContainer({
  title: "午休",
  pos: new Pos(0, 5, 5, 1),
  color: data.uiColor
});

for (let x = 0; x < 5; ++x) {
  let routine = data.routine[x];

  addToContainer({
    title: routine.title,
    pos: new Pos(x, 0, 1, 1),
    color: data.uiColor
  });

  let chunks = parseChunks(x, routine.list);
  for (let lesson of chunks)
    addToContainer(lesson);
}