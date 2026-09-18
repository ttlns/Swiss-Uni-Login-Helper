// redirect to dark theme if nesseceary
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    const url = new URL(window.location.href);
    
    if (url.searchParams.get('backgroundColor') !== '000000') {
        url.searchParams.set('backgroundColor', '000000');
        url.searchParams.set('fontColor', 'ffffff');
        window.location.replace(url.toString());
    }
}