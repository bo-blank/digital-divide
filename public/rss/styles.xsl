<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="3.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:atom="http://www.w3.org/2005/Atom">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml" lang="en">
      <head>
        <title><xsl:value-of select="/rss/channel/title"/> RSS Feed</title>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <style type="text/css">
          * {
            box-sizing: border-box;
          }
          body {
            font-family: Georgia, "Times New Roman", serif;
            line-height: 1.6;
            color: #1A1A1A;
            background: #FAFAF8;
            max-width: 800px;
            margin: 0 auto;
            padding: 2rem 1rem;
          }
          h1 {
            font-size: 2rem;
            margin-bottom: 0.5rem;
            font-weight: 500;
          }
          .description {
            color: #6B7280;
            margin-bottom: 2rem;
          }
          .notice {
            background: #F5F5F3;
            border: 1px solid #E5E7EB;
            border-radius: 0.5rem;
            padding: 1rem;
            margin-bottom: 2rem;
            font-family: system-ui, sans-serif;
            font-size: 0.875rem;
          }
          .notice strong {
            display: block;
            margin-bottom: 0.25rem;
          }
          .feed-list {
            list-style: none;
            padding: 0;
            margin: 0;
          }
          .feed-item {
            border-bottom: 1px solid #E5E7EB;
            padding: 1.5rem 0;
          }
          .feed-item:last-child {
            border-bottom: none;
          }
          .feed-item h2 {
            font-size: 1.25rem;
            margin: 0 0 0.5rem;
            font-weight: 500;
          }
          .feed-item h2 a {
            color: inherit;
            text-decoration: none;
          }
          .feed-item h2 a:hover {
            color: #0D9488;
          }
          .feed-item .meta {
            font-family: system-ui, sans-serif;
            font-size: 0.875rem;
            color: #6B7280;
            margin-bottom: 0.5rem;
          }
          .feed-item .excerpt {
            color: #374151;
          }
        </style>
      </head>
      <body>
        <h1><xsl:value-of select="/rss/channel/title"/></h1>
        <p class="description"><xsl:value-of select="/rss/channel/description"/></p>

        <div class="notice">
          <strong>This is an RSS feed</strong>
          Subscribe by copying the URL from your browser's address bar into your RSS reader.
        </div>

        <ul class="feed-list">
          <xsl:for-each select="/rss/channel/item">
            <li class="feed-item">
              <h2>
                <a>
                  <xsl:attribute name="href">
                    <xsl:value-of select="link"/>
                  </xsl:attribute>
                  <xsl:value-of select="title"/>
                </a>
              </h2>
              <p class="meta">
                <xsl:value-of select="pubDate"/>
              </p>
              <p class="excerpt">
                <xsl:value-of select="description"/>
              </p>
            </li>
          </xsl:for-each>
        </ul>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
