(function () {
    'use strict';

    const THREE_MODULE_URL = 'https://cdn.jsdelivr.net/npm/three@0.179.1/build/three.module.js';

    async function createThreeScene(canvas, heroStage, reducedMotion, darkTheme) {
        if (!canvas || !heroStage) return null;

        let THREE;
        try {
            THREE = await import(THREE_MODULE_URL);
        } catch (error) {
            console.warn('Three.js could not be loaded:', error);
            heroStage.classList.add('three-fallback');
            return null;
        }

        let renderer;
        try {
            renderer = new THREE.WebGLRenderer({
                canvas,
                alpha: true,
                antialias: true,
                powerPreference: 'high-performance'
            });
        } catch (error) {
            console.warn('WebGL renderer could not be created:', error);
            heroStage.classList.add('three-fallback');
            return null;
        }

        heroStage.classList.add('three-ready');
        renderer.setClearColor(0x000000, 0);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
        camera.position.set(0, 0, 7.8);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
        const rimLight = new THREE.PointLight(0xc7ff4a, 2.2, 24);
        rimLight.position.set(2.8, 2.4, 5.2);
        const accentLight = new THREE.PointLight(darkTheme ? 0x8b8cff : 0x5b5cf0, 2.1, 20);
        accentLight.position.set(-3.4, -1.8, 3.8);
        scene.add(ambientLight, rimLight, accentLight);

        const systemGroup = new THREE.Group();
        const orbitGroup = new THREE.Group();
        scene.add(systemGroup, orbitGroup);

        const shellGeometry = new THREE.IcosahedronGeometry(1.72, 2);
        const shellMaterial = new THREE.MeshPhysicalMaterial({
            color: darkTheme ? 0x8b8cff : 0x5b5cf0,
            roughness: 0.4,
            metalness: 0.08,
            transmission: 0,
            transparent: true,
            opacity: 0.24,
            wireframe: true
        });
        const shell = new THREE.Mesh(shellGeometry, shellMaterial);
        shell.rotation.set(0.38, -0.22, 0.1);
        systemGroup.add(shell);

        const coreGeometry = new THREE.SphereGeometry(0.96, 42, 42);
        const coreMaterial = new THREE.MeshPhysicalMaterial({
            color: darkTheme ? 0xdfe4ff : 0xf5f7ff,
            emissive: darkTheme ? 0x11162e : 0x11162e,
            emissiveIntensity: 0.32,
            roughness: 0.08,
            metalness: 0.06,
            transmission: 0.94,
            thickness: 1.4,
            transparent: true,
            opacity: 0.5,
            clearcoat: 1,
            clearcoatRoughness: 0.1
        });
        const core = new THREE.Mesh(coreGeometry, coreMaterial);
        core.position.y = -0.06;
        systemGroup.add(core);

        const innerGeometry = new THREE.OctahedronGeometry(0.52, 1);
        const innerMaterial = new THREE.MeshBasicMaterial({
            color: darkTheme ? 0xc7ff4a : 0xb5ff3f,
            transparent: true,
            opacity: 0.32,
            wireframe: true
        });
        const inner = new THREE.Mesh(innerGeometry, innerMaterial);
        systemGroup.add(inner);

        const ringGeometry = new THREE.TorusGeometry(2.25, 0.032, 12, 220);
        const ringMaterial = new THREE.MeshBasicMaterial({
            color: darkTheme ? 0xc7ff4a : 0xe9ff9a,
            transparent: true,
            opacity: 0.28
        });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.rotation.set(1.06, 0.24, 0.38);
        orbitGroup.add(ring);

        const haloGeometry = new THREE.TorusGeometry(2.8, 0.012, 8, 220);
        const haloMaterial = new THREE.MeshBasicMaterial({
            color: darkTheme ? 0xffffff : 0xcfd4ff,
            transparent: true,
            opacity: 0.14
        });
        const halo = new THREE.Mesh(haloGeometry, haloMaterial);
        halo.rotation.set(0.22, -0.5, 0.3);
        orbitGroup.add(halo);

        const satelliteGeometry = new THREE.OctahedronGeometry(0.07, 0);
        const satelliteMaterial = new THREE.MeshBasicMaterial({
            color: darkTheme ? 0xc7ff4a : 0x99ff66
        });
        const satellites = [];
        for (let index = 0; index < 8; index += 1) {
            const satellite = new THREE.Mesh(satelliteGeometry, satelliteMaterial);
            orbitGroup.add(satellite);
            satellites.push({
                mesh: satellite,
                radius: 2.05 + (index % 3) * 0.38,
                speed: 0.28 + index * 0.03,
                offset: (Math.PI * 2 * index) / 8
            });
        }

        const particleCount = window.innerWidth < 768 ? 240 : 540;
        const particlePositions = new Float32Array(particleCount * 3);
        for (let index = 0; index < particleCount; index += 1) {
            const radius = 3 + Math.random() * 3.5;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            particlePositions[index * 3] = radius * Math.sin(phi) * Math.cos(theta);
            particlePositions[index * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            particlePositions[index * 3 + 2] = radius * Math.cos(phi);
        }
        const particleGeometry = new THREE.BufferGeometry();
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
        const particleMaterial = new THREE.PointsMaterial({
            color: darkTheme ? 0xffffff : 0xd7dbff,
            size: 0.02,
            transparent: true,
            opacity: 0.72
        });
        const particles = new THREE.Points(particleGeometry, particleMaterial);
        scene.add(particles);

        const pointer = { x: 0, y: 0 };
        const pointerTarget = { x: 0, y: 0 };
        let visible = true;
        let frameId = null;
        let elapsed = 0;
        let previousTime = performance.now();

        const resize = () => {
            const width = heroStage.clientWidth || 1;
            const height = heroStage.clientHeight || 1;
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height, false);
            if (reducedMotion) renderer.render(scene, camera);
        };

        const movePointer = (event) => {
            const rect = heroStage.getBoundingClientRect();
            pointerTarget.x = ((event.clientX - rect.left) / rect.width - 0.5) * 0.85;
            pointerTarget.y = ((event.clientY - rect.top) / rect.height - 0.5) * -0.7;
        };

        const render = (time) => {
            if (!reducedMotion) frameId = requestAnimationFrame(render);
            if (!visible || document.hidden) return;

            const delta = Math.min((time - previousTime) / 1000, 0.05);
            previousTime = time;
            elapsed += delta;
            pointer.x += (pointerTarget.x - pointer.x) * 0.05;
            pointer.y += (pointerTarget.y - pointer.y) * 0.05;

            if (!reducedMotion) {
                shell.rotation.y += delta * 0.22;
                shell.rotation.x += delta * 0.08;
                core.rotation.y -= delta * 0.11;
                core.rotation.z += delta * 0.04;
                core.scale.setScalar(1 + Math.sin(elapsed * 1.4) * 0.025);
                inner.rotation.x += delta * 0.38;
                inner.rotation.y -= delta * 0.48;
                ring.rotation.z += delta * 0.05;
                halo.rotation.y -= delta * 0.04;
                particles.rotation.y = elapsed * 0.018;
                particles.rotation.x = Math.sin(elapsed * 0.12) * 0.08;

                satellites.forEach((satellite, index) => {
                    const angle = elapsed * satellite.speed + satellite.offset;
                    satellite.mesh.position.set(
                        Math.cos(angle) * satellite.radius,
                        Math.sin(angle * 1.3) * 0.65,
                        Math.sin(angle) * satellite.radius * 0.35
                    );
                    satellite.mesh.rotation.x += delta * (0.8 + index * 0.04);
                    satellite.mesh.rotation.y -= delta * (0.5 + index * 0.03);
                });
            }

            systemGroup.rotation.y += (pointer.x * 0.65 - systemGroup.rotation.y) * 0.035;
            systemGroup.rotation.x += (pointer.y * 0.55 - systemGroup.rotation.x) * 0.035;
            orbitGroup.rotation.y += (pointer.x * 0.25 - orbitGroup.rotation.y) * 0.04;
            orbitGroup.rotation.x += (pointer.y * 0.12 - orbitGroup.rotation.x) * 0.04;
            renderer.render(scene, camera);
        };

        const observer = new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting;
            if (visible && reducedMotion) renderer.render(scene, camera);
        }, { threshold: 0.02 });

        observer.observe(heroStage);
        if (!reducedMotion) heroStage.addEventListener('pointermove', movePointer, { passive: true });
        window.addEventListener('resize', resize, { passive: true });
        resize();
        if (!reducedMotion) frameId = requestAnimationFrame(render);
        else renderer.render(scene, camera);

        return {
            systemGroup,
            orbitGroup,
            updateTheme(isDark) {
                shellMaterial.color.setHex(isDark ? 0x8b8cff : 0x5b5cf0);
                ringMaterial.color.setHex(isDark ? 0xc7ff4a : 0xe9ff9a);
                accentLight.color.setHex(isDark ? 0x8b8cff : 0x5b5cf0);
                particleMaterial.color.setHex(isDark ? 0xffffff : 0xd7dbff);
                coreMaterial.color.setHex(isDark ? 0xdfe4ff : 0xf5f7ff);
                coreMaterial.emissive.setHex(0x11162e);
                innerMaterial.color.setHex(isDark ? 0xc7ff4a : 0xb5ff3f);
            },
            destroy() {
                if (frameId) cancelAnimationFrame(frameId);
                observer.disconnect();
                if (!reducedMotion) heroStage.removeEventListener('pointermove', movePointer);
                window.removeEventListener('resize', resize);
                [
                    shellGeometry,
                    coreGeometry,
                    innerGeometry,
                    ringGeometry,
                    haloGeometry,
                    satelliteGeometry,
                    particleGeometry
                ].forEach(item => item.dispose());
                [
                    shellMaterial,
                    coreMaterial,
                    innerMaterial,
                    ringMaterial,
                    haloMaterial,
                    satelliteMaterial,
                    particleMaterial
                ].forEach(item => item.dispose());
                renderer.dispose();
                renderer.forceContextLoss();
                heroStage.classList.remove('three-ready');
            }
        };
    }

    async function create(options) {
        const root = options?.root;
        const canvas = options?.canvas;
        if (!root || !canvas) return null;

        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const hasGsap = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
        const hasLenis = typeof window.Lenis !== 'undefined';
        let context = null;
        let lenis = null;
        let tickerCallback = null;
        let threeRuntime = null;
        let threeScrollTween = null;

        if (hasGsap) {
            window.gsap.registerPlugin(window.ScrollTrigger);
        }

        if (hasLenis && !reducedMotion) {
            lenis = new window.Lenis({
                duration: 1.05,
                lerp: 0.08,
                smoothWheel: true,
                wheelMultiplier: 0.95,
                anchors: { offset: -96 },
                prevent: node => Boolean(node.closest?.('.modal, .swal2-container, [data-lenis-prevent]'))
            });

            if (hasGsap) {
                lenis.on('scroll', window.ScrollTrigger.update);
                tickerCallback = time => lenis.raf(time * 1000);
                window.gsap.ticker.add(tickerCallback);
                window.gsap.ticker.lagSmoothing(0);
            }
        }

        if (hasGsap && !reducedMotion) {
            context = window.gsap.context(() => {
                const intro = window.gsap.timeline({ defaults: { ease: 'power3.out' } });
                intro
                    .from('[data-xp-intro="status"]', { y: 18, autoAlpha: 0, duration: 0.55 })
                    .from('.xp-hero-title .xp-title-line', { yPercent: 110, autoAlpha: 0, duration: 1, stagger: 0.08 }, '-=0.18')
                    .from('[data-xp-intro="copy"]', { y: 28, autoAlpha: 0, duration: 0.8, stagger: 0.08 }, '-=0.6')
                    .from('.xp-hero-actions > *', { y: 20, autoAlpha: 0, duration: 0.65, stagger: 0.08 }, '-=0.55')
                    .from('.xp-hero-metrics .xp-metric-card', { y: 24, autoAlpha: 0, duration: 0.65, stagger: 0.08 }, '-=0.5')
                    .from('.xp-hero-stack span', { y: 18, autoAlpha: 0, duration: 0.45, stagger: 0.04 }, '-=0.55')
                    .from('.xp-hero-stage', { x: 42, scale: 0.96, autoAlpha: 0, duration: 1.05 }, '-=0.95')
                    .from('.xp-feature-float', { y: 24, autoAlpha: 0, duration: 0.7 }, '-=0.45')
                    .from('.xp-stage-stack span', { y: 14, autoAlpha: 0, duration: 0.4, stagger: 0.05 }, '-=0.35');

                window.gsap.utils.toArray('[data-xp-reveal]').forEach(element => {
                    window.gsap.from(element, {
                        y: 56,
                        autoAlpha: 0,
                        duration: 0.9,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: element,
                            start: 'top 88%',
                            once: true
                        }
                    });
                });

                window.gsap.utils.toArray('[data-xp-stagger]').forEach(container => {
                    window.gsap.from(container.children, {
                        y: 34,
                        autoAlpha: 0,
                        duration: 0.72,
                        stagger: 0.08,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: container,
                            start: 'top 86%',
                            once: true
                        }
                    });
                });

                window.gsap.utils.toArray('[data-xp-parallax]').forEach(element => {
                    const depth = Number(element.dataset.xpParallax || 10);
                    window.gsap.fromTo(element, { yPercent: -depth }, {
                        yPercent: depth,
                        ease: 'none',
                        scrollTrigger: {
                            trigger: element,
                            start: 'top bottom',
                            end: 'bottom top',
                            scrub: 0.7
                        }
                    });
                });

                window.gsap.to('.xp-hero-copy', {
                    yPercent: 8,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: '.xp-hero',
                        start: 'top top',
                        end: 'bottom top',
                        scrub: 0.65
                    }
                });

                window.gsap.to('.xp-feature-float', {
                    y: -16,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: '.xp-hero',
                        start: 'top top',
                        end: 'bottom top',
                        scrub: 0.8
                    }
                });
            }, root);
        }

        threeRuntime = await createThreeScene(
            canvas,
            root.querySelector('.xp-hero-stage'),
            reducedMotion,
            Boolean(options.dark)
        );

        if (hasGsap && threeRuntime && !reducedMotion) {
            threeScrollTween = window.gsap.timeline({
                scrollTrigger: {
                    trigger: root.querySelector('.xp-hero'),
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 0.85
                }
            });

            threeScrollTween
                .to(threeRuntime.systemGroup.rotation, {
                    y: Math.PI * 0.9,
                    z: Math.PI * 0.16,
                    ease: 'none'
                }, 0)
                .to(threeRuntime.orbitGroup.rotation, {
                    z: Math.PI * 0.32,
                    y: Math.PI * 0.5,
                    ease: 'none'
                }, 0);
        }

        requestAnimationFrame(() => {
            lenis?.resize();
            window.ScrollTrigger?.refresh();
        });

        return {
            lenis,
            updateTheme(isDark) {
                threeRuntime?.updateTheme(isDark);
            },
            refresh() {
                lenis?.resize();
                window.ScrollTrigger?.refresh();
            },
            destroy() {
                context?.revert();
                threeScrollTween?.kill();
                threeRuntime?.destroy();
                lenis?.destroy();
                if (tickerCallback && hasGsap) window.gsap.ticker.remove(tickerCallback);
                window.ScrollTrigger?.getAll().forEach(trigger => {
                    if (trigger.trigger && root.contains(trigger.trigger)) trigger.kill();
                });
            }
        };
    }

    window.PortfolioLanding = { create };
})();
