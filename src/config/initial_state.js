module.exports = {
  routes: {
    //current active page
    page: "all"
  },
  data: {
    //list of todos, we have no backend so start with these two
    todos: [
      {
        id: 2,
        completed: false,
        text: "Learn RedFlow"
      },
      {
        id: 1,
        completed: true,
        text: "Find a nice React architecture :)"
      }
    ]
  }
};
