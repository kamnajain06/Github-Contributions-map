window.onload = async () => {
    try {
        const response = await fetch(process.env.API_URL);
        const calendar = await response.json();

        const heatmapContainer = document.querySelector('.heatmap');

        const getMonthAndYear = (dateString) => {
            const date = new Date(dateString);
            return { month: date.getMonth(), year: date.getFullYear() };
        };

        const months = {};

        calendar.weeks.forEach((week) => {
            week.contributionDays.forEach((day) => {
                const { month, year } = getMonthAndYear(day.date);
                const monthYearKey = `${month}-${year}`;
                if (!months[monthYearKey]) {
                    months[monthYearKey] = [];
                }
                if (!months[monthYearKey].includes(week)) {
                    months[monthYearKey].push(week);
                }
            });
        });

        Object.keys(months).forEach((monthYearKey) => {
            const [month, year] = monthYearKey.split('-');
            const monthName = new Date(year, month).toLocaleString('default', { month: 'long' });
            const monthDiv = document.createElement('div');
            monthDiv.classList.add('month');
            monthDiv.innerHTML = `<h4>${monthName}</h4>`;

            const weekGrid = document.createElement('div');
            weekGrid.classList.add('week-grid');

            months[monthYearKey].forEach((week) => {
                const weekDiv = document.createElement('div');
                weekDiv.classList.add('week');

                week.contributionDays.forEach((day) => {
                    const dayDiv = document.createElement('div');
                    dayDiv.classList.add('day');

                    const { month: dayMonth, year: dayYear } = getMonthAndYear(day.date);
                    if (dayMonth !== parseInt(month) || dayYear !== parseInt(year)) {
                        dayDiv.classList.add('day-prev-month');
                    }

                    if (day.contributionCount === 0) {
                        dayDiv.classList.add('day-0');
                    } else if (day.contributionCount <= 5) {
                        dayDiv.classList.add('day-1');
                    } else if (day.contributionCount <= 10) {
                        dayDiv.classList.add('day-2');
                    } else {
                        dayDiv.classList.add('day-3');
                    }

                    // Optionally, display the date in the day div
                    dayDiv.setAttribute('title', day.date);

                    // Append the day div to the week div
                    weekDiv.appendChild(dayDiv);
                });

                weekGrid.appendChild(weekDiv);
            });

            monthDiv.appendChild(weekGrid);
            heatmapContainer.appendChild(monthDiv);
        });

    } catch (error) {
        console.error('Error fetching contributions:', error);
    }
};
