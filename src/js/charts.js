import Chart from "https://cdn.jsdelivr.net/npm/chart.js";

export function renderCasesChart(ctx, labels, data, labelName = "Cases") {
    return new Chart(ctx, {
        type: "line",
        data: {
            labels,
            datasets: [{
                label: labelName,
                data,
                backgroundColor: "rgba(16, 185, 129, 0.2)",
                borderColor: "rgba(5, 150, 105, 1)",
                borderWidth: 2,
                tension: 0.3,
                fill: true
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: true }
            },
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}
// src/js/charts.js
// small helpers around Chart.js - import where needed
export function renderBarChart(ctx, labels, values, label = 'Count') {
  return new Chart(ctx, {
    type: 'bar',
    data: { labels, datasets: [{ label, data: values }] },
    options: { responsive:true, plugins:{legend:{display:false}} }
  });
}

export function renderDoughnut(ctx, labels, values) {
  return new Chart(ctx, {
    type: 'doughnut',
    data: { labels, datasets: [{ data: values }] },
    options: { responsive:true }
  });
}