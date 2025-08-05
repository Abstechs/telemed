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
