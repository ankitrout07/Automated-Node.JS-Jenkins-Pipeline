document.addEventListener('DOMContentLoaded', () => {
    const responseTimeEl = document.getElementById('response-time');
    const memoryUsageEl = document.getElementById('memory-usage');
    const logsEl = document.getElementById('system-logs');
    const refreshBtn = document.getElementById('refresh-btn');

    const addLog = (message) => {
        const entry = document.createElement('p');
        entry.className = 'log-entry';
        entry.textContent = `> [${new Date().toLocaleTimeString()}] ${message}`;
        logsEl.appendChild(entry);
        logsEl.scrollTop = logsEl.scrollHeight;
    };

    const fetchData = async () => {
        try {
            const start = performance.now();
            const res = await fetch('/api');
            const data = await res.json();
            const end = performance.now();
            
            responseTimeEl.textContent = `${Math.round(end - start)}ms`;
            addLog(`API check: ${data.status} (version ${data.version})`);
        } catch (error) {
            addLog(`Error fetching API: ${error.message}`);
        }
    };

    const fetchMetrics = async () => {
        try {
            const res = await fetch('/metrics');
            const text = await res.text();
            
            // Very basic Prometheus parsing for demo
            const memMatch = text.match(/nodejs_heap_size_total_bytes\s+(\d+)/);
            if (memMatch) {
                const mb = (parseInt(memMatch[1]) / (1024 * 1024)).toFixed(2);
                memoryUsageEl.textContent = `${mb} MB`;
            }
            
            addLog('Metrics updated from Prometheus provider');
        } catch (error) {
            addLog(`Error fetching metrics: ${error.message}`);
        }
    };

    const updateAll = () => {
        fetchData();
        fetchMetrics();
    };

    refreshBtn.addEventListener('click', () => {
        addLog('Manual refresh triggered...');
        updateAll();
    });

    // Initial load
    updateAll();

    // Periodic update
    setInterval(updateAll, 10000);
});
