"use strict";
var atom = require("../lib/atom_state"),
    _ = require("mori"),
    Dispatcher = require("../lib/dispatcher"),
    Actions = require("../config/actions");

/**

A Store deals with one domain has two main responsibilites:

1) It acts as a facade to the full atom, via query method.
   Basically these mean "getXXXX" from this version of the atom.

2) Listen to Dispatcher messages/actions and update the atom

**/

/**
This configures the path in the atom tree this
Store will be querying/modifying
**/
var s = {
  todos: ["data", "todos"]
}



//debugging - just for creating random items
var pending = 1000,
    interval;

/** Creates a new todo hashmap with a random id **/
function createTodo(text){
  var newId = (new Date().valueOf() + Math.floor(Math.random()*9999)).toString(16);
  //simpler step, avoid duplicate ids when adding 1000 very fast
  var newId = _.count(atom.getIn(s.todos))+1;
  return _.hashMap("id", newId, "completed", false, "text", text);
}

/** Creates a random text **/
function createRandomTodo(){
  var verbs = ["Learn", "Tidy", "Think about", "Prepare", "Compile"],
      subjects = ["React", "Javascript", "morijs", "my room", "my pet", "her dress"],
      when = ["tomorrow", "next day", "next week", "whenever possible", "ASAP!"];

  return verbs[Math.floor(Math.random()*verbs.length)] + " " +
    subjects[Math.floor(Math.random()*subjects.length)] + " " +
    when[Math.floor(Math.random()*when.length)];
}

//Store last version saved to avoid persisting the same twice
var lastSaved;
/** Persists the todo list to the browser's Local Storage **/
function saveToLocalStorage(){
  //Devtools: this breaks action replayability
  return;
  var todos = atom.getIn(s.todos);
  if(!_.equals(todos, lastSaved)){
    var todoList = _.toJs(todos);
    lastSaved = todos;
    localStorage.setItem("redflow-todos", JSON.stringify(todoList));
  }
}
/** Loads from Local Storage the todo list into the atom **/
function loadFromLocalStorage(){
  var todoJSON = localStorage.getItem("redflow-todos");
  return todoJSON ? JSON.parse(todoJSON) : [];
}
/** Store public API **/
var TodosStore = {
  /** Query Methods **/

  //Returns the list of active items in this specific state
  getActiveItems: function(state){
    /**
    mori.filter recevies a filtering function and a collection
    **/
    return _.filter(function(item){
      return (_.get(item, "completed") === false);
    },_.getIn(state, s.todos));
  },
  //Returns the list of items with {completed:true} in this specific state
  getCompletedItems: function(state){
    return _.filter(function(item){
      return _.get(item, "completed") === true;
    },_.getIn(state, s.todos));
  },
  //Returns all items in this specific state
  getAllItems: function(state){
    return _.getIn(state, s.todos);
  },
  //Returns the # of active items in this specific state
  getActiveItemCount: function(state){
    return _.count(_.filter(function(item){
      return _.get(item, "completed") === false;
    }, _.getIn(state, s.todos)));
  },

  /** Actions Listeners **/
  //Loads todos from Local Storage
  loadTodos: Dispatcher.listen(Actions.TODO_LOAD, function(){
    var savedTodos = loadFromLocalStorage();
    if(savedTodos.length)
      atom.assocIn(s.todos, _.toClj(savedTodos));
  }),
  //Creates a new todo item with the given todoText
  addTodo: Dispatcher.listen(Actions.TODO_ADD, function(payload){
    var todoText = payload.text;
    /**
    atom.updateIn replaces a full subtree of the atom
    It receives the path and a function that will receive
    the current subtree and should *return* the new one
    **/
    atom.updateIn(s.todos, function(list){
      /**
      If we simply add a new item to a vector using mori.conj()
      it will be pushed at the end. Instead, we create a new vector
      containing the new item, and concatenate the new with the old one
      using mori.into(col1, col2)
      **/
      var newTodo = _.vector(createTodo(todoText));
      //append at list beginning
      return _.into(newTodo, list);
    });
    saveToLocalStorage();
  }),
  //Updates an existing todo with a new text
  updateTodo: Dispatcher.listen(Actions.TODO_UPDATE, function(payload){
    var todoId = payload.id,
        todoText = payload.text;
    atom.updateIn(s.todos, function(list){
      /** We simply map the collection back, changing only the specific item **/
      return _.map(function(item){
        if(_.get(item, "id") === todoId) {
          return _.assoc(item, "text", todoText);
        }
        else {
          return item;
        }
      }, list);
    });
    saveToLocalStorage();
  }),
  //Toggles the todo with id {todoId} "completed" state
  toggleTodo: Dispatcher.listen(Actions.TODO_TOGGLE, function(payload){
    var todoId = payload.id;
    atom.updateIn(s.todos, function(list){
      return _.map(function(item){
        if(_.get(item, "id") === todoId){
          return _.assoc(item, "completed", !_.get(item, "completed"));
        }
        else {
          return item;
        }
      }, list);
    });
    saveToLocalStorage();
  }),
  //Removes a todo from the list, by its id
  removeTodo: Dispatcher.listen(Actions.TODO_DELETE, function(payload){
    var todoId = payload.id;
    atom.updateIn(s.todos, function(list){
      /** For removal, we replace the collection with a new one
      with the unwanted element filtered out **/
      return _.filter(function(item){
        return _.get(item, "id") !== todoId;
      }, list);
    });
    saveToLocalStorage();
  }),
  //Removes every completed todo from the list
  removeAllCompleted: Dispatcher.listen(Actions.TODO_CLEAR_COMPLETED, function(){
    atom.updateIn(s.todos, function(list){
      return _.filter(function(item){
        return _.get(item, "completed") === false;
      }, list);
    });
    saveToLocalStorage();
  }),



  //Utility - just for learning purposes
  addRandomItems: function(){
    interval = setInterval(function(){
      if(pending){
        var state = atom.get();
        TodosStore.addTodo(createRandomTodo());
        pending--;
      }
      else {
        clearInterval(interval);
        TodosStore.addTodo(createRandomTodo());
      }
    }, 1);
  }
};

module.exports = TodosStore;