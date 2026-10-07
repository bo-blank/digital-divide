import type { Lang } from './config';

/**
 * Every user-visible string in the chrome, in both languages.
 *
 * `en` is the source of truth: `de` is typed as `Record<keyof typeof en, string>`,
 * so a missing German key is a build error rather than a blank on the page. Add
 * to `en` first and TypeScript will tell you what `de` still owes.
 *
 * Two conventions matter for translators:
 *
 *   - Placeholders are `{name}` and are substituted by `t()`. Never build a
 *     sentence by concatenating a translated fragment with a value — German
 *     word order differs, and "{author} reports." has to be free to become
 *     "{author} berichtet." Whole sentences are keys; fragments are not.
 *   - Countable strings come in `_one`/`_other` pairs and are read with
 *     `plural()`. Both languages happen to be binary, so the pair is exact for
 *     each; a language with more forms would need this replaced by Intl.PluralRules.
 */
const en = {
  // Site-wide
  'site.title': 'Digital Divide',
  'site.description': 'Essays exploring the intersection of technology and humanity.',
  'site.skipToContent': 'Skip to content',
  'site.rights': '© {year} Digital Divide. All rights reserved.',

  // Header / navigation
  'nav.label': 'Main',
  'nav.essays': 'Essays',
  'nav.notes': 'Notes',
  'nav.tags': 'Tags',
  'nav.about': 'About',
  'nav.subscribe': 'Subscribe',
  'nav.openMenu': 'Open menu',
  'nav.closeMenu': 'Close menu',
  'nav.trendingLabel': 'Trending topics',
  'nav.trending': 'Trending',
  'nav.language': 'Language',
  'nav.switchLanguage': 'Read this page in {language}',
  'nav.switchLanguageUnavailable':
    'Not available in {language} — go to the {language} home page',

  // Footer
  'footer.explore': 'Explore',
  'footer.essays': 'Essays',
  'footer.notes': 'Notes',
  'footer.topics': 'Topics',
  'footer.series': 'Series',
  'footer.rss': 'RSS Feed',
  'footer.about': 'About',
  'footer.aboutUs': 'About Us',
  'footer.contact': 'Contact',
  'footer.legal': 'Legal',
  'footer.privacy': 'Privacy Policy',
  'footer.newsletter': 'Newsletter',
  'footer.newsletterHint': 'Get essays delivered to your inbox',
  'footer.emailLabel': 'Email address',
  'footer.emailPlaceholder': 'your@email.com',
  'footer.subscribe': 'Subscribe',

  // Home
  'home.byline': '{author} reports.',
  'home.read': 'Read',
  'home.heroBlurb':
    'Essays exploring the intersection of technology and humanity. We examine how digital tools shape our relationships, communities, and sense of self.',
  'home.subscribe': 'Subscribe',
  'home.dontMiss': 'Don’t miss a post. Stay updated »',
  'home.recentEssays': 'Recent Essays',
  'home.viewAll': 'View all →',
  'home.noEssays': 'No essays published yet.',
  'home.notes': 'Notes',
  'home.viewNote': 'View note →',

  // Essays listing
  'essays.title': 'Essays',
  'essays.titlePaged': 'Essays - Page {page}',
  'essays.description':
    'Long-form essays exploring technology, culture, and the human experience.',
  'essays.tagline': 'Long-form explorations of technology, culture, and the spaces between.',
  'essays.empty': 'No essays published yet. Check back soon.',

  // Notes listing + note page
  'notes.title': 'Notes',
  'notes.description':
    'Quick thoughts, observations, and brief commentary on technology and culture.',
  'notes.tagline': 'Quick thoughts and observations. Less polished, more frequent.',
  'notes.empty': 'No notes published yet. Check back soon.',
  'notes.draft': 'Draft',
  'notes.viewNote': 'View note →',
  'notes.untitled': 'Note from {date}',
  'notes.allNotes': '← All notes',

  // Tag index
  'tags.indexTitle': 'Topics',
  'tags.indexDescription': 'Browse all topics and tags on Digital Divide.',
  'tags.indexHeading': 'The Index',
  'tags.indexTagline': 'Browse essays by topic',
  'tags.indexEmpty': 'No tags yet.',
  'tags.untitledNote': 'Untitled note',

  // Single tag page
  'tags.pageTitle': 'Posts tagged “{tag}”',
  'tags.pageDescription': 'All content tagged with “{tag}” on Digital Divide.',
  'tags.allTags': '← All tags',
  'tags.taggedPrefix': 'Tagged:',
  'tags.essayCount_one': '{count} essay',
  'tags.essayCount_other': '{count} essays',
  'tags.noteCount_one': '{count} note',
  'tags.noteCount_other': '{count} notes',
  'tags.noContent': 'No content with this tag yet.',
  'tags.essaysHeading': 'Essays',
  'tags.notesHeading': 'Notes',
  'tags.noEssays': 'No essays with this tag yet.',
  'tags.noNotes': 'No notes with this tag yet.',

  // Series index
  'series.indexTitle': 'Series',
  'series.indexDescription':
    'Explore multi-part essay series on technology, culture, and ideas.',
  'series.indexTagline': 'Multi-part explorations of complex topics.',
  'series.indexEmpty': 'No series published yet. Check back soon.',
  'series.partCount_one': '{count} part',
  'series.partCount_other': '{count} parts',
  'series.latest': 'Latest: {title}',

  // Single series page
  'series.kicker': 'Series',
  'series.pageTitle': '{name} Series',
  'series.pageDescription': 'A multi-part series exploring {name}.',
  'series.partsInSeries_one': '{count} part in this series',
  'series.partsInSeries_other': '{count} parts in this series',
  'series.noPosts': 'No posts in this series yet.',
  'series.allSeries': '← All series',

  // In-post series navigation
  'seriesNav.label': 'Series navigation',
  'seriesNav.partOfSeries': 'Part of series',
  'seriesNav.partOf': 'Part {current} of {total}',
  'seriesNav.previous': 'Previous in series',
  'seriesNav.next': 'Next in series',
  'seriesNav.viewAll_one': 'View all {count} post in series →',
  'seriesNav.viewAll_other': 'View all {count} posts in series →',

  // Essay page chrome
  'post.draft': 'Draft',
  'post.updated': 'Updated: {date}',
  'post.enjoyed': 'Enjoyed this essay?',
  'post.subscribePrompt': 'Subscribe to get new essays delivered to your inbox.',
  'post.subscribe': 'Subscribe',
  'post.navLabel': 'Post navigation',
  'post.allEssays': '← All essays',

  // Post card
  'card.draft': 'Draft',

  // Related posts
  'related.title': 'You might also like',

  // Table of contents
  'toc.title': 'Contents',

  // Pagination
  'pagination.label': 'Pagination',
  'pagination.previous': 'Previous',
  'pagination.next': 'Next',
  'pagination.goToPrevious': 'Go to previous page',
  'pagination.goToNext': 'Go to next page',
  'pagination.goToPage': 'Go to page {page}',

  // Share buttons
  'share.label': 'Share:',
  'share.twitter': 'Share on Twitter',
  'share.linkedin': 'Share on LinkedIn',
  'share.email': 'Share via email',
  'share.copyLink': 'Copy link',
  'share.copyLinkAria': 'Copy link to clipboard',

  // Code copy button
  'copy.code': 'Copy code',
  'copy.codeAria': 'Copy code to clipboard',

  // Theme toggle
  'theme.toggle': 'Toggle dark mode',

  // Reading time / word count
  'readingTime.minutes_one': '{count} min read',
  'readingTime.minutes_other': '{count} min read',
  'readingTime.words_one': '{count} word',
  'readingTime.words_other': '{count} words',

  // 404
  'notFound.title': 'Page Not Found',
  'notFound.description': 'That page doesn’t exist. Browse the latest essays instead.',
  'notFound.kicker': 'Error 404',
  'notFound.heading': 'This page doesn’t exist',
  'notFound.body': 'The link may be out of date, or the address may have a typo.',
  'notFound.goHome': 'Go home',
  'notFound.browseEssays': 'Browse essays',
  'notFound.recentEssays': 'Recent essays',

  // Subscribe page
  'subscribe.title': 'Subscribe',
  'subscribe.description':
    'Subscribe to Digital Divide and get new essays delivered to your inbox.',
  'subscribe.lead': 'Get new essays delivered directly to your inbox.',
  'subscribe.heroAlt':
    'Illustration of a letter and stamp arriving in an envelope, with paper airplanes flying past, representing essays delivered by newsletter',
  'subscribe.emailLabel': 'Email address',
  'subscribe.emailPlaceholder': 'your@email.com',
  'subscribe.consent':
    'I agree to receive emails from Digital Divide. You can unsubscribe at any time.',
  'subscribe.viewPrivacyBefore': 'View our',
  'subscribe.privacyPolicy': 'privacy policy',
  'subscribe.viewPrivacyAfter': '.',
  'subscribe.submit': 'Subscribe',
  'subscribe.submitting': 'Subscribing…',
  'subscribe.successTitle': 'Thanks for subscribing!',
  'subscribe.successBody': 'Check your inbox to confirm your subscription.',
  'subscribe.errorTitle': 'Something went wrong.',
  'subscribe.errorBody': 'Please try again later.',
  'subscribe.noSpam': 'No spam, ever. Unsubscribe with one click.',
  'subscribe.whatYouGet': 'What you’ll get',
  'subscribe.feature1Title': 'Long-form Essays',
  'subscribe.feature1Body': 'Thoughtful explorations of technology and culture.',
  'subscribe.feature2Title': 'Quick Notes',
  'subscribe.feature2Body': 'Brief observations and timely commentary.',
  'subscribe.feature3Title': 'Curated Reads',
  'subscribe.feature3Body': 'Occasional links to the best writing elsewhere.',

  // About page chrome (the prose comes from the CMS)
  'about.heroAlt':
    'Person standing at a digital divide, representing the intersection of technology and humanity',

  // Privacy page chrome
  'privacy.lastUpdated': 'Last updated: {date}',

  // RSS feed
  'rss.title': 'Digital Divide',
  'rss.description': 'Essays exploring technology, culture, and the spaces between.',
} as const;

const de: Record<keyof typeof en, string> = {
  // Site-wide
  'site.title': 'Digital Divide',
  'site.description': 'Essays über das Spannungsfeld von Technologie und Menschlichkeit.',
  'site.skipToContent': 'Zum Inhalt springen',
  'site.rights': '© {year} Digital Divide. Alle Rechte vorbehalten.',

  // Header / navigation
  'nav.label': 'Hauptnavigation',
  'nav.essays': 'Essays',
  'nav.notes': 'Notizen',
  'nav.tags': 'Themen',
  'nav.about': 'Über uns',
  'nav.subscribe': 'Abonnieren',
  'nav.openMenu': 'Menü öffnen',
  'nav.closeMenu': 'Menü schließen',
  'nav.trendingLabel': 'Aktuelle Themen',
  'nav.trending': 'Im Trend',
  'nav.language': 'Sprache',
  'nav.switchLanguage': 'Diese Seite auf {language} lesen',
  'nav.switchLanguageUnavailable':
    'Nicht auf {language} verfügbar — zur Startseite auf {language}',

  // Footer
  'footer.explore': 'Entdecken',
  'footer.essays': 'Essays',
  'footer.notes': 'Notizen',
  'footer.topics': 'Themen',
  'footer.series': 'Serien',
  'footer.rss': 'RSS-Feed',
  'footer.about': 'Über',
  'footer.aboutUs': 'Über uns',
  'footer.contact': 'Kontakt',
  'footer.legal': 'Rechtliches',
  'footer.privacy': 'Datenschutz',
  'footer.newsletter': 'Newsletter',
  'footer.newsletterHint': 'Essays direkt in Ihr Postfach',
  'footer.emailLabel': 'E-Mail-Adresse',
  'footer.emailPlaceholder': 'ihre@email.de',
  'footer.subscribe': 'Abonnieren',

  // Home
  'home.byline': '{author} berichtet.',
  'home.read': 'Lesen',
  'home.heroBlurb':
    'Essays über das Spannungsfeld von Technologie und Menschlichkeit. Wir untersuchen, wie digitale Werkzeuge unsere Beziehungen, unsere Gemeinschaften und unser Selbstverständnis prägen.',
  'home.subscribe': 'Abonnieren',
  'home.dontMiss': 'Keinen Beitrag verpassen. Bleiben Sie auf dem Laufenden »',
  'home.recentEssays': 'Neueste Essays',
  'home.viewAll': 'Alle ansehen →',
  'home.noEssays': 'Noch keine Essays veröffentlicht.',
  'home.notes': 'Notizen',
  'home.viewNote': 'Notiz ansehen →',

  // Essays listing
  'essays.title': 'Essays',
  'essays.titlePaged': 'Essays – Seite {page}',
  'essays.description':
    'Ausführliche Essays über Technologie, Kultur und das menschliche Erleben.',
  'essays.tagline':
    'Ausführliche Erkundungen von Technologie, Kultur und den Räumen dazwischen.',
  'essays.empty': 'Noch keine Essays veröffentlicht. Schauen Sie bald wieder vorbei.',

  // Notes listing + note page
  'notes.title': 'Notizen',
  'notes.description':
    'Kurze Gedanken, Beobachtungen und Anmerkungen zu Technologie und Kultur.',
  'notes.tagline': 'Kurze Gedanken und Beobachtungen. Weniger geschliffen, dafür häufiger.',
  'notes.empty': 'Noch keine Notizen veröffentlicht. Schauen Sie bald wieder vorbei.',
  'notes.draft': 'Entwurf',
  'notes.viewNote': 'Notiz ansehen →',
  'notes.untitled': 'Notiz vom {date}',
  'notes.allNotes': '← Alle Notizen',

  // Tag index
  'tags.indexTitle': 'Themen',
  'tags.indexDescription': 'Alle Themen und Schlagwörter auf Digital Divide.',
  'tags.indexHeading': 'Das Register',
  'tags.indexTagline': 'Essays nach Thema durchstöbern',
  'tags.indexEmpty': 'Noch keine Themen.',
  'tags.untitledNote': 'Notiz ohne Titel',

  // Single tag page
  'tags.pageTitle': 'Beiträge zum Thema „{tag}“',
  'tags.pageDescription': 'Alle Beiträge zum Thema „{tag}“ auf Digital Divide.',
  'tags.allTags': '← Alle Themen',
  'tags.taggedPrefix': 'Thema:',
  'tags.essayCount_one': '{count} Essay',
  'tags.essayCount_other': '{count} Essays',
  'tags.noteCount_one': '{count} Notiz',
  'tags.noteCount_other': '{count} Notizen',
  'tags.noContent': 'Noch keine Beiträge zu diesem Thema.',
  'tags.essaysHeading': 'Essays',
  'tags.notesHeading': 'Notizen',
  'tags.noEssays': 'Noch keine Essays zu diesem Thema.',
  'tags.noNotes': 'Noch keine Notizen zu diesem Thema.',

  // Series index
  'series.indexTitle': 'Serien',
  'series.indexDescription':
    'Mehrteilige Essay-Serien über Technologie, Kultur und Ideen.',
  'series.indexTagline': 'Mehrteilige Erkundungen komplexer Themen.',
  'series.indexEmpty': 'Noch keine Serien veröffentlicht. Schauen Sie bald wieder vorbei.',
  'series.partCount_one': '{count} Teil',
  'series.partCount_other': '{count} Teile',
  'series.latest': 'Zuletzt: {title}',

  // Single series page
  'series.kicker': 'Serie',
  'series.pageTitle': 'Serie: {name}',
  'series.pageDescription': 'Eine mehrteilige Serie über {name}.',
  'series.partsInSeries_one': '{count} Teil in dieser Serie',
  'series.partsInSeries_other': '{count} Teile in dieser Serie',
  'series.noPosts': 'Noch keine Beiträge in dieser Serie.',
  'series.allSeries': '← Alle Serien',

  // In-post series navigation
  'seriesNav.label': 'Serien-Navigation',
  'seriesNav.partOfSeries': 'Teil der Serie',
  'seriesNav.partOf': 'Teil {current} von {total}',
  'seriesNav.previous': 'Vorheriger Teil',
  'seriesNav.next': 'Nächster Teil',
  'seriesNav.viewAll_one': 'Alle {count} Beiträge der Serie ansehen →',
  'seriesNav.viewAll_other': 'Alle {count} Beiträge der Serie ansehen →',

  // Essay page chrome
  'post.draft': 'Entwurf',
  'post.updated': 'Aktualisiert: {date}',
  'post.enjoyed': 'Hat Ihnen dieser Essay gefallen?',
  'post.subscribePrompt':
    'Abonnieren Sie, und Sie bekommen neue Essays direkt in Ihr Postfach.',
  'post.subscribe': 'Abonnieren',
  'post.navLabel': 'Beitragsnavigation',
  'post.allEssays': '← Alle Essays',

  // Post card
  'card.draft': 'Entwurf',

  // Related posts
  'related.title': 'Das könnte Sie auch interessieren',

  // Table of contents
  'toc.title': 'Inhalt',

  // Pagination
  'pagination.label': 'Seitennummerierung',
  'pagination.previous': 'Zurück',
  'pagination.next': 'Weiter',
  'pagination.goToPrevious': 'Zur vorherigen Seite',
  'pagination.goToNext': 'Zur nächsten Seite',
  'pagination.goToPage': 'Zu Seite {page}',

  // Share buttons
  'share.label': 'Teilen:',
  'share.twitter': 'Auf Twitter teilen',
  'share.linkedin': 'Auf LinkedIn teilen',
  'share.email': 'Per E-Mail teilen',
  'share.copyLink': 'Link kopieren',
  'share.copyLinkAria': 'Link in die Zwischenablage kopieren',

  // Code copy button
  'copy.code': 'Code kopieren',
  'copy.codeAria': 'Code in die Zwischenablage kopieren',

  // Theme toggle
  'theme.toggle': 'Dunkelmodus umschalten',

  // Reading time / word count
  'readingTime.minutes_one': '{count} Min. Lesezeit',
  'readingTime.minutes_other': '{count} Min. Lesezeit',
  'readingTime.words_one': '{count} Wort',
  'readingTime.words_other': '{count} Wörter',

  // 404
  'notFound.title': 'Seite nicht gefunden',
  'notFound.description':
    'Diese Seite existiert nicht. Stöbern Sie stattdessen in den neuesten Essays.',
  'notFound.kicker': 'Fehler 404',
  'notFound.heading': 'Diese Seite existiert nicht',
  'notFound.body':
    'Der Link ist womöglich veraltet, oder die Adresse enthält einen Tippfehler.',
  'notFound.goHome': 'Zur Startseite',
  'notFound.browseEssays': 'Essays durchstöbern',
  'notFound.recentEssays': 'Neueste Essays',

  // Subscribe page
  'subscribe.title': 'Abonnieren',
  'subscribe.description':
    'Abonnieren Sie Digital Divide und bekommen Sie neue Essays direkt in Ihr Postfach.',
  'subscribe.lead': 'Neue Essays direkt in Ihr Postfach.',
  'subscribe.heroAlt':
    'Illustration eines Briefs mit Briefmarke, der in einem Umschlag ankommt, während Papierflieger vorbeifliegen — sinnbildlich für Essays, die per Newsletter zugestellt werden',
  'subscribe.emailLabel': 'E-Mail-Adresse',
  'subscribe.emailPlaceholder': 'ihre@email.de',
  'subscribe.consent':
    'Ich willige ein, E-Mails von Digital Divide zu erhalten. Sie können sich jederzeit abmelden.',
  'subscribe.viewPrivacyBefore': 'Lesen Sie unsere',
  'subscribe.privacyPolicy': 'Datenschutzerklärung',
  'subscribe.viewPrivacyAfter': '.',
  'subscribe.submit': 'Abonnieren',
  'subscribe.submitting': 'Wird abonniert …',
  'subscribe.successTitle': 'Danke für Ihr Abonnement!',
  'subscribe.successBody': 'Bitte bestätigen Sie es über die E-Mail in Ihrem Postfach.',
  'subscribe.errorTitle': 'Etwas ist schiefgelaufen.',
  'subscribe.errorBody': 'Bitte versuchen Sie es später noch einmal.',
  'subscribe.noSpam': 'Kein Spam. Abmeldung mit einem Klick.',
  'subscribe.whatYouGet': 'Das erwartet Sie',
  'subscribe.feature1Title': 'Ausführliche Essays',
  'subscribe.feature1Body': 'Durchdachte Erkundungen von Technologie und Kultur.',
  'subscribe.feature2Title': 'Kurze Notizen',
  'subscribe.feature2Body': 'Knappe Beobachtungen und aktuelle Anmerkungen.',
  'subscribe.feature3Title': 'Lesenswertes',
  'subscribe.feature3Body': 'Gelegentliche Hinweise auf die besten Texte anderswo.',

  // About page chrome (the prose comes from the CMS)
  'about.heroAlt':
    'Eine Person an einer digitalen Kluft, sinnbildlich für das Spannungsfeld von Technologie und Menschlichkeit',

  // Privacy page chrome
  'privacy.lastUpdated': 'Zuletzt aktualisiert: {date}',

  // RSS feed
  'rss.title': 'Digital Divide',
  'rss.description': 'Essays über Technologie, Kultur und die Räume dazwischen.',
};

const ui: Record<Lang, Record<keyof typeof en, string>> = { en, de };

export type UIKey = keyof typeof en;

/**
 * The base name of every `_one`/`_other` pair, derived from the dictionary
 * rather than listed by hand — adding a new countable string to `en` makes it
 * a legal argument to plural() automatically, and a typo in one is a type error.
 */
export type PluralKey = {
  [K in UIKey]: K extends `${infer Base}_one` ? Base : never;
}[UIKey];

export type TranslationVars = Record<string, string | number>;

function interpolate(template: string, vars?: TranslationVars): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in vars ? String(vars[name]) : match
  );
}

/**
 * Translator bound to one locale.
 *
 *   const { t, plural } = useTranslations(lang);
 *   t('post.updated', { date: formatted })
 *   plural('tags.essayCount', posts.length)
 */
export function useTranslations(lang: Lang) {
  const dict = ui[lang];

  return {
    t(key: UIKey, vars?: TranslationVars): string {
      return interpolate(dict[key], vars);
    },
    /**
     * `count` is passed through as the `{count}` placeholder as well as
     * selecting the form, so a caller never has to supply it twice.
     */
    plural(key: PluralKey, count: number, vars?: TranslationVars): string {
      const form = (count === 1 ? `${key}_one` : `${key}_other`) as UIKey;
      return interpolate(dict[form], { count, ...vars });
    },
  };
}

export type Translator = ReturnType<typeof useTranslations>;
