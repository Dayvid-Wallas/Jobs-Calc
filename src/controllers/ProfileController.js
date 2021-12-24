const Profile = require('../model/Profile');

module.exports = {
    index(request, response) {
        return response.render('profile', { profile: Profile.get() });
    },

    update(request, response) {
        const data = request.body;
        const weeksPerYear = 52;
        const weeksPerMonth = (weeksPerYear - data['vacation-per-year']) / 12;
        const weekTotalHours = data['hours-per-day'] * data['days-per-week'];
        const monthlyTotalHours = weekTotalHours * weeksPerMonth;
        const value_Hour = data['monthly-budget'] / monthlyTotalHours;
        
        Profile.update({
            ...Profile.get(),
            ...request.body,
            valueHour: value_Hour
        })
        return response.redirect('/profile');
    }
}