---
title: "Career Coaching: From LLM Limitations to Vector Solutions in CV Parsing"
date: 2025-08-31T06:00:23+00:00
hero: /images/sections/posts/continuum-pulse/career-coach.jpg
description: Exploring challenges in CV parsing using traditional tools and LLMs, and implementing a vector database solution for career coaching applications
categories: [machine learning & ai]
tags: [document processing, llm limitations, pdf parsing, career tech]
menu:
  sidebar:
    name: Introduction
    identifier: professional-blogs-curriculum-parser-continuum-pulse
    parent: professional-blogs-continuum-pulse
    weight: 30
---

In a recent client engagement, I worked on a project to develop a system that simulates the role of a career coach. A key feature involved analyzing user information, such as curriculum vitae, portfolios, and stated interests, to offer tailored career guidance.

This was an exciting project. It was targeting personalized career development in a more profound way than [roadmap](https://roadmap.sh/), for instance, and not CV rewording to match ATS systems. Nonetheless, this system had to parse one document more important than any of the rest: the CV.

## Pipeline
Let me start with a quick illustration of the pipeline. Given a CV, it pulls all text from the document, clean and structure the data for later stages of the system.

![CV Parsing Pipeline](/images/sections/posts/continuum-pulse/pipeline-cv-llm.png "CV Parsing Pipeline")


## Processing Curricula Vitarum

Regardless of the tool and process that I already had in mind for the job, I did some research to understand the most recent practices and tools in document processing. Nowadays, there are a substantial number of frameworks that simply market the use of LLMs. Surprisingly, there are even more comments and tutorials on how to use them (it would be interesting to see how that scales). However, I found substantial comments from different developers from this specific area of expertise that remarked on the perils of processing CVs with LLMs given the particular nature of those documents. Those remarks were, once again, a warning sign of the market around LLMs. 

### Platform Skeleton
For this project, I chose a pragmatic and cost effective technology stack, prioritizing both operational efficiency and user privacy from the start of development.

Key tools and choices included:
- Python
- Groq, serving Llama 3, to leverage advanced language models at a lower cost
- Qdrant, a powerful vector search engine
- A focus on privacy, taking advantage of Groq's privacy centered terms

This approach helped keep early-stage expenses lean, but also introduced challenges such as token limitations that required careful handling.

### New kid on the block?
Extracting structured information from CV is essential. Among the many libraries available, the recently introduced pymupdf4llm (as of the article writing date, roughly 1 year) **is consistently mentioned for delivering comprehensive and accurate PDF parsing results**.[^1]

```python
  import pymupdf4llm
  text = pymupdf4llm.to_markdown(file_path)
  return self._clean_text(text)
```

By design, the above delivers the contents of a document whereas the routine `_clean_text()` is nothing more than basic text processing:

```python
def _clean_text(self, text):
    content = text.strip()
    content_lines = content.split('\n')
    
    clean_lines = []
    for line in content_lines:
        cleaned_line = line.strip()
        if cleaned_line:  # discard empty lines
            clean_lines.append(cleaned_line)
    
    return '\n'.join(clean_lines)
```

This preprocessing step removes unnecessary whitespace and empty lines, preparing the extracted text for further analysis.

While impressive, testing with sample CV revealed significant limitations; for example, some CV created with TikZ, a LaTeX package for producing graphics, yielded no results, and in other cases, certain sections were not processed correctly. This identifies clear opportunities for improvement and the potential need to explore alternative solutions.[^2]

> It is worth noting that many recently released Applicant Tracking Systems (ATS) likely rely on this very library for CV parsing. This raises concerns about the number of candidates whose CVs may be discarded simply due to parsing errors, rather than their actual qualifications. It highlights the importance of more transparent recruitment processes and the continued involvement of humans in the loop.


### Worth a shot?
With the CV content now available in markdown format, the next step was to decide how best to extract structured information from it. Developers mentioned above had already warned about the difficulties of using LLMs to reliably parse and interpret CV data, highlighting the challenges that lay ahead.

So I took a shot and quickly made a script that, given the extracted text, attempted to feed the information into an LLM using JSON tooling based on a series of Pydantic objects. While some examples worked perfectly, it was striking how unreliable the process was overall. Even after implementing a chunking strategy to break down the input, the LLM frequently failed to produce the expected structured output. 
<mark>This outcome aligns with what some experienced developers in the CV parsing space have pointed out: using LLMs for this task is largely an unviable path.</mark>

Therefore, after all the experimentation, it turned out that the tried-and-true approach of using regular expressions and rule-based parsing was the most effective. It's remarkable that despite all the advances in technology, a production-grade, years-old process still delivers the most reliable results for CV parsing.


## Solution

I must say that the trickiest part was extracting structured information from the CV using rule based parsing.
Once that was accomplished, the rest came naturally. 
I implemented a process that split the parsed content into individual entries, each representing a distinct aspect of the candidate's experience and skills. These chunks were embedded using sentence transformers and stored in a vector database Qdrant as part of the knowledge base. This chunk-level insertion enabled the system to retrieve and analyze specific parts of a CV, allowing for more focused and personalized career recommendations based on targeted aspects of professional development.


## Concluding Remarks

While we still have a lot to cover regarding this project, it is worth highlighting key challenges and findings from the development and testing of CV parsing approaches:

- Document information extraction:
  - There is still a gap in standalone PDF processing libraries for production use, especially when:
    - Structured output (such as markdown) is needed for downstream processing.
    - Handling complex or nonstandard CV formats.
- CV processing:
  - Using LLMs to generate JSON structured output was unreliable; in some cases, the model failed to respond or produced no results.
  - LLMs only produced the desired output when given very short, well defined sections to process.
  - Rule based parsing with regular expressions proved more reliable than LLM approaches for structured data extraction.
  - Custom document parsing logic remains necessary to reliably extract and structure CV data for analysis.
  - Further benchmarking and testing are required to identify robust solutions for CV parsing and processing.

In summary, this phase resulted in a rapid prototype capable of extracting CV content with reasonable accuracy and implementing a vector database approach for structured information retrieval, laying the groundwork for further refinement.

---

[^1]: Elias Tarnaras, Unlocking the Secrets of PDF Parsing: A Comparative Analysis of Python Libraries, 2024 (accessed on Aug 31st).
[^2]: As I move forward with the project, we're also exploring production grade and commercially open tools.
