module.exports = {

	mockLocalStorage: function() {

    window.localStorage = {

      setItem: function () {
        return '[{"id":0,"completed":false,"text":"Learn RedFlow"},{"id":1,"completed":true,"text":"Find a nice React architecture :)"}]';
      },

      getItem: function () {}

    };

	}
};
