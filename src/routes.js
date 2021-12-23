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

        update(request, response) {
            const data = request.body;
            const weeksPerYear = 52;
            const weeksPerMonth = (weeksPerYear - data['vacation-per-year']) / 12;
            const weekTotalHours = data['hours-per-day'] * data['days-per-week'];
            const monthlyTotalHours = weekTotalHours * weeksPerMonth;
            const value_Hour = data['monthly-budget'] / monthlyTotalHours;
            
            profile.data = {
                ...profile.data,
                ...request.body,
                valueHour: value_Hour
            };
            return response.redirect('/profile');
        }
    }
};

const Job = {
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
            const newArrayJobs = Job.data.map((job) => {
            const remaining = Job.services.remainingDays(job);
            const status = remaining <= 0 ? 'done' : 'progress';
            return {
                ...job,
                remaining,
                status,
                price: Job.services.calculatetPrice(job, profile['value-hour'])
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
            const lastId = Job.data[Job.data.length - 1]?.id || 1;            
            Job.data.push({
                id: lastId + 1,
                name: request.body.name,
                'daily-hours': request.body['daily-hours'],
                'total-hours': request.body['total-hours'],
                createdIn: Date.now()
            });
            return response.redirect('/');
        },

        show(request, response) {
            const jobId = request.params.id;
            const job = Job.data.find((job) => {
                return Number(job.id) === Number(jobId);
            })
            if(!job) {
                return response.send('Job not found');
            }
            Job.price = Job.services.calculatetPrice(job, profile['value-hour'])
            return response.render(`${folderViews}job-edit`, { job });
        }
    },

    services: {
        remainingDays(job) {
            const remainingDays = (job['total-hours'] / job['daily-hours']).toFixed();
            const createdDate = new Date(job.createdIn);
            const dueDay = createdDate.getDate() + Number(remainingDays);
            const dueDateInMs = createdDate.setDate(dueDay);
            const timeDiffInMs = dueDateInMs - Date.now();
            const dayInMs = 1000 * 60 * 60 * 24;
            const dayDiff = Math.floor(timeDiffInMs / dayInMs);
            return dayDiff;
        },

        calculatetPrice(job, valueHour) {
            return valueHour * job['total-hours'];
        }
    }
};

routes.get('/', Job.controllers.index);
routes.get('/job', Job.controllers.create);
routes.post('/job', Job.controllers.save);
routes.get('/profile', profile.controllers.index);
routes.post('/profile', profile.controllers.update);
routes.get('/job/:id', Job.controllers.show);

module.exports = routes;