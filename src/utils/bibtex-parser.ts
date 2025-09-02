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
  // Remove outer braces and clean up the value
  return value
    .replace(/^{|}$/g, '')
    // Handle complex LaTeX accent commands like {\'{i}}, {\~{a}}, etc.
    .replace(/\\['`^~"=.]{\{([^}]*)\}}/g, '$1')
    .replace(/\{\\['`^~"=.]{([^}]*)\}}/g, '$1')
    // Handle LaTeX accent commands like \'{e}, \~{a}, \^{o}, etc.
    .replace(/\\['`^~"=.]{([^}]*)}/g, '$1')
    // Handle specific LaTeX special characters
    .replace(/\\i\b/g, 'i')  // \i -> i
    .replace(/\\o\b/g, 'o')  // \o -> o
    .replace(/\\l\b/g, 'l')  // \l -> l
    .replace(/\\ae\b/g, 'æ') // \ae -> æ
    .replace(/\\oe\b/g, 'œ') // \oe -> œ
    .replace(/\\ss\b/g, 'ß') // \ss -> ß
    // Handle general LaTeX commands
    .replace(/\\[a-zA-Z]+{([^}]*)}/g, '$1')
    // Handle common LaTeX special characters and commands
    .replace(/\\textbf{([^}]*)}/g, '$1')
    .replace(/\\textit{([^}]*)}/g, '$1')
    .replace(/\\emph{([^}]*)}/g, '$1')
    .replace(/\\url{([^}]*)}/g, '$1')
    .replace(/\\href{[^}]*}{([^}]*)}/g, '$1')
    // Handle nested braces more aggressively
    .replace(/{([^{}]*)}/g, '$1')
    .replace(/{([^{}]*)}/g, '$1') // Run twice for nested cases
    // Handle remaining single braces (edge cases)
    .replace(/[{}]/g, '')
    // Handle special LaTeX characters
    .replace(/\\\\/g, '')
    .replace(/~/g, ' ')
    .replace(/\\&/g, '&')
    .replace(/\\%/g, '%')
    .replace(/\\\$/g, '$')
    .replace(/\\#/g, '#')
    .replace(/\\_/g, '_')
    // Handle common LaTeX dashes
    .replace(/---/g, '—')
    .replace(/--/g, '–')
    // Clean up any remaining backslashes before letters (leftover LaTeX commands)
    .replace(/\\([a-zA-Z])/g, '$1')
    // Clean up whitespace and newlines
    .replace(/\s+/g, ' ')
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
    
    // Parse fields - improved to handle multi-line values
    const entryContent = lines.slice(1).join('\n');
    
    // More robust field parsing that handles nested braces and multi-line values
    const fieldMatches = [];
    let currentPos = 0;
    
    while (currentPos < entryContent.length) {
      // Find field name
      const fieldMatch = entryContent.substring(currentPos).match(/(\w+)\s*=\s*{/);
      if (!fieldMatch) break;
      
      const fieldName = fieldMatch[1];
      const fieldStart = currentPos + fieldMatch.index! + fieldMatch[0].length - 1; // Position of opening brace
      
      // Find matching closing brace
      let braceCount = 0;
      let valueEnd = fieldStart;
      
      for (let i = fieldStart; i < entryContent.length; i++) {
        if (entryContent[i] === '{') {
          braceCount++;
        } else if (entryContent[i] === '}') {
          braceCount--;
          if (braceCount === 0) {
            valueEnd = i;
            break;
          }
        }
      }
      
      if (braceCount === 0) {
        const fieldValue = entryContent.substring(fieldStart + 1, valueEnd);
        fieldMatches.push({ field: fieldName, value: fieldValue });
        currentPos = valueEnd + 1;
      } else {
        break; // Malformed entry
      }
    }
    
    // Process extracted fields
    for (const { field, value } of fieldMatches) {
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
    const bibPath = path.join(process.cwd(), 'public', 'files', 'publications', 'literature.bib');
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
