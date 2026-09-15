(() => {
  "use strict";

  const canvas = document.getElementById("dungeon-canvas");
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = false;

  const GRID = 20;
  const TILE = 30;
  const START = { x: 3, y: 18 };

  const hpEl = document.querySelector("[data-hp]");
  const goldEl = document.querySelector("[data-gold]");
  const levelEl = document.querySelector("[data-level]");
  const messageEl = document.querySelector("[data-message]");
  const overlay = document.querySelector("[data-overlay]");
  const startPanel = document.querySelector("[data-start-panel]");
  const endPanel = document.querySelector("[data-end-panel]");
  const endKicker = document.querySelector("[data-end-kicker]");
  const endTitle = document.querySelector("[data-end-title]");
  const endCopy = document.querySelector("[data-end-copy]");
  const startButton = document.querySelector("[data-start]");
  const resetButton = document.querySelector("[data-reset]");
  const fullscreenButton = document.querySelector("[data-fullscreen]");
  const gameFrame = document.querySelector(".game-frame");
  const playAgainButton = document.querySelector("[data-play-again]");
  const characterButtons = [...document.querySelectorAll("[data-character]")];
  const moveButtons = [...document.querySelectorAll("[data-move]")];
  const teleportButton = document.querySelector("[data-teleport]");

  const spriteNames = {
    floor: "Boden.png",
    wall: "Wand.png",
    chestClosed: "TruheZu.png",
    chestOpen: "TruheOffen.png",
    gateClosed: "TorZu.png",
    gateOpen: "TorAuf.png",
    grave: "Grab.png",
    fighter: "kaempfer.png",
    mage: "mage.png",
    skeleton: "skelett.png",
    bat: "Bat.png"
  };

  const sprites = {};
  let selectedClass = "fighter";
  let state = null;
  let assetsReady = false;

  function randInt(min, maxInclusive) {
    return Math.floor(Math.random() * (maxInclusive - min + 1)) + min;
  }

  function shuffle(array) {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function createCharacter(type, x, y) {
    if (type === "fighter") {
      return { type, x, y, hp: 50, ap: 15, gold: 0, poison: 0, alive: true };
    }
    if (type === "mage") {
      return { type, x, y, hp: 20, ap: 8, gold: 0, poison: 0, alive: true };
    }
    if (type === "skeleton") {
      return { type, x, y, hp: 20, ap: 10, gold: randInt(0, 5), poison: 0, alive: true };
    }
    return { type: "bat", x, y, hp: 1, ap: 7, gold: 0, poison: 0, alive: true };
  }

  function blankTile(x, y, type = "floor") {
    return {
      x,
      y,
      type,
      open: false,
      gold: 0,
      heal: 0
    };
  }

  function gridAt(grid, x, y) {
    if (x < 0 || y < 0 || x >= GRID || y >= GRID) return null;
    return grid[y][x];
  }

  function entityAt(x, y, ignore = null) {
    if (!state) return null;
    if (state.player && state.player !== ignore && state.player.alive && state.player.x === x && state.player.y === y) {
      return state.player;
    }
    return state.enemies.find((enemy) =>
      enemy !== ignore && enemy.alive && enemy.x === x && enemy.y === y
    ) || null;
  }

  function passableForPath(tile) {
    return tile && tile.type !== "wall" && tile.type !== "chest" && tile.type !== "grave";
  }

  function hasPath(grid, start, exit) {
    const seen = Array.from({ length: GRID }, () => Array(GRID).fill(false));
    const queue = [start];
    seen[start.y][start.x] = true;

    while (queue.length) {
      const current = queue.shift();
      if (current.x === exit.x && current.y === exit.y) return true;

      for (const [dx, dy] of [[1,0],[-1,0],[0,1],[0,-1]]) {
        const nx = current.x + dx;
        const ny = current.y + dy;
        if (nx < 0 || ny < 0 || nx >= GRID || ny >= GRID || seen[ny][nx]) continue;
        const tile = gridAt(grid, nx, ny);
        if (!passableForPath(tile) && !(nx === exit.x && ny === exit.y)) continue;
        seen[ny][nx] = true;
        queue.push({ x: nx, y: ny });
      }
    }
    return false;
  }

  function createLevel() {
    let grid;
    let exit;

    for (let attempt = 0; attempt < 120; attempt += 1) {
      grid = Array.from({ length: GRID }, (_, y) =>
        Array.from({ length: GRID }, (_, x) => {
          if (x === 0 || y === 0 || x === GRID - 1 || y === GRID - 1) {
            return blankTile(x, y, "wall");
          }

          if (y !== 1 && y !== 18 && Math.random() < 0.20) {
            return blankTile(x, y, "wall");
          }

          if (Math.random() < 0.01) {
            const chest = blankTile(x, y, "chest");
            chest.gold = randInt(20, 59);
            chest.heal = randInt(13, 18);
            return chest;
          }

          return blankTile(x, y, "floor");
        })
      );

      exit = { x: randInt(1, 18), y: 1 };
      grid[exit.y][exit.x] = blankTile(exit.x, exit.y, "gate");
      grid[START.y][START.x] = blankTile(START.x, START.y, "floor");

      if (hasPath(grid, START, exit)) break;
    }

    const enemies = [];
    for (let y = 1; y < GRID - 1; y += 1) {
      for (let x = 1; x < GRID - 1; x += 1) {
        const tile = grid[y][x];
        if (tile.type !== "floor") continue;
        if (x === START.x && y === START.y) continue;
        if (Math.abs(x - START.x) + Math.abs(y - START.y) < 3) continue;

        const roll = Math.random();
        if (roll < 1 / 100) {
          enemies.push(createCharacter("bat", x, y));
        } else if (roll < 1 / 100 + 1 / 80) {
          enemies.push(createCharacter("skeleton", x, y));
        }
      }
    }

    state.grid = grid;
    state.exit = exit;
    state.enemies = enemies;
    state.player.x = START.x;
    state.player.y = START.y;
    state.teleportMode = false;
    state.turnLocked = false;
    setMessage(`Level ${state.level}. Reach the gate at the top.`);
  }

  function loadSprites() {
    const jobs = Object.entries(spriteNames).map(([key, file]) => new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        sprites[key] = img;
        resolve();
      };
      img.onerror = reject;
      img.src = `assets/${file}`;
    }));

    return Promise.all(jobs).then(() => {
      assetsReady = true;
      drawIdleBackground();
    });
  }

  function spriteForTile(tile) {
    if (tile.type === "wall") return sprites.wall;
    if (tile.type === "chest") return tile.open ? sprites.chestOpen : sprites.chestClosed;
    if (tile.type === "gate") return state && state.levelComplete ? sprites.gateOpen : sprites.gateClosed;
    if (tile.type === "grave") return sprites.grave;
    return sprites.floor;
  }

  function spriteForEntity(entity) {
    return sprites[entity.type];
  }

  function drawIdleBackground() {
    if (!assetsReady) return;
    for (let y = 0; y < GRID; y += 1) {
      for (let x = 0; x < GRID; x += 1) {
        ctx.drawImage(sprites.floor, x * TILE, y * TILE, TILE, TILE);
      }
    }
  }

  function draw() {
    if (!assetsReady || !state) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < GRID; y += 1) {
      for (let x = 0; x < GRID; x += 1) {
        const tile = state.grid[y][x];
        ctx.drawImage(spriteForTile(tile), x * TILE, y * TILE, TILE, TILE);
      }
    }

    for (const enemy of state.enemies) {
      if (!enemy.alive) continue;
      ctx.drawImage(spriteForEntity(enemy), enemy.x * TILE, enemy.y * TILE, TILE, TILE);
    }

    if (state.player.alive) {
      ctx.drawImage(spriteForEntity(state.player), state.player.x * TILE, state.player.y * TILE, TILE, TILE);
    }

    updateHud();
  }

  function updateHud() {
    if (!state) {
      hpEl.textContent = "—";
      goldEl.textContent = "—";
      levelEl.textContent = "—";
      return;
    }
    hpEl.textContent = Math.max(0, state.player.hp);
    goldEl.textContent = state.player.gold;
    levelEl.textContent = state.level;
  }

  function setMessage(text) {
    messageEl.textContent = text;
  }

  function applyPoison(entity) {
    if (entity.poison > 0 && entity.alive) {
      entity.hp -= 8;
      entity.poison -= 1;
      if (entity === state.player) {
        setMessage(`Poison deals 8 damage. ${entity.poison} poisoned turn${entity.poison === 1 ? "" : "s"} left.`);
      }
      if (entity.hp <= 0) {
        entity.alive = false;
      }
    }
  }

  function killEnemy(enemy) {
    enemy.alive = false;
    state.player.gold += enemy.gold;
    const tile = gridAt(state.grid, enemy.x, enemy.y);
    tile.type = "grave";
    setMessage(enemy.type === "bat" ? "Bat defeated." : `Skeleton defeated. +${enemy.gold} gold.`);
  }

  function attack(attacker, defender) {
    if (!attacker.alive || !defender.alive) return;

    if (attacker.type === "bat" && defender.poison <= 0) {
      defender.poison = 5;
      if (defender === state.player) {
        setMessage("A bat poisoned you for 5 turns.");
      }
    }

    defender.hp -= attacker.ap;

    if (defender.hp <= 0) {
      defender.alive = false;
      if (defender === state.player) {
        endGame();
      } else if (attacker === state.player) {
        killEnemy(defender);
      } else {
        const tile = gridAt(state.grid, defender.x, defender.y);
        tile.type = "grave";
      }
    } else if (attacker === state.player) {
      setMessage(`You hit the ${defender.type} for ${attacker.ap} damage.`);
    }
  }

  function tryMoveEntity(entity, dx, dy, distance = 1, isTeleport = false) {
    const tx = entity.x + dx * distance;
    const ty = entity.y + dy * distance;
    const tile = gridAt(state.grid, tx, ty);

    if (!tile) return false;

    const targetEntity = entityAt(tx, ty, entity);
    if (targetEntity) {
      attack(entity, targetEntity);
      return true;
    }

    if (tile.type === "wall" || tile.type === "grave") {
      if (entity === state.player) setMessage("A wall blocks the way.");
      return true;
    }

    if (tile.type === "chest") {
      if (entity !== state.player) return true;

      if (!tile.open) {
        tile.open = true;
        entity.gold += tile.gold;
        entity.hp += tile.heal;
        setMessage(`Chest opened: +${tile.gold} gold, +${tile.heal} HP.`);
      } else {
        setMessage("The chest is already empty.");
      }
      return true;
    }

    entity.x = tx;
    entity.y = ty;

    if (entity === state.player && tile.type === "gate") {
      state.levelComplete = true;
      draw();
      window.setTimeout(nextLevel, 480);
      return true;
    }

    if (entity === state.player && isTeleport) {
      setMessage("Teleported three tiles.");
    }

    return true;
  }

  function moveEnemies() {
    const directions = [[0,-1],[0,1],[-1,0],[1,0]];

    for (const enemy of state.enemies) {
      if (!enemy.alive || !state.player.alive) continue;

      applyPoison(enemy);
      if (!enemy.alive) {
        const tile = gridAt(state.grid, enemy.x, enemy.y);
        tile.type = "grave";
        continue;
      }

      const [dx, dy] = shuffle(directions)[0];
      const tx = enemy.x + dx;
      const ty = enemy.y + dy;
      const tile = gridAt(state.grid, tx, ty);

      if (!tile || tile.type === "wall" || tile.type === "grave" || tile.type === "chest" || tile.type === "gate") {
        continue;
      }

      const target = entityAt(tx, ty, enemy);
      if (target === state.player) {
        attack(enemy, state.player);
      } else if (!target) {
        enemy.x = tx;
        enemy.y = ty;
      }
    }
  }

  function afterPlayerTurn() {
    if (!state.player.alive || state.levelComplete) return;

    applyPoison(state.player);
    if (!state.player.alive) {
      endGame();
      draw();
      return;
    }

    moveEnemies();
    draw();

    if (!state.player.alive) {
      endGame();
    }
  }

  function directionVector(direction) {
    return {
      up: [0, -1],
      down: [0, 1],
      left: [-1, 0],
      right: [1, 0]
    }[direction];
  }

  function playerMove(direction) {
    if (!state || !state.running || state.turnLocked || !state.player.alive) return;

    const [dx, dy] = directionVector(direction);
    const wantsTeleport = state.teleportMode && state.player.type === "mage";

    if (wantsTeleport) {
      if (state.player.gold < 100) {
        state.teleportMode = false;
        teleportButton.classList.remove("is-active");
        setMessage("Teleport requires 100 gold.");
        return;
      }

      state.player.gold -= 100;
      state.teleportMode = false;
      teleportButton.classList.remove("is-active");
      tryMoveEntity(state.player, dx, dy, 3, true);
    } else {
      tryMoveEntity(state.player, dx, dy, 1, false);
    }

    if (!state.levelComplete) afterPlayerTurn();
    draw();
  }

  function toggleTeleport() {
    if (!state || !state.running || !state.player.alive) return;

    if (state.player.type !== "mage") {
      setMessage("Teleport is a Mage ability.");
      return;
    }

    if (state.player.gold < 100) {
      setMessage("You need 100 gold to teleport.");
      return;
    }

    state.teleportMode = !state.teleportMode;
    teleportButton.classList.toggle("is-active", state.teleportMode);
    setMessage(state.teleportMode ? "Teleport ready. Choose a direction." : "Teleport cancelled.");
  }

  function startGame() {
    if (!assetsReady) {
      setMessage("Loading game assets…");
      return;
    }

    const player = createCharacter(selectedClass, START.x, START.y);
    state = {
      player,
      grid: [],
      enemies: [],
      exit: null,
      level: 1,
      levelComplete: false,
      teleportMode: false,
      running: true,
      turnLocked: false
    };

    createLevel();
    overlay.classList.remove("is-visible");
    startPanel.classList.remove("is-hidden");
    endPanel.classList.add("is-hidden");
    teleportButton.classList.toggle("is-hidden", selectedClass !== "mage");
    draw();
    canvas.focus?.();
  }

  function nextLevel() {
    if (!state || !state.player.alive) return;
    state.level += 1;
    state.levelComplete = false;
    createLevel();
    draw();
  }

  function endGame() {
    if (!state) return;
    state.running = false;
    state.player.alive = false;
    endKicker.textContent = "Game over";
    endTitle.textContent = `Level ${state.level}`;
    endCopy.textContent = `You collected ${state.player.gold} gold before the run ended.`;
    startPanel.classList.add("is-hidden");
    endPanel.classList.remove("is-hidden");
    overlay.classList.add("is-visible");
    updateHud();
  }

  function showStartScreen() {
    state = null;
    updateHud();
    setMessage("Select a character to begin.");
    startPanel.classList.remove("is-hidden");
    endPanel.classList.add("is-hidden");
    overlay.classList.add("is-visible");
    teleportButton.classList.remove("is-active");
    drawIdleBackground();
  }


  function updateFullscreenButton() {
    if (!fullscreenButton) return;
    const active = document.fullscreenElement === gameFrame;
    fullscreenButton.textContent = active ? "Exit fullscreen" : "Fullscreen";
    fullscreenButton.setAttribute(
      "aria-label",
      active ? "Exit fullscreen" : "Enter fullscreen"
    );
  }

  async function toggleFullscreen() {
    if (!gameFrame || !fullscreenButton) return;

    try {
      if (document.fullscreenElement === gameFrame) {
        await document.exitFullscreen();
      } else if (gameFrame.requestFullscreen) {
        await gameFrame.requestFullscreen();
      } else {
        setMessage("Fullscreen is not supported by this browser.");
      }
    } catch {
      setMessage("Fullscreen could not be opened.");
    }
  }

  if (!document.fullscreenEnabled && fullscreenButton) {
    fullscreenButton.disabled = true;
    fullscreenButton.title = "Fullscreen is not supported by this browser.";
  }

  document.addEventListener("fullscreenchange", updateFullscreenButton);
  fullscreenButton?.addEventListener("click", toggleFullscreen);

  characterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      selectedClass = button.dataset.character;
      characterButtons.forEach((item) => item.classList.toggle("is-selected", item === button));
    });
  });

  startButton.addEventListener("click", startGame);
  resetButton.addEventListener("click", showStartScreen);
  playAgainButton.addEventListener("click", showStartScreen);

  moveButtons.forEach((button) => {
    button.addEventListener("click", () => playerMove(button.dataset.move));
  });

  teleportButton.addEventListener("click", toggleTeleport);

  document.addEventListener("keydown", (event) => {
    const keyMap = {
      ArrowUp: "up",
      ArrowDown: "down",
      ArrowLeft: "left",
      ArrowRight: "right"
    };

    if (keyMap[event.key]) {
      event.preventDefault();
      playerMove(keyMap[event.key]);
      return;
    }

    if (event.key.toLowerCase() === "t") {
      event.preventDefault();
      toggleTeleport();
    }

    if (event.key.toLowerCase() === "r") {
      event.preventDefault();
      showStartScreen();
    }

    if (!state && (event.key === "ArrowLeft" || event.key === "ArrowRight")) {
      selectedClass = selectedClass === "fighter" ? "mage" : "fighter";
    
  function updateFullscreenButton() {
    if (!fullscreenButton) return;
    const active = document.fullscreenElement === gameFrame;
    fullscreenButton.textContent = active ? "Exit fullscreen" : "Fullscreen";
    fullscreenButton.setAttribute(
      "aria-label",
      active ? "Exit fullscreen" : "Enter fullscreen"
    );
  }

  async function toggleFullscreen() {
    if (!gameFrame || !fullscreenButton) return;

    try {
      if (document.fullscreenElement === gameFrame) {
        await document.exitFullscreen();
      } else if (gameFrame.requestFullscreen) {
        await gameFrame.requestFullscreen();
      } else {
        setMessage("Fullscreen is not supported by this browser.");
      }
    } catch {
      setMessage("Fullscreen could not be opened.");
    }
  }

  if (!document.fullscreenEnabled && fullscreenButton) {
    fullscreenButton.disabled = true;
    fullscreenButton.title = "Fullscreen is not supported by this browser.";
  }

  document.addEventListener("fullscreenchange", updateFullscreenButton);
  fullscreenButton?.addEventListener("click", toggleFullscreen);

  characterButtons.forEach((button) => {
        button.classList.toggle("is-selected", button.dataset.character === selectedClass);
      });
    }

    if (!state && event.key === "Enter") {
      startGame();
    }
  });

  loadSprites().catch(() => {
    setMessage("The game assets could not be loaded.");
  });
})();
