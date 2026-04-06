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