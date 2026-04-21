
//Calendar page renderer. This file stores calendar UI state, normalizes dates, renders month/week/day views, and loads event data from the jobs API.


(function () {
    //UI state: current view mode, focal date, and the events loaded from the backend.
    const state = {
        view: 'month',
        currentDate: startOfDay(new Date()),
        events: []
    };

    //Lazy DOM getters so the page can safely query elements at render time.
    const refs = {
        container: () => document.getElementById('calendarViewContainer'),
        status: () => document.getElementById('calendarStatus'),
        label: () => document.getElementById('calendarCurrentLabel'),
        agendaList: () => document.getElementById('calendarAgendaList'),
        agendaTitle: () => document.getElementById('calendarSidebarTitle'),
        viewButtons: () => Array.from(document.querySelectorAll('.calendar-view-btn'))
    };

    //Date helper: strip a date down to 00:00:00.000 for inclusive comparisons.
    function startOfDay(date) {
        const value = new Date(date);
        value.setHours(0, 0, 0, 0);
        return value;
    }

    //Date helper: move a date to the last millisecond of that same day.
    function endOfDay(date) {
        const value = new Date(date);
        value.setHours(23, 59, 59, 999);
        return value;
    }

    //Date helper: calculate the Monday that begins the visible week.
    function startOfWeek(date) {
        const value = startOfDay(date);
        const day = value.getDay();
        const diffToMonday = (day + 6) % 7;
        value.setDate(value.getDate() - diffToMonday);
        return value;
    }

    //Date helper: calculate the Sunday night that ends the visible week.
    function endOfWeek(date) {
        const value = startOfWeek(date);
        value.setDate(value.getDate() + 6);
        return endOfDay(value);
    }

    //Date helper: first day of the current month.
    function startOfMonth(date) {
        return new Date(date.getFullYear(), date.getMonth(), 1);
    }

    //Date helper: last moment of the current month.
    function endOfMonth(date) {
        return endOfDay(new Date(date.getFullYear(), date.getMonth() + 1, 0));
    }

    //Return a new Date offset by a fixed number of days.
    function addDays(date, days) {
        const value = new Date(date);
        value.setDate(value.getDate() + days);
        return value;
    }

    //Return a new Date offset by a fixed number of months.
    function addMonths(date, months) {
        return new Date(date.getFullYear(), date.getMonth() + months, date.getDate());
    }

    //Compare two Date objects by calendar day only.
    function isSameDay(left, right) {
        return left.getFullYear() === right.getFullYear()
        && left.getMonth() === right.getMonth()
        && left.getDate() === right.getDate();
    }

    //Convenience wrapper for highlighting the current day.
    function isToday(date) {
        return isSameDay(date, new Date());
    }

    //Localized date formatting helper used by headings and labels.
    function formatDate(date, options) {
        return date.toLocaleDateString(undefined, options);
    }

    //Localized time formatting helper used for event chips/cards.
    function formatTime(date) {
        return date.toLocaleTimeString([], {
            hour: 'numeric',
            minute: '2-digit'
        });
    }

    //Escape text before injecting it into innerHTML-based templates.
    function escapeHtml(value) {
        return String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }

    //Convert raw API event objects into view models with a parsed Date instance.
    function normalizeEvent(event) {
        const eventDate = new Date(event.eventAt);
        return {
            ...event,
            parsedDate: eventDate
        };
    }

    //Build the active start/end range plus UI labels for day/week/month mode.
    function getRange() {
        const current = state.currentDate;

        if (state.view === 'day') {
            return {
                start: startOfDay(current),
                end: endOfDay(current),
                label: formatDate(current, {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                }),
                agendaTitle: 'Events for this day'
            };
        }

        if (state.view === 'week') {
            const start = startOfWeek(current);
            const end = endOfWeek(current);
            return {
                start,
                end,
                label: `${formatDate(start, { month: 'short', day: 'numeric' })} - ${formatDate(end, { month: 'short', day: 'numeric', year: 'numeric' })}`,
                agendaTitle: 'Events for this week'
            };
        }

        const start = startOfMonth(current);
        const end = endOfMonth(current);
        return {
            start,
            end,
            label: formatDate(current, { month: 'long', year: 'numeric' }),
            agendaTitle: 'Events for this month'
        };
    }

    //Filter all loaded events down to the active visible range.
    function getEventsInRange(start, end) {
        return state.events
        .filter((event) => event.parsedDate >= start && event.parsedDate <= end)
        .sort((left, right) => left.parsedDate - right.parsedDate);
    }

    //Return events that belong to one specific day cell.
    function getEventsForDay(date) {
        return state.events
        .filter((event) => isSameDay(event.parsedDate, date))
        .sort((left, right) => left.parsedDate - right.parsedDate);
    }

    //Generate either a compact day-chip or a full-size event card markup block.
    function buildEventMarkup(event, compact) {
        const title = escapeHtml(event.title || 'Job event');
        const company = escapeHtml(event.company || 'Unknown company');
        const detail = escapeHtml(event.detail || 'No extra details');
        const type = escapeHtml(event.eventType || 'Career event');
        const time = formatTime(event.parsedDate);

        if (compact) {
            return `
            <div class="calendar-event-chip">
            <span class="calendar-event-time">${time}</span>
            <span class="calendar-event-name">${title}</span>
            </div>
            `;
        }

        return `
            <article class="calendar-event-card">
            <div class="calendar-event-card-time">${time}</div>
            <div class="calendar-event-card-body">
            <strong>${title}</strong>
            <span>${company}</span>
            <span>${type}</span>
            <p>${detail}</p>
            </div>
            </article>
        `;
    }

    //Render the sidebar agenda list for the currently selected range.
    function renderAgenda(rangeEvents, agendaTitle) {
        const list = refs.agendaList();
        const title = refs.agendaTitle();
        if (!list || !title) return;

        title.textContent = agendaTitle;
        list.innerHTML = '';

        if (rangeEvents.length === 0) {
            const empty = document.createElement('li');
            empty.className = 'calendar-agenda-empty';
            empty.textContent = 'No events scheduled in this range.';
            list.appendChild(empty);
            return;
        }

        rangeEvents.forEach((event) => {
            const item = document.createElement('li');
            item.className = 'calendar-agenda-item';
            item.innerHTML = `
                <div class="calendar-agenda-date">${formatDate(event.parsedDate, { weekday: 'short', month: 'short', day: 'numeric' })}</div>
                <div class="calendar-agenda-body">
                <strong>${escapeHtml(event.title || 'Job event')}</strong>
                <span>${formatTime(event.parsedDate)} - ${escapeHtml(event.company || 'Unknown company')}</span>
                <p>${escapeHtml(event.detail || 'No extra details')}</p>
                </div>
            `;
            list.appendChild(item);
        });
    }

    //Render a 6-row month grid with per-day event chips.
    function renderMonthView() {
        const container = refs.container();
        if (!container) return;

        const monthStart = startOfMonth(state.currentDate);
        const gridStart = startOfWeek(monthStart);
        const cells = [];

        for (let index = 0; index < 42; index += 1) {
            const current = addDays(gridStart, index);
            const dayEvents = getEventsForDay(current);
            const dayClasses = [
                'calendar-day-cell',
                current.getMonth() === state.currentDate.getMonth() ? 'is-current-month' : 'is-other-month',
                isToday(current) ? 'is-today' : ''
            ].filter(Boolean).join(' ');

            cells.push(`
                <div class="${dayClasses}">
                <div class="calendar-day-header">
                <span class="calendar-day-number">${current.getDate()}</span>
                </div>
                <div class="calendar-day-events">
                ${dayEvents.length === 0
                ? '<span class="calendar-day-empty">No events</span>'
                : dayEvents.map((event) => buildEventMarkup(event, true)).join('')}
                </div>
                </div>
            `);
        }

        container.innerHTML = `
            <div class="calendar-month-view">
            <div class="calendar-weekdays">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
            </div>
            <div class="calendar-month-grid">
            ${cells.join('')}
            </div>
            </div>
        `;
    }

    //Render a week layout where each column represents one day of the active week.
    function renderWeekView() {
        const container = refs.container();
        if (!container) return;

        const start = startOfWeek(state.currentDate);
        const columns = [];

        for (let index = 0; index < 7; index += 1) {
            const current = addDays(start, index);
            const dayEvents = getEventsForDay(current);
            columns.push(`
                <section class="calendar-week-column ${isToday(current) ? 'is-today' : ''}">
                <header class="calendar-week-column-header">
                <span>${formatDate(current, { weekday: 'short' })}</span>
                <strong>${formatDate(current, { month: 'short', day: 'numeric' })}</strong>
                </header>
                <div class="calendar-week-column-body">
                ${dayEvents.length === 0
                ? '<p class="calendar-column-empty">No events</p>'
                : dayEvents.map((event) => buildEventMarkup(event, false)).join('')}
                </div>
                </section>
            `);
        }

        container.innerHTML = `
            <div class="calendar-week-view">
            ${columns.join('')}
            </div>
        `;
    }

    //Render a single-day list view for the active date.
    function renderDayView() {
        const container = refs.container();
        if (!container) return;

        const dayEvents = getEventsForDay(state.currentDate);
        container.innerHTML = `
            <div class="calendar-day-view">
            <header class="calendar-day-view-header">
            <span>${formatDate(state.currentDate, { weekday: 'long' })}</span>
            <strong>${formatDate(state.currentDate, { month: 'long', day: 'numeric', year: 'numeric' })}</strong>
            </header>
            <div class="calendar-day-view-body">
            ${dayEvents.length === 0
            ? '<p class="calendar-column-empty">No events scheduled for this day.</p>'
            : dayEvents.map((event) => buildEventMarkup(event, false)).join('')}
            </div>
            </div>
        `;
    }

    //Refresh the label, agenda, active view button states, and main calendar display.
    function renderCalendar() {
        const { start, end, label, agendaTitle } = getRange();
        const rangeEvents = getEventsInRange(start, end);

        if (refs.label()) {
            refs.label().textContent = label;
        }

        refs.viewButtons().forEach((button) => {
            button.classList.toggle('active', button.dataset.view === state.view);
        });

        if (state.view === 'month') {
            renderMonthView();
        } else if (state.view === 'week') {
            renderWeekView();
        } else {
            renderDayView();
        }

        renderAgenda(rangeEvents, agendaTitle);
    }

    //Move backward/forward through the calendar based on the active view mode.
    function moveCalendar(direction) {
        if (state.view === 'month') {
            state.currentDate = addMonths(state.currentDate, direction);
        } else if (state.view === 'week') {
            state.currentDate = addDays(state.currentDate, direction * 7);
        } else {
            state.currentDate = addDays(state.currentDate, direction);
        }

        renderCalendar();
    }

    //Attach handlers for previous/next navigation and view-mode switching buttons.
    function bindControls() {
        const prev = document.getElementById('calendarPrevBtn');
        const next = document.getElementById('calendarNextBtn');
        const today = document.getElementById('calendarTodayBtn');

        if (prev) {
            prev.addEventListener('click', () => moveCalendar(-1));
        }

        if (next) {
            next.addEventListener('click', () => moveCalendar(1));
        }

        if (today) {
            today.addEventListener('click', () => {
                state.currentDate = startOfDay(new Date());
                renderCalendar();
            });
        }

        refs.viewButtons().forEach((button) => {
            button.addEventListener('click', () => {
                state.view = button.dataset.view || 'month';
                renderCalendar();
            });
        });
    }

    //Fetch calendar events, normalize them, and trigger the initial render.
    async function loadCalendarPage() {
        const status = refs.status();
        if (!refs.container()) return;

        try {
            if (status) status.textContent = 'Loading calendar events...';
            await window.ApiClient.ensureAuthenticated();
            const events = await window.JobsApi.getCalendarEvents();
            state.events = (events || []).map(normalizeEvent).filter((event) => !Number.isNaN(event.parsedDate.getTime()));
            renderCalendar();
            if (status) status.textContent = '';
            } catch (error) {
            if (status) status.textContent = error.message;
            }
        }

        //Bootstrap the page after the DOM is available.
        document.addEventListener('DOMContentLoaded', () => {
            if (!window.ApiClient || !window.JobsApi || !refs.container()) {
                return;
            }

        bindControls();
        loadCalendarPage();
    });
})();
