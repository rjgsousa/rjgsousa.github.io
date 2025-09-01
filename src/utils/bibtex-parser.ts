import fs from 'fs';
import path from 'path';

interface Publication {
  id: string;
  type: string;
  title: string;
  authors: string[];
  year: string;
  journal?: string;
  booktitle?: string;
  publisher?: string;
  pages?: string;
  volume?: string;
  number?: string;
  url?: string;
  doi?: string;
  abstract?: string;
}

function cleanBibTeXValue(value: string): string {
  // Remove braces and clean up the value
  return value
    .replace(/^{|}$/g, '')
    .replace(/\\[a-zA-Z]+{([^}]*)}/g, '$1')
    .replace(/\\\\/g, '')
    .replace(/~/g, ' ')
    .trim();
}

function parseAuthors(authorString: string): string[] {
  // Split by 'and' and clean up each author
  return authorString
    .split(' and ')
    .map(author => {
      // Handle "Last, First" format
      const parts = author.trim().split(',');
      if (parts.length === 2) {
        return `${parts[1].trim()} ${parts[0].trim()}`;
      }
      return author.trim();
    })
    .filter(author => author.length > 0);
}

export function parseBibTeX(content: string): Publication[] {
  const publications: Publication[] = [];
  
  // Split entries by @
  const entries = content.split('@').slice(1); // Remove empty first element
  
  for (const entry of entries) {
    const lines = entry.split('\n');
    const firstLine = lines[0];
    
    // Extract entry type and ID
    const typeMatch = firstLine.match(/^(\w+)\s*{\s*([^,]+),?/);
    if (!typeMatch) continue;
    
    const [, type, id] = typeMatch;
    const pub: Publication = {
      id: id.trim(),
      type: type.toLowerCase(),
      title: '',
      authors: [],
      year: '',
    };
    
    // Parse fields
    const entryContent = lines.slice(1).join('\n');
    const fieldRegex = /(\w+)\s*=\s*{([^}]*(?:{[^}]*}[^}]*)*)}/g;
    let match;
    
    while ((match = fieldRegex.exec(entryContent)) !== null) {
      const [, field, value] = match;
      const cleanValue = cleanBibTeXValue(value);
      
      switch (field.toLowerCase()) {
        case 'title':
          pub.title = cleanValue;
          break;
        case 'author':
          pub.authors = parseAuthors(cleanValue);
          break;
        case 'year':
          pub.year = cleanValue;
          break;
        case 'journal':
          pub.journal = cleanValue;
          break;
        case 'booktitle':
          pub.booktitle = cleanValue;
          break;
        case 'publisher':
          pub.publisher = cleanValue;
          break;
        case 'pages':
          pub.pages = cleanValue;
          break;
        case 'volume':
          pub.volume = cleanValue;
          break;
        case 'number':
          pub.number = cleanValue;
          break;
        case 'url':
          pub.url = cleanValue;
          break;
        case 'doi':
          pub.doi = cleanValue;
          break;
        case 'abstract':
          pub.abstract = cleanValue;
          break;
      }
    }
    
    if (pub.title && pub.authors.length > 0) {
      publications.push(pub);
    }
  }
  
  // Sort by year (descending)
  return publications.sort((a, b) => parseInt(b.year) - parseInt(a.year));
}

export function loadPublications(): Publication[] {
  try {
    const bibPath = path.join(process.cwd(), 'assets', 'files', 'publications', 'literature.bib');
    const content = fs.readFileSync(bibPath, 'utf-8');
    return parseBibTeX(content);
  } catch (error) {
    console.error('Error loading publications:', error);
    return [];
  }
}

export function getPublicationsByYear(publications: Publication[]): Record<string, Publication[]> {
  return publications.reduce((acc, pub) => {
    const year = pub.year;
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(pub);
    return acc;
  }, {} as Record<string, Publication[]>);
}

export function getPublicationsByType(publications: Publication[]): Record<string, Publication[]> {
  return publications.reduce((acc, pub) => {
    const type = pub.type;
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(pub);
    return acc;
  }, {} as Record<string, Publication[]>);
}
