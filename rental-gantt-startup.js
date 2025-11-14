// Rental Gantt Chart - Startup Script (vis-timeline)
// This script runs when the control add-in is loaded

// Global container reference
window.ganttContainer = null;
var libraryLoadAttempts = 0;
var maxLoadAttempts = 20; // Wait up to 10 seconds (20 * 500ms)

// CRITICAL FIX: BC ignores RequestedHeight when other controls exist on Card page
// Solution: Manipulate parent iframe AND all parent containers directly from inside
(function() {
    try {
        // Get reference to the iframe element (this script runs inside the iframe)
        var iframe = window.frameElement;
        if (iframe) {
            // AGGRESSIVELY force iframe to be visible with !important equivalent
            iframe.style.setProperty('height', '700px', 'important');
            iframe.style.setProperty('min-height', '700px', 'important');
            iframe.style.setProperty('max-height', 'none', 'important');
            iframe.style.setProperty('display', 'block', 'important');
            iframe.style.setProperty('visibility', 'visible', 'important');
            iframe.style.setProperty('opacity', '1', 'important');
            iframe.style.setProperty('position', 'relative', 'important');
            iframe.style.setProperty('flex', '1 1 700px', 'important');

            console.log('Iframe forced to 700px with !important styles');

            // Walk up parent container chain and force visibility
            var parent = iframe.parentElement;
            var level = 0;
            while (parent && level < 10) {
                parent.style.setProperty('display', 'block', 'important');
                parent.style.setProperty('visibility', 'visible', 'important');
                parent.style.setProperty('opacity', '1', 'important');
                parent.style.setProperty('overflow', 'visible', 'important');

                // If parent has height restrictions, force them open
                if (parent.style.height === '0px' || parent.style.maxHeight === '0px') {
                    parent.style.setProperty('height', 'auto', 'important');
                    parent.style.setProperty('min-height', '700px', 'important');
                    parent.style.setProperty('max-height', 'none', 'important');
                    console.log('Fixed collapsed parent at level', level);
                }

                parent = parent.parentElement;
                level++;
            }

            console.log('Forced visibility on', level, 'parent containers');
        } else {
            console.warn('Could not access parent iframe element');
        }
    } catch (e) {
        console.error('Error manipulating iframe:', e);
    }
})();

// Wait for DOM to be ready before manipulating it
function initializeTimeline() {
    // Set body and html dimensions
    if (document.documentElement) {
        document.documentElement.style.height = '100%';
        document.documentElement.style.margin = '0';
        document.documentElement.style.padding = '0';
    }

    if (document.body) {
        document.body.style.height = '100%';
        document.body.style.margin = '0';
        document.body.style.padding = '0';
        document.body.style.overflow = 'auto';
    }

    // Create container for Timeline
    if (!window.ganttContainer && document.body) {
    window.ganttContainer = document.createElement('div');
    window.ganttContainer.id = 'rental-gantt-container';

    // AGGRESSIVELY FORCE VISIBILITY
    window.ganttContainer.style.width = '100%';
    window.ganttContainer.style.height = '700px';
    window.ganttContainer.style.minHeight = '700px';
    window.ganttContainer.style.position = 'relative';
    window.ganttContainer.style.overflow = 'visible';
    window.ganttContainer.style.display = 'block';
    window.ganttContainer.style.visibility = 'visible';
    window.ganttContainer.style.opacity = '1';
    window.ganttContainer.style.zIndex = '1';
    window.ganttContainer.style.backgroundColor = '#f8f9fa';

    document.body.appendChild(window.ganttContainer);

        console.log('Timeline container created:', window.ganttContainer.offsetWidth, 'x', window.ganttContainer.offsetHeight);
        console.log('Container bounding rect:', window.ganttContainer.getBoundingClientRect());
    }

    // Wait for vis-timeline library to load before notifying AL
    waitForLibrary();
}

// Wait for vis-timeline library to load before notifying AL
function waitForLibrary() {
    if (typeof vis !== 'undefined' && typeof vis.Timeline !== 'undefined') {
        console.log('vis-timeline library loaded successfully');
        console.log('vis-timeline version:', vis.Timeline.version || 'unknown');
        Microsoft.Dynamics.NAV.InvokeExtensibilityMethod('OnControlReady', []);
    } else {
        libraryLoadAttempts++;
        if (libraryLoadAttempts < maxLoadAttempts) {
            console.log('Waiting for vis-timeline library... attempt', libraryLoadAttempts);
            setTimeout(waitForLibrary, 500);
        } else {
            console.error('vis-timeline library failed to load after', libraryLoadAttempts, 'attempts');
            Microsoft.Dynamics.NAV.InvokeExtensibilityMethod('OnError', ['Failed to load Timeline library']);
        }
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeTimeline);
} else {
    // DOM already loaded
    initializeTimeline();
}

console.log('Rental Timeline control add-in initializing...');
