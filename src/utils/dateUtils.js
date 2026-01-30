export function getDateRangeForPeriod(period) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    let startDate, endDate;

    switch (period) {
        case 'today':
            startDate = new Date(today);
            endDate = new Date(now);
            break;

        case 'yesterday':
            startDate = new Date(today);
            startDate.setDate(startDate.getDate() - 1);
            endDate = new Date(startDate);
            endDate.setHours(23, 59, 59, 999);
            break;

        case 'this_week':
            // Get start of week (Sunday)
            startDate = new Date(today);
            const dayOfWeek = startDate.getDay();
            startDate.setDate(startDate.getDate() - dayOfWeek);
            endDate = new Date(now);
            break;

        case 'this_month':
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            endDate = new Date(now);
            break;

        case '3_months':
            startDate = new Date(now);
            startDate.setMonth(startDate.getMonth() - 3);
            endDate = new Date(now);
            break;

        case 'this_year':
            startDate = new Date(now.getFullYear(), 0, 1);
            endDate = new Date(now);
            break;

        default:
            // Default to last 7 days
            startDate = new Date(now);
            startDate.setDate(startDate.getDate() - 7);
            endDate = new Date(now);
    }

    return {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
    };
}

export function getTimePeriodLabel(period) {
    const labels = {
        'today': 'اليوم',
        'yesterday': 'الأمس',
        'this_week': 'هذا الأسبوع',
        'this_month': 'هذا الشهر',
        '3_months': '3 أشهر',
        'this_year': 'هذا العام'
    };

    return labels[period] || period;
}

export function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}
