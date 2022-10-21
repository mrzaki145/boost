import Lenis from "@studio-freight/lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ limitCallbacks: true });
import { TextPlugin } from "gsap/TextPlugin";
gsap.registerPlugin(TextPlugin);
import SplitType from "split-type";

// Lenis smooth scrolling
let lenis;
const initSmoothScrolling = () => {
  lenis = new Lenis({
    lerp: 0.1,
    smooth: true,
  });
  const scrollFn = (time) => {
    lenis.raf(time);
    requestAnimationFrame(scrollFn);
  };
  requestAnimationFrame(scrollFn);
};

const bodyEl = document.body;
const sections = {
  loading: bodyEl.querySelector("#js_loadingScreen"),
  hero: bodyEl.querySelector("#js_hero"),
  bottle: bodyEl.querySelector(".bottle"),
  features: bodyEl.querySelector("#js_features"),
  vega: bodyEl.querySelector("#js_vegan"),
  feedback: bodyEl.querySelector("#js_feedback"),
  cta: bodyEl.querySelector("#js_cta"),
};

// intro animation.
const introTL = gsap.timeline({ paused: true });

// --> loading
gsap.from(sections.loading.querySelectorAll("path"), {
  id: "logoTween",
  translateY: -25,
  opacity: 0,
  stagger: 0.1,
  duration: 0.25,
  repeat: -1,
  repeatDelay: 0.5,
  ease: "back.out(1.6)",
  delay: 0.25,
});
const loadingScreenTween = gsap.to(sections.loading, {
  "--bg-clr": "var(--clr-transparent)",
  "--bg-img": "var(--gradient-transparent)",
  autoAlpha: 0,
  translateY: "-100%",
  duration: 1,
  ease: "power2.inOut",
  onStart: () => {
    gsap.getById("logoTween").revert();
  },
});
introTL.add(loadingScreenTween);

// --> hero
const heroTL = gsap.timeline({
  smoothChildTiming: true,
  autoRemoveChildren: true,
  defaults: {
    duration: 1,
    ease: "sine.out",
  },
});
gsap.matchMedia().add(
  {
    isMobile: "(max-width: 799px)",
    isDesktop: "(min-width: 800px)",
  },
  (ctx) => {
    const { isMobile, isDesktop } = ctx.conditions;
    const hero = {
      // el: document.querySelector("#js_hero"),
      title: document.querySelector("#js_heroTitle"),
      img: document.querySelector("#js_heroImg"),
    };

    if (isMobile) {
      gsap.set([hero.title, hero.img], { autoAlpha: 0, translateY: 50 });

      heroTL
        .to([hero.title], {
          autoAlpha: 1,
          translateY: 0,
        })
        .to(
          [hero.img],
          {
            autoAlpha: 1,
            translateY: 0,
          },
          "<25%"
        );

      return;
    }

    if (isDesktop) {
      const title = new SplitType(hero.title, { types: "words" });

      gsap.set(title.words, { rotate: 5 });
      gsap.set(hero.title, { autoAlpha: 0, translateY: 50 });
      gsap.set(".bottle", { autoAlpha: 0, translateY: 50 });

      heroTL
        .to(hero.title, { autoAlpha: 1, translateY: 0, duration: 0.5 })
        .to(
          title.words,
          {
            rotate: 0,
            stagger: 0.05,
            duration: 0.3,
            onComplete: function () {
              title.revert();
            },
          },
          "<"
        )
        .to(
          ".bottle",
          {
            autoAlpha: 1,
            translateY: 0,
          },
          "<25%"
        );
    }
  }
);

introTL.add(heroTL, "<50%");

// --> bottle-canvas
let initBottle = () => null;
gsap.matchMedia().add({ isDesktop: "(min-width: 800px)" }, (ctx) => {
  const { isDesktop } = ctx.conditions;
  if (!isDesktop) return;

  const images = [];
  const frameCount = 299;
  const bottles = { frame: 0 };
  const currentFrame = (index) =>
    `/images/sequence/webp/A_0${index.toString().padStart(4, "0")}.webp`;
  const m = document.createElement("img");
  m.src = "/images/alpha.png";

  for (let i = 0; i < frameCount; i++) {
    let img = new Image();
    img.src = currentFrame(i);
    images.push(img);
  }

  const canvas = sections.bottle.querySelector("#bottleCanvas");
  const context = canvas.getContext("2d");
  (canvas.width = 1020), (canvas.height = 1020);

  gsap.from(sections.bottle.querySelector(".bottle__container"), {
    translateY: "5vh",
    translateX: "35vw",
    rotate: "15deg",
    ease: "none",
    scrollTrigger: {
      scrub: 0.2,
      trigger: bodyEl,
      endTrigger: sections.hero,
      start: "top top",
      end: "bottom bottom",
    },
  });

  ScrollTrigger.create({
    trigger: sections.feedback,
    start: "top top",
    end: "bottom -=500%",
    onEnterBack() {
      gsap.set(sections.bottle, {
        position: "fixed",
        top: 0,
      });
    },
    onLeave() {
      gsap.set(sections.bottle, {
        position: "absolute",
        top: `${window.pageYOffset}px`,
      });
    },
  });

  gsap.to(bottles, {
    frame: frameCount - 1,
    snap: "frame",
    repeat: 1,
    scrollTrigger: {
      scrub: 0.2,
      trigger: bodyEl,
      endTrigger: sections.feedback,
      start: "top top",
      end: "bottom -=500%",
    },
    onUpdate: render,
  });

  images[0].onload = render;

  function render() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(images[bottles.frame], 0, 0, canvas.width, canvas.height);
    context.globalCompositeOperation = "xor";
    context.drawImage(m, 0, 0, canvas.width, canvas.height);
  }
});

// --> features
const d = 0.5;
const features = {
  el: sections.features,
  elderberry: sections.features.querySelectorAll("[data-elderberry]"),
  orange: sections.features.querySelectorAll("[data-orange]"),
  zinc: sections.features.querySelectorAll("[data-zinc]"),
  titles: sections.features.querySelectorAll("[data-title]"),
  subtitles: sections.features.querySelectorAll("[data-feature-title]"),
  tip: sections.features.querySelector("[data-tip]"),
};
const featuresTl = gsap.timeline({
  paused: true,
  smoothChildTiming: true,
  defaults: {
    duration: d,
    overwrite: "auto",
    ease: "sine.inOut",
    lazy: false,
  },
});

featuresTl
  .set(bodyEl, {
    "--txt-clr": "var(--clr-white)",
    "--bg-clr": "var(--clr-yellow)",
    "--bg-img": "var(--gradient-orange)",
  })
  .set([features.titles[0]], {
    color: "var(--clr-white)",
  })
  .set(features.elderberry, {
    autoAlpha: 1,
  })
  .to([features.elderberry[0], features.elderberry[1]], {
    autoAlpha: 0,
    duration: d / 2,
    scale: 2,
    rotate: "+=random(-90, 90, 45)",
    translateY: "-=80%",
    stagger: 0.1,
  })
  .to(
    [features.elderberry[2], features.elderberry[3]],
    {
      autoAlpha: 0,
      duration: d / 2,
      scale: 2,
      rotate: "-=random(-90, 90, 45)",
      translateY: "+=80%",
      stagger: 0.1,
    },
    `<${d / 2}`
  );

featuresTl
  .set(bodyEl, {
    "--bg-clr": "var(--clr-indigo)",
    "--bg-img": "var(--gradient-light-blue)",
  })
  .set(
    [features.titles[1]],
    {
      color: "var(--clr-white)",
    },
    "<"
  )
  .set(
    [features.titles[0], features.titles[2]],
    {
      color: "transparent",
    },
    "<"
  )
  .fromTo(
    features.subtitles[0],
    {
      text: "01. Provides Major Cold and Flu Relief",
    },
    {
      duration: d / 6,
      text: {
        speed: 20,
        type: "diff",
        value: "01. Improves Common Cold Symptoms",
      },
    },
    "<"
  )
  .fromTo(
    features.subtitles[1],
    {
      text: "02. Alleviates Sinus Infections",
    },
    {
      duration: d / 6,
      text: {
        speed: 20,
        type: "diff",
        value: "02. Holds Antioxidant Properties",
      },
    },
    "<"
  )
  .fromTo(
    features.subtitles[2],
    {
      text: "03. Encourages Healthy Skin",
    },
    {
      duration: d / 6,
      text: {
        speed: 20,
        type: "diff",
        value: "03. Promotes Glowing Skin",
      },
    },
    "<"
  )
  .fromTo(
    features.subtitles[3],
    {
      text: "04. Reduces Inflammation",
    },
    {
      duration: d / 6,
      text: {
        speed: 20,
        type: "diff",
        value: "04. Enhances Brain Function",
      },
    },
    "<"
  )
  .fromTo(
    features.tip,
    {
      text: "BOOST has 150mg of Elderberry Extract per serving",
    },
    {
      duration: d / 2,
      text: {
        speed: 20,
        type: "diff",
        value: "BOOST has 100mg of Vitamin C per serving",
      },
    },
    "<"
  )
  .to(
    features.orange,
    {
      autoAlpha: 1,
      scale: 1,
      stagger: 0.1,
      rotate: "+=random(-90, 90, 45)",
      startAt: {
        scale: 0,
        rotate: "+=random(-90, 90, 45)",
      },
    },
    "<"
  )
  .to([features.orange[0], features.orange[1]], {
    autoAlpha: 0,
    duration: d / 2,
    scale: 2,
    rotate: "+=random(-90, 90, 45)",
    translateY: "-=80%",
    stagger: 0.2,
  })
  .to(
    [features.orange[2], features.orange[3]],
    {
      autoAlpha: 0,
      duration: d / 2,
      scale: 2,
      rotate: "-=random(-90, 90, 45)",
      translateY: "+=80%",
      stagger: 0.2,
    },
    `<${d / 2}`
  );

featuresTl
  .set(bodyEl, {
    "--bg-clr": "var(--clr-white)",
    "--bg-img": "var(--gradient-blue)",
  })
  .set(features.el, {
    color: "var(--clr-black)",
  })
  .set([features.titles[2]], {
    color: "var(--clr-black)",
    webkitTextStrokeColor: "transparent",
  })
  .set([features.titles[0], features.titles[1]], {
    color: "transparent",
    webkitTextStrokeColor: "var(--clr-black)",
  })
  .fromTo(
    features.subtitles[0],
    {
      text: "01. Improves Common Cold Symptoms",
    },
    {
      duration: d / 6,
      text: {
        speed: 20,
        type: "diff",
        value: "01. Acts as a Powerful Antioxidant",
      },
    },
    "<"
  )
  .fromTo(
    features.subtitles[1],
    {
      text: "02. Holds Antioxidant Properties",
    },
    {
      duration: d / 6,
      text: {
        speed: 20,
        type: "diff",
        value: "02. Helps Balance Hormones",
      },
    },
    "<"
  )
  .fromTo(
    features.subtitles[2],
    {
      text: "03. Promotes Glowing Skin",
    },
    {
      duration: d / 6,
      text: {
        value: "03. Maintains Heart Health",
        speed: 20,
        type: "diff",
      },
    },
    "<"
  )
  .fromTo(
    features.subtitles[3],
    {
      text: "04. Enhances Brain Function",
    },
    {
      duration: d / 6,
      text: {
        speed: 20,
        type: "diff",
        value: "04. Aids in Digestion",
      },
    },
    "<"
  )
  .fromTo(
    features.tip,
    {
      text: "BOOST has 100mg of Vitamin C per serving",
    },
    {
      duration: d / 2,
      text: {
        speed: 20,
        type: "diff",
        value: "BOOST has 10mg of Zinc per serving",
      },
    },
    "<"
  )
  .to(
    features.zinc,
    {
      autoAlpha: 1,
      scale: 1,
      stagger: 0.1,
      rotate: 0,
      startAt: {
        scale: 0,
        rotate: "random(-90, 90)",
      },
    },
    "<"
  )
  .to([features.zinc[0], features.zinc[1]], {
    autoAlpha: 0,
    duration: d / 2,
    scale: 2,
    rotate: "+=random(-90, 90, 45)",
    translateY: "-=80%",
    stagger: 0.2,
  })
  .to(
    [features.zinc[2], features.zinc[3]],
    {
      autoAlpha: 0,
      duration: d / 2,
      scale: 2,
      rotate: "-=random(-90, 90, 45)",
      translateY: "+=80%",
      stagger: 0.2,
    },
    `<${d / 2}`
  );

// features
ScrollTrigger.create({
  animation: featuresTl,
  pin: true,
  scrub: 1,
  trigger: features.el,
  start: "top top",
  end: "bottom -=500%",
  invalidateOnRefresh: true,
  // onRefresh: function (s) {
  //   s.isActive || bodyEl.removeAttribute("style");
  // },
  onLeaveBack() {
    bodyEl.removeAttribute("style");
  },
});

// vegan
ScrollTrigger.create({
  start: "top center",
  trigger: bodyEl.querySelector("#js_vegan"),
  onEnter: function () {
    gsap.set(bodyEl, {
      "--txt-clr": "var(--clr-black)",
      "--bg-clr": "var(--clr-floral-white)",
      "--bg-img": "var(--gradient-transparent)",
    });
  },
  onLeaveBack: function () {
    gsap.set(bodyEl, {
      "--bg-clr": "var(--clr-white)",
      "--bg-img": "var(--gradient-blue)",
    });
  },
});

// cta
ScrollTrigger.create({
  start: "top 75%",
  toggleActions: "play none none reverse",
  trigger: bodyEl.querySelector("#js_cta"),
  onEnter: function () {
    gsap.set(bodyEl, {
      "--txt-clr": "var(--clr-white)",
      "--bg-clr": "var(--clr-yellow)",
      "--bg-img": "var(--gradient-orange)",
    });
  },
  onLeaveBack: function () {
    gsap.set(bodyEl, {
      "--txt-clr": "var(--clr-black)",
      "--bg-clr": "var(--clr-floral-white)",
      "--bg-img": "var(--gradient-transparent)",
    });
  },
});

// ------------------------------------------------

window.addEventListener("DOMContentLoaded", () => {
  initSmoothScrolling();
});
window.addEventListener("load", () => {
  introTL.play();

  initBottle();
});

function showSection(toggler) {
  const controls = document.querySelector(
    `#${toggler.getAttribute("aria-controls")}`
  );
  const tween = gsap.to(controls, {
    x: 0,
    opacity: 1,
    duration: 0.3,
    paused: true,
  });

  toggler.addEventListener("click", () => {
    const isClosed = toggler.getAttribute("aria-expanded") == "false";

    if (isClosed) {
      toggler.setAttribute("aria-expanded", "true");
    } else {
      toggler.setAttribute("aria-expanded", "false");
    }

    tween.play();

    const closeNav = controls.querySelector(".close");
    closeNav.addEventListener("click", () => {
      tween.reverse();
    });
  });
}

showSection(document.querySelector("#js_cartToggler"));
showSection(document.querySelector("#js_navToggler"));
