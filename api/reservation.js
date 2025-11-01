import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const toEmail = process.env.TO_EMAIL;

export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const {
      name, furigana, email, phone,
      date_1, time_1, date_2, time_2, date_3, time_3,
      line, inquiry
    } = req.body;

    // Basic validation
    if (!name || !furigana || !email || !phone) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const subject = `【Regalis】新規ご予約リクエスト: ${name}様`;

    const htmlBody = `
      <h1>新規ご予約リクエスト</h1>
      <p>ウェブサイトの予約フォームから新しいリクエストがありました。</p>
      <hr>
      <h2>お客様情報</h2>
      <ul>
        <li><strong>お名前:</strong> ${name}</li>
        <li><strong>ふりがな:</strong> ${furigana}</li>
        <li><strong>メールアドレス:</strong> ${email}</li>
        <li><strong>電話番号:</strong> ${phone}</li>
      </ul>
      <h2>ご希望日時</h2>
      <ul>
        <li><strong>第1希望:</strong> ${date_1 || '未指定'} ${time_1 || ''}</li>
        <li><strong>第2希望:</strong> ${date_2 || '未指定'} ${time_2 || ''}</li>
        <li><strong>第3希望:</strong> ${date_3 || '未指定'} ${time_3 || ''}</li>
      </ul>
      <h2>ご検討中のライン</h2>
      <p>${line || '未指定'}</p>
      <h2>お問い合わせ内容</h2>
      <p>${inquiry || '特になし'}</p>
      <hr>
    `;

    const { data, error } = await resend.emails.send({
      from: 'Regalis Reservation <noreply@your-verified-domain.com>', // Note: This needs to be a verified domain in Resend
      to: [toEmail],
      subject: subject,
      html: htmlBody,
    });

    if (error) {
      console.error({ error });
      return res.status(500).json({ error: 'Failed to send email' });
    }

    res.status(200).json({ message: 'Reservation request sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
};
