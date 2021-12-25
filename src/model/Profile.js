let data = {
    name: 'Dayvid',
    avatar: 'https://avatars.githubusercontent.com/u/96118837?v=4',
    'monthly-budget': 10000,
    'hours-per-day': 5,
    'days-per-week': 5,
    'vacation-per-year': 4,
    'value-hour': 50
};

module.exports = {
    get() {
        return data;
    },

    update(newData) {
        data = newData;
    }
};