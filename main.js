const eventAggregator = (function () {
  const events = {};

  function register(name, handler) {
    events[name] = events[name] || [];
    events[name].push(handler);
  }

  function trigger(name, args) {
    events[name] = events[name] || [];
    events[name].forEach(handler => handler(args));
  }

  return { register, trigger };
})();

const colorUtils = (function () {
  function _randomNumber(n) {
    return Math.floor(Math.random() * (n + 1));
  }

  function generateRandomRGBColor() {
    const red = _randomNumber(255);
    const green = _randomNumber(255);
    const blue = _randomNumber(255);

    return `rgb(${red},${green},${blue})`;
  }

  return { generateRandomRGBColor };
})();

const boardController = (function () {
  // Model
  const MIN_CELLS = 1;
  const MAX_CELLS = 64;
  let numCells;

  // Event listeners
  eventAggregator.register('boardCellCountInput', (cells) => _setNumCells(cells));
  eventAggregator.register('boardViewInit', () => {
    const numCellsDefault = 16;
    _setNumCells(numCellsDefault);
  })

  // Helpers
  function _setNumCells(value) {
    if (isNaN(value) || value < MIN_CELLS || value > MAX_CELLS) return;

    numCells = value;
    eventAggregator.trigger('numCellsUpdated', numCells);
  }
})();

const boardView = (function () {
  // Board Info
  const boardSizeInPixels = 550;
  let boardCellCount;
  let boardCellPixelSize;

  // Color Display Info
  const DEFAULT_PEN_COLOR = '#000';
  let penIsDown = false;

  // DOM Cache
  const boardDisplay = document.getElementById('board');
  const resetBtn = document.querySelector('button.reset');
  const rainbowBtn = document.querySelector('button.rainbow');

  // Events Listeners
  resetBtn.addEventListener('click', _handleCellsReset);
  rainbowBtn.addEventListener('click', _handleRainbowSelection);
  eventAggregator.register('numCellsUpdated', _handleBoardCellSizeUpdated);

  // Init
  eventAggregator.trigger('boardViewInit');
  _createEmptyBoard();

  // DOM Helpers
  function _createEmptyBoard() {
    const cellEvents = {
      'click': _handleCellClick,
      'mouseover': _handleCellHover
    };

    for (let i = 0; i < boardCellCount; i++) {
      const row = document.createElement('div');
      row.classList.add('row');

      for (let j = 0; j < boardCellCount; j++) {
        const cell = _createCell(cellEvents);
        row.append(cell);
      }

      boardDisplay.appendChild(row);
    }
  }

  function _resetBoardDisplay() {
    rainbowBtn.dataset.rainbow = 'disabled';
    penIsDown = false;
    [...boardDisplay.children].forEach(rowElem => boardDisplay.removeChild(rowElem));
    _createEmptyBoard();
  }

  function _createCell(cellElemEvents) {
    const cell = document.createElement('div');

    cell.classList.add('cell');
    cell.style.cssText = _setCellStyle();

    Object.keys(cellElemEvents).forEach(ev => {
      cell.addEventListener(ev, cellElemEvents[ev])
    });

    return cell;
  }

  function _setCellStyle() {
    return `width: ${boardCellPixelSize}px;height: ${boardCellPixelSize}px;flex: 1 1 ${boardCellPixelSize}px`;
  }

  function _paintCell(cell) {
    if (rainbowBtn.dataset.rainbow === 'enabled') {
      cell.style.backgroundColor = colorUtils.generateRandomRGBColor();
      cell.dataset.color = 'random';
      return;
    }

    cell.style.backgroundColor = DEFAULT_PEN_COLOR;
    cell.dataset.color = 'default';
  }

  function _toggleRainbow(rainbow) {
    if (rainbow === 'enabled') return 'disabled';
    return 'enabled';
  }

  // Event Handlers
  function _handleBoardCellSizeUpdated(numCells) {
    boardCellCount = numCells;
    boardCellPixelSize = boardSizeInPixels / boardCellCount;
    _resetBoardDisplay();
  }

  function _handleCellsReset() {
    const message = 'How many cells per line (MIN = 1, MAX = 64)?'
    const cells = +prompt(message);

    if (isNaN(cells)) return;

    eventAggregator.trigger('boardCellCountInput', cells);
  }

  function _handleRainbowSelection() {
    this.dataset.rainbow = _toggleRainbow(this.dataset.rainbow);
    penIsDown = false;
  }

  function _handleCellClick(event) {
    penIsDown = !penIsDown;
    if (penIsDown) _paintCell(event.target);
  }

  function _handleCellHover(event) {
    if (penIsDown) _paintCell(event.target);
  }
})();