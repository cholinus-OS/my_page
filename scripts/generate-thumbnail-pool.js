const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

function loadApiKey() {
  if (process.env.GEMINI_API_KEY) return process.env.GEMINI_API_KEY.trim();
  const envPath = path.join(process.cwd(), ".env.local");
  if (fs.existsSync(envPath)) {
    const line = fs.readFileSync(envPath, "utf8").split("\n").find(l => l.trim().startsWith("GEMINI_API_KEY="));
    if (line) return line.split("=").slice(1).join("=").trim().replace(/^['"]|['"]$/g, "");
  }
  return null;
}

const BASE_STYLE = `16:9 widescreen ultra-clean photorealistic 3D medical orthopedic illustration.
Background: Softly blurred, bright modern Korean orthopedic and rehabilitation clinic interior with soft pastel mint-white walls on one side and warm light oak wood accents with airy natural window sunlight on the other side, smooth shallow depth-of-field bokeh.
Subject: Rich, balanced medical-textbook-grade 3D anatomical model — NOT bare bones alone. Combine matte ivory bone and smooth translucent ice-blue articular cartilage with clearly visible, clean soft-tissue anatomy: realistic pearly-white fibrous ligaments and tendons, semi-translucent sculpted soft-coral/muted-rose anatomical muscle fiber bundles, and delicate fine golden-yellow peripheral nerve pathways where anatomically relevant. NO human skin, NO nudity, NO live human body parts, NO red blood or gory elements.
Signature Effect: Soft luminous cyan/aqua energy glow highlighting the exact target anatomical structure (joint, ligament, tendon, muscle, or nerve pathway), accompanied by 2-3 subtle translucent frosted-glass medical UI icons (cross, heartbeat, shield, chart) floating softly in the blurred background.
STRICT CONSTRAINT: ZERO text, ZERO letters, ZERO numbers, ZERO anatomical labels or watermarks anywhere in the image.`;

const POOL_SPECS = {
  knee: [
    "Anterior 3/4 view of a knee joint focusing on the central cruciate ligaments (ACL/PCL) glowing softly cyan inside the joint notch.",
    "Front-angled cutaway view of a knee joint focusing on the C-shaped meniscus cartilage cushions glowing luminous cyan between femur and tibia.",
    "Slight side-front 3/4 view of a knee joint combining semi-translucent sculpted quadriceps muscle fibers, pearly-white quadriceps and patellar tendons, collateral ligaments, and fine golden femoral nerve branches with a gentle cyan neuromuscular pulse glow.",
    "Lateral outer-side 3/4 view of a knee joint showcasing the fibrous iliotibial (IT) band, lateral collateral ligament, biceps femoris tendon, semi-translucent lateral thigh muscle fibers, and common peroneal nerve pathway glowing softly cyan.",
    "Clean lateral side profile of a perfectly aligned knee joint showing semi-translucent anterior quadriceps and posterior hamstring muscle bundles, popliteal tendon and ligaments, and the tibial nerve pathway with a vertical luminous cyan stability aura.",
    "Front 3/4 view of a knee joint highlighting the patella gliding smoothly over ice-blue femoral cartilage, anchored by white medial/lateral retinacular ligaments, quadriceps tendon, and semi-translucent vastus medialis muscle fibers glowing cyan.",
    "Front-angled view of a healthy knee joint combining ivory bone, smooth ice-blue cartilage, crisp medial and lateral collateral ligaments, pes anserinus tendons, and semi-translucent surrounding leg muscle bundles glowing softly cyan."
  ],
  shoulder: [
    "Anterior 3/4 view of a shoulder joint highlighting the supraspinatus rotator cuff tendon passing under the acromion with a glowing cyan energy line.",
    "Close-up lateral-anterior view focusing on the ball-and-socket glenohumeral joint capsule glowing softly cyan for smooth mobility.",
    "Posterior back 3/4 view of the shoulder showcasing semi-translucent infraspinatus, teres minor, and rhomboid muscle fiber bundles, fibrous scapular stabilizer tendons, and the delicate golden suprascapular nerve pathway with a glowing cyan stabilization aura.",
    "Top-front angled view highlighting the acromioclavicular and coracoclavicular ligaments, clavicular head of deltoid and trapezius semi-translucent muscle fibers, and brachial plexus nerve cords passing beneath the clavicle glowing softly cyan.",
    "Anterior view focusing on the glenoid labrum rim and biceps tendon anchor glowing luminous cyan.",
    "Dynamic slightly arm-raised 3D shoulder model showing semi-translucent deltoid and supraspinatus muscle bundles, smooth white rotator cuff tendons gliding with wide subacromial clearance, and the axillary nerve pathway glowing softly cyan.",
    "Clean 3/4 anterior view showing balanced shoulder girdle anatomy with semi-translucent rotator cuff and pectoral muscle layers, fibrous glenohumeral ligaments, biceps tendon, and delicate brachial plexus nerve branches inside a protective cyan energy halo."
  ],
  waist: [
    "Clean lateral side profile of the five lumbar vertebrae and sacrum wrapped in a luminous translucent cyan spherical core-stability shield aura.",
    "Close-up 3/4 view focusing on healthy hydrated ice-blue intervertebral disc cushions glowing cyan between lumbar vertebrae.",
    "Posterior-oblique view of the lumbar spine highlighting open neural foramina, delicate golden lumbar spinal nerve roots exiting cleanly, crisp interspinous ligaments, and semi-translucent multifidus muscle fibers glowing softly cyan.",
    "Front-oblique view of the lumbar spine and pelvis showcasing semi-translucent psoas major and deep core muscle bundles, anterior longitudinal and iliolumbar ligaments, and lumbosacral plexus nerve roots with glowing cyan balance lines.",
    "Side profile of the natural S-curve lumbar spine combining hydrated ice-blue discs, fibrous posterior spinal ligaments, semi-translucent erector spinae muscle layers, and fine golden nerve roots with a smooth glowing cyan vertical arc.",
    "Close-up 3/4 view focusing on deep stabilizing spinal ligaments, thoracolumbar fascia tendon sheets, and semi-translucent transverse abdominis and multifidus muscle bundles wrapping around the lumbar column with glowing cyan support rings.",
    "Wide clean 3/4 view of the lower thoracic-to-lumbar spine and pelvis showing semi-translucent core and gluteal muscle bundles, strong sacroiliac ligaments, and golden sciatic nerve root origins with a soft luminous cyan vitality aura."
  ],
  elbow: [
    "Lateral outer-side 3/4 view of an elbow joint focusing on the lateral epicondyle and extensor tendon fibers glowing softly cyan.",
    "Medial inner-side 3/4 view of an elbow joint focusing on the medial epicondyle and flexor tendon attachment glowing cyan.",
    "Close-up anterior 3/4 view of the elbow joint combining smooth ice-blue cartilage, crisp ulnar and radial collateral ligaments, biceps brachii tendon, semi-translucent brachialis muscle fibers, and the delicate golden median nerve pathway glowing softly cyan.",
    "Clean side profile of a 90-degree bent elbow showing the olecranon and triceps tendon glowing softly cyan with a smooth motion arc.",
    "Side-oblique view of an extended elbow and forearm showcasing semi-translucent wrist extensor and brachioradialis muscle bundles, long pearly-white forearm tendons, annular ligament, and the golden radial nerve branch with glowing cyan lengthening lines.",
    "Posterior back 3/4 view of the elbow highlighting the delicate golden ulnar nerve gliding freely through the cubital tunnel, fibrous retinacular ligament, triceps tendon insertion, and semi-translucent posterior forearm muscle fibers glowing softly cyan.",
    "Dynamic 3/4 view of the elbow-to-forearm showing semi-translucent pronator teres and supinator muscle bundles, interosseous membrane ligament, biceps tendon, and fine golden nerve pathways with luminous cyan spiral mobility rings."
  ],
  neck: [
    "Clean side profile of the cervical spine showing the healthy natural C-shaped neck curve glowing with a luminous cyan alignment arc.",
    "Close-up 3/4 view focusing on hydrated ice-blue cervical intervertebral discs glowing softly cyan between neck vertebrae.",
    "Posterior-oblique view focusing on the upper suboccipital region where skull base meets upper neck vertebrae with glowing cyan decompression aura.",
    "Front-oblique view highlighting deep anterior cervical stability lines glowing cyan along the front of the cervical column.",
    "Side-oblique view of the cervicothoracic junction where neck meets upper back standing tall with glowing cyan posture support rings.",
    "Close-up lateral view of the cervical spine highlighting open neural spaces and smooth facet joints glowing softly cyan.",
    "Wide clean 3/4 view of the cervical spine supported by a gentle luminous cyan vertical balance pillar."
  ],
  wrist: [
    "Palmar palm-up 3/4 view of wrist and hand bones highlighting the carpal tunnel arch at the wrist center glowing softly cyan.",
    "Radial thumb-side 3/4 view highlighting the thumb extensor tendons gliding cleanly along the radial wrist glowing cyan.",
    "Ulnar pinky-side 3/4 view highlighting the triangular fibrocartilage cushion between ulna and carpal bones glowing luminous cyan.",
    "Close-up palmar view of finger flexor tendons gliding smoothly through annular pulley rings glowing softly cyan.",
    "Clean side profile of a neutral straight ergonomic wrist bone alignment with a glowing horizontal cyan balance beam.",
    "Dorsal back-of-hand 3/4 view showcasing the full hand and carpal bone architecture with glowing cyan intercarpal cartilage.",
    "Dynamic gentle wrist extension stretch 3D skeletal pose with smooth glowing cyan tendon gliding arcs."
  ],
  hip: [
    "Close-up anterior 3/4 view of the hip ball-and-socket joint highlighting smooth ice-blue femoral head cartilage and acetabular labrum glowing cyan.",
    "Wide symmetrical front view of the full pelvis and both hip joints with a luminous horizontal cyan pelvic-level balance line.",
    "Lateral side 3/4 view highlighting the greater trochanter and lateral gluteal stabilizer tendon attachment glowing softly cyan.",
    "Posterior back 3/4 view highlighting the sacroiliac joint and deep posterior hip stabilizers glowing cyan.",
    "Front-oblique cutaway showing clean spacious clearance between femoral neck and acetabular rim glowing luminous cyan.",
    "Anterior view highlighting the upper femur bone density and inner hip stabilizer attachment wrapped in a glowing cyan energy aura.",
    "Dynamic 3/4 view of a healthy hip joint in smooth flexion-extension range with a translucent glowing cyan circular mobility arc."
  ],
  ankle: [
    "Medial-bottom 3/4 view of foot and ankle bones highlighting the plantar fascia band stretching from heel bone to toes glowing softly cyan.",
    "Posterior back 3/4 view highlighting the thick fibrous Achilles tendon attaching to the heel bone glowing luminous cyan.",
    "Lateral outer-side 3/4 view highlighting the outer ankle stability ligaments glowing softly cyan.",
    "Clean medial side profile showcasing a healthy elevated foot arch supported by a glowing cyan spring-like energy arc.",
    "Top-front 3/4 view highlighting the big toe joint alignment glowing cyan.",
    "Front view of the ankle mortise joint (tibia, fibula, talus) highlighting smooth ice-blue cartilage and a balanced cyan stability shield.",
    "Dynamic heel-raise 3D skeletal foot and ankle pose with glowing cyan kinetic balance rings."
  ],
  systemic: [
    "Clean 3/4 view of a translucent 3D skeletal upper-and-lower body silhouette with glowing cyan bone mineral density sparkle inside healthy trabecular bone structure.",
    "Close-up macro 3D medical illustration of dense healthy honeycomb trabecular bone matrix surrounded by pearly-white periosteal tendon attachment fibers and fine golden micro-nerve pathways glowing softly cyan.",
    "Balanced 3D full-spine and dual-hip anatomical model combining semi-translucent deep core and gluteal muscle bundles, strong pelvic ligaments, and delicate golden spinal nerve roots aligned along a glowing cyan vertical equilibrium axis.",
    "3D medical illustration of clean semi-translucent sculpted muscle fiber bundles, long fibrous tendons, joint ligaments, and delicate golden motor nerve branches wrapping smoothly around healthy ivory leg bones with glowing cyan vitality energy.",
    "Clean 3/4 view of synchronized hip, knee, and ankle lower-limb anatomy featuring semi-translucent quadriceps, hamstring, and calf muscles, Achilles and patellar tendons, joint ligaments, and the golden sciatic-to-tibial nerve chain glowing softly cyan.",
    "Clean 3/4 view of synchronized shoulder, elbow, and wrist upper-limb anatomy featuring semi-translucent rotator cuff and forearm muscles, fibrous tendons and ligaments, and the delicate golden brachial plexus to median nerve pathway glowing softly cyan.",
    "Bright clinic 3D wellness composition showing harmonious multi-joint anatomy (knee, spine, shoulder) with translucent ice-blue cartilage, crisp white ligaments and tendons, semi-translucent muscle layers, and fine golden nerve pathways glowing softly cyan."
  ],
  chapter1: [
    "Dynamic 3D running-stride lower-limb skeletal model (hip, knee, ankle) with glowing cyan shock-absorption rings at each joint for sports injury prevention.",
    "Dynamic 3D overhead-swing upper-limb skeletal model (shoulder, elbow, wrist) with glowing cyan protective tendon trajectory lines.",
    "3D anatomical knee and ankle landing-stability illustration with a luminous cyan vertical force-distribution shield.",
    "3D anatomical core spine and pelvis rotation model featuring semi-translucent oblique and deep core muscle bundles, strong lumbopelvic ligaments, and golden lumbar nerve roots wrapped in a glowing cyan protective stability ring.",
    "3D anatomical hamstring-to-knee kinetic chain model showcasing semi-translucent hamstring and calf muscle fiber bundles, crisp posterior knee tendons and ligaments, and the golden sciatic nerve pathway with smooth glowing cyan elastic stretching waves.",
    "3D anatomical calf and ankle propulsion model featuring semi-translucent gastrocnemius and soleus muscle bundles, a thick fibrous pearly-white Achilles tendon, ankle ligaments, and fine tibial nerve branches glowing softly cyan.",
    "Clean 3D orthopedic warm-up mobility illustration showing shoulder and hip joints with semi-translucent rotator cuff and hip flexor muscles, elastic white tendons and joint capsule ligaments, and subtle golden nerve pathways surrounded by glowing cyan range-of-motion arcs."
  ],
  chapter2: [
    "Clean side profile of an upright neutral cervical-to-lumbar full spine alignment with a glowing cyan plumb line for daily posture.",
    "3D upper-back thoracic spine and shoulder blades opening smoothly backward with glowing cyan posture-correction arcs.",
    "3D seated-posture pelvis and lumbar spine model resting in ideal neutral alignment with a glowing cyan cushion aura.",
    "3D ergonomic forearm, wrist, and hand model showcasing semi-translucent forearm flexor muscles, smooth white flexor tendons gliding through the transverse carpal ligament, and the delicate golden median nerve glowing softly cyan in neutral alignment.",
    "3D cervical spine and skull base lifting gently upright, showing semi-translucent deep neck flexor and suboccipital muscle bundles, nuchal ligament, and delicate golden cervical nerve roots decompressing inside a glowing cyan vertical elongation halo.",
    "3D symmetrical standing pelvis, knees, and feet model combining semi-translucent gluteal, thigh, and calf muscle layers, supportive knee and ankle ligaments, and balanced tendons aligned along glowing cyan plumb lines.",
    "3D full-spine restorative evening decompression pose showing hydrated ice-blue discs, relaxed semi-translucent back muscle fibers, spinal ligaments, and calm golden nerve roots with soft glowing cyan relaxation waves."
  ],
  chapter3: [
    "3D growing adolescent knee and tibia bone model highlighting smooth glowing cyan healthy growth plates and cartilage.",
    "3D upright young-adult full spine model with hydrated ice-blue discs glowing cyan representing lifelong spinal vitality.",
    "3D middle-age shoulder and hip joint preservation model with smooth glowing cyan articular cartilage shields.",
    "3D senior bone-and-muscle vitality illustration showing dense ivory femur and hip joint reinforced by semi-translucent gluteal and quadriceps muscle bundles, strong iliofemoral ligaments, and fibrous tendons inside a luminous cyan aura.",
    "3D lower-limb balance and fall-prevention illustration showing hip, knee, and foot arch supported by semi-translucent leg muscles, crisp ankle ligaments and Achilles tendon, and fine golden proprioceptive nerve pathways glowing softly cyan.",
    "3D healthy aging knee joint illustration combining plush glowing ice-blue meniscus cushions, intact white cruciate and collateral ligaments, quadriceps tendon, and semi-translucent thigh muscle fibers with a protective cyan vitality glow.",
    "Bright serene 3D wellness illustration of a balanced full-body anatomical model combining ivory bones, translucent ice-blue cartilage, semi-translucent postural muscle layers, fibrous ligaments and tendons, and delicate golden nerve pathways surrounded by gentle glowing cyan longevity rings."
  ]
};

async function generateOne(apiKey, topic, index, detailPrompt, outFile) {
  const fullPrompt = `${BASE_STYLE}\n\nSpecific Subject (${topic} #${index}): ${detailPrompt}`;
  const models = ["gemini-3.1-flash-image", "gemini-2.5-flash-image"];

  for (const model of models) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    const body = {
      contents: [{ parts: [{ text: fullPrompt }] }],
      generationConfig: {
        responseModalities: ["IMAGE"],
        imageConfig: { aspectRatio: "16:9" }
      }
    };

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    if (res.ok) {
      const data = await res.json();
      const parts = data.candidates?.[0]?.content?.parts || [];
      const imgPart = parts.find(p => p.inlineData && p.inlineData.data);
      if (imgPart) {
        const tmpFile = `${outFile}.tmp`;
        fs.writeFileSync(tmpFile, Buffer.from(imgPart.inlineData.data, "base64"));
        execFileSync("sips", ["-Z", "1200", "-s", "format", "jpeg", "-s", "formatOptions", "82", tmpFile, "--out", outFile], { stdio: "ignore" });
        fs.unlinkSync(tmpFile);
        return { ok: true, model };
      }
      return { ok: false, error: `No inline image returned (${model})` };
    } else {
      const errText = await res.text();
      if (res.status === 429) {
        console.warn(`  ⚠️ 429 on ${model}: ${errText.slice(0, 140)}`);
        continue;
      }
      return { ok: false, error: `HTTP ${res.status} (${model}): ${errText.slice(0, 180)}` };
    }
  }
  return { ok: false, error: "All image models exhausted/rate-limited" };
}

async function main() {
  const apiKey = loadApiKey();
  if (!apiKey) {
    console.error("GEMINI_API_KEY not found.");
    process.exit(1);
  }

  const onlyArg = process.argv.find(a => a.startsWith("--only="));
  const onlyTarget = onlyArg ? onlyArg.split("=")[1] : null;
  const topicArg = process.argv.find(a => a.startsWith("--topic="));
  const topicFilter = topicArg ? topicArg.split("=")[1].split(",") : null;

  const baseDir = path.join(process.cwd(), "public/images/thumbnails");
  let generated = 0, skipped = 0, failed = 0;

  for (const [topic, prompts] of Object.entries(POOL_SPECS)) {
    if (topicFilter && !topicFilter.includes(topic)) continue;
    const topicDir = path.join(baseDir, topic);
    fs.mkdirSync(topicDir, { recursive: true });

    for (let i = 0; i < prompts.length; i++) {
      const num = String(i + 1).padStart(2, "0");
      const id = `${topic}_${num}`;
      if (onlyTarget && onlyTarget !== id) continue;

      const outFile = path.join(topicDir, `${id}.jpg`);
      if (fs.existsSync(outFile)) {
        skipped++;
        continue;
      }

      process.stdout.write(`🎨 Generating ${id}... `);
      const result = await generateOne(apiKey, topic, i + 1, prompts[i], outFile);
      if (result.ok) {
        const sizeKb = Math.round(fs.statSync(outFile).size / 1024);
        console.log(`OK (${result.model}, ${sizeKb}KB)`);
        generated++;
        await new Promise(r => setTimeout(r, 1200));
      } else {
        console.log(`FAIL: ${result.error}`);
        failed++;
        if (result.error.includes("exhausted") || result.error.includes("429")) {
          console.error("Stopping early due to quota/rate limit.");
          process.exitCode = 1;
          return;
        }
      }
    }
  }

  console.log(`\nDone! generated=${generated}, skipped=${skipped}, failed=${failed}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
