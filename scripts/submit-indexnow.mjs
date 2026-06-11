// Submits all sitemap URLs to IndexNow (Bing, Yandex, Naver, Seznam).
// Run after a deploy that adds or meaningfully updates pages:
//   node scripts/submit-indexnow.mjs
const KEY = "ed61b5e27adcf28faefd228168ce0825";
const HOST = "www.outing.golf";

const sitemap = await fetch(`https://${HOST}/sitemap.xml`).then((r) => r.text());
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);

const res = await fetch("https://api.indexnow.org/IndexNow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({
    host: HOST,
    key: KEY,
    keyLocation: `https://${HOST}/${KEY}.txt`,
    urlList: urls
  })
});

console.log(`Submitted ${urls.length} URLs — IndexNow responded ${res.status}`);
