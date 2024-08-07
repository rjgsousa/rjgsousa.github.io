---
title: "Automated Book Summarization"
date: 2024-08-07T14:00:00+01:00
hero: /images/sections/posts/machine-learning/book-summarization/open-book-over-tree-stump.jpeg
description: An Introduction
menu:
  sidebar:
    name: Introduction
    identifier: machine-learning-book-summarization
    parent: summarization
    weight: 30
---

In an era of information abundance, the ability to efficiently extract key insights from vast amounts of text has become an invaluable skill. This is particularly true for books, where complex narratives and intricate arguments can make it challenging to grasp the essence of a work. Consequently, automated book summarization techniques, which employ AI (more recently leveraging the power of Large Language Models (LLMs)) to distill lengthy texts into concise, informative summaries, have emerged as an increasingly reliable resource.

However, the question remains: How reliable are the latest LLMs in automated book summarization? To explore this, I started a small but exciting project to:
1. Assess cutting-edge Llama 3.1 language model performance (renowned for its impressive capacity to process and understand large chunks of text), and;
2. Understand how RAG capabilities could improve the summarization capabilities of such powerful models. 

## Facing the Challenge
It is widely acknowledged that creating high-quality summaries poses diverse challenges. It's not just about maintaining the coherence (for fiction books, for instance) of the narrative, preserving the main characters, their traits, and personalities, but also providing a clear overview of the passage or book's scope and content. This requires a deeper understanding of the material, going beyond a mere summary of the book.

The key objectives of this study were to investigate the following research questions:

1. Can the current most robust LLM generate reliable summaries even when its context window is reduced (henceforth, the baseline method)?
2. Would integrating the LLM with a simple RAG with its books and informative documents about summarization techniques lead to improved accuracy and better results?

## Methods

I leveraged the Llama (3.1) 70b model, which boasts an extensive context window of 128k tokens (infrastructure provided by Groq). To streamline my experiment, I integrated the llamaindex library. Given the elevated context window of Llama 3.1, its `context_window` was truncated to a lower number. This allowed me not only to assess the Tree Summarize algorithm performance but also to understand the RAG capabilities enabled by my experiment did provide. 

To enable the RAG capabilities, I used the Booksum dataset. I also included some literary analysis articles. These articles provide valuable insights and contextual information that can enhance the quality and depth of the generated book summaries. 

## Early Results
Preliminary experiments using this approach have yielded interesting results. When tasked with summarizing chapters from James Fenimore Cooper's "The Last of the Mohicans," the AI-generated summaries demonstrated a reasonable ability to identify and present key plot points.

Quantitative metrics, such as [ROUGE](https://en.wikipedia.org/wiki/ROUGE_(metric)) indicated a high degree of similarity between baseline and the RAG-enabled with literacy documents. However, these metrics don't capture the full picture. Qualitative analysis, involving a closer examination of the content and flow of the summaries, highlighted other aspects in the AI's output. Consider the following example for the baseline:

> In a serene forest setting, two men, Chingachgook, a Native American, and Hawkeye, a white man, engage in a conversation. They discuss their ancestors, traditions, and the history of their people. Chingachgook shares the story of how his tribe, the Mohicans, arrived in the area and fought against other tribes. Hawkeye listens intently and responds with his own perspective, highlighting the differences between their cultures.
> Their conversation is interrupted by the arrival of Uncas, Chingachgook's son, who reports that he has been tracking a group of Maquas, a rival tribe. Hawkeye and Chingachgook decide to hunt for food, and Uncas successfully kills a deer using his bow and arrow. As they prepare to eat, they hear the sound of approaching horses and realize that a group of white men is approaching.
> The scene is set in a forest near a river, with a serene atmosphere, but also with an undercurrent of tension and potential danger. The conversation between Chingachgook and Hawkeye highlights the complexities of their relationship and the cultural differences between their people. The arrival of Uncas and the subsequent hunting scene showcases the skills and traditions of the Native American characters.

Now, consider the output from the RAG-enabled approach:
> The scene shifts to a forest where two men, a Native American named Chingachgook and a white man named Hawkeye, are conversing. Chingachgook is a member of the Mohican tribe, and Hawkeye is a hunter and scout. They discuss their respective cultures and traditions, with Chingachgook sharing the story of his people's migration to the area and their conflicts with other tribes. Hawkeye listens intently and responds with his own perspective, acknowledging the differences between their cultures.
> As they talk, a young warrior named Uncas, Chingachgook's son, appears and joins the conversation. Hawkeye and Uncas engage in a discussion about hunting and the skills required to track and kill game. Hawkeye is impressed by Uncas's abilities and acknowledges that the Native Americans have a deeper understanding of the natural world.
> The conversation is interrupted by the sound of approaching horses, and Chingachgook identifies the riders as white men. Hawkeye takes charge and prepares to communicate with the newcomers, speaking in English and boasting of his ability to communicate with people of different cultures. The scene ends with the arrival of the white men, who are likely to be the main characters of the story.

and, finally, from the human annotation:
> The narrator shifts the focus of attention from Magua and his party to another group of people in another part of the forest, a few miles west by the river. We meet the remaining primary characters: Hawkeye, a white hunter, and Chingachgook, his Mohican ally. Though both men are hunters, they dress differently. Hawkeye wears a hunting shirt, a skin cap, and buckskin leggings; he carries a knife, a pouch, and a horn. Chingachgook is almost naked and covered in war-paint. Both men carry weapons. Hawkeye carries a long rifle, and Chingachgook carries a short rifle and a tomahawk. They discuss the historical developments that have caused them to both inhabit the same forest. Hawkeye proclaims his inheritance of a genuine and enduring whiteness, and Chingachgook laments the demise of his tribe of Mohicans. Of the Mohican tribe, only Chingachgook and his son remain. At this mention of the diminishing tribe, Chingachgook's son Uncas appears and reports that he has been trailing the Maquas, the Iroquois enemies of the Mohicans. When the antlers of a deer appear in the distance, Hawkeye wants to shoot the animal, but then realizes that the noise of the rifle will draw the attention of the enemy. In the place of the long rifle, Uncas uses an arrow to kill the deer. Shortly thereafter, Chingachgook detects the sound of horses approaching


Look closely to the subtle distinctions in this concise example (similar patterns can be seen in several other cases): ***The arrival of Uncas and the subsequent hunting scene showcases the skills and traditions of the Native American characters.*** with ***Hawkeye and Uncas engage in a discussion about hunting and the skills required to track and kill game.*** 
What's striking is how the two summaries share similarities yet diverge in their emphasis on the sequence of events.

## What is ahead of us?
Despite the challenges, the advancements in this field are remarkable. In regard to this project:

1. The base LLM, even with a reduced context window, yielded impressive results.
2. The RAG approach, augmented with literary documents, enabled the model to provide more detailed and nuanced descriptions of certain passages. 

However, a more thorough quantitative analysis is necessary to further validate these findings and identify areas for improvement.

****

Source code to be released soon. Image generated with [FLUX](https://blackforestlabs.ai/#get-flux).
