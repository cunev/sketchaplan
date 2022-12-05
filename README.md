![](https://i.imgur.com/lhcJ82D.png)

<hr>
<div align="center" style="display:flex;flex-direction:column;">
  <h3>A simple hand-drawn task and project planner.<br>Inspired from your favorite drawing tool Excalidraw</h3>
  <img src="https://img.shields.io/static/v1?label=Status&message=Under%20development&color=red">
  <p>Start using it on <a target="_blank" href="https://www.sketchaplan.com/">sketchaplan.com</a>.</p>
</div>

## Concept
The goal of Sketchaplan is to provide an easy to use and simple task manager and/or project planner. Currently, the project is in **development** and
it does not reflect the final state of the product.

Initially, Sketchaplan was developed to plan small scale projects for my university, but since it might be useful to others, I decided to make it public and open-source.

## Controls
- **Delete** - Removes a block 
- **Alt+Wheel** - Zoom
- **Middle Mouse** - Move canvas camera
- **Drag n' Drop** - Add image
- **CTRL+Left Click** - Select multiple

## Groups
You can use groups to have a collection of tasks, just like in Trello!
![](https://i.imgur.com/hynoU02.gif)

## Images
You can drag and drop images into the canvas.
![](https://i.imgur.com/6ot4UqH.gif)

## Development
Sketchaplan is powered by Vite and P5 and runs on HTML5 Canvas + React.
> The project is **not** a fork and **not** affiliated with Excalidraw.

### Local Installation

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

#### Requirements

- [Node.js](https://nodejs.org/en/)
- [Yarn](https://yarnpkg.com/getting-started/install) (v1 or v2.4.2+)
- [Git](https://git-scm.com/downloads)

#### Clone the repo

```bash
git clone https://github.com/sketchaplan/sketchaplan.git
```

#### Install the dependencies

```bash
yarn
```

#### Start the server

```bash
yarn start
```

Now you can open [http://localhost:5173](http://localhost:5173) and start coding in your favorite code editor.

## Contributing

Pull requests are welcome. For major changes, please [open an issue](https://github.com/cunev/sketchaplan/issues/new) first to discuss what you would like to change.

## Notable used tools

- [Vite](https://github.com/vitejs/vite)
- [p5.js](https://github.com/processing/p5.js?files=1)
- [Rough.js](https://roughjs.com)
- [TypeScript](https://www.typescriptlang.org)
