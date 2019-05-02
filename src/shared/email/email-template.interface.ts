export default interface EmailTemplate {
  to: string;
  from: string;
  subject: string;
  html: string;
  text: string;
}
