export const pages = {
  home: {
    en: {
      metaTitle: "Pelican Bicycle Benchmark — 8 AI Models Riding a Bicycle, Animated (2026)",
      metaDescription:
        "One prompt, eight AI models: an animated SVG of a pelican riding a bicycle. Watch DeepSeek, Kimi, Doubao, GPT-6.1, GPT-6.0, GPT-5.6, Agnes and HY3 side by side, scored on anatomy, bicycle structure and motion.",
      eyebrow: "The animated LLM benchmark · 08 runs · 27 Oct 2026",
      h1: 'Eight AIs. One pelican.<br><em>One bicycle.</em>',
      lede:
        "The pelican-on-a-bicycle test is the internet's quickest visual check for LLM drawing skills. We extended it: one prompt, eight models, and a scene that has to move.",
      heroNote: "Zero-shot · consumer clients · one run per model",
      promptNote: "Sent once, unchanged, to each model. No follow-ups, no fixes.",
      gridTitle: "The starting grid",
      gridIntro: "Eight machines, eight interpretations, one shared task. Open a card to watch the full run.",
      gridCta: "Watch the run",
      rubricTitle: "The 25-point test",
      rubricIntro: "We score the pelican, the bicycle, and — most importantly — the motion.",
      whyTitle: "Why animation is the harder test",
      whyBody:
        "A still SVG asks whether a model knows what a pelican and a bicycle look like. Animation asks whether it understands how they move together: wheels turn, cranks rotate, feet follow the pedals, and the rider stays attached. Most models can draw a bicycle. Far fewer can make it move correctly.",
      whyNote: "A pretty still frame can hide a bicycle that never pedals.",
      leaderTitle: "The leaderboard",
      leaderIntro: "Editorial scores from one zero-shot run. The total is out of 25.",
      leaderCta: "Full leaderboard",
      runTitle: "Run the same test on your AI",
      runBody:
        "Copy the prompt, paste it into your model, save the result as an .html file and open it. Then check the motion, not just the still.",
      runCta: "Get the checklist",
      timelineTitle: "How the pelican got here",
      stats: [
        { n: "08", l: "runs" },
        { n: "25", l: "points" },
        { n: "01", l: "prompt" },
        { n: "00", l: "fixes" },
      ],
      faqTitle: "Questions people actually ask",
      faqIntro: "The short version, before you fall down the pelican hole.",
      closingTitle: 'One prompt. Eight very different pelicans. <em>Judge for yourself.</em>',
      closingBody:
        "This is not a leaderboard of intelligence. It is a quick, visual stress test for spatial reasoning, code generation and — now — motion.",
      closingCta: "Compare the runs",
      scoreNote: "Scores are editorial and based on one run per model.",
    },
    zh: {
      metaTitle: "鹈鹕骑自行车基准测试：8 款大模型的动画横评（2026）",
      metaDescription:
        "同一道提示词，八个大模型：用 SVG 画一个鹈鹕骑自行车的 2D 动画。并排看 DeepSeek、Kimi、豆包、GPT-6.1、GPT-6.0、GPT-5.6、Agnes 和 HY3 的成品，按解剖、自行车结构和运动物理逐项打分。",
      eyebrow: "动画版 LLM 基准 · 08 次运行 · 2026-10-27",
      h1: "八个 AI，一只鹈鹕，<br><em>一辆自行车。</em>",
      lede:
        "「鹈鹕骑自行车」是网上流传最广的 LLM 视觉测试。我们把它往前推了一步：同一个提示词、八个模型，而且必须动起来。",
      heroNote: "零样本 · 客户端 · 每个模型一次",
      promptNote: "每个模型只发一次，不追问、不修图。",
      gridTitle: "发车名单",
      gridIntro: "八台机器，八种理解，同一道题。点开卡片看完整动画。",
      gridCta: "看它跑",
      rubricTitle: "25 分制",
      rubricIntro: "我们评鹈鹕、评自行车，更重要的是评运动。",
      whyTitle: "为什么动画更难",
      whyBody:
        "静态 SVG 只问模型知不知道鹈鹕和自行车长什么样。动画还要问它懂不懂两者怎么一起动：轮子转、曲柄转、脚跟着踏板、骑手不脱节。大多数模型都能画出一辆自行车，但能让它正确动起来的少得多。",
      whyNote: "一张漂亮的静帧，可能藏着一辆永远不会蹬的自行车。",
      leaderTitle: "榜单",
      leaderIntro: "一次零样本运行的编辑评分，总分 25 分。",
      leaderCta: "完整榜单",
      runTitle: "用你自己的 AI 跑一遍",
      runBody:
        "复制提示词，粘进你的模型，把结果保存成 .html 打开。然后看它怎么动，不要只看静帧。",
      runCta: "拿检查清单",
      timelineTitle: "鹈鹕是怎么火起来的",
      stats: [
        { n: "08", l: "次运行" },
        { n: "25", l: "分制" },
        { n: "01", l: "道题" },
        { n: "00", l: "修图" },
      ],
      faqTitle: "常见问题",
      faqIntro: "先把话说明白，再掉进鹈鹕洞。",
      closingTitle: "一句提示词，八只完全不同的鹈鹕。<em>自己判断。</em>",
      closingBody:
        "这不是「智能排行榜」，而是一次快速、直观的压力测试：空间推理、代码生成，现在还加上运动。",
      closingCta: "并排对比",
      scoreNote: "评分为编辑评分，每个模型一次运行。",
    },
  },
  leaderboard: {
    en: {
      metaTitle: "Leaderboard — Pelican Bicycle Benchmark",
      metaDescription:
        "All eight animated pelican-on-a-bicycle runs, ranked by a 25-point rubric covering semantics, anatomy, bicycle structure, motion physics and polish.",
      eyebrow: "Scoreboard · 25 points",
      title: "The leaderboard",
      intro:
        "Eight runs, sorted by total score. Each total is the sum of five editorial scores, each out of 5.",
      note:
        "One zero-shot run per model, consumer clients, 27 Oct 2026. These are editorial scores, not an automated or general-intelligence ranking. Client-side model versions can change without notice.",
      tableNote: "Click a run to open its full scorecard and original HTML.",
      back: "Back to the grid",
      methodCta: "How we score",
    },
    zh: {
      metaTitle: "榜单 — 鹈鹕骑自行车基准测试",
      metaDescription:
        "八次鹈鹕骑车动画运行，按 25 分制排名：语义、解剖、自行车结构、运动物理、完成度与交互。点开任意一条，查看完整评分卡和原始 HTML 动画。",
      eyebrow: "记分牌 · 25 分",
      title: "榜单",
      intro: "八次运行，按总分排序。总分是五项编辑评分的加总，每项 5 分。",
      note:
        "每个模型一次零样本运行，客户端，2026-10-27。这是编辑评分，不是自动化评分，也不是通用智能排名。客户端模型版本可能随时变化。",
      tableNote: "点开任意一条，查看完整评分卡和原始 HTML。",
      back: "回到发车名单",
      methodCta: "评分方法",
    },
  },
  compare: {
    en: {
      metaTitle: "Compare the runs — Pelican Bicycle Benchmark",
      metaDescription:
        "Load two or more animated pelican-on-a-bicycle runs, start them together and compare the same second. Synchronized play, pause and restart.",
      eyebrow: "Sync room · 2–8 lanes",
      title: "Compare the same second",
      intro:
        "Load two or more runs, start them together, and watch what each model does with the same moment. The controls drive each model's own animation; nothing is re-rendered or edited.",
      pickTitle: "Choose lanes",
      pickHint: "Select at least two runs. On mobile, lanes stack vertically.",
      syncNote:
        "Synchronization uses same-origin iframe APIs. CSS animations are paused and reset directly; models that ship their own pause button are controlled through that button. Expect a few milliseconds of drift.",
      errorNote:
        "The runs could not be controlled from this page. Open the raw file to watch it directly, or serve the site over HTTP.",
      actionStart: "Start sync",
      actionRestart: "Restart",
      howTitle: "What to look for",
      howBody:
        "Watch the contact points: feet against pedals, wing against handlebar, body against saddle. Then check whether the scenery moves independently of the rider. A model can animate the background and forget the bicycle.",
      scoreLabel: "Total",
      laneNote: "Original model output.",
    },
    zh: {
      metaTitle: "并排对比 — 鹈鹕骑自行车基准测试",
      metaDescription:
        "加载两个或更多鹈鹕骑车动画，同步开始、暂停、重来，对比同一秒钟。支持 2–8 条车道并排，直接驱动模型自己的动画，不重绘、不剪辑。",
      eyebrow: "同步室 · 2–8 条车道",
      title: "对比同一秒钟",
      intro:
        "加载两次或更多运行，同时开始，看每个模型在同一时刻做了什么。控制条直接驱动模型自己的动画，不重绘、不剪辑。",
      pickTitle: "选择车道",
      pickHint: "至少选两个模型。手机上会纵向排列。",
      syncNote:
        "同步使用同源 iframe API：CSS 动画直接暂停和归零；自带暂停按钮的模型通过它自己的按钮控制。允许几毫秒的误差。",
      errorNote:
        "这个页面无法控制动画。请直接打开原始文件，或用 HTTP 服务访问本站。",
      actionStart: "同步开始",
      actionRestart: "重来",
      howTitle: "看什么",
      howBody:
        "盯接触点：脚和踏板、翅膀和车把、身体和坐垫。然后看场景是不是独立于骑手在动。模型很容易把背景做得很热闹，却忘了自行车。",
      scoreLabel: "总分",
      laneNote: "模型原始输出。",
    },
  },
  prompt: {
    en: {
      metaTitle: "The pelican bicycle prompt — exact text and checklist",
      metaDescription:
        "The exact prompt used in the animated pelican bicycle benchmark, plus a 10-point checklist to test your own AI and spot bikes that slide, feet that hover and riders that float.",
      eyebrow: "Copy · paste · watch",
      title: "The prompt",
      intro:
        "This is the exact text sent to every model. It is deliberately open-ended: no style guide, no component list, no tests.",
      translationLabel: "English translation",
      runTitle: "Run it yourself",
      checklistTitle: "The 10-point check",
      checklistIntro:
        "Score each item 0 or 1. The first four catch semantic failures; the middle four catch motion failures; the last two catch a scene that only works in a still.",
      dumbTitle: "Is my AI getting dumber?",
      dumbBody:
        "This test is a useful smoke signal, not a diagnosis. A single bad pelican can come from a changed default, a lazy system prompt, a reasoning-effort setting or a random seed. Compare the same model across dates, and look at the motion checks — not just whether the drawing is pretty.",
      caveat:
        "The prompt explicitly says no tests and no restrictions. We did not add style guidance or fix the outputs.",
      download: "Download the prompt (.txt)",
      cta: "See the results",
    },
    zh: {
      metaTitle: "鹈鹕骑自行车提示词：原文与检查清单",
      metaDescription:
        "动画版鹈鹕骑自行车基准的完整提示词，以及 10 条自查清单：识别打滑的车、悬空的脚和飘在车外的骑手。复制即可测试你自己的模型。",
      eyebrow: "复制 · 粘贴 · 看结果",
      title: "提示词",
      intro: "这是发给每个模型的完整原文，故意保持开放：没有风格指南、没有零件清单、没有测试。",
      translationLabel: "英文翻译",
      runTitle: "自己跑一遍",
      checklistTitle: "10 条检查清单",
      checklistIntro:
        "每条记 0 或 1 分。前四条抓语义错误，中间四条抓运动错误，最后两条抓「只在静帧里成立」的场景。",
      dumbTitle: "我的 AI 是不是降智了？",
      dumbBody:
        "这个测试是一个有用的烟雾信号，不是诊断。一次画得差，可能来自默认设置变化、系统提示变懒、推理强度不同，或者只是随机种子。要跨时间比较同一个模型，并且重点看运动检查，不要只看画得美不美。",
      caveat: "提示词明确写了「不需要测试、不要有限制」。我们没有追加风格要求，也没有修图。",
      download: "下载提示词（.txt）",
      cta: "看测试结果",
    },
  },
  methodology: {
    en: {
      metaTitle: "Methodology — Pelican Bicycle Benchmark",
      metaDescription:
        "How the animated pelican bicycle benchmark was run: prompt, models, access, scoring rubric, limitations and attribution to Simon Willison's original test.",
      eyebrow: "Method · v1",
      title: "Methodology",
      intro:
        "A small, transparent test. One prompt, eight consumer clients, one run each, and a five-part editorial score. Here is exactly what we did — and what we did not do.",
      originTitle: "Where the test comes from",
      originBody:
        "On 25 October 2024, Simon Willison asked a set of LLMs to “Generate an SVG of a pelican riding a bicycle.” The results were funny, revealing and easy to compare, and the prompt became an informal benchmark. It tests spatial reasoning and code generation through a task that is trivial to state and surprisingly hard to satisfy.",
      variantTitle: "Our variant",
      variantBody:
        "We kept the core task and changed the deliverable: a self-contained HTML page with a 2D SVG animation of a pelican riding a bicycle. The animation raises the bar. A static drawing can hide a bicycle that never pedals; a loop exposes the contact points and the motion chain.",
      protocolTitle: "Protocol",
      protocol: [
        "One prompt, identical text, no follow-ups and no corrections.",
        "One run per model. No cherry-picking, no regenerations.",
        "Consumer clients, default settings, tested on 27 October 2026.",
        "Outputs saved as self-contained HTML. No external network requests were present in the eight artifacts.",
        "Outputs are displayed unmodified. Only the wrapper around them is ours.",
        "Scores are editorial, produced by a human against the rubric below. They are not automated measurements.",
      ],
      rubricTitle: "The rubric",
      limitsTitle: "Limitations",
      limits: [
        "Single run per model: not statistically significant, and vulnerable to random variation.",
        "Consumer client versions are moving targets. A score is a snapshot of one date, not a permanent property of a model.",
        "Aesthetic judgment is subjective; the rubric makes the criteria explicit but not objective.",
        "This is not a general intelligence benchmark. It is a visual smoke test for spatial composition and motion.",
        "The canonical pelican test is a static SVG. This is an animated extension, and both can be useful.",
      ],
      attributionTitle: "Attribution",
      attributionBody:
        'The pelican-on-a-bicycle test was created by Simon Willison. Read his <a href="https://simonwillison.net/2024/Oct/25/pelican-riding-a-bicycle/" target="_blank" rel="noopener">original post</a>, the <a href="https://github.com/simonw/pelican-bicycle" target="_blank" rel="noopener">GitHub repository of model outputs</a> and the <a href="https://simonwillison.net/2025/Jun/6/six-months-in-llms/" target="_blank" rel="noopener">2025 talk-turned-article</a>. For the 2026 “pelicanmaxxing” study of 1,000+ SVGs, see <a href="https://dylancastillo.co/posts/pelicanmaxxing.html" target="_blank" rel="noopener">Dylan Castillo’s analysis</a>. The eight HTML files on this site were generated by the named models and are displayed unmodified.',
      changelogTitle: "Changelog",
      changelog: ["27 Oct 2026 — v1: eight runs, bilingual English/Chinese site, animated scorecard and sync comparison."],
      protocolTitleShort: "Protocol",
      rubricNote: "Each dimension is scored 0–5. The total is out of 25.",
      accessValue: "Consumer client, zero-shot",
    },
    zh: {
      metaTitle: "测试方法 — 鹈鹕骑自行车基准测试",
      metaDescription:
        "动画版鹈鹕骑车基准如何运行：提示词、模型、测试方式、评分标准、局限，以及 Simon Willison 原版测试的来源。",
      eyebrow: "方法 · v1",
      title: "测试方法",
      intro:
        "一个小而透明的测试：一句提示词、八个客户端、每个模型一次运行、五项编辑评分。下面是具体做法，以及我们没有做什么。",
      originTitle: "测试的由来",
      originBody:
        "2024 年 10 月 25 日，Simon Willison 让一批 LLM「生成一张鹈鹕骑自行车的 SVG」。结果好笑、信息量大、又容易横向比较，这个提示词从此变成了民间基准。它用一个说起来简单、做起来很难的任务，同时考察空间推理和代码生成。",
      variantTitle: "我们的变体",
      variantBody:
        "我们保留了核心任务，改了交付物：一个自包含的 HTML 页面，里面是鹈鹕骑自行车的 2D SVG 动画。动画把门槛抬高了：静态图可以藏住一辆永远不蹬的自行车，循环播放会暴露接触点和运动链。",
      protocolTitle: "流程",
      protocol: [
        "一句提示词，原文一致，不追问、不纠正。",
        "每个模型一次运行，不挑结果、不重生成。",
        "客户端、默认设置，测试日期 2026-10-27。",
        "输出保存为自包含 HTML。八个文件均未发现外部网络请求。",
        "输出原样展示，只有外层包装是我们的。",
        "评分由人工按下面的标准给出，不是自动化测量。",
      ],
      rubricTitle: "评分标准",
      limitsTitle: "局限",
      limits: [
        "每个模型只跑一次：没有统计显著性，也会受随机波动影响。",
        "客户端模型版本随时会变。分数是某一天的快照，不是模型的永久属性。",
        "审美判断是主观的；标准把维度写清楚了，但不等于客观。",
        "这不是通用智能基准，而是一个考察空间构图和运动的视觉烟雾测试。",
        "经典的鹈鹕测试是静态 SVG。这是动画版延伸，两者都有用。",
      ],
      attributionTitle: "来源与致谢",
      attributionBody:
        '「鹈鹕骑自行车」测试由 Simon Willison 创建。可以读他的<a href="https://simonwillison.net/2024/Oct/25/pelican-riding-a-bicycle/" target="_blank" rel="noopener">原始文章</a>、<a href="https://github.com/simonw/pelican-bicycle" target="_blank" rel="noopener">模型输出 GitHub 仓库</a>，以及 2025 年的<a href="https://simonwillison.net/2025/Jun/6/six-months-in-llms/" target="_blank" rel="noopener">演讲文章</a>。2026 年那份生成 1000+ 张 SVG 的「pelicanmaxxing」研究，见 <a href="https://dylancastillo.co/posts/pelicanmaxxing.html" target="_blank" rel="noopener">Dylan Castillo 的分析</a>。本站的八个 HTML 文件由对应模型生成，原样展示。',
      changelogTitle: "更新记录",
      changelog: ["2026-10-27 — v1：八次运行，中英双语站点，动画评分卡与同步对比。"],
      protocolTitleShort: "流程",
      rubricNote: "每项 0–5 分，总分 25 分。",
      accessValue: "客户端，零样本",
    },
  },
  model: {
    en: {
      metaTitle: (name) => `${name} — pelican on a bicycle, animated`,
      metaDesc: (name, total) =>
        `${name} generated an animated pelican-on-a-bicycle scene from one prompt. Score: ${total}/25. See the full run, scorecard, motion checks and verdict.`,
      breadcrumb: "All runs",
      runTitle: "The run",
      runHint: "This is the model's original HTML output. Its own controls are inside the frame.",
      noControls: "This model shipped no playback controls. Use reload to watch it again.",
      scorecard: "Scorecard",
      totalLabel: "Total",
      outOf: "out of 25",
      verdict: "Verdict",
      works: "What works",
      breaks: "What breaks",
      motion: "Motion check",
      spec: "Spec",
      vendorLabel: "Vendor",
      accessLabel: "Access",
      accessValue: "Consumer client, zero-shot",
      testedLabel: "Tested",
      promptLabel: "Prompt",
      controlsLabel: "Controls",
      fileLabel: "File",
      compareCta: "Compare this run",
      editorialNote: "Editorial score, one run. The full rubric is in the methodology.",
      next: "Next run",
      prev: "Previous run",
      back: "Back to the grid",
      rankLabel: "Rank",
      roleLabel: "Role",
    },
    zh: {
      metaTitle: (name) => `${name} 的鹈鹕骑车动画 — 基准测试`,
      metaDesc: (name, total) =>
        `${name} 用一句提示词生成了鹈鹕骑自行车的动画。得分 ${total}/25。查看完整动画、评分卡、运动检查和评审。`,
      breadcrumb: "全部运行",
      runTitle: "动画",
      runHint: "这是模型的原始 HTML 输出，它自己的控制条就在画面里。",
      noControls: "这个模型没有自带播放控制。可以点「重新加载」再看一遍。",
      scorecard: "评分卡",
      totalLabel: "总分",
      outOf: "满分 25",
      verdict: "评审",
      works: "成立的地方",
      breaks: "翻车点",
      motion: "运动检查",
      spec: "规格",
      vendorLabel: "厂商",
      accessLabel: "测试方式",
      accessValue: "客户端，零样本",
      testedLabel: "测试日期",
      promptLabel: "提示词",
      controlsLabel: "控制",
      fileLabel: "文件",
      compareCta: "加入并排对比",
      editorialNote: "编辑评分，单次运行。完整标准见方法页。",
      next: "下一台",
      prev: "上一台",
      back: "回到发车名单",
      rankLabel: "排名",
      roleLabel: "角色",
    },
  },
};
