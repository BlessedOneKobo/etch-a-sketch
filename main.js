/**
 * Handles event delegation and message passing
 * @module eventAggregator
 */
const eventAggregator = (function () {
  const events = {};

  /**
   * Registers an event handler
   * @param {string} name - Event name
   * @param {function} handler - Function to execute when the event triggered
   */
  function register(name, handler) {
    events[name] = events[name] || [];
    events[name].push(handler);
  }

  /**
   * Executes the handlers for an event
   * @param {string} name - The name of the event
   * @param {any} args - The argument(s) to pass to each event handler
   */
  function trigger(name, args) {
    events[name] = events[name] || [];
    events[name].forEach(handler => handler(args));
  }

  return { register, trigger };
})();

/**
 * Handles colors
 * @module colorUtils
 */
const colorUtils = (function () {
  /**
   * Generate a random number
   * @param {number} n - The upper limit of the number to be generated
   * @return {number} A number in the range of 1 and n
   */
  function _randomNumber(n) {
    return Math.floor(Math.random() * (n + 1));
  }

  /**
   * Generate a random RGB color string
   * @return {string} An RGB string for a random color
   */
  function generateRandomRGBColor() {
    const red = _randomNumber(255);
    const green = _randomNumber(255);
    const blue = _randomNumber(255);

    return `rgb(${red},${green},${blue})`;
  }

  return { generateRandomRGBColor };
})();

/**
 * Manages board state
 * @module boardController
 */
const boardController = (function () {
  const NUM_CELLS_DEFAULT = 16;
  const MIN_CELLS = 1;
  const MAX_CELLS = 64;
  let length = 0;

  // Event listeners //

  eventAggregator.register('boardViewInit', () => _setNumCells(NUM_CELLS_DEFAULT));
  eventAggregator.register('boardLengthInput', cells => _setNumCells(cells));

  /**
   * Sets the value of length
   * @param {number} value - The new value of length
   */
  function _setNumCells(value) {
    if (value === 0) eventAggregator.trigger('boardLengthUpdated', length);

    if (isNaN(value) || value < MIN_CELLS || value > MAX_CELLS) return;

    length = value;
    eventAggregator.trigger('boardLengthUpdated', length);
  }
})();

/**
 * Manages board display
 * @module boardView
 */
const boardView = (function () {
  // Board Info //

  const boardPixelSize = 550;
  let boardLength = 0;
  let boardCellPixelSize = 0;

  // Color Display Info //

  const DEFAULT_PEN_COLOR = '#000';
  let penIsOnTheBoard = false;

  // DOM Cache //

  const boardDisplay = document.getElementById('board');
  const resetBtn = document.querySelector('button.reset');
  const rainbowBtn = document.querySelector('button.rainbow');

  // Events Listeners //

  resetBtn.addEventListener('click', _promptUserForNewBoardDimensions);
  rainbowBtn.addEventListener('click', _handleRainbowSelection);
  eventAggregator.register('boardLengthUpdated', _updateBoardDimensions);

  // Init //

  eventAggregator.trigger('boardViewInit');
  _resetBoardDisplay();

  // DOM Helpers //

  /** Render an empty board */
  function _renderEmptyBoard() {
    const cellEvents = {
      click: _handleCellClick,
      mouseover: _handleCellHover,
    };

    for (let i = 0; i < boardLength; i++) {
      const row = document.createElement('div');
      row.classList.add('row');

      for (let j = 0; j < boardLength; j++) {
        const cell = _createCell(cellEvents);
        row.append(cell);
      }

      boardDisplay.appendChild(row);
    }
  }

  /** Restore the display to initial state */
  function _resetBoardDisplay() {
    rainbowBtn.dataset.rainbow = 'disabled';
    penIsOnTheBoard = false;
    [...boardDisplay.children].forEach(rowElem => boardDisplay.removeChild(rowElem));
    _renderEmptyBoard();
  }

  /**
   * Create a board cell on the DOM
   * @param {object} cellElemEvents - The events and handlers for the cell
   * @return {HTMLDivElement} The created DOM element
   */
  function _createCell(cellElemEvents) {
    const cell = document.createElement('div');

    cell.classList.add('cell');
    cell.style.cssText = _generateCellCSS();

    Object.keys(cellElemEvents).forEach(ev => {
      cell.addEventListener(ev, cellElemEvents[ev]);
    });

    return cell;
  }

  /**
   * Generate CSS rules for each cell
   * @return {string} The CSS rules for the cell
   */
  function _generateCellCSS() {
    const pixelSize = `${boardCellPixelSize}px`;
    return `width: ${pixelSize}; height: ${pixelSize}; flex: 1 1 ${pixelSize}`;
  }

  /**
   * Change the color of a cell
   * @param {HTMLDivElement} cell - The DOM Element for the cell
   */
  function _paintCell(cell) {
    if (rainbowBtn.dataset.rainbow === 'enabled') {
      cell.style.backgroundColor = colorUtils.generateRandomRGBColor();
      cell.dataset.color = 'random';
      return;
    }

    cell.style.backgroundColor = DEFAULT_PEN_COLOR;
    cell.dataset.color = 'default';
  }

  /**
   * Toggle the value of rainbow setting
   * @param {string} currentSetting - The current rainbow
   * @return {string} The new setting after it has been toggled
   */
  function _toggleRainbowSetting(currentSetting) {
    if (currentSetting === 'enabled') return 'disabled';
    return 'enabled';
  }

  // Event Handlers //

  /**
   * Reset board with new dimensions
   * @param {number} newLength - Updated board length
   */
  function _updateBoardDimensions(newLength) {
    boardLength = newLength;
    boardCellPixelSize = boardPixelSize / boardLength;
    _resetBoardDisplay();
  }

  /** Prompts the user for new board dimensions */
  function _promptUserForNewBoardDimensions() {
    const message = 'How many cells per line (MIN = 1, MAX = 64)?';
    const userInput = prompt(message);
    const cells = +userInput;

    if (userInput === null || isNaN(cells)) return;

    eventAggregator.trigger('boardLengthInput', cells);
  }

  /** Toggle rainbow setting and raise painting pen from the board */
  function _handleRainbowSelection() {
    this.dataset.rainbow = _toggleRainbowSetting(this.dataset.rainbow);
    penIsOnTheBoard = false;
  }

  /**
   * Toggle painting pen status and paint the cell if the pen is on the board
   * @param {Event} event - Event object
   */
  function _handleCellClick(event) {
    penIsOnTheBoard = !penIsOnTheBoard;
    if (penIsOnTheBoard) _paintCell(event.target);
  }

  /**
   * Paint the cell if the painting pen is on the board
   * @param {Event} event - Event object
   */
  function _handleCellHover(event) {
    if (penIsOnTheBoard) _paintCell(event.target);
  }
})();
