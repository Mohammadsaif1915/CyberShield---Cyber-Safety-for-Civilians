import nodemailer from 'nodemailer';

const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
};

const welcomeEmailTemplate = (email) => ({
  from: `"Cyber Shield" <${process.env.GMAIL_USER}>`,
  to: email,
  subject: '🛡️ Welcome to Cyber Shield – You\'re Now Protected!',
  html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Welcome to Cyber Shield</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:Arial,sans-serif;">
  <div style="max-width:600px;margin:32px auto;border-radius:14px;overflow:hidden;border:1.5px solid #e2e8f0;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
    <div style="background:linear-gradient(135deg,#0f172a 0%,#1e3a5f 60%,#0ea5e9 100%);padding:40px 32px 32px;text-align:center;">
      <div style="display:inline-flex;align-items:center;justify-content:center;width:64px;height:64px;background:rgba(14,165,233,0.2);border-radius:16px;border:1.5px solid rgba(14,165,233,0.5);margin-bottom:16px;">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2z" fill="#0ea5e9" stroke="#7dd3fc" stroke-width="1"/></svg>
      </div>
      <div style="font-size:22px;font-weight:700;color:#fff;letter-spacing:-0.5px;">Cyber Shield</div>
      <div style="font-size:12px;color:#7dd3fc;letter-spacing:3px;text-transform:uppercase;margin-top:4px;">Security Intelligence Platform</div>
    </div>
    <div style="background:#f0f9ff;border-bottom:2px solid #bae6fd;padding:20px 32px;display:flex;align-items:center;gap:12px;">
      <div style="width:42px;height:42px;border-radius:50%;background:linear-gradient(135deg,#0ea5e9,#0369a1);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M9 12l2 2 4-4" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="12" r="9" stroke="#fff" stroke-width="2"/></svg>
      </div>
      <div>
        <div style="font-size:15px;font-weight:700;color:#0c4a6e;">You're now protected!</div>
        <div style="font-size:12px;color:#0369a1;">Subscription confirmed successfully</div>
      </div>
      <div style="margin-left:auto;background:#0ea5e9;color:#fff;font-size:11px;font-weight:700;padding:4px 12px;border-radius:20px;">ACTIVE</div>
    </div>
    <div style="background:#fff;padding:32px;">
      <h2 style="font-size:22px;font-weight:700;color:#0f172a;margin:0 0 12px;">Welcome to the Shield 🛡️</h2>
      <p style="font-size:14px;color:#475569;line-height:1.7;margin:0 0 24px;">You've just joined a community of security-aware professionals. We'll keep you updated with the latest cybersecurity insights, threat intelligence, and best practices — straight to your inbox.</p>
      <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:28px;">
        <span style="background:#f0f9ff;color:#0369a1;font-size:12px;font-weight:600;padding:6px 14px;border-radius:20px;border:1px solid #bae6fd;">Threat Alerts</span>
        <span style="background:#f0fdf4;color:#166534;font-size:12px;font-weight:600;padding:6px 14px;border-radius:20px;border:1px solid #bbf7d0;">Expert Guides</span>
        <span style="background:#fdf4ff;color:#6b21a8;font-size:12px;font-weight:600;padding:6px 14px;border-radius:20px;border:1px solid #e9d5ff;">CVE Bulletins</span>
        <span style="background:#fff7ed;color:#9a3412;font-size:12px;font-weight:600;padding:6px 14px;border-radius:20px;border:1px solid #fed7aa;">Security News</span>
      </div>
      <div style="text-align:center;margin:28px 0;">
        <a href="${process.env.SITE_URL || 'http://localhost:3000'}/blog" style="display:inline-block;background:linear-gradient(135deg,#0ea5e9,#0369a1);color:#fff;font-size:15px;font-weight:700;padding:14px 40px;border-radius:10px;text-decoration:none;">Explore Articles →</a>
      </div>
      <div style="border-top:1px solid #e2e8f0;padding-top:24px;display:grid;grid-template-columns:repeat(3,1fr);gap:12px;text-align:center;">
        <div style="background:#f8fafc;border-radius:10px;padding:14px 8px;">
          <div style="font-size:20px;font-weight:700;color:#0ea5e9;">500+</div>
          <div style="font-size:11px;color:#64748b;margin-top:2px;">Articles</div>
        </div>
        <div style="background:#f8fafc;border-radius:10px;padding:14px 8px;">
          <div style="font-size:20px;font-weight:700;color:#0ea5e9;">10K+</div>
          <div style="font-size:11px;color:#64748b;margin-top:2px;">Members</div>
        </div>
        <div style="background:#f8fafc;border-radius:10px;padding:14px 8px;">
          <div style="font-size:20px;font-weight:700;color:#0ea5e9;">Daily</div>
          <div style="font-size:11px;color:#64748b;margin-top:2px;">Updates</div>
        </div>
      </div>
    </div>
    <div style="background:#0f172a;padding:20px 32px;text-align:center;">
      <div style="font-size:11px;color:#64748b;">© 2024 Cyber Shield &nbsp;|&nbsp; MSBTE Final Year Project &nbsp;|&nbsp; All rights reserved</div>
      <div style="font-size:11px;color:#334155;margin-top:6px;">You're receiving this because you subscribed at cybershield.com</div>
    </div>
  </div>
</body>
</html>`
});

const newBlogEmailTemplate = (email, blog) => ({
  from: `"Cyber Shield" <${process.env.GMAIL_USER}>`,
  to: email,
  subject: `🔔 New Article: ${blog.title}`,
  html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>New Article: ${blog.title}</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:Arial,sans-serif;">
  <div style="max-width:600px;margin:32px auto;border-radius:14px;overflow:hidden;border:1.5px solid #e2e8f0;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
    <div style="background:linear-gradient(135deg,#0f172a 0%,#1e3a5f 60%,#0ea5e9 100%);padding:28px 32px;display:flex;align-items:center;gap:16px;">
      <div style="display:inline-flex;align-items:center;justify-content:center;width:48px;height:48px;background:rgba(14,165,233,0.2);border-radius:12px;border:1.5px solid rgba(14,165,233,0.5);flex-shrink:0;">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2z" fill="#0ea5e9"/></svg>
      </div>
      <div>
        <div style="font-size:18px;font-weight:700;color:#fff;">Cyber Shield</div>
        <div style="font-size:11px;color:#7dd3fc;letter-spacing:2px;text-transform:uppercase;">New Article Alert</div>
      </div>
      <div style="margin-left:auto;background:#ef4444;color:#fff;font-size:11px;font-weight:700;padding:4px 12px;border-radius:20px;">NEW</div>
    </div>
    <div style="background:linear-gradient(90deg,#fef3c7,#fef9c3);border-left:4px solid #f59e0b;padding:10px 20px;">
      <span style="font-size:12px;color:#92400e;font-weight:600;">New article published — don't miss it!</span>
    </div>
    <div style="background:#fff;padding:32px;">
      <div style="margin-bottom:16px;">
        <span style="background:#fdf4ff;color:#7c3aed;font-size:11px;font-weight:700;padding:4px 12px;border-radius:20px;border:1px solid #e9d5ff;text-transform:uppercase;letter-spacing:1px;">Cyber Intelligence</span>
      </div>
      <h2 style="font-size:21px;font-weight:700;color:#0f172a;margin:0 0 14px;line-height:1.35;">${blog.title}</h2>
      <p style="font-size:14px;color:#475569;line-height:1.75;margin:0 0 24px;">${blog.excerpt}</p>
      <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:16px 20px;margin-bottom:28px;">
        <div style="font-size:12px;color:#94a3b8;font-weight:600;text-transform:uppercase;letter-spacing:1px;margin-bottom:10px;">Why You Should Read This</div>
        <div style="display:flex;align-items:flex-start;gap:8px;margin-bottom:6px;">
          <span style="color:#0ea5e9;font-weight:700;">→</span>
          <span style="font-size:13px;color:#334155;">Expert analysis with actionable takeaways</span>
        </div>
        <div style="display:flex;align-items:flex-start;gap:8px;margin-bottom:6px;">
          <span style="color:#0ea5e9;font-weight:700;">→</span>
          <span style="font-size:13px;color:#334155;">Real-world case studies and threat vectors</span>
        </div>
        <div style="display:flex;align-items:flex-start;gap:8px;">
          <span style="color:#0ea5e9;font-weight:700;">→</span>
          <span style="font-size:13px;color:#334155;">Defense strategies you can implement today</span>
        </div>
      </div>
      <div style="text-align:center;margin:28px 0 8px;">
        <a href="${process.env.SITE_URL || 'http://localhost:3000'}/blog/${blog._id}" style="display:inline-block;background:linear-gradient(135deg,#0ea5e9,#0369a1);color:#fff;font-size:15px;font-weight:700;padding:14px 40px;border-radius:10px;text-decoration:none;">Read Full Article →</a>
      </div>
      <div style="text-align:center;font-size:12px;color:#94a3b8;margin-top:10px;">Members-only deep dive — exclusive to subscribers</div>
    </div>
    <div style="background:#0f172a;padding:20px 32px;text-align:center;">
      <div style="font-size:11px;color:#64748b;">© 2024 Cyber Shield &nbsp;|&nbsp; MSBTE Final Year Project &nbsp;|&nbsp; All rights reserved</div>
      <div style="font-size:11px;color:#334155;margin-top:6px;">Unsubscribe &nbsp;·&nbsp; Manage Preferences &nbsp;·&nbsp; View in Browser</div>
    </div>
  </div>
</body>
</html>`
});

export const sendWelcomeEmail = async (email) => {
  const transporter = createTransporter();
  const mailOptions = welcomeEmailTemplate(email);
  const info = await transporter.sendMail(mailOptions);
  console.log(`✅ Welcome email sent to ${email}: ${info.messageId}`);
  return info;
};

export const sendBlogNotification = async (subscribers, blog) => {
  const transporter = createTransporter();
  const results = [];

  for (const subscriber of subscribers) {
    try {
      const mailOptions = newBlogEmailTemplate(subscriber.email, blog);
      const info = await transporter.sendMail(mailOptions);
      results.push({ email: subscriber.email, success: true });
    } catch (err) {
      results.push({ email: subscriber.email, success: false });
    }
  }

  return results;
};

// ══════════════════════════════════════════════════════════════
// INCIDENT REPORT TEMPLATES
// ══════════════════════════════════════════════════════════════

const incidentReportSubmissionTemplate = (reporterEmail, userName, report) => {
  const typeEmojis = {
    phishing: '🎣',
    malware: '🦠',
    scam_call: '☎️',
    fraud_link: '🔗',
    suspicious_email: '✉️',
    other: '❓'
  };
  const severityColors = {
    low: '#0D9488',
    medium: '#D97706',
    high: '#EA580C',
    critical: '#DC2626'
  };

  return {
    from: `"Cyber Shield" <${process.env.GMAIL_USER}>`,
    to: reporterEmail,
    subject: `✅ Threat Report #${report._id.toString().slice(-6).toUpperCase()} Received`,
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Report Confirmation</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:Arial,sans-serif;">
  <div style="max-width:600px;margin:32px auto;border-radius:14px;overflow:hidden;border:1.5px solid #e2e8f0;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
    {/* Header */}
    <div style="background:linear-gradient(135deg,#059669 0%,#0d9488 100%);padding:32px;text-align:center;">
      <div style="display:inline-flex;align-items:center;justify-content:center;width:56px;height:56px;background:rgba(255,255,255,0.2);border-radius:14px;border:2px solid rgba(255,255,255,0.3);margin-bottom:12px;">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M9 12l2 2 4-4" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="12" r="9" stroke="#fff" stroke-width="2"/></svg>
      </div>
      <h1 style="font-size:24px;font-weight:700;color:#fff;margin:0 0 6px;">Report Received</h1>
      <p style="font-size:13px;color:rgba(255,255,255,0.9);margin:0;">Thank you for helping protect the community</p>
    </div>

    {/* Confirmation Box */}
    <div style="background:#f0fdf4;border-left:4px solid #059669;padding:18px 24px;">
      <p style="font-size:13px;color:#166534;margin:0;font-weight:600;">✓ Your threat report has been submitted successfully</p>
      <p style="font-size:12px;color:#16a34a;margin:6px 0 0;">Report ID: <strong>#${report._id.toString().slice(-6).toUpperCase()}</strong></p>
    </div>

    {/* Report Details */}
    <div style="background:#fff;padding:32px;">
      <h2 style="font-size:18px;font-weight:700;color:#0f172a;margin:0 0 24px;border-bottom:2px solid #e2e8f0;padding-bottom:12px;">Report Details</h2>
      
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:28px;">
        {/* Type */}
        <div>
          <div style="font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;">Threat Type</div>
          <div style="font-size:14px;font-weight:600;color:#0f172a;">${typeEmojis[report.reportType]} ${report.reportType.replace(/_/g, ' ')}</div>
        </div>
        
        {/* Severity */}
        <div>
          <div style="font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;">Severity</div>
          <div style="display:inline-block;background:${severityColors[report.severity]}20;color:${severityColors[report.severity]};font-size:13px;font-weight:700;padding:6px 14px;border-radius:20px;text-transform:capitalize;border:1px solid ${severityColors[report.severity]}40;">${report.severity}</div>
        </div>
      </div>

      {/* Title */}
      <div style="margin-bottom:20px;">
        <div style="font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;">Subject</div>
        <div style="font-size:14px;color:#334155;font-weight:500;">${report.title}</div>
      </div>

      {/* Description Preview */}
      <div style="margin-bottom:20px;">
        <div style="font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;">Description</div>
        <div style="font-size:13px;color:#475569;line-height:1.6;background:#f8fafc;padding:12px 16px;border-radius:8px;border-left:3px solid #0ea5e9;">${report.description.substring(0, 200)}${report.description.length > 200 ? '...' : ''}</div>
      </div>

      {/* Submission Time */}
      <div style="display:flex;align-items:center;gap:8px;font-size:12px;color:#94a3b8;">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><path d="M12 6v6h4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
        <span>Submitted on ${new Date(report.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })} at ${new Date(report.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
      </div>
    </div>

    {/* What Happens Next */}
    <div style="background:#f0f9ff;border-top:1px solid #bae6fd;padding:24px 32px;">
      <h3 style="font-size:14px;font-weight:700;color:#0c4a6e;margin:0 0 16px;">What Happens Next?</h3>
      <div style="display:flex;align-items:flex-start;gap:12px;margin-bottom:14px;">
        <div style="width:28px;height:28px;background:#0ea5e9;color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;flex-shrink:0;">1</div>
        <div>
          <div style="font-size:13px;font-weight:600;color:#0369a1;">Review & Analysis</div>
          <div style="font-size:12px;color:#0c4a6e;margin-top:2px;">Our security team will thoroughly investigate your report</div>
        </div>
      </div>
      <div style="display:flex;align-items:flex-start;gap:12px;margin-bottom:14px;">
        <div style="width:28px;height:28px;background:#0ea5e9;color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;flex-shrink:0;">2</div>
        <div>
          <div style="font-size:13px;font-weight:600;color:#0369a1;">Status Updates</div>
          <div style="font-size:12px;color:#0c4a6e;margin-top:2px;">You'll receive email updates as your report is reviewed</div>
        </div>
      </div>
      <div style="display:flex;align-items:flex-start;gap:12px;">
        <div style="width:28px;height:28px;background:#0ea5e9;color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;flex-shrink:0;">3</div>
        <div>
          <div style="font-size:13px;font-weight:600;color:#0369a1;">Community Impact</div>
          <div style="font-size:12px;color:#0c4a6e;margin-top:2px;">Verified threats help us protect thousands of users</div>
        </div>
      </div>
    </div>

    {/* CTA */}
    <div style="background:#fff;padding:0 32px 28px;text-align:center;">
      <a href="${process.env.SITE_URL || 'http://localhost:3000'}/dashboard?tab=incident-report" style="display:inline-block;background:linear-gradient(135deg,#0ea5e9,#0369a1);color:#fff;font-size:14px;font-weight:700;padding:12px 36px;border-radius:8px;text-decoration:none;">View Report →</a>
    </div>

    {/* Footer */}
    <div style="background:#0f172a;padding:20px 32px;text-align:center;">
      <div style="font-size:11px;color:#64748b;">© 2024 Cyber Shield &nbsp;|&nbsp; MSBTE Final Year Project &nbsp;|&nbsp; All rights reserved</div>
      <div style="font-size:11px;color:#334155;margin-top:8px;">This confirmation was sent because a threat report was submitted from this email address</div>
    </div>
  </div>
</body>
</html>`
  };
};

const incidentStatusUpdateTemplate = (reporterEmail, userName, report, oldStatus, newStatus) => {
  const statusMessages = {
    pending: { text: 'Under Initial Review', color: '#D97706', emoji: '⏳' },
    reviewed: { text: 'Reviewed by Security Team', color: '#0EA5E9', emoji: '🔍' },
    verified: { text: 'Verified as Authentic Threat', color: '#059669', emoji: '✓' },
    resolved: { text: 'Threat Resolved', color: '#10B981', emoji: '✅' }
  };

  const current = statusMessages[newStatus] || statusMessages.pending;

  return {
    from: `"Cyber Shield" <${process.env.GMAIL_USER}>`,
    to: reporterEmail,
    subject: `🔔 Update: Report #${report._id.toString().slice(-6).toUpperCase()} – ${current.text}`,
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Report Status Update</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:Arial,sans-serif;">
  <div style="max-width:600px;margin:32px auto;border-radius:14px;overflow:hidden;border:1.5px solid #e2e8f0;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
    {/* Header */}
    <div style="background:linear-gradient(135deg,${current.color},${current.color}dd);padding:28px 32px;display:flex;align-items:center;gap:16px;">
      <div style="font-size:32px;">${current.emoji}</div>
      <div>
        <h1 style="font-size:20px;font-weight:700;color:#fff;margin:0;">${current.text}</h1>
        <p style="font-size:12px;color:rgba(255,255,255,0.9);margin:4px 0 0;">Report #${report._id.toString().slice(-6).toUpperCase()}</p>
      </div>
    </div>

    {/* Update Alert */}
    <div style="background:#fff3cd;border-left:4px solid #ffc107;padding:16px 24px;">
      <p style="font-size:13px;color:#664d03;margin:0;font-weight:600;">Your threat report has been updated</p>
    </div>

    {/* Details */}
    <div style="background:#fff;padding:32px;">
      <h2 style="font-size:16px;font-weight:700;color:#0f172a;margin:0 0 20px;">Status Update Details</h2>
      
      <table style="width:100%;margin-bottom:28px;">
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #e2e8f0;font-size:12px;color:#64748b;font-weight:700;text-transform:uppercase;">Report Title</td>
          <td style="padding:12px 0;border-bottom:1px solid #e2e8f0;text-align:right;font-size:13px;color:#334155;font-weight:500;">${report.title}</td>
        </tr>
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #e2e8f0;font-size:12px;color:#64748b;font-weight:700;text-transform:uppercase;">Previous Status</td>
          <td style="padding:12px 0;border-bottom:1px solid #e2e8f0;text-align:right;"><span style="background:#e5e7eb;color:#374151;font-size:12px;font-weight:700;padding:4px 12px;border-radius:20px;text-transform:capitalize;">${oldStatus}</span></td>
        </tr>
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #e2e8f0;font-size:12px;color:#64748b;font-weight:700;text-transform:uppercase;">New Status</td>
          <td style="padding:12px 0;border-bottom:1px solid #e2e8f0;text-align:right;"><span style="background:${current.color}20;color:${current.color};font-size:12px;font-weight:700;padding:4px 12px;border-radius:20px;text-transform:capitalize;border:1px solid ${current.color}40;">${newStatus}</span></td>
        </tr>
        <tr>
          <td style="padding:12px 0;font-size:12px;color:#64748b;font-weight:700;text-transform:uppercase;">Updated On</td>
          <td style="padding:12px 0;text-align:right;font-size:13px;color:#334155;">${new Date().toLocaleDateString('en-IN')} at ${new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</td>
        </tr>
      </table>

      ${newStatus === 'verified' ? `
        <div style="background:#f0fdf4;border:1px solid #86efac;border-radius:10px;padding:16px;margin-bottom:20px;">
          <div style="display:flex;align-items:flex-start;gap:10px;">
            <span style="font-size:18px;flex-shrink:0;">🎖️</span>
            <div>
              <div style="font-size:13px;font-weight:700;color:#166534;margin-bottom:4px;">Threat Verified</div>
              <div style="font-size:12px;color:#166534;">Your report has been verified as an authentic security threat. This information helps us protect the entire community.</div>
            </div>
          </div>
        </div>
      ` : ''}

      ${newStatus === 'resolved' ? `
        <div style="background:#f0fdf4;border:1px solid #86efac;border-radius:10px;padding:16px;margin-bottom:20px;">
          <div style="display:flex;align-items:flex-start;gap:10px;">
            <span style="font-size:18px;flex-shrink:0;">🎯</span>
            <div>
              <div style="font-size:13px;font-weight:700;color:#166534;margin-bottom:4px;">Threat Resolved</div>
              <div style="font-size:12px;color:#166534;">Thank you for reporting this threat. Appropriate action has been taken to mitigate the risk.</div>
            </div>
          </div>
        </div>
      ` : ''}
    </div>

    {/* Footer */}
    <div style="background:#0f172a;padding:20px 32px;text-align:center;">
      <div style="font-size:11px;color:#64748b;">© 2024 Cyber Shield &nbsp;|&nbsp; MSBTE Final Year Project &nbsp;|&nbsp; All rights reserved</div>
      <div style="font-size:11px;color:#334155;margin-top:8px;">You're receiving this update because you submitted a threat report</div>
    </div>
  </div>
</body>
</html>`
  };
};

export const sendIncidentReportConfirmation = async (reporterEmail, userName, report) => {
  const transporter = createTransporter();
  const mailOptions = incidentReportSubmissionTemplate(reporterEmail, userName, report);
  const info = await transporter.sendMail(mailOptions);
  console.log(`✅ Incident report confirmation sent to ${reporterEmail}: ${info.messageId}`);
  return info;
};

export const sendIncidentStatusUpdate = async (reporterEmail, userName, report, oldStatus, newStatus) => {
  const transporter = createTransporter();
  const mailOptions = incidentStatusUpdateTemplate(reporterEmail, userName, report, oldStatus, newStatus);
  const info = await transporter.sendMail(mailOptions);
  console.log(`✅ Incident status update sent to ${reporterEmail}: ${info.messageId}`);
  return info;
};