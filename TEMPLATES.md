# Content Templates

This document defines the frontmatter specification for all content types in the garden.

## Story

```yaml
---
title: "Your Story Title"
description: "A brief description of what this story is about"
author: "Thomas"            # or contributor name
date: 2026-04-13
updated: 2026-04-13         # optional, when last revised
scenes:                      # which garden paths this story touches
  - auditory-art
  - social-observation
disciplines:                 # which knowledge areas are involved
  - physics
  - neuroscience
tags:                        # freeform tags
  - erhu
  - acoustics
aiCoCreated: true            # Principle VII: transparent AI labeling
draft: false                 # drafts won't appear on the site
---
```

## Knowledge Note

```yaml
---
title: "Fourier Transform Basics"
description: "Why any sound can be decomposed into sine waves"
discipline: physics          # exactly one primary discipline
date: 2026-04-13
updated: 2026-04-13
tags:
  - acoustics
  - frequency
aiCoCreated: true
draft: false
---
```

## Work

```yaml
---
title: "The Teapot"
description: "A 3D teapot — thirty years in the making"
author: "Thomas"
date: 2026-04-13
updated: 2026-04-13
scenes:
  - visual-art
disciplines:
  - mathematics
  - physics
storyRef: "thomas"           # links back to the story that birthed this work
tags:
  - 3d-modeling
  - origin-story
aiCoCreated: true
draft: false
---
```

## Course

```yaml
---
title: "Why Does an Erhu Sound Like That?"
description: "A journey from a simple question to acoustics, physiology, and digital audio"
scenes:
  - auditory-art
  - everyday-life
disciplines:
  - physics
  - physiology
  - neuroscience
date: 2026-04-13
updated: 2026-04-13
tags:
  - sound
  - chinese-instruments
aiCoCreated: true
draft: false
---
```

## Field Reference

### scenes (pick one or more)
- `everyday-life`
- `social-observation`
- `auditory-art`
- `visual-art`
- `interactive-installation`
- `traditional-art`

### disciplines (pick one or more, or exactly one for knowledge notes)
- `physics`
- `mathematics`
- `economics`
- `philosophy`
- `psychology`
- `physiology`
- `neuroscience`

### aiCoCreated
Per Charter Principle VII, set to `true` whenever AI participated in creating the content. This is not optional.
