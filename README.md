# Personal site

Static site — no build step, no dependencies. Open `index.html` in a browser and it runs.

```
my-site/
├── index.html        content and structure
├── css/styles.css    all styling, tokens at the top
├── js/main.js        three behaviors, commented
├── images/           placeholders, swap freely
└── README.md
```

## Swapping in real photos

The placeholders already have the filenames the HTML expects. Drop your own photo in
`images/` with the same name and it just works — no code change.

| File | Shape | Used for |
|---|---|---|
| `hobby-gym.jpg` | 4:3 landscape | Gym card |
| `hobby-guitar.jpg` | 4:3 landscape | Guitar card |
| `food-alfredo.jpg` | 4:3 landscape | Cajun chicken alfredo |
| `food-dosa.jpg` | 4:3 landscape | Dosa |
| `food-thai.jpg` | 4:3 landscape | Thai food |
| `place-germany.jpg` | 4:5 portrait | Germany |
| `place-hawaii.jpg` | 4:5 portrait | Hawaii |
| `place-netherlands.jpg` | 4:5 portrait | Netherlands |
| `place-cuba.jpg` | 4:5 portrait | Cuba |

Two things that matter more than photo quality:

1. **Resize before uploading.** A phone photo is 4–8 MB. Anything over ~300 KB is
   wasteful. [Squoosh](https://squoosh.app) does this in the browser.
2. **Keep the shape consistent within a row.** `object-fit: cover` crops for you, but
   wildly different aspect ratios still read as sloppy.

Update the `alt` text in `index.html` when you swap — it describes the image for
screen readers and shows if the image fails to load.

## Changing the look

Everything visual is a variable at the top of `styles.css`:

```css
--accent: #E8833A;
```

Change that one line and every link, marker, tag and highlight follows. That's the
whole point of tokens — no find-and-replace across the file.

## Publishing on GitHub Pages

1. Make a public repo named `yourusername.github.io`
2. Push these files to the root of the `main` branch
3. Settings → Pages → source: `main`, folder: `/ (root)`
4. Live at `https://yourusername.github.io` in about a minute

## Things to build next

Rough order of difficulty:

- Rewrite the copy in your own voice — I guessed at it
- Add your last name and real contact links in the footer
- Mobile nav: the links hide under 900px, add a hamburger menu
- Highlight the current section in the nav as you scroll (same
  `IntersectionObserver` pattern already in `main.js`)
- A projects section — the most useful thing you can add as an engineer
- Split `styles.css` into multiple files once it gets uncomfortable to scroll
