const Job = require('../model/Job');
const JobUtils = require('../utils/jobUtils');
const Profile = require('../model/Profile');

module.exports = {    
    create(request, response) {
        return response.render('job');
    },

    //Creating POST route to receive form data
    save(request, response) {
        //request.body = { name: 'Dayvid', 'daily-hours': '6', 'total-hours': '20' }
        const jobs = Job.get();

        const lastId = jobs[jobs.length - 1]?.id || 0;
                    
        Job.create({
            id: lastId + 1,
            name: request.body.name,
            'daily-hours': request.body['daily-hours'],
            'total-hours': request.body['total-hours'],
            createdIn: Date.now()
        });
        return response.redirect('/');
    },

    show(request, response) {
        const jobs = Job.get();

        const jobId = request.params.id;
        const job = jobs.find((job) => {
            return Number(job.id) === Number(jobId);
        })
        if(!job) {
            return response.send('Job not found');
        }
        const profile = Profile.get();

        Job.budget = JobUtils.calculatetPrice(job, profile['value-hour']);
        return response.render('job-edit', { job });
    },

    update(request, response) {
        const jobs = Job.get();

        const jobId = request.params.id;
        const job = jobs.find((job) => {
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
        const newJobs = jobs.map((job) => {
            if(Number(job.id) === Number(jobId)) {
                job = updateJob;
            }
            return job;
        })
        Job.update(newJobs);
        response.redirect('/job/' + jobId);
    },

    delete(request, response) {
        const jobId = request.params.id;
        Job.delete(jobId);
        return response.redirect('/');
    }
};