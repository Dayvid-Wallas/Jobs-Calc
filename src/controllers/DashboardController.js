const Job = require('../model/Job');
const Profile = require('../model/Profile');
const JobUtils = require('../utils/jobUtils');

module.exports = {
    async index(request, response) {
        const jobs = await Job.get();
        const profile = await Profile.get();

        let statusCount = {
            progress: 0,
            done: 0,
            total: jobs.length
        }

        let jobTotalHours = 0;

        const newArrayJobs = jobs.map((job) => {
        const remaining = JobUtils.remainingDays(job);
        const status = remaining <= 0 ? 'done' : 'progress';

        statusCount[status] += 1;

        if(status == 'progress') {
            jobTotalHours += Number(job['daily-hours']);
        }

        return {
            ...job,
            remaining,
            status,
            budget: JobUtils.calculatetPrice(job, profile['value-hour'])
        }
    })
    const freeHours = profile['hours-per-day'] - jobTotalHours;
    return response.render('index', { jobs: newArrayJobs, profile: profile, statusCount: statusCount, freeHours: freeHours });
    }
}