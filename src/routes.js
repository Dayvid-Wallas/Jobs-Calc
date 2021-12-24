const { request } = require('express');
const express = require('express');
const routes = express.Router();
const ProfileController = require('./controllers/ProfileController');

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
                price: Job.services.calculatetPrice(job, profile.data['value-hour'])
            }
        })
        return response.render('index', { jobs: newArrayJobs });
        },
        
        create(request, response) {
            return response.render('job');
        },

        //Creating POST route to receive form data
        save(request, response) {
            //request.body = { name: 'Dayvid', 'daily-hours': '6', 'total-hours': '20' }            
            const lastId = Job.data[Job.data.length - 1]?.id || 0;            
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
            Job.price = Job.services.calculatetPrice(job, profile.data['value-hour']);
            return response.render('job-edit', { job });
        },

        update(request, response) {
            const jobId = request.params.id;
            const job = Job.data.find((job) => {
                return Number(job.id) === Number(jobId);
            })
            if(!job) {
                return response.send('Job not found');
            }
            const updateJob = {
                ...job,
                name: request.body.name,
                'total-hours': request.body['total-hours'],
                'daily-hours': request.body['daily-hours']
            }
            Job.data = Job.data.map((job) => {
                if(Number(job.id) === Number(jobId)) {
                    job = updateJob;
                }
                return job;
            })
            response.redirect('/job/' + jobId);
        },

        delete(request, response) {
            const jobId = request.params.id;
            Job.data = Job.data.filter((job) => {
                Number(job.id) !== Number(jobId);
                return response.redirect('/');
            })
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
routes.get('/profile', ProfileController.index);
routes.post('/profile', ProfileController.update);
routes.get('/job/:id', Job.controllers.show);
routes.post('/job/:id', Job.controllers.update);
routes.post('/job/delete/:id', Job.controllers.delete);

module.exports = routes;