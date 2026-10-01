export interface ContactDetails {
  name: string;
  email: string;
  focus: string;
  message: string;
}

export function buildContactDraft(details: ContactDetails) {
  const subject = details.focus + " — " + details.name;
  const body = [
    "Hi Rahul,",
    "",
    details.message.trim(),
    "",
    "Name: " + details.name.trim(),
    "Reply to: " + details.email.trim(),
    "Interested in: " + details.focus,
  ].join("\n");
  return { subject, body };
}

export function contactMailto(email: string, draft: { subject: string; body: string }) {
  return "mailto:" + email + "?subject=" + encodeURIComponent(draft.subject) + "&body=" + encodeURIComponent(draft.body);
}
