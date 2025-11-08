# Modal Component Usage Guide

## Overview

The Modal component is a reusable, responsive popup modal that can display content from markdown files or inline content. It's perfect for showing Terms & Conditions, Privacy Policy, or any other informational content without navigating away from the current page.

## Features

✅ Load content from markdown files in `/public/content/`
✅ Support for inline markdown content
✅ Responsive design (mobile-friendly)
✅ Smooth animations
✅ Backdrop blur effect
✅ Prevent body scroll when open
✅ Click outside to close
✅ ESC key support (built-in)
✅ Beautiful markdown rendering

## Installation

The modal component is already set up! Just import it wherever you need it:

```javascript
import Modal from '@/components/Modal';
```

## Basic Usage

### 1. Load Content from File

```javascript
import { useState } from 'react';
import Modal from '@/components/Modal';

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        View Terms
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Terms and Conditions"
        contentUrl="/content/terms-and-conditions.md"
      />
    </>
  );
}
```

### 2. Use Inline Content

```javascript
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="About Us"
  content={`
# About GreenEye Foundation

We are dedicated to **environmental conservation**.

## Our Mission
- Plant trees
- Educate communities
- Protect nature
  `}
/>
```

### 3. In Register/Login Forms

Replace direct links with modal triggers:

```javascript
// Before:
<a href="/terms">Terms and Conditions</a>

// After:
const [termsOpen, setTermsOpen] = useState(false);

<a
  href="#"
  onClick={(e) => {
    e.preventDefault();
    setTermsOpen(true);
  }}
>
  Terms and Conditions
</a>

<Modal
  isOpen={termsOpen}
  onClose={() => setTermsOpen(false)}
  title="Terms and Conditions"
  contentUrl="/content/terms-and-conditions.md"
/>
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `isOpen` | boolean | Yes | Controls modal visibility |
| `onClose` | function | Yes | Called when modal should close |
| `title` | string | Yes | Modal header title |
| `contentUrl` | string | No* | URL to markdown file (e.g., "/content/terms.md") |
| `content` | string | No* | Inline markdown content |

*Either `contentUrl` or `content` must be provided

## Adding New Content Files

1. Create a new markdown file in `/public/content/`
2. Write your content using markdown
3. Reference it in the modal:

```javascript
<Modal
  contentUrl="/content/your-file.md"
  // ...other props
/>
```

### Example Content Files Included

- `/public/content/terms-and-conditions.md`
- `/public/content/privacy-policy.md`

## Markdown Support

The modal supports full markdown syntax:

- Headings (`#`, `##`, `###`)
- Bold (`**text**`) and italic (`*text*`)
- Lists (ordered and unordered)
- Links (`[text](url)`)
- Code blocks (` ``` `)
- Inline code (`` `code` ``)
- And more!

## Styling

The modal uses your existing CSS variables:
- `--white`
- `--lime-spark`
- `--evergreen`
- `--charcoal-bark`

Custom styles are in `/styles/modal.css`

## Mobile Responsive

The modal automatically adapts:
- Desktop: Centered with max-width
- Tablet: Full width with padding
- Mobile: Full screen overlay

## Examples in Action

Check out the example component: `components/ModalExample.jsx`

## Best Practices

1. **Keep content organized**: Store all content files in `/public/content/`
2. **Use descriptive titles**: Help users understand what they're reading
3. **Mobile-first**: Test on mobile devices
4. **Accessibility**: The modal supports keyboard navigation
5. **Loading states**: The modal shows a loading spinner while fetching content

## Common Use Cases

- ✅ Terms and Conditions
- ✅ Privacy Policy
- ✅ Cookie Policy
- ✅ About Us
- ✅ FAQs
- ✅ Instructions
- ✅ Announcements
- ✅ Product details
- ✅ Help content

## Troubleshooting

**Modal not appearing?**
- Check that `isOpen` is set to `true`
- Verify the content file exists
- Check browser console for errors

**Content not loading?**
- Ensure file path starts with `/` (e.g., `/content/file.md`)
- File must be in `/public` directory
- Check file extension is `.md`

**Styling issues?**
- CSS is imported in `_app.js`
- Check CSS variables are defined
- Inspect element to verify classes

## Need Help?

Create an issue or contact the development team!
