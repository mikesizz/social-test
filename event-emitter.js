(() => {
    class EventEmitter {
        handlers = {};
        oneTimeHandlers = {};

        emit() {
            const originalArgs = Array.prototype.slice.call(arguments, 0);

            // Get the event key from arguments.
            const key = originalArgs[0];

            // Get the remaining arguments to use as handler arguments.
            const args = originalArgs.slice(1);

            // Call all handlers for the given event key.
            if (this.handlers.hasOwnProperty(key)) {
                for (var i = 0; i < this.handlers[key].length; i++) {
                    this.handlers[key][i].apply(this, args);
                }
            }

            // Call all one time handlers for the given key.
            if (this.oneTimeHandlers.hasOwnProperty(key)) {
                // Cache one time handlers for event key.
                const oneTimeHandlers = this.oneTimeHandlers[key];

                // Reset the list of one time handlers for the event key.
                this.oneTimeHandlers[key] = [];

                // Call all one time handlers for given event key.
                for (let i = 0; i < oneTimeHandlers.length; i++) {
                    oneTimeHandlers[i].apply(this, args);
                }
            }
        }

        on(key, handler) {
            // Add handler array for given handler key.
            this.handlers[key] = this.handlers.hasOwnProperty(key) ? this.handlers[key] : [];
        
            // Add handler to handler array.
            this.handlers[key].push(handler);
        }

        once(key, handler) {
            // Add one time handler array for given handler key.
            this.oneTimeHandlers[key] = this.oneTimeHandlers.hasOwnProperty(key) ? this.oneTimeHandlers[key] : [];

            // Add one time handler to one time handler array.
            this.oneTimeHandlers[key].push(handler);
        }
    }

    window.EventEmitter = EventEmitter;
})();