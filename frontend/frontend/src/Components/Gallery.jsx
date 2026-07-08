import React, { useEffect, useRef, useState } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "./Gallery.css";
import aboutPrimary from "./about1.webp";
import aboutSecondary from "./about2.png";
import backOne from "../assets/back1.jpg";
import backThree from "../assets/back3.jpeg";
import robot from "../assets/robot.jpg";
import aiImage from "../assets/imageofai.webp";
import batchImage from "../assets/Batch.png";

const galleryHighlights = [
  {
    title: "Awards & Recognition",
    text: "Milestones, trophies, certificates, and proud moments from the NeubAitics learning journey.",
    image: aboutSecondary,
    tag: "Awards",
  },
  {
    title: "Class Workshops",
    text: "Active classroom workshops where students learn AI, robotics, and problem solving through guided sessions.",
    image: aboutPrimary,
    tag: "Workshop",
  },
  {
    title: "Meet With Students",
    text: "Peer connections, mentor interactions, and collaborative student meetups that turn learning into community.",
    image: batchImage,
    tag: "Students",
  },
  {
    title: "Expo Showcase",
    text: "Innovation expo moments featuring projects, demos, exhibits, and public presentations by students.",
    image: robot,
    tag: "Expo",
  },
];

const galleryCollections = [
  {
    title: "Awards",
    subtitle: "Certificates, appreciation moments, and podium-ready memories.",
    images: [
      { src: aboutSecondary, alt: "Award ceremony at NeubAitics" },
      { src: aboutPrimary, alt: "Recognition event with students" },
      { src: backThree, alt: "Celebration moment after achievement" },
      { src: aiImage, alt: "AI achievement showcase" },
    ],
  },
  {
    title: "Class Workshops",
    subtitle: "Hands-on classroom energy with AI, robotics, and interactive sessions.",
    images: [
      { src: backOne, alt: "Workshop learning session" },
      { src: aiImage, alt: "AI workshop presentation" },
      { src: robot, alt: "Robotics demonstration in class" },
      { src: aboutPrimary, alt: "Faculty-led workshop session" },
    ],
  },
  {
    title: "Meet With Students",
    subtitle: "Mentor meets, discussions, and community-building across batches.",
    images: [
      { src: batchImage, alt: "Student meetup group photo" },
      { src: aboutPrimary, alt: "Students in discussion session" },
      { src: aboutSecondary, alt: "Mentor interaction with learners" },
      { src: backOne, alt: "Batch interaction moment" },
    ],
  },
  {
    title: "Expo",
    subtitle: "Project showcases, live demos, and exhibition-ready innovation.",
    images: [
      { src: robot, alt: "Student project expo display" },
      { src: backThree, alt: "Tech exhibition setup" },
      { src: aiImage, alt: "AI expo screen and demo" },
      { src: batchImage, alt: "Students presenting at expo" },
    ],
  },
];

const Gallery = () => {
  const sectionRefs = useRef([]);
  const [visibleCards, setVisibleCards] = useState({});
  const [activeCollection, setActiveCollection] = useState(null);

  useEffect(() => {
    document.title = "Gallery | NeubAitics School Of AI";
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setActiveCollection(null);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    sectionRefs.current = sectionRefs.current.slice(0, galleryCollections.length);

    const observers = sectionRefs.current.map((section, sectionIndex) => {
      if (!section) {
        return null;
      }

      const tiles = Array.from(section.querySelectorAll(".gallery-image-tile"));

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const cardIndex = Number(entry.target.getAttribute("data-card-index"));

            setVisibleCards((prev) => {
              const sectionState = prev[sectionIndex] || [];
              const nextSectionState = [...sectionState];
              nextSectionState[cardIndex] = entry.isIntersecting;

              return {
                ...prev,
                [sectionIndex]: nextSectionState,
              };
            });
          });
        },
        {
          threshold: 0.35,
          rootMargin: "0px 0px -8% 0px",
        }
      );

      tiles.forEach((tile) => observer.observe(tile));
      return observer;
    });

    return () => {
      observers.forEach((observer) => observer?.disconnect());
    };
  }, []);

  return (
    <div className="gallery-page">
      <section className="gallery-hero">
        <div className="gallery-hero-inner container">
          <span className="gallery-kicker">Gallery</span>
          <h1>Awards, workshops, student meets, and expo moments</h1>
          <p>
            A dedicated gallery page for NeubAitics events, classroom sessions, recognition moments, and public showcases.
          </p>
        </div>
      </section>

      <section className="gallery-main container py-5">
        <div className="gallery-showcase">
          <div className="gallery-showcase-header">
            <div>
              <span className="gallery-showcase-chip">Featured Highlights</span>
              <h2>Visual stories from the learning journey</h2>
            </div>
            <p>
              This page is structured to support many photos, so you can keep expanding each category over time.
            </p>
          </div>

          <Carousel
            className="gallery-carousel"
            showArrows={true}
            showThumbs={false}
            showStatus={false}
            showIndicators={true}
            infiniteLoop={true}
            autoPlay={true}
            interval={4200}
            swipeable={true}
            emulateTouch={true}
          >
            {galleryHighlights.map((slide, index) => (
              <div key={`${slide.title}-${index}`} className="gallery-slide">
                <div className="gallery-slide-stage">
                  <div className="gallery-slide-visual">
                    <img className="gallery-slide-image" src={slide.image} alt={slide.title} />
                    <span className="gallery-slide-badge">{slide.tag}</span>
                  </div>

                  <div className="gallery-slide-copy">
                    <span className="gallery-slide-count">
                      {String(index + 1).padStart(2, "0")} / {String(galleryHighlights.length).padStart(2, "0")}
                    </span>
                    <h3>{slide.title}</h3>
                    <p>{slide.text}</p>
                    <div className="gallery-slide-meta">
                      <span>Event Photos</span>
                      <span>Auto Slider</span>
                      <span>Separate Gallery Page</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Carousel>
        </div>

        <div className="gallery-section-grid">
          {galleryCollections.map((collection, sectionIndex) => (
            <article
              key={collection.title}
              className="gallery-section-card"
              ref={(node) => {
                sectionRefs.current[sectionIndex] = node;
              }}
              onClick={() => setActiveCollection(collection)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setActiveCollection(collection);
                }
              }}
              role="button"
              tabIndex={0}
            >
              <div className="gallery-section-head">
                <h3>{collection.title}</h3>
                <p>{collection.subtitle}</p>
              </div>

              <div className="gallery-image-grid">
                {collection.images.map((image, index) => (
                  <div
                    key={`${collection.title}-${index}`}
                    className={`gallery-image-tile ${visibleCards[sectionIndex]?.[index] ? "is-visible" : ""}`}
                    data-card-index={index}
                    style={{
                      "--card-order": index,
                      "--card-delay": `${index * 110}ms`,
                    }}
                  >
                    <img src={image.src} alt={image.alt} />
                  </div>
                ))}
              </div>

              <div className="gallery-section-cta">
                <span>Click to view all photos</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {activeCollection ? (
        <div className="gallery-modal-backdrop" onClick={() => setActiveCollection(null)}>
          <div
            className="gallery-modal"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={`${activeCollection.title} photo gallery`}
          >
            <button
              type="button"
              className="gallery-modal-close"
              onClick={() => setActiveCollection(null)}
              aria-label="Close gallery"
            >
              ×
            </button>

            <div className="gallery-modal-head">
              <h3>{activeCollection.title}</h3>
              <p>{activeCollection.subtitle}</p>
            </div>

            <div className="gallery-modal-grid">
              {activeCollection.images.map((image, index) => (
                <div key={`${activeCollection.title}-modal-${index}`} className="gallery-modal-tile">
                  <img src={image.src} alt={image.alt} />
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Gallery;
