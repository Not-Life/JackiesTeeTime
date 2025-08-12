MedAssist Tees E‑Commerce Website
================================

This folder contains a simple, mobile‑friendly e‑commerce site built with plain HTML,
CSS and JavaScript. You can open the pages directly in your browser (no server
required) to explore the features:

* **index.html** – The main shop page. Products are displayed in a responsive grid. You
  can select colors and sizes and add items to the cart. The cart drawer shows
  added items, allows quantity adjustments and removal, and calculates the
  subtotal. Checkout is disabled for this demo but could be wired up to Stripe
  or PayPal.
* **blog.html** – A blog for sharing medical assisting tips and stories. Existing
  posts load from local storage or a sample list. Click **New post** to add a
  new article without touching any code. Posts are saved to your browser’s
  local storage and will persist between page reloads. Each post shows its
  date, tags, summary and full content.
* **about.html** – A simple about page describing the business.
* **contact.html** – A contact form. Submitted messages are just acknowledged
  locally for this demo.

### Editing or Adding Products

Product data lives at the top of `script.js` in a JavaScript array named
`PRODUCTS`. To add or edit products, open `script.js` in a text editor and
modify the objects in this array. Each product looks like this:

```
{
  id: 'scrub-life',            // unique identifier (no spaces)
  title: 'Scrub Life Tee',      // product name
  price: 24.99,                 // price as a number
  img: 'path or URL to image',  // product photo (local or remote)
  description: '...',           // short description
  colors: ['Black', 'Navy'],    // available colors
  sizes: ['S','M','L','XL'],    // available sizes
}
```

Edit existing fields or duplicate a product object and change its values to
create a new product. Save the file and reload `index.html` to see your
changes.

### Editing Blog Posts

You can add new posts directly from **blog.html** using the **New post** button.
Posts are stored in your browser’s local storage under the key `posts`. If you
need to edit or remove existing posts, open your browser’s developer tools and
manipulate the local storage data for `posts`, or modify the `SAMPLE_POSTS`
array in `blog.js` before your first run. For basic use, adding new posts via
the UI should suffice.

### Extending the Site

The site is intentionally simple so you can extend it as needed:

* **Checkout** – Wire up the checkout button in the cart drawer to Stripe or
  PayPal by adding an event listener in `script.js` and including the relevant
  payment SDKs.
* **Server‑side data** – Replace the hard‑coded product and blog data with
  fetch calls to your own backend or headless CMS if you want centralised
  storage. The UI will adapt automatically as long as you provide the same
  data structure.

Enjoy building your medical assisting e‑commerce site!