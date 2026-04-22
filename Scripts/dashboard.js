// ============================================
// STATIC DATA - Replace with API later
// ============================================
var MOCK_CLIENTS = [
    {
        id: "1",
        name: "Srikara Hospitals",
        locations: [
            {
                name: "Secunderabad Main Branch",
                status: "active",
                date: "2026-04-05",
                history: [
                    "01-Jan-2025 to 31-Jan-2025 --- licence expired (trail version)",
                    "01-Feb-2025 to 31-Jan-2026 --- Extended"
                ]
            },
            {
                name: "Kondapur Center",
                status: "inactive",
                date: "2026-03-21",
                history: [
                    "01-Mar-2021 to 31-Mar-2021 --- licence expired (trail version)",
                    "01-Apr-2021 to 31-Mar-2026 --- Extended"
                ]
            }
        ]
    },
    {
        id: "2",
        name: "Apollo Health",
        locations: [
            {
                name: "Jubilee Hills",
                status: "active",
                date: "2026-04-15",
                history: [
                    "01-Apr-2024 to 30-Apr-2024 --- licence expired (trail version)",
                    "01-May-2024 to 30-Apr-2025 --- Extended"
                ]
            },
            {
                name: "Gachibowli",
                status: "active",
                date: "2026-04-01",
                history: [
                    "01-Mar-2026 to 31-Mar-2026 --- licence expired (trail version)"
                ]
            }
        ]
    },
    {
        id: "3",
        name: "Yashoda Group",
        locations: [
            {
                name: "Somajiguda",
                status: "inactive",
                date: "2026-03-10",
                history: [
                    "01-Feb-2026 to 28-Feb-2026 --- licence expired (trail version)"
                ]
            },
            {
                name: "Malakpet",
                status: "inactive",
                date: "2026-03-25",
                history: [
                    "01-Mar-2024 to 31-Mar-2024 --- licence expired (trail version)",
                    "01-Apr-2024 to 31-Mar-2025 --- Extended"
                ]
            }
        ]
    },
    {
        id: "4",
        name: "Care Hospitals",
        locations: [
            {
                name: "Banjara Hills",
                status: "active",
                date: "2026-04-08",
                history: [
                    "01-Apr-2021 to 30-Apr-2021 --- licence expired (trail version)",
                    "01-May-2021 to 30-Apr-2026 --- Extended"
                ]
            },
            {
                name: "Nampally",
                status: "inactive",
                date: "2026-03-15",
                history: [
                    "01-Feb-2026 to 28-Feb-2026 --- licence expired (trail version)"
                ]
            }
        ]
    },
    {
        id: "5",
        name: "KIMS Hospitals",
        locations: [
            {
                name: "Begumpet",
                status: "active",
                date: "2026-02-20",
                history: [
                    "01-Feb-2024 to 29-Feb-2024 --- licence expired (trail version)",
                    "01-Mar-2024 to 28-Feb-2025 --- Extended"
                ]
            },
            {
                name: "Kukatpally",
                status: "active",
                date: "2026-04-09",
                history: [
                    "01-Mar-2026 to 31-Mar-2026 --- licence expired (trail version)"
                ]
            }
        ]
    },
    {
        id: "6",
        name: "Rainbow Children's",
        locations: [
            {
                name: "Hydernagar",
                status: "inactive",
                date: "2026-01-12",
                history: [
                    "01-Jan-2021 to 31-Jan-2021 --- licence expired (trail version)",
                    "01-Feb-2021 to 31-Jan-2026 --- Extended"
                ]
            },
            {
                name: "Vikrampuri",
                status: "inactive",
                date: "2026-03-31",
                history: [
                    "01-Mar-2024 to 31-Mar-2024 --- licence expired (trail version)",
                    "01-Apr-2024 to 31-Mar-2025 --- Extended"
                ]
            }
        ]
    }
];

// ============================================
// APP STATE
// ============================================
var state = {
    isAuthenticated: false,
    viewType: 'grid',
    searchQuery: '',
    statusFilter: 'all',
    expandedClients: []
};

// ============================================
// HELPER FUNCTIONS
// ============================================
function formatDate(dateStr) {
    var date = new Date(dateStr);
    var day = String(date.getDate()).padStart(2, '0');
    var month = date.toLocaleString('default', { month: 'short' });
    var year = date.getFullYear();
    return day + '-' + month + '-' + year;
}

function getRelativeTime(dateStr, status) {
    var now = new Date();
    var date = new Date(dateStr);
    var diffTime = date - now;
    var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (status === 'inactive') {
        return 'Expired ' + Math.abs(diffDays) + ' days ago';
    }
    if (diffDays < 0) {
        return 'Expired ' + Math.abs(diffDays) + ' days ago';
    }
    return 'Expires in ' + diffDays + ' days';
}

function isExpanded(clientId) {
    return state.expandedClients.indexOf(clientId) !== -1;
}

// ============================================
// MAIN RENDER FUNCTION
// ============================================
function render() {
    var authScreen = document.getElementById('auth-screen');
    var dashboardScreen = document.getElementById('dashboard-screen');

    if (!state.isAuthenticated) {
        authScreen.classList.remove('hidden');
        dashboardScreen.classList.add('hidden');
        return;
    }

    authScreen.classList.add('hidden');
    dashboardScreen.classList.remove('hidden');

    // Filter clients based on search and status
    var filteredClients = MOCK_CLIENTS.map(function (client) {
        var filteredLocs = state.statusFilter === 'active'
            ? client.locations.filter(function (loc) { return loc.status === 'active'; })
            : client.locations;
        return { id: client.id, name: client.name, locations: filteredLocs };
    }).filter(function (client) {
        var matchSearch = client.name.toLowerCase().indexOf(state.searchQuery.toLowerCase()) !== -1;
        return matchSearch && client.locations.length > 0;
    });

    if (state.viewType === 'grid') {
        renderGridView(filteredClients);
    } else {
        renderCardView(filteredClients);
    }

    lucide.createIcons();
}

// ============================================
// GRID VIEW
// ============================================
function renderGridView(clients) {
    var html = '<div class="grid-view">';
    html += '<div class="grid-header">';
    html += '<div></div>';
    html += '<div>Client Name</div>';
    html += '<div>Locations</div>';
    html += '<div>Status</div>';
    html += '<div>Date</div>';
    html += '<div>Days</div>';
    html += '<div>Log</div>';
    html += '</div>';
    html += '<div class="grid-body">';

    clients.forEach(function (client) {
        var expanded = isExpanded(client.id);
        var hasActive = client.locations.some(function (loc) { return loc.status === 'active'; });
        var statusClass = hasActive ? 'active' : 'inactive';

        html += '<div class="client-card-row ' + statusClass + '">';

        // Main Row (clickable to expand)
        html += '<div class="main-row" onclick="toggleExpand(\'' + client.id + '\')">';
        html += '<div class="expand-icon"><i data-lucide="' + (expanded ? 'minus' : 'plus') + '"></i></div>';
        html += '<div class="client-name">' + client.name + '</div>';
        html += '<div class="location-count">' + client.locations.length + ' Locations</div>';
        html += '<div style="grid-column: span 4"></div>';
        html += '</div>';

        // Expanded Locations
        html += '<div class="expanded-locations ' + (expanded ? 'open' : '') + '">';
        client.locations.forEach(function (loc) {
            html += '<div class="location-row">';
            html += '<div></div>';
            html += '<div></div>';
            html += '<div class="loc-name-cell"><i data-lucide="map-pin"></i><span>' + loc.name + '</span></div>';
            html += '<div class="status-cell"><span class="status-badge ' + loc.status + '">' + loc.status + '</span></div>';
            html += '<div class="date-cell">' + formatDate(loc.date) + '</div>';
            html += '<div class="days-cell">' + getRelativeTime(loc.date, loc.status) + '</div>';
            html += '<div class="log-cell">';
            html += '<button type="button" class="history-btn" onclick="event.stopPropagation(); showHistory(\'' + client.name + '\', \'' + loc.name + '\')">';
            html += '<i data-lucide="history"></i>';
            html += '</button>';
            html += '</div>';
            html += '</div>';
        });
        html += '</div>';

        html += '</div>';
    });

    html += '</div></div>';
    document.getElementById('content-area').innerHTML = html;
}

// ============================================
// CARD VIEW
// ============================================
function renderCardView(clients) {
    var html = '<div class="card-view">';

    clients.forEach(function (client) {
        html += '<div class="client-card">';
        html += '<div class="card-header">';
        html += '<div class="card-title">';
        html += '<h3>' + client.name + '</h3>';
        html += '<p>' + client.locations.length + ' Locations</p>';
        html += '</div></div>';
        html += '<div class="card-locations">';

        client.locations.forEach(function (loc) {
            html += '<div class="card-location-item">';
            html += '<div class="loc-info">';
            html += '<span class="loc-name">' + loc.name + '</span>';
            html += '<span class="loc-date">' + formatDate(loc.date) + '</span>';
            html += '</div>';
            html += '<span class="status-badge ' + loc.status + '">' + loc.status + '</span>';
            html += '</div>';
        });

        html += '</div></div>';
    });

    html += '</div>';
    document.getElementById('content-area').innerHTML = html;
}

// ============================================
// TOGGLE EXPAND (Grid rows)
// ============================================
function toggleExpand(clientId) {
    var index = state.expandedClients.indexOf(clientId);
    if (index !== -1) {
        state.expandedClients.splice(index, 1);
    } else {
        state.expandedClients.push(clientId);
    }
    render();
}

// ============================================
// SHOW HISTORY MODAL
// ============================================
function showHistory(clientName, locationName) {
    var client = MOCK_CLIENTS.find(function (c) { return c.name === clientName; });
    var location = client.locations.find(function (l) { return l.name === locationName; });

    document.getElementById('modal-client-name').textContent = clientName;
    document.getElementById('modal-location-name').textContent = locationName;

    var historyList = document.getElementById('history-list');
    var html = '';

    if (location.history && location.history.length > 0) {
        location.history.forEach(function (log) {
            var isTrial = log.toLowerCase().indexOf('trail version') !== -1
                || log.toLowerCase().indexOf('trial version') !== -1;
            var parts = log.split(' --- ');
            var dates = parts[0];
            var label = parts[1];
            var colorClass = isTrial ? 'red' : 'green';

            html += '<div class="history-item">';
            html += '<div class="history-dot ' + colorClass + '"></div>';
            html += '<div class="history-content">';
            html += '<p class="history-dates ' + colorClass + '">' + dates + '</p>';
            html += '<p class="history-label">' + label + '</p>';
            html += '</div></div>';
        });
    } else {
        html = '<p style="text-align:center; color:#94a3b8; padding: 2rem 0;">No history found.</p>';
    }

    historyList.innerHTML = html;
    document.getElementById('history-dialog').classList.remove('hidden');
    lucide.createIcons();
}

// ============================================
// EVENT LISTENERS (run after page loads)
// ============================================


window.onload = function () {

    // ✅ Check Session — if logged in show dashboard directly
    // ✅ NEW — safely updates only elements that exist
    if (typeof SERVER_USER !== 'undefined' && SERVER_USER.isLoggedIn) {

        // Update user name
        var userNameEl = document.querySelector('.user-name');
        if (userNameEl) {
            userNameEl.textContent = SERVER_USER.name;
        }

        // ✅ Update avatar
        var avatarInner = document.querySelector('.user-avatar-inner');
        if (avatarInner) {
            if (SERVER_USER.picture && SERVER_USER.picture.length > 0) {

                var img = document.createElement('img');

                // ✅ Set onerror BEFORE src — very important
                img.onerror = function () {
                    avatarInner.innerHTML = '';
                    avatarInner.textContent = SERVER_USER.initials;
                    avatarInner.style.background = '#2563eb';
                    avatarInner.style.color = 'white';
                    avatarInner.style.fontSize = '0.875rem';
                    avatarInner.style.fontWeight = '700';
                    avatarInner.style.display = 'flex';
                    avatarInner.style.alignItems = 'center';
                    avatarInner.style.justifyContent = 'center';
                };

                img.alt = SERVER_USER.initials;
                img.style.width = '100%';
                img.style.height = '100%';
                img.style.borderRadius = '50%';
                img.style.objectFit = 'cover';
                img.style.display = 'block';

                // ✅ This fixes Google image blocking from localhost
                img.setAttribute('referrerpolicy', 'no-referrer');

                // ✅ Set src LAST — after onerror is ready
                img.src = SERVER_USER.picture;

                avatarInner.innerHTML = '';
                avatarInner.appendChild(img);

            } else {
                // No picture → show initials
                avatarInner.textContent = SERVER_USER.initials;
                avatarInner.style.background = '#2563eb';
                avatarInner.style.color = 'white';
                avatarInner.style.fontSize = '0.875rem';
                avatarInner.style.fontWeight = '700';
                avatarInner.style.display = 'flex';
                avatarInner.style.alignItems = 'center';
                avatarInner.style.justifyContent = 'center';
            }
        }

        state.isAuthenticated = true;
        render();
    }  


    // ============================================
    // ✅ STEP 2 — User Menu Trigger (show/hide dropdown)
    // ============================================
    var userMenuTrigger = document.getElementById('user-menu-trigger');
    var userDropdown = document.getElementById('user-dropdown');

    if (userMenuTrigger && userDropdown) {
        userMenuTrigger.addEventListener('click', function (e) {
            e.stopPropagation(); // prevent click going to document

            // Toggle active class on trigger (rotates chevron)
            userMenuTrigger.classList.toggle('active');

            // Toggle show class on dropdown
            userDropdown.classList.toggle('show');
        });
    }

    // ============================================
    // ✅ STEP 3 — Close dropdown when clicking outside
    // ============================================
    document.addEventListener('click', function (e) {
        if (userDropdown && userDropdown.classList.contains('show')) {
            if (!userMenuTrigger.contains(e.target) && !userDropdown.contains(e.target)) {
                userDropdown.classList.remove('show');
                userMenuTrigger.classList.remove('active');
            }
        }
    });



    // ============================================
    // ✅ STEP 4 — Logout button (inside dropdown)
    // ============================================
    var logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function () {
            window.location.href = 'Logout.aspx';
        });
    }



    // ============================================
    // ✅ STEP 5 — Search box
    // ============================================
    var searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function (e) {
            state.searchQuery = e.target.value;
            render();
        });
    }

    // ✅ Filter buttons
    var filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            filterBtns.forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');
            state.statusFilter = btn.getAttribute('data-filter');
            render();
        });
    });

    // ✅ View toggle
    var viewBtns = document.querySelectorAll('.view-btn');
    viewBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            viewBtns.forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');
            state.viewType = btn.getAttribute('data-view');
            render();
        });
    });

    // ✅ Close modal
    document.getElementById('close-modal').addEventListener('click', function () {
        document.getElementById('history-dialog').classList.add('hidden');
    });

    document.getElementById('modal-close-btn').addEventListener('click', function () {
        document.getElementById('history-dialog').classList.add('hidden');
    });

    render();
    lucide.createIcons();
};