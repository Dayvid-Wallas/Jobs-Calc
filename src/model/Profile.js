let data = {
    name: 'Dayvid',
    avatar: 'https://avatars.githubusercontent.com/u/96118837?v=4',
    monthlyBudget: 10000,
    hoursPerDay: 5,
    daysPerWeek: 5,
    vacationPerYear: 4,
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