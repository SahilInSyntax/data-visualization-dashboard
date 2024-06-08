document.addEventListener('DOMContentLoaded', function() {
    // Fetch the CSV file
    fetch('sales_data.csv')
        .then(response => response.text())
        .then(data => {
            // Parse the CSV data
            const parsedData = parseCSV(data);
            // Create the charts
            createBarChart(parsedData);
            createLineChart(parsedData);
        });

    // Function to parse CSV data
    function parseCSV(data) {
        const rows = data.trim().split('\n').slice(1); // Split the data into rows and skip the header row
        const parsedData = rows.map(row => {
            const [month, product, sales] = row.split(',');
            return { month, product, sales: parseInt(sales) };
        });
        return parsedData;
    }

    // Function to create the bar chart
    function createBarChart(data) {
        // Filter data for Product A and Product B
        const productAData = data.filter(item => item.product === 'Product A');
        const productBData = data.filter(item => item.product === 'Product B');

        // Define the traces for Plotly
        const traceA = {
            x: productAData.map(item => item.month),
            y: productAData.map(item => item.sales),
            type: 'bar',
            name: 'Product A',
            text: productAData.map(item => `Sales: ${item.sales}`),
            hoverinfo: 'text'
        };

        const traceB = {
            x: productBData.map(item => item.month),
            y: productBData.map(item => item.sales),
            type: 'bar',
            name: 'Product B',
            text: productBData.map(item => `Sales: ${item.sales}`),
            hoverinfo: 'text'
        };

        // Define the layout for the bar chart
        const layout = {
            title: 'Monthly Sales Data',
            xaxis: { title: 'Month' },
            yaxis: { title: 'Sales' }
        };

        // Plot the bar chart
        Plotly.newPlot('chart', [traceA, traceB], layout);
    }

    // Function to create the line chart
    function createLineChart(data) {
        // Aggregate sales by month
        const months = [...new Set(data.map(item => item.month))];
        const salesByMonth = months.map(month => {
            const monthlySales = data.filter(item => item.month === month);
            return monthlySales.reduce((sum, item) => sum + item.sales, 0);
        });

        // Define the trace for Plotly
        const trace = {
            x: months,
            y: salesByMonth,
            type: 'scatter',
            mode: 'lines+markers',
            name: 'Total Sales',
            text: salesByMonth.map(sales => `Total Sales: ${sales}`),
            hoverinfo: 'text'
        };

        // Define the layout for the line chart
        const layout = {
            title: 'Sales Trends Over Months',
            xaxis: { title: 'Month' },
            yaxis: { title: 'Total Sales' }
        };

        // Plot the line chart
        Plotly.newPlot('lineChart', [trace], layout);
    }
});
