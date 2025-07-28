/**
 * PodcastPreview Web Component
 * A reusable custom element for displaying podcast previews
 *
 * @example
 * <podcast-preview
 *   id="10716"
 *   title="Something Was Wrong"
 *   image="https://example.com/image.jpg"
 *   seasons="14"
 *   genres="Personal Growth, Investigative Journalism"
 *   updated="2022-11-03T07:00:00.000Z">
 * </podcast-preview>
 */
class PodcastPreview extends HTMLElement {
  /**
   * Constructor for the PodcastPreview component
   */
  constructor() {
    super();

    // Create shadow DOM for encapsulation
    this.attachShadow({ mode: "open" });

    // Bind methods to maintain context
    this.handleClick = this.handleClick.bind(this);
  }

  /**
   * Lifecycle method called when the element is connected to the DOM
   */
  connectedCallback() {
    this.render();
    this.addEventListeners();
  }

  /**
   * Lifecycle method called when the element is disconnected from the DOM
   */
  disconnectedCallback() {
    this.removeEventListeners();
  }

  /**
   * Lifecycle method called when observed attributes change
   * @param {string} name - The name of the attribute that changed
   * @param {string} oldValue - The previous value
   * @param {string} newValue - The new value
   */
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  /**
   * Specifies which attributes to observe for changes
   * @returns {Array<string>} Array of attribute names to observe
   */
  static get observedAttributes() {
    return ["id", "title", "image", "seasons", "genres", "updated"];
  }

  /**
   * Adds event listeners to the component
   */
  addEventListeners() {
    this.shadowRoot.addEventListener("click", this.handleClick);
  }

  /**
   * Removes event listeners from the component
   */
  removeEventListeners() {
    this.shadowRoot.removeEventListener("click", this.handleClick);
  }

  /**
   * Handles click events on the podcast preview
   * @param {Event} event - The click event
   */
  handleClick(event) {
    // Prevent event bubbling
    event.stopPropagation();

    // Create and dispatch custom event
    const podcastClickEvent = new CustomEvent("podcast-click", {
      detail: {
        podcastId: this.getAttribute("id"),
        podcastTitle: this.getAttribute("title"),
      },
      bubbles: true,
      composed: true,
    });

    this.dispatchEvent(podcastClickEvent);
  }

  /**
   * Formats a date string into a human-readable format
   * @param {string} dateString - ISO date string
   * @returns {string} Human-readable date (e.g., "2 days ago")
   */
  formatDate(dateString) {
    if (!dateString) return "Unknown";

    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
  }

  /**
   * Parses genres string into an array
   * @param {string} genresString - Comma-separated genres string
   * @returns {Array<string>} Array of genre names
   */
  parseGenres(genresString) {
    if (!genresString) return [];
    return genresString.split(",").map((genre) => genre.trim());
  }

  /**
   * Renders the component's HTML and CSS
   */
  render() {
    const id = this.getAttribute("id") || "";
    const title = this.getAttribute("title") || "Unknown Title";
    const image = this.getAttribute("image") || "";
    const seasons = this.getAttribute("seasons") || "0";
    const genres = this.parseGenres(this.getAttribute("genres") || "");
    const updated = this.getAttribute("updated") || "";

    // Calendar icon SVG
    const calendarIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"/></svg>`;

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: "Inter", sans-serif;
        }

        .podcast-card {
          background-color: #ffffff;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          cursor: pointer;
          transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
        }

        .podcast-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
        }

        .podcast-card__image-container {
          background-color: #e0e0e0;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 200px;
          color: #a0a0a0;
        }

        .podcast-card__image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .podcast-card__image-placeholder {
          font-size: 1.2rem;
        }

        .podcast-card__content {
          padding: 1rem;
        }

        .podcast-card__title {
          font-size: 1.25rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          color: #212529;
        }

        .podcast-card__meta {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #6c757d;
          font-size: 0.9rem;
          margin-bottom: 0.75rem;
        }

        .podcast-card__genres {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 0.75rem;
          flex-wrap: wrap;
        }

        .podcast-card__genre-tag {
          background-color: #e9ecef;
          color: #212529;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.8rem;
        }

        .podcast-card__updated {
          font-size: 0.85rem;
          color: #6c757d;
        }

        /* Responsive styles */
        @media (max-width: 480px) {
          .podcast-card__title {
            font-size: 1.1rem;
          }
          
          .podcast-card__content {
            padding: 0.75rem;
          }
        }
      </style>

      <div class="podcast-card" data-id="${id}">
        <div class="podcast-card__image-container">
          <img 
            src="${image}" 
            alt="${title}" 
            class="podcast-card__image" 
            onerror="this.style.display='none'; this.nextElementSibling.style.display='block';"
          >
          <div class="podcast-card__image-placeholder" style="display:none;">Podcast Cover</div>
        </div>
        <div class="podcast-card__content">
          <h3 class="podcast-card__title">${title}</h3>
          <div class="podcast-card__meta">
            ${calendarIconSvg}
            <span>${seasons} seasons</span>
          </div>
          <div class="podcast-card__genres">
            ${genres
              .map(
                (genre) =>
                  `<span class="podcast-card__genre-tag">${genre}</span>`
              )
              .join("")}
          </div>
          <p class="podcast-card__updated">Updated ${this.formatDate(
            updated
          )}</p>
        </div>
      </div>
    `;
  }
}

// Register the custom element
customElements.define("podcast-preview", PodcastPreview);

export default PodcastPreview;
