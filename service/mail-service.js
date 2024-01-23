import nodemailer from 'nodemailer'

class MailService {

  constructor() {
    this.transporter = nodemailer.createTransport({
      host:process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    })
  }

  async sendActivationMail(to, link){
    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_USER,
        to,
        subject: 'Активация аккаунта Control history',
        text: 
          `
            <div>
              <h1>Пройдите по ссылке для активации</h1>
              <a href="${link}">Ссылка для активации</a>
            </div>
          `
      })
    } catch (e) {
      console.log(e);
    }
  }
}

export default new MailService();
