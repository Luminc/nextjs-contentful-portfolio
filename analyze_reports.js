const fs = require('fs');
const path = require('path');

const oldReportPath = 'test-main-domain.json';
const newReportPath = 'www.jeroenkortekaas.com-20260214T163111.json';

function getScore(report, category) {
    return report.categories[category] ? Math.round(report.categories[category].score * 100) : 'N/A';
}

function getMetric(report, auditId) {
    const audit = report.audits[auditId];
    if (!audit) return 'N/A';
    return audit.displayValue || audit.numericValue + ' (raw)';
}

function getMetricValue(report, auditId) {
    const audit = report.audits[auditId];
    if (!audit) return Infinity;
    return audit.numericValue;
}

try {
    const oldReport = JSON.parse(fs.readFileSync(oldReportPath, 'utf8'));
    const newReport = JSON.parse(fs.readFileSync(newReportPath, 'utf8'));

    console.log('### Lighthouse Report Comparison');
    console.log('| Category | Old Score | New Score | Change |');
    console.log('| :--- | :---: | :---: | :---: |');
    ['performance', 'accessibility', 'best-practices', 'seo', 'pwa'].forEach(cat => {
        const oldScore = getScore(oldReport, cat);
        const newScore = getScore(newReport, cat);
        // safely calculate diff if numbers
        let diff = 'N/A';
        if (typeof oldScore === 'number' && typeof newScore === 'number') {
            const d = newScore - oldScore;
            diff = d > 0 ? `+${d}` : `${d}`;
        }
        console.log(`| ${cat.toUpperCase()} | ${oldScore} | ${newScore} | ${diff} |`);
    });

    console.log('\n### Core Web Vitals & Metrics');
    console.log('| Metric | Old Value | New Value | Improvement? |');
    console.log('| :--- | :---: | :---: | :---: |');

    const metrics = [
        { id: 'first-contentful-paint', name: 'FCP' },
        { id: 'largest-contentful-paint', name: 'LCP' },
        { id: 'total-blocking-time', name: 'TBT' },
        { id: 'cumulative-layout-shift', name: 'CLS' },
        { id: 'speed-index', name: 'Speed Index' },
        { id: 'interactive', name: 'Time to Interactive' }
    ];

    metrics.forEach(m => {
        const oldDisplay = getMetric(oldReport, m.id);
        const newDisplay = getMetric(newReport, m.id);
        const oldVal = getMetricValue(oldReport, m.id);
        const newVal = getMetricValue(newReport, m.id);

        let improvement = 'N/A';
        if (oldVal !== Infinity && newVal !== Infinity) {
            improvement = newVal < oldVal ? '✅ Better' : (newVal > oldVal ? '❌ Worse' : '➖ Same');
        }

        console.log(`| ${m.name} | ${oldDisplay} | ${newDisplay} | ${improvement} |`);
    });

    console.log('\n### SEO Specifics');
    // Check for some SEO specific audits
    const seoAudits = [
        'document-title',
        'meta-description',
        'http-status-code',
        'link-text',
        'crawlable-anchors',
        'is-crawlable',
        'robots-txt',
        'canonical'
    ];

    console.log('| Audit | Old Status | New Status |');
    console.log('| :--- | :--- | :--- |');
    seoAudits.forEach(id => {
        const oldAudit = oldReport.audits[id];
        const newAudit = newReport.audits[id];
        const oldPass = oldAudit ? (oldAudit.score === 1 ? 'Pass' : 'Fail') : 'N/A';
        const newPass = newAudit ? (newAudit.score === 1 ? 'Pass' : 'Fail') : 'N/A';
        const title = oldAudit ? oldAudit.title : (newAudit ? newAudit.title : id);
        console.log(`| ${title} | ${oldPass} | ${newPass} |`);
    });

} catch (e) {
    console.error('Error analyzing reports:', e);
}
