(function () {
    const seedNotifications = [
        {
            id: 1,
            unread: true,
            category: 'connections',
            section: 'today',
            initials: 'MR',
            color: '#4a8fd4',
            text: '<strong>Maria Rodriguez</strong> sent you a connection request.',
            time: '2 minutes ago',
            actions: ['accept', 'decline']
        },
        {
            id: 2,
            unread: true,
            category: 'jobs',
            section: 'today',
            icon: '💼',
            iconBg: '#fff3e0',
            text: '<strong>Google</strong> viewed your application for <strong>Software Engineer Intern</strong>.',
            time: '1 hour ago'
        },
        {
            id: 3,
            unread: true,
            category: 'connections',
            section: 'today',
            initials: 'JK',
            color: '#8e44ad',
            text: '<strong>James Kim</strong> accepted your connection request.',
            time: '3 hours ago'
        },
        {
            id: 4,
            unread: true,
            category: 'mentions',
            section: 'today',
            initials: 'SL',
            color: '#e05252',
            text: '<strong>Sarah Lee</strong> mentioned you in a post: "Had a great mock interview with @John Smith today!"',
            time: '5 hours ago'
        },
        {
            id: 5,
            unread: false,
            category: 'jobs',
            section: 'earlier',
            icon: '🎉',
            iconBg: '#e8f5e9',
            text: 'You have a <strong>new job match</strong> — Frontend Developer at Stripe. Your profile is a 92% fit.',
            time: 'Yesterday at 4:30 PM'
        },
        {
            id: 6,
            unread: false,
            category: 'connections',
            section: 'earlier',
            initials: 'AP',
            color: '#1a9e7e',
            text: '<strong>Alex Park</strong> sent you a connection request.',
            time: 'Yesterday at 1:12 PM',
            actions: ['accept', 'decline']
        },
        {
            id: 7,
            unread: false,
            category: 'mentions',
            section: 'earlier',
            icon: '📣',
            iconBg: '#fce4ec',
            text: 'Your post <strong>"5 tips for acing a technical interview"</strong> received 47 likes.',
            time: '2 days ago'
        },
        {
            id: 8,
            unread: false,
            category: 'jobs',
            section: 'earlier',
            icon: '📋',
            iconBg: '#e3f2fd',
            text: '<strong>Meta</strong> posted a new role matching your interests: <strong>Product Manager Intern</strong>.',
            time: '3 days ago'
        }
    ];

    let notifications = [...seedNotifications];
    let currentFilter = 'all';
    let lastRemoved = null;
    let toastTimer = null;

    function cardHTML(notification) {
        const avatar = notification.initials
            ? `<div class="notif-avatar" style="background:${notification.color}">${notification.initials}</div>`
            : `<div class="notif-icon" style="background:${notification.iconBg}">${notification.icon}</div>`;

        const actions = (notification.actions || []).map((action) => (
            action === 'accept'
                ? `<button class="btn-accept" onclick="handleAction(event,${notification.id},'accept')">Accept</button>`
                : `<button class="btn-decline" onclick="handleAction(event,${notification.id},'decline')">Decline</button>`
        )).join('');

        return `<div class="notif-card ${notification.unread ? 'unread' : ''}" id="notif-${notification.id}" onclick="markRead(${notification.id})">
            <div class="unread-dot"></div>
            ${avatar}
            <div class="notif-body">
                <div class="notif-text">${notification.text}</div>
                <div class="notif-time">${notification.time}</div>
                ${actions ? `<div class="notif-actions">${actions}</div>` : ''}
            </div>
            <button class="notif-dismiss" title="Dismiss" onclick="dismiss(event,${notification.id})">×</button>
        </div>`;
    }

    function render() {
        const feed = document.getElementById('feed');
        if (!feed) return;

        const items = currentFilter === 'all'
            ? notifications
            : currentFilter === 'unread'
                ? notifications.filter((notification) => notification.unread)
                : notifications.filter((notification) => notification.category === currentFilter);

        if (!items.length) {
            feed.innerHTML = '<div class="empty-state"><div class="empty-icon">🔔</div><p>No notifications here yet.</p></div>';
            return;
        }

        let html = '';
        ['today', 'earlier'].forEach((section) => {
            const sectionItems = items.filter((notification) => notification.section === section);
            if (!sectionItems.length) return;
            html += `<p class="section-label">${section === 'today' ? 'Today' : 'Earlier'}</p><div class="notif-list">`;
            sectionItems.forEach((notification) => {
                html += cardHTML(notification);
            });
            html += '</div>';
        });

        feed.innerHTML = html;
    }

    function setFilter(category, button) {
        currentFilter = category;
        document.querySelectorAll('.filter-btn').forEach((btn) => btn.classList.remove('active'));
        if (button) button.classList.add('active');
        render();
    }

    function markRead(id) {
        const notification = notifications.find((item) => item.id === id);
        if (notification) notification.unread = false;

        const card = document.getElementById(`notif-${id}`);
        if (card) card.classList.remove('unread');
    }

    function markAllRead() {
        notifications.forEach((notification) => {
            notification.unread = false;
        });

        document.querySelectorAll('.notif-card.unread').forEach((card) => {
            card.classList.remove('unread');
        });
    }

    function showToast() {
        const toast = document.getElementById('toast');
        if (!toast) return;

        toast.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => {
            toast.classList.remove('show');
        }, 4000);
    }

    function dismiss(event, id) {
        event.stopPropagation();

        const idx = notifications.findIndex((notification) => notification.id === id);
        if (idx === -1) return;

        lastRemoved = { notif: notifications[idx], idx };
        notifications.splice(idx, 1);

        const card = document.getElementById(`notif-${id}`);
        if (!card) {
            render();
            showToast();
            return;
        }

        card.classList.add('removing');
        card.addEventListener('animationend', () => {
            render();
            showToast();
        }, { once: true });
    }

    function handleAction(event, id, type) {
        event.stopPropagation();

        const notification = notifications.find((item) => item.id === id);
        if (!notification) return;

        notification.actions = [];
        notification.unread = false;
        notification.text += type === 'accept'
            ? ' <span style="color:#3a7d44;font-weight:600">✓ Accepted</span>'
            : ' <span style="color:#aaa;font-weight:600">Declined</span>';

        render();
    }

    function undoDismiss() {
        if (!lastRemoved) return;

        notifications.splice(lastRemoved.idx, 0, lastRemoved.notif);
        lastRemoved = null;

        const toast = document.getElementById('toast');
        if (toast) toast.classList.remove('show');

        render();
    }

    document.addEventListener('DOMContentLoaded', () => {
        if (!document.getElementById('feed')) return;

        window.setFilter = setFilter;
        window.markRead = markRead;
        window.markAllRead = markAllRead;
        window.dismiss = dismiss;
        window.handleAction = handleAction;
        window.undoDismiss = undoDismiss;

        render();
    });
})();
