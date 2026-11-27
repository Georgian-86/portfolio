// 02b Live agent: plays the Figma 02b sequence on scroll
// (customer → typing → reply → booking card). The typing row hides when the reply lands.
// Under reduced motion it shows the end state with no scrub.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const EASE = 'cubic-bezier(0.16,1,0.3,1)';

export function mountAgentDemo(el) {
  const rq = matchMedia('(prefers-reduced-motion: reduce)');
  const track = el.querySelector('.agent__track') || el;
  const typing = el.querySelector('.agent__typing');
  const reply = el.querySelector('.agent__reply');
  const booking = el.querySelector('.agent__booking');
  let tl = null;

  function endState() {
    gsap.set([reply, booking], { clearProps: 'all' });
    gsap.set(typing, { autoAlpha: 0 });
    el.dataset.state = 'end';
  }

  function build() {
    tl?.scrollTrigger?.kill();
    tl?.kill();
    tl = null;
    el.classList.toggle('is-static', rq.matches);
    if (rq.matches) return endState();
    el.dataset.state = 'play';
    gsap.set(typing, { autoAlpha: 0 });
    gsap.set([reply, booking], { autoAlpha: 0, y: 16 });
    // Snap keyframes: typing by 0.2, reply lands at 0.382, booking card at 0.618, hold to 1.
    tl = gsap
      .timeline({
        defaults: { ease: EASE },
        scrollTrigger: { trigger: track, start: 'top top', end: 'bottom bottom', scrub: 0.3 },
        onComplete: () => { el.dataset.state = 'end'; },
      })
      .to(typing, { autoAlpha: 1, duration: 0.12 }, 0.08)
      .to(typing, { autoAlpha: 0, duration: 0.04 }, 0.342)
      .to(reply, { autoAlpha: 1, y: 0, duration: 0.12 }, 0.342)
      .to(booking, { autoAlpha: 1, y: 0, duration: 0.14 }, 0.56)
      .to({}, { duration: 0.1 }, 0.9);
  }

  build();
  rq.addEventListener('change', build);

  return {
    destroy() {
      rq.removeEventListener('change', build);
      tl?.scrollTrigger?.kill();
      tl?.kill();
    },
  };
}
