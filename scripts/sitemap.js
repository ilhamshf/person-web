const fs = require('fs')
const path = require('path')
const nanositemap = require('nanositemap')

const { getAllPosts, getAllTags } = require('../lib/api')
const { SITE_METADATA } = require('../lib/constants')

async function main () {
  const sitemapObj = {}
  const posts = await getAllPosts(['date', 'slug'], 'id')

  for (const post of posts) {
    sitemapObj[`/${post.slug}`] = {
      lastmod: new Date(post.date).toISOString(),
      priority: 0.7
    }
  }

  const tags = await getAllTags()

  for (const tag of tags) {
    sitemapObj[`/tag/${tag}`] = {
      lastmod: new Date().toISOString(),
      priority: 0.6
    }
  }

  const sitemap = nanositemap(SITE_METADATA.url, {
    '/': { lastmod: new Date().toISOString(), priority: 0.8 },
    ...sitemapObj
  })

  fs.writeFileSync(path.join('./public', 'sitemap.xml'), sitemap)
}

main()
