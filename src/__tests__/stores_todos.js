jest.autoMockOff();

var //test dependencies

  testUtils = require('../__tests__utils/test_utils'),

  getStoreTodoItems = function () {
    var activeItems = TodosStore.getActiveItems(atom.get()),
      completedItems = TodosStore.getCompletedItems(atom.get()),
      allItems = TodosStore.getAllItems(atom.get());
    return {
      activeItems: activeItems,
      activeItemsCount: _.count(activeItems),
      completedItems: completedItems,
      completedItemsCount: _.count(completedItems),
      allItems: allItems,
      allItemsCount: _.count(allItems)
    };
  },

  //store to test

  TodosStore = require('../stores/todos.js')

  //app dependencies

  _ = require('mori'),
  atom = require('../lib/atom_state'),
  initialState = require('../config/initial_state'),
  Dispatcher = require('../lib/dispatcher'),
  Actions = require('../config/actions');

describe('Tests > Store > Todos', function() {

  beforeEach(function () {
    testUtils.mockLocalStorage();
    atom.silentSwap(_.toClj(initialState));
    Dispatcher.emit(Actions.TODO_LOAD);
  });

  it('Load data from localStorage', function () {
    var todoItems = getStoreTodoItems();
    expect(todoItems.activeItemsCount).toBe(1);
    expect(todoItems.completedItemsCount).toBe(1);
    expect(todoItems.allItemsCount).toBe(2);
  });

  it('Register a new TODO with the dispatcher', function () {
    Dispatcher.emit(Actions.TODO_ADD, 'This is a new TODO');
    var todoItems = getStoreTodoItems();
    expect(todoItems.activeItemsCount).toBe(2);
    expect(todoItems.completedItemsCount).toBe(1);
    expect(todoItems.allItemsCount).toBe(3);
  });

  it('Update a TODO text with the dispatcher', function () {
    Dispatcher.emit(Actions.TODO_UPDATE, 0, 'New text');
    var todoItems = getStoreTodoItems();
    expect(_.toJs(todoItems.allItems)[0].text).toBe('New text');
    expect(todoItems.activeItemsCount).toBe(1);
    expect(todoItems.completedItemsCount).toBe(1);
    expect(todoItems.allItemsCount).toBe(2);
  });

  it('Delete a TODO text with the dispatcher', function () {
    Dispatcher.emit(Actions.TODO_DELETE, 0);
    var todoItems = getStoreTodoItems();
    expect(todoItems.activeItemsCount).toBe(0);
    expect(todoItems.completedItemsCount).toBe(1);
    expect(todoItems.allItemsCount).toBe(1);
  });

  it('Toogle an active item with the dispatcher', function () {
    Dispatcher.emit(Actions.TODO_TOGGLE, 0);
    var todoItems = getStoreTodoItems();
    expect(todoItems.activeItemsCount).toBe(0);
    expect(todoItems.completedItemsCount).toBe(2);
    expect(todoItems.allItemsCount).toBe(2);
  });

  it('Toggle an inactive item with the dispatcher', function () {
    Dispatcher.emit(Actions.TODO_TOGGLE, 1);
    var todoItems = getStoreTodoItems();
    expect(todoItems.activeItemsCount).toBe(2);
    expect(todoItems.completedItemsCount).toBe(0);
    expect(todoItems.allItemsCount).toBe(2);
  });

  it('Clear all completed items with the dispatcher', function () {
    Dispatcher.emit(Actions.TODO_CLEAR_COMPLETED);
    var todoItems = getStoreTodoItems();
    expect(todoItems.activeItemsCount).toBe(1);
    expect(todoItems.completedItemsCount).toBe(0);
    expect(todoItems.allItemsCount).toBe(1);
  });

});
