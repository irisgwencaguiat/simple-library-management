const localStorageService = {
    save(name, value) {
        window.localStorage.setItem(name, value);
    },

    get(name) {
        return window.localStorage.getItem(name) || null;
    },

    remove(name) {
        window.localStorage.removeItem(name);
    },
};

export default localStorageService;
