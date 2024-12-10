import md5 from "md5";

export function getGravatarUrl(email, size = 200, defaultImage = "identicon") {
  const baseUrl = "https://www.gravatar.com/avatar/";
  const emailHash = md5(email.trim().toLowerCase());
  return `${baseUrl}${emailHash}?s=${size}&d=${defaultImage}`;
}