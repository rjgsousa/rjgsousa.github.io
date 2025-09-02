export interface TocHeading {
  text: string;
  slug: string;
  level: number;
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
    .replace(/^-|-$/g, '');
}

export function extractHeadings(content: string): TocHeading[] {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const headings: TocHeading[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const slug = generateSlug(text);
    
    if (level >= 2 && level <= 4) {
      headings.push({ text, slug, level });
    }
  }

  return headings;
}

export function addHeadingAnchors(html: string): string {
  return html.replace(
    /<(h[2-4])([^>]*)>([^<]+)<\/h[2-4]>/gi,
    (match, tag, attrs, text) => {
      const slug = generateSlug(text);
      return `<${tag}${attrs} id="${slug}"><a href="#${slug}" class="heading-anchor">${text}</a></${tag}>`;
    }
  );
}
