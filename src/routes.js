const { request } = require('express');
const express = require('express');
const routes = express.Router();

const folderViews = `${__dirname}/views/`;

const profile = {
    data: {
        name: 'Dayvid',
        avatar: 'https://avatars.githubusercontent.com/u/96118837?v=4',
        monthlyBudget: 10000,
        hoursPerDay: 5,
        daysPerWeek: 5,
        vacationPerYear: 4,
        valueHour: 50
    },

    controllers: {
        index(request, response) {
            return response.render(`${folderViews}profile`, { profile: profile.data });
        },

        update() {

        }
    }
};

const job = {
    data: [
        {
            id: 1,
            name: 'Pizzaria Guloso',
            'daily-hours': 2,
            'total-hours': 1,
            createdIn: Date.now()
        },
        {
            id: 2,
            name: 'OneTwo Project',
            'daily-hours': 2,
            'total-hours': 11,
            createdIn: Date.now()
        }
    ],

    controllers: {
        index(request, response) {
            const newArrayJobs = job.data.map((job) => {
            const remaining = job.services.remainingDays(job);
            const status = remaining <= 0 ? 'done' : 'progress';
            return {
                ...job,
                remaining,
                status,
                price: profile.data.valueHour * job['total-hours']
            }
        })
        return response.render(`${folderViews}index`, { jobs: newArrayJobs });
        },

        create(request, response) {
            return response.render(`${folderViews}job`);
        },

        //Creating POST route to receive form data
        save(request, response) {
            //request.body = { name: 'Dayvid', 'daily-hours': '6', 'total-hours': '20' }            
            const lastId = job.data[job.data.length - 1]?.id || 1;            
            jobs.push({
                id: lastId + 1,
                name: request.body.name,
                'daily-hours': request.body['daily-hours'],
                'total-hours': request.body['total-hours'],
                createdIn: Date.now()
            });
            return response.redirect('/');
        }
    },

    services: {
        remainingDays(job) {
            const remainingDays = (job.data['total-hours'] / job.data['daily-hours']).toFixed();
            const createdDate = new Date(job.data.createdIn);
            const dueDay = createdDate.getDate() + Number(remainingDays);
            const dueDateInMs = createdDate.setDate(dueDay);
            const timeDiffInMs = dueDateInMs - Date.now();
            const dayInMs = 1000 * 60 * 60 * 24;
            const dayDiff = Math.floor(timeDiffInMs / dayInMs);
            return dayDiff;
        }
    }
};

routes.get('/', job.controllers.index);
routes.get('/job', job.controllers.create);
routes.post('/job', job.controllers.save);
routes.get('/profile', profile.controllers.index);
routes.post('/profile', profile.controllers.update);

routes.get('/job-edit', (request, response) => {
    return response.render(`${folderViews}job-edit`);
});

module.exports = routes;