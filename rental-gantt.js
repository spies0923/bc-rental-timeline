// Rental Gantt Chart - vis-timeline Implementation
// Functions callable from AL

// Global variables
var timeline = null;
var groups = null;
var items = null;

function LoadData(dataJson) {
    try {
        console.log('LoadData called with:', dataJson);

        if (!dataJson || dataJson === '') {
            console.warn('No data to load');
            Clear();
            return;
        }

        // Parse JSON data from AL
        var data = JSON.parse(dataJson);

        if (!data.groups || data.groups.length === 0) {
            console.warn('No groups (rental objects) in data');
            Clear();
            return;
        }

        if (!data.items || data.items.length === 0) {
            console.warn('No items (contracts) in data');
            Clear();
            return;
        }

        // Check if vis Timeline library is loaded
        if (typeof vis === 'undefined' || typeof vis.Timeline === 'undefined') {
            console.error('vis-timeline library not loaded yet');
            Microsoft.Dynamics.NAV.InvokeExtensibilityMethod('OnError', ['Timeline library not loaded. Please refresh the page.']);
            return;
        }

        // Create DataSets for groups and items
        groups = new vis.DataSet(data.groups);
        items = new vis.DataSet(data.items);

        // Get container
        var container = document.getElementById('rental-gantt-container');
        if (!container) {
            console.error('Container not found');
            Microsoft.Dynamics.NAV.InvokeExtensibilityMethod('OnError', ['Timeline container not found']);
            return;
        }

        // Clear any previous content (like empty state message)
        container.innerHTML = '';

        // Timeline configuration options
        var options = {
            // Let vis-timeline calculate dimensions from container
            width: '100%',
            height: '100%',

            // Enable stacking of items within same group (row)
            stack: true,

            // Auto-expand row height to fit stacked items
            groupHeightMode: 'auto',

            // Timeline orientation
            orientation: 'top',

            // Visual spacing
            margin: {
                item: {
                    horizontal: 5,
                    vertical: 8
                }
            },

            // Allow zoom and move
            zoomable: true,
            moveable: true,

            // Snap to grid
            snap: null,

            // Show current time marker
            showCurrentTime: true,

            // Time axis configuration
            timeAxis: {
                scale: 'day',
                step: 1
            },

            // Tooltip configuration
            tooltip: {
                followMouse: true,
                overflowMethod: 'cap'
            },

            // Ensure timeline renders and resizes
            autoResize: true,
            verticalScroll: true,
            horizontalScroll: true,

            // Maximum height for row to prevent excessive expansion
            maxHeight: 700
        };

        // Always destroy and recreate timeline to avoid rendering issues
        if (timeline) {
            timeline.destroy();
            timeline = null;
            container.innerHTML = '';
        }

        // Create fresh timeline instance
        timeline = new vis.Timeline(container, items, groups, options);

        // Add click event listener
        timeline.on('click', function(properties) {
            if (properties.item) {
                console.log('Item clicked:', properties.item);
                Microsoft.Dynamics.NAV.InvokeExtensibilityMethod('OnTaskClick', [properties.item]);
            }
        });

        // Add double-click event listener
        timeline.on('doubleClick', function(properties) {
            if (properties.item) {
                console.log('Item double-clicked:', properties.item);
                Microsoft.Dynamics.NAV.InvokeExtensibilityMethod('OnTaskDoubleClick', [properties.item]);
            }
        });

        console.log('Timeline created with', data.groups.length, 'groups and', data.items.length, 'items');
        console.log('Container after timeline creation:', container.offsetWidth, 'x', container.offsetHeight);

        // Force visibility and fit timeline to show all data
        setTimeout(function() {
            // Make timeline visible (vis-timeline sets visibility:hidden initially)
            var timelineElement = container.querySelector('.vis-timeline');
            if (timelineElement) {
                timelineElement.style.visibility = 'visible';
                timelineElement.style.display = 'block';
                console.log('Timeline visibility forced to visible');
            }

            // Force full redraw and fit
            timeline.redraw();
            timeline.fit({
                animation: false  // No animation for immediate display
            });

            console.log('Timeline fit and redrawn');
            console.log('Final container dimensions:', container.offsetWidth, 'x', container.offsetHeight);
            console.log('Timeline DOM elements:', container.querySelectorAll('.vis-timeline').length, 'timeline elements');
            console.log('Timeline items rendered:', container.querySelectorAll('.vis-item').length, 'items');
        }, 150);

    } catch (error) {
        console.error('Error loading data:', error);
        Microsoft.Dynamics.NAV.InvokeExtensibilityMethod('OnError', ['Error loading data: ' + error.message]);
    }
}

function SetViewMode(mode) {
    try {
        console.log('SetViewMode called with:', mode);

        if (!timeline) {
            console.warn('Timeline not initialized');
            return;
        }

        // Map mode to time scale
        var timeScale = 'day';
        var timeStep = 1;

        switch (mode) {
            case 'Day':
                timeScale = 'day';
                timeStep = 1;
                break;
            case 'Week':
                timeScale = 'week';
                timeStep = 1;
                break;
            case 'Month':
                timeScale = 'month';
                timeStep = 1;
                break;
            case 'Year':
                timeScale = 'year';
                timeStep = 1;
                break;
            default:
                timeScale = 'month';
                timeStep = 1;
        }

        // Update timeline options
        timeline.setOptions({
            timeAxis: {
                scale: timeScale,
                step: timeStep
            }
        });

        console.log('View mode changed to:', mode, '(' + timeScale + ')');
    } catch (error) {
        console.error('Error setting view mode:', error);
        Microsoft.Dynamics.NAV.InvokeExtensibilityMethod('OnError', ['Error setting view mode: ' + error.message]);
    }
}

function SetDateRange(startDate, endDate) {
    try {
        console.log('SetDateRange called with:', startDate, endDate);

        if (!timeline) {
            console.warn('Timeline not initialized');
            return;
        }

        // Set visible window
        timeline.setWindow(startDate, endDate, {
            animation: {
                duration: 500,
                easingFunction: 'easeInOutQuad'
            }
        });

        console.log('Date range set');
    } catch (error) {
        console.error('Error setting date range:', error);
        Microsoft.Dynamics.NAV.InvokeExtensibilityMethod('OnError', ['Error setting date range: ' + error.message]);
    }
}

function Refresh() {
    try {
        console.log('Refresh called');

        if (timeline) {
            timeline.redraw();
            console.log('Timeline refreshed');
        }
    } catch (error) {
        console.error('Error refreshing:', error);
        Microsoft.Dynamics.NAV.InvokeExtensibilityMethod('OnError', ['Error refreshing: ' + error.message]);
    }
}

function Clear() {
    try {
        console.log('Clear called');

        var container = document.getElementById('rental-gantt-container');

        if (timeline) {
            timeline.destroy();
            timeline = null;
        }

        if (groups) {
            groups.clear();
            groups = null;
        }

        if (items) {
            items.clear();
            items = null;
        }

        if (container) {
            // Completely empty the container first
            container.innerHTML = '';
            // Then add the empty state message
            container.innerHTML = '<div style="padding: 40px; text-align: center; color: #666; font-size: 14px;">' +
                '<div style="font-size: 48px; margin-bottom: 20px;">📅</div>' +
                '<div>No rental contracts to display.</div>' +
                '<div style="margin-top: 10px; font-size: 12px; color: #999;">Select date range and click Refresh to load data.</div>' +
                '</div>';
        }

        console.log('Timeline cleared');
    } catch (error) {
        console.error('Error clearing:', error);
    }
}
