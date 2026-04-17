(function () {
   const statusEl = () => document.getElementById('jobsSearchStatus');
   const listEl = () => document.getElementById('jobsSearchResults');
   const countEl = () => document.getElementById('jobsSearchCount');

   function value(id) {
     const el = document.getElementById(id);
     return el ? el.value.trim() : '';
   }

   function intValue(id) {
     const raw = value(id);
     if (!raw) return null;
     const parsed = Number.parseInt(raw, 10);
     return Number.isNaN(parsed) ? null : parsed;
   }

   function collectPreferencesFromForm() {
     return {
       keyWords: value('jobKeyWords') || null,
       location: value('jobLocation') || null,
       distance: intValue('jobDistance'),
       salaryMin: intValue('jobSalaryMin'),
       salaryMax: intValue('jobSalaryMax'),
       contractType: value('jobContractType') || null,
       maxDaysOld: intValue('jobMaxDaysOld')
     };
   }

   function renderSearchResults(jobs) {
     const list = listEl();
     if (!list) return;

     list.innerHTML = '';
     if (!jobs || jobs.length === 0) {
       const empty = document.createElement('li');
       empty.textContent = 'No jobs found for this search.';
       list.appendChild(empty);
       return;
     }

     jobs.forEach((job) => {
       const item = document.createElement('li');
       const title = document.createElement('a');
       title.href = job.redirectUrl || '#';
       title.target = '_blank';
       title.rel = 'noopener noreferrer';
       title.textContent = `${job.title || 'Untitled role'} — ${job.company || 'Unknown company'}`;

       const details = document.createElement('div');
       details.textContent = [job.location, job.contractType, job.created].filter(Boolean).join(' | ');

       item.appendChild(title);
       item.appendChild(details);
       if (window.SavedJobs) {
            window.SavedJobs.addSaveButton(item, job, 'SEARCH');
       }
       list.appendChild(item);
     });
   }

   async function searchAndRender(preferences, statusMessage) {
        const status = statusEl();
        if (status) status.textContent = statusMessage;

        const payload = {
          preferences,
          page: 1,
          pageSize: 20
        };

        const response = await window.JobsApi.searchJobs(payload);
        if (countEl()) countEl().textContent = String(response.count || 0);
        renderSearchResults(response.jobs || []);
        if (status) status.textContent = 'Search complete.';
      }

   async function hydratePreferences() {
     try {
       const preferences = await window.JobsApi.getPreferences();
       const map = [
         ['jobKeyWords', preferences.keyWords],
         ['jobLocation', preferences.location],
         ['jobDistance', preferences.distance],
         ['jobSalaryMin', preferences.salaryMin],
         ['jobSalaryMax', preferences.salaryMax],
         ['jobContractType', preferences.contractType],
         ['jobMaxDaysOld', preferences.maxDaysOld]
       ];

       map.forEach(([id, val]) => {
         const el = document.getElementById(id);
         if (el && val !== null && val !== undefined) {
           el.value = String(val);
         }
       });
     } catch (error) {
       if (statusEl()) statusEl().textContent = error.message;
     }
   }

   async function onSearchSubmit(event) {
     event.preventDefault();

     try {

       const preferences = collectPreferencesFromForm();
       await window.JobsApi.savePreferences(preferences);
       await searchAndRender(preferences, 'Searching jobs...');

     } catch (error) {
       if (statusEl()) statusEl().textContent = error.message;
     }
   }

   document.addEventListener('DOMContentLoaded', async () => {
     if (!document.getElementById('jobsSearchForm')) {
       return;
     }

     try {
       await window.ApiClient.ensureAuthenticated();
       await hydratePreferences();
       await searchAndRender(collectPreferencesFromForm(), 'Loading jobs...');
       if (window.SavedJobs) {
            await window.SavedJobs.loadAndRenderSavedJobs();
       }
     } catch (error) {
       if (statusEl()) statusEl().textContent = error.message;
     }

     const form = document.getElementById('jobsSearchForm');
     if (form) {
       form.addEventListener('submit', onSearchSubmit);
     }
   });
 })();